import {
    getEbookByTitle
} from "../services/ebooks.service.js";

import {
    getPaidOrder
} from "../services/orders.service.js";

export default function requirePaidPurchase() {

    return async (req, res, next) => {

        try {

            const user = req.session.user;

            if (!user) {

                return res.redirect(
                    `/login?redirect=${encodeURIComponent(
                        req.originalUrl
                    )}`
                );

            }

            const title = decodeURIComponent(
                req.params.title
            );

            const ebook =
                await getEbookByTitle(title);

            if (!ebook) {

                return res
                    .status(404)
                    .send(
                        "Libro no encontrado."
                    );

            }

            const order =
                await getPaidOrder(
                    user.id,
                    ebook.id
                );

            if (!order) {

                return res
                    .status(403)
                    .send(
                        "Debes comprar este ebook antes de acceder."
                    );

            }

            req.user = user;
            req.ebook = ebook;
            req.order = order;

            next();

        } catch (err) {

            console.error(err);

            return res
                .status(500)
                .send(
                    "Error verificando acceso."
                );

        }

    };

}