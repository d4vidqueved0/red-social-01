import type { Post, Profile } from '@/types'

export type PostWithProfile = Post & {
    profiles: Pick<Profile, 'username' | 'avatar_url' | 'name'>

}
export type PostWithProfileAndLikes = PostWithProfile & {
    likes: [{ count: number }]
    user_likes: [{ user_id: string }] | []
}


export type PostsPage = {
    data: PostWithProfileAndLikes[]
    nextPage: number | null
}