import express from "express";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import portfolio from "../models/portfolio.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

/* LOGIN */
router.get("/login", (req, res) => {
  res.render("admin-login", { error: null });
});

router.post("/login", async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.render("admin-login", { error: "Contraseña requerida" });
  }

  const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
  if (!ADMIN_PASSWORD_HASH) {
  throw new Error("ADMIN_PASSWORD_HASH no definido en .env");
  }
  
  const valid = await bcrypt.compare(
    password,
    ADMIN_PASSWORD_HASH
  );

  if (!valid) {
    return res.render("admin-login", {
      error: "Contraseña incorrecta"
    });
  }

  req.session.isAdmin = true;
  res.redirect("/admin/portfolio");
});

/* LISTADO */
router.get("/portfolio", isAdmin, async (req, res) => {
  const trabajos = await portfolio.find().lean();
  res.render("admin-portfolio", { trabajos, errors: null, data: {} });
});

/* CREAR */
router.post(
  "/portfolio",
  isAdmin,
  [
    body("authorName").trim().notEmpty(),
    body("authorImage").isURL(),
    body("bookTitle").trim().notEmpty(),
    body("bookImage").isURL(),
    body("genre").trim().notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const trabajos = await portfolio.find().lean();
      return res.render("admin-portfolio", {
        trabajos,
        errors: errors.array(),
        data: req.body
      });
    }

    await portfolio.create({
      author: {
        name: req.body.authorName,
        image: req.body.authorImage
      },
      book: {
        title: req.body.bookTitle,
        image: req.body.bookImage,
        genre: req.body.genre
      }
    });

    res.redirect("/admin/portfolio");
  }
);

/* ELIMINAR */
router.post("/portfolio/:id/delete", isAdmin, async (req, res) => {
  await portfolio.findByIdAndDelete(req.params.id);
  res.redirect("/admin/portfolio");
});

/* EDITAR */
router.get("/portfolio/:id/edit", isAdmin, async (req, res) => {
  const item = await portfolio.findById(req.params.id).lean();
  if (!item) return res.redirect("/admin/portfolio");

  res.render("admin-edit-portfolio", { item, errors: null });
});

/* ACTUALIZAR */
router.post(
  "/portfolio/:id/update",
  isAdmin,
  [
    body("authorName").trim().notEmpty(),
    body("authorImage").isURL(),
    body("bookTitle").trim().notEmpty(),
    body("bookImage").isURL(),
    body("genre").trim().notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const item = await portfolio.findById(req.params.id).lean();
      return res.render("admin-edit-portfolio", {
        item,
        errors: errors.array()
      });
    }

    await portfolio.findByIdAndUpdate(req.params.id, {
      author: {
        name: req.body.authorName,
        image: req.body.authorImage
      },
      book: {
        title: req.body.bookTitle,
        image: req.body.bookImage,
        genre: req.body.genre
      }
    });

    res.redirect("/admin/portfolio");
  }
);

export default router;