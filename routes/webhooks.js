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
                "=== WEBHOOK RECIBIDO ==="
            );

            console.log(
                "BODY TYPE:",
                typeof req.body
            );

            console.log(
                "BODY EXISTS:",
                !!req.body
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