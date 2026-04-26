import { supabase } from "@/lib/supabase";

const PAGE_SIZE = 10


export const getComments = async ({ queryKey, pageParam }) => {

    const [, postID] = queryKey


    const { data, error } = await supabase
        .from("comments")
        .select('*, profiles(*)')
        .eq("post_id", postID)
        .order('created_at', { ascending: true })
        .gt('created_at', pageParam).limit(PAGE_SIZE + 1)
    if (error) throw error

    const hasMore = data.length > PAGE_SIZE

    return {
        data: hasMore ? data.slice(0, PAGE_SIZE) : data,
        nextPage: hasMore ? data[PAGE_SIZE - 1].created_at : null
    }

}