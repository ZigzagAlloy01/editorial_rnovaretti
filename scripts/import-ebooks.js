import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ebooksPath = path.join(
    __dirname,
    "../ebooks.json"
);

function slugify(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function run() {

    const raw = await fs.readFile(
        ebooksPath,
        "utf8"
    );

    const ebooks = JSON.parse(raw);

    for (const [title, info] of Object.entries(ebooks)) {

        const record = {
            title,
            slug: slugify(title),
            download_url: info.enlace_ebook,
            active: true
        };

        const { error } = await supabase
            .from("ebooks")
            .upsert(
                record,
                {
                    onConflict: "title"
                }
            );

        if (error) {
            console.error(
                `❌ ${title}`,
                error.message
            );
        } else {
            console.log(
                `✅ ${title}`
            );
        }
    }

    console.log(
        "\nImportación finalizada."
    );
}

run().catch(console.error);