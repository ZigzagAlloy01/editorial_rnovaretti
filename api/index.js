import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import portfolio from "../models/portfolio.js"
import connectDB from "../lib/db.js";
import MongoStore from "connect-mongo";
import adminRoutes from "../routes/admin.js";
import authRoutes from "../routes/auth.js";
import ebookRoutes from "../routes/ebooks.js";
import webhookRoutes from "../routes/webhooks.js";
import requireAuth from "../middleware/requireAuth.js";
import {
  getEbookByTitle
} from "../services/ebooks.service.js";

import {
  getPaidOrder,
  getPendingOrder,
  createPendingOrder
} from "../services/orders.service.js";

import {
  createPaymentPreference
} from "../services/payments.service.js";

import supabase from "../lib/supabase.js";

const app = express();
app.set("trust proxy", 1);

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Middlewares
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true, 
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: { 
    secure: true, 
    sameSite: 'lax', 
    maxAge: 1000 * 60 * 60
  }
}));

app.use((req, res, next) => {

  res.locals.user =
    req.session.user || null;

  res.locals.isAdmin =
    req.session.isAdmin || false;

  next();

});

app.use("/", authRoutes);
app.use("/", ebookRoutes);
app.use("/webhooks", webhookRoutes);

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

app.get(
  "/comprar-ebook/:title",
  requireAuth,
  async (req, res) => {

    try {

      const title =
        decodeURIComponent(
          req.params.title
        );

      const user =
        req.session.user;

      const ebook =
        await getEbookByTitle(
          title
        );

      if (!ebook) {

        return res
          .status(404)
          .send(
            "Libro no encontrado."
          );

      }

      const paidOrder =
        await getPaidOrder(
          user.id,
          ebook.id
        );

      if (paidOrder) {

        return res.redirect(
          `/mis-libros/${encodeURIComponent(
            title
          )}`
        );

      }

      let order =
        await getPendingOrder(
          user.id,
          ebook.id
        );

      if (!order) {

        order =
          await createPendingOrder(
            user.id,
            ebook.id
          );

      }

      const preference =
        await createPaymentPreference(
          order,
          ebook,
          user
        );

      await supabase
        .from("orders")
        .update({
          mercadopago_preference_id:
            preference.id
        })
        .eq(
          "id",
          order.id
        );

      return res.redirect(
        preference.init_point
      );

    } catch (err) {

      console.error(err);

      return res
        .status(500)
        .send(
          "Error creando pago."
        );

    }

  }
);

app.get("/anuncios", (req, res) => {
  res.render("news");
});

app.get("/contacto", (req, res) => {
  res.render("contact");
});

app.use("/admin", adminRoutes);

export default app;