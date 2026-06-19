import express from "express";
import bcrypt from "bcrypt";
import supabase from "../lib/supabase.js";

const router = express.Router();

router.get("/login", (req, res) => {

    res.render("auth/login", {
        error: null
    });

});

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.render("auth/login", {
                error: "Debes proporcionar correo y contraseña."
            });

        }

        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .maybeSingle();

        if (error || !user) {

            return res.render("auth/login", {
                error: "Correo o contraseña incorrectos."
            });

        }

        const validPassword = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!validPassword) {

            return res.render("auth/login", {
                error: "Correo o contraseña incorrectos."
            });

        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        const redirect =
            req.query.redirect ||
            req.body.redirect ||
            "/portafolio";

        return res.redirect(redirect);

    } catch (err) {

        console.error(err);

        return res
            .status(500)
            .send("Error iniciando sesión.");

    }

});

router.get("/register", (req, res) => {

    res.render("auth/register", {
        error: null
    });

});

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;

        if (
            !name ||
            !email ||
            !password
        ) {

            return res.render(
                "auth/register",
                {
                    error: "Todos los campos son obligatorios."
                }
            );

        }

        const { data: existingUser } =
            await supabase
                .from("users")
                .select("id")
                .eq("email", email)
                .maybeSingle();

        if (existingUser) {

            return res.render(
                "auth/register",
                {
                    error: "Ese correo ya está registrado."
                }
            );

        }

        const password_hash =
            await bcrypt.hash(
                password,
                10
            );

        const { data: user, error } =
            await supabase
                .from("users")
                .insert({
                    name,
                    email,
                    password_hash
                })
                .select()
                .single();

        if (error) {

            console.error(error);

            return res.render(
                "auth/register",
                {
                    error: "No fue posible crear la cuenta."
                }
            );

        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        return res.redirect(
            "/portafolio"
        );

    } catch (err) {

        console.error(err);

        return res
            .status(500)
            .send("Error creando cuenta.");

    }

});

router.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/");

    });

});

export default router;