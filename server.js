import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import mongoose from "mongoose";
import session from "express-session";
import { fileURLToPath } from "url";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

/* DB */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Error MongoDB:", err));

/* VIEW + STATIC */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

/* SESSION */
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecreto",
  resave: false,
  saveUninitialized: false
}));

/* ROUTES */
app.use(express.urlencoded({ extended: true }));
app.use("/", publicRoutes);
app.use("/admin", adminRoutes);

/* SERVER */
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
