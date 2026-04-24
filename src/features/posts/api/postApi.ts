import { supabase } from "@/lib/supabase";
import type { Dayjs } from "dayjs";

const PAGE_SIZE = 4


export async function getPosts({ pageParam }: { pageParam: Dayjs | string }) {
    const { data, error } = await supabase
        .from('posts')
        .select(`*, profiles (username, avatar_url, name)`)
        .order('created_at', { ascending: false })
        .lt('created_at', pageParam).limit(PAGE_SIZE)

    if (error) throw error
    return { data, nextPage: data.length !== 0 ? data[data.length - 1].created_at : null }
}