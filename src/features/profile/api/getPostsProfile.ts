import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/store/authStore"
import type { QueryFunctionContext } from "@tanstack/react-query"

type PostProfileKey = readonly ['posts', 'profile', string | undefined]


const PAGE_SIZE = 10

export const getPostsProfile = async ({ pageParam, queryKey }: QueryFunctionContext<PostProfileKey, string | undefined>) => {

    const { profile } = useAuthStore.getState()
    const [, , idProfile] = queryKey

    if (!idProfile) throw new Error('Id requerido.')

    const { data, error } = await supabase
        .from('posts')
        .select(`
   *, 
   profiles(username, avatar_url, name),
   likes(count),
   user_likes:likes(user_id),
   comments(count)
 `).eq('user_id', idProfile).filter('user_likes.user_id', 'eq', profile?.id)
        .order('created_at', { ascending: false })
        .lt('created_at', pageParam).limit(PAGE_SIZE)
    if (error) throw error


    return { data, nextPage: data.length !== 0 ? data[data.length - 1].created_at : null }
}