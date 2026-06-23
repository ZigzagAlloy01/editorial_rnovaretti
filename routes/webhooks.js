import express from "express";
import supabase from "../lib/supabase.js";
import client from "../lib/mercadopago.js";
import { Payment } from "mercadopago";

const router = express.Router();

router.post("/mercadopago", async (req, res) => {
    try {
        console.log("=================================");
        console.log("=== WEBHOOK MERCADOPAGO ===");
        console.log(JSON.stringify(req.body, null, 2));
        console.log("=================================");

        const paymentId = req.body?.data?.id || req.body?.id;
        console.log("PAYMENT ID:", paymentId);

        if (!paymentId) {
            console.log("No se recibió paymentId.");
            return res.status(200).send("ok");
        }

        const paymentApi = new Payment(client);
        const payment = await paymentApi.get({ id: paymentId });

        console.log("=== PAGO OBTENIDO ===");
        console.log(JSON.stringify(payment, null, 2));
        console.log("STATUS:", payment.status);
        console.log("EXTERNAL_REFERENCE:", payment.external_reference);

        if (payment.status !== "approved") {
            console.log("Pago aún no aprobado.");
            return res.status(200).send("ok");
        }

        const orderId = payment.external_reference;

        if (!orderId) {
            console.log("No existe external_reference.");
            return res.status(200).send("ok");
        }

        // Buscar la orden en Supabase
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single();

        console.log("ORDER:", order);
        if (orderError) console.log("ORDER ERROR:", orderError);

        if (!order) {
            console.log("Orden no encontrada en Supabase.");
            return res.status(200).send("ok");
        }

        if (order.status === "paid") {
            console.log("La orden ya estaba marcada como pagada.");
            return res.status(200).send("ok");
        }

        const { data: updatedOrder, error: updateError } = await supabase
            .from("orders")
            .update({
                status: "paid",
                paid_at: new Date().toISOString(),
                mercadopago_payment_id: paymentId.toString()
            })
            .eq("id", order.id)
            .select()
            .single();

        if (updateError) {
            console.error("Error al actualizar la orden en Supabase:", updateError);
            return res.status(500).send("error");
        }

        console.log("=== ORDEN ACTUALIZADA CON ÉXITO ===");
        console.log(updatedOrder);

        return res.status(200).send("ok");

    } catch (err) {
        console.error("ERROR WEBHOOK:", err);
        return res.status(500).send("error");
    }
});

export default router;