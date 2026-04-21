import { supabase } from "@/lib/supabase";

export async function getPosts() {
    const { data, error } = await supabase
        .from("posts")
        .select(
            `
            *,
            profiles (
                username,
                avatar_url,
                name
            )
            `,
        )
        .order("created_at", { ascending: false });

    console.log(data, error)
    if (error) throw error;
    return data;
}
