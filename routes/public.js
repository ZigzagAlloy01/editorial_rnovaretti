import express from "express";
import portfolio from "../models/portfolio.js";
import mercadopago from "../mercadopago.json" with { type: "json" };

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/servicios", (req, res) => {
  res.render("services");
});

router.get("/quienes-somos", (req, res) => {
  res.render("about");
});

router.get("/portafolio", async (req, res) => {
  const trabajos = await portfolio.find().lean();
  res.render("portfolio", { trabajos });
});

router.get("/comprar-ebook/:title", (req, res) => {

  const title = decodeURIComponent(req.params.title);

  const libro = mercadopago[title];

  if (!libro) {
    return res.status(404).send("No se encontró enlace de pago para este libro.");
  }

  res.redirect(libro.enlace_pago);

});

router.get("/anuncios", (req, res) => {
  res.render("news");
});

router.get("/contacto", (req, res) => {
  res.render("contact");
});

export default router;
