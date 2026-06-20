import express from "express";

import supabase from "../lib/supabase.js";

import {
    markOrderPaid
} from "../services/orders.service.js";

import client from "../lib/mercadopago.js";

import {
    Payment
} from "mercadopago";

const router = express.Router();

router.post(
    "/mercadopago",
    async (req, res) => {

        try {

            console.log("=== WEBHOOK RECIBIDO ===");

            console.log(
                JSON.stringify(req.body)
            );

            const paymentId =
                req.body?.data?.id;

            console.log(
                "paymentId:",
                paymentId
            );

            if (!paymentId) {

                console.log(
                    "No paymentId"
                );

                return res
                    .status(200)
                    .send("ok");

            }

            console.log(
                "Consultando MP..."
            );

            const paymentApi =
                new Payment(client);

            const payment =
                await paymentApi.get({
                    id: paymentId
                });

            console.log(
                "Pago obtenido:"
            );

            console.log(
                JSON.stringify(payment)
            );

            const orderId =
                payment.external_reference;

            console.log(
                "orderId:",
                orderId
            );

            if (!orderId) {

                return res
                    .status(200)
                    .send("ok");

            }

            const {
                data: order,
                error: orderError
            } = await supabase
                .from("orders")
                .select("*")
                .eq("id", orderId)
                .single();

            console.log(
                "orderError:",
                orderError
            );

            console.log(
                "order:",
                order
            );

            if (!order) {

                return res
                    .status(200)
                    .send("ok");

            }

            await markOrderPaid(
                order.id
            );

            console.log(
                "ORDEN MARCADA COMO PAGADA"
            );

            return res
                .status(200)
                .send("ok");

        } catch (err) {

            console.error(
                "ERROR WEBHOOK:"
            );

            console.error(err);

            console.error(
                err?.message
            );

            console.error(
                err?.stack
            );

            return res
                .status(500)
                .send("error");

        }

    }
);

export default router;