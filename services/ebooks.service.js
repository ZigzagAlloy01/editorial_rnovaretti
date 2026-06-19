import supabase from "../lib/supabase.js";

export async function getEbookByTitle(title) {

    const { data, error } =
        await supabase
            .from("ebooks")
            .select("*")
            .eq("title", title)
            .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function getAllActiveEbooks() {

    const { data, error } =
        await supabase
            .from("ebooks")
            .select("*")
            .eq("active", true)
            .order("title");

    if (error) {
        throw error;
    }

    return data;
}