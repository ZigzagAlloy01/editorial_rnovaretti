import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
    throw new Error("SUPABASE_URL no está definida");
}

if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY no está definida");
}

export const supabase = createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    }
);

export default supabase;