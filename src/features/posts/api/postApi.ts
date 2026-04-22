import { supabase } from "@/lib/supabase";

const PAGE_SIZE = 7

export async function getPosts({ pageParam = 0 }: { pageParam: number }) {
    const { data, error } = await supabase
        .from('posts')
        .select(`*, profiles (username, avatar_url, name)`)
        .order('created_at', { ascending: false })
        .range(pageParam, pageParam + PAGE_SIZE - 1)

    if (error) throw error
    return { data, nextPage: data.length === PAGE_SIZE ? pageParam + PAGE_SIZE : null }
}