import client from "../lib/mercadopago.js";

import {
    Preference
} from "mercadopago";

export async function createPaymentPreference(
    order,
    ebook,
    user
) {

    const preference =
        new Preference(client);

    const result =
        await preference.create({

            body: {

                items: [
                    {
                        title: ebook.title,
                        quantity: 1,
                        currency_id: "MXN",
                        unit_price: Number(
                            ebook.price || 100
                        )
                    }
                ],

                external_reference:
                    order.id,

                payer: {
                    email: user.email
                }

            }

        });

    return result;
}