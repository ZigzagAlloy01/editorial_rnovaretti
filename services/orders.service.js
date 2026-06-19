import supabase from "../lib/supabase.js";

export async function getPaidOrder(
    userId,
    ebookId
) {

    const { data, error } =
        await supabase
            .from("orders")
            .select("*")
            .eq("user_id", userId)
            .eq("ebook_id", ebookId)
            .eq("status", "paid")
            .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
}

export async function getPendingOrder(
    userId,
    ebookId
) {

    const { data, error } =
        await supabase
            .from("orders")
            .select("*")
            .eq("user_id", userId)
            .eq("ebook_id", ebookId)
            .eq("status", "pending")
            .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
}

export async function createPendingOrder(
    userId,
    ebookId
) {

    const { data, error } =
        await supabase
            .from("orders")
            .insert({
                user_id: userId,
                ebook_id: ebookId,
                status: "pending"
            })
            .select()
            .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function markOrderPaid(
    orderId
) {

    const { data, error } =
        await supabase
            .from("orders")
            .update({
                status: "paid",
                paid_at: new Date()
            })
            .eq("id", orderId)
            .select()
            .single();

    if (error) {
        throw error;
    }

    return data;
}