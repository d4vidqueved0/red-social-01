import type { Comment, Post, Profile } from '@/types'

export type PostWithProfile = Post & {
    profiles: Profile

}
export type PostWithProfileAndLikes = PostWithProfile & {
    likes: { count: number }[]
    user_likes: { user_id: string }[] | []
    comments: {count: number}[]
}


export type PostsPage = {
    data: PostWithProfileAndLikes[]
    nextPage: number | null
}

export type CommentWithProfile = Comment & {
    profiles: Profile
}

export type PostDetail = PostWithProfileAndLikes & {
    comments: CommentWithProfile[] | []
}
