import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import portfolio from "../models/portfolio.js"
import connectDB from "../lib/db.js";
import adminRoutes from "../routes/admin.js";

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
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === "production",
    httpOnly: true 
  }
}));
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
    await connectDB();
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

app.use("/admin", adminRoutes);

export default app;