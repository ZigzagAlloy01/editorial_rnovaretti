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

            console.log(
                "Webhook MercadoPago recibido"
            );

            const paymentId =
                req.body?.data?.id;

            if (!paymentId) {

                return res
                    .status(200)
                    .send("ok");

            }

            const paymentApi =
                new Payment(client);

            const payment =
                await paymentApi.get({
                    id: paymentId
                });

            console.log(
                "Pago consultado:",
                payment.id
            );

            if (
                payment.status !==
                "approved"
            ) {

                return res
                    .status(200)
                    .send("ok");

            }

            const orderId =
                payment.external_reference;

            if (!orderId) {

                console.error(
                    "Sin external_reference"
                );

                return res
                    .status(200)
                    .send("ok");

            }

            const {
                data: order
            } = await supabase
                .from("orders")
                .select("*")
                .eq("id", orderId)
                .single();

            if (!order) {

                console.error(
                    "Orden inexistente"
                );

                return res
                    .status(200)
                    .send("ok");

            }

            if (
                order.status ===
                "paid"
            ) {

                return res
                    .status(200)
                    .send("ok");

            }

            await markOrderPaid(
                order.id
            );

            console.log(
                "Orden marcada como pagada:",
                order.id
            );

            return res
                .status(200)
                .send("ok");

        } catch (err) {

            console.error(err);

            return res
                .status(500)
                .send("error");

        }

    }
);

export default router;