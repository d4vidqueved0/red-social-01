import type { PostWithProfileAndLikes } from "../types"

export const toggleLike = (isLike: boolean, post: PostWithProfileAndLikes, userId: string) => {
    if (!isLike) {
        return {
            ...post,
            likes: [{ count: post.likes[0].count + 1 }],
            user_likes: [{ user_id: String(userId) }],
        }
    } else {
        return {
            ...post,
            likes: [{ count: post.likes[0].count - 1 }],
            user_likes: [],
        }
    }
}