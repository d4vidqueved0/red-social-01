import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import type { Dayjs } from "dayjs";

const PAGE_SIZE = 5


export async function getPosts({ pageParam }: { pageParam: Dayjs | string }) {

    const { session } = useAuthStore.getState()

    const { data, error } = await supabase
        .from('posts')
        .select(`
  *, 
  profiles(username, avatar_url, name),
  likes(count),
  user_likes:likes(user_id),
  comments(count)
`).filter('user_likes.user_id', 'eq', session?.user.id)
        .order('created_at', { ascending: false })
        .lt('created_at', pageParam).limit(PAGE_SIZE)
    if (error) throw error
    return { data, nextPage: data.length !== 0 ? data[data.length - 1].created_at : null }
}