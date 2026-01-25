import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import portfolio from "../models/portfolio.js"

const app = express();

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Middlewares
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/servicios", (req, res) => {
  res.render("services");
});

app.get("/quienes-somos", (req, res) => {
  res.render("about");
});

app.get("/portafolio", async (req, res) => {
  try {
    const trabajos = await portfolio.find().lean();
    res.render("portfolio", { trabajos });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error cargando portafolio");
  }
});

app.get("/contacto", (req, res) => {
  res.render("contact");
});

export default app;