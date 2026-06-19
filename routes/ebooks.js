import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import requirePaidPurchase from "../middleware/requirePaidPurchase.js";
import {
    getEbookByTitle
} from "../services/ebooks.service.js";

const router = express.Router();

router.get(
    "/mis-libros",
    requireAuth,
    async (req, res) => {

        try {

            const books =
                req.books || [];

            return res.render(
                "ebooks/library",
                {
                    books
                }
            );

        } catch (err) {

            console.error(err);

            return res
                .status(500)
                .send(
                    "Error cargando biblioteca."
                );

        }

    }
);


router.get(
    "/mis-libros/:title",
    requirePaidPurchase(),
    async (req, res) => {

        try {

            return res.render(
                "ebooks/detail",
                {
                    ebook: req.ebook
                }
            );

        } catch (err) {

            console.error(err);

            return res
                .status(500)
                .send(
                    "Error cargando ebook."
                );

        }

    }
);

router.get(
    "/descargar-ebook/:title",
    requirePaidPurchase(),
    async (req, res) => {

        try {

            return res.redirect(
                req.ebook.download_url
            );

        } catch (err) {

            console.error(err);

            return res
                .status(500)
                .send(
                    "Error descargando ebook."
                );

        }

    }
);

export default router;