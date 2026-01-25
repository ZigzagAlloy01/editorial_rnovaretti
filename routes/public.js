import express from "express";
import portfolio from "../models/portfolio.js";

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

router.get("/contacto", (req, res) => {
  res.render("contact");
});

export default router;
