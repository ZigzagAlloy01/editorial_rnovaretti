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

const mercadopagoPath = path.join(
    __dirname,
    "../mercadopago.json"
);

async function run() {
    const raw = await fs.readFile(
        mercadopagoPath,
        "utf8"
    );

    const data = JSON.parse(raw);

    for(const [title, info] of Object.entries(data)) {
        const { error } = await supabase
            .from("ebooks")
            .update({
                payment_url: info.enlace_pago
            })
            .eq("title", title);
        
        if (error) {
            console.error(
                `❌ ${title}`,
                error.message
            );
        }
        
        else {
            console.log(
                `✅ ${title}`
            );
        }
    }

    console.log(
        "\nEnlaces de pago importados."
    );
}

run().catch(console.error);