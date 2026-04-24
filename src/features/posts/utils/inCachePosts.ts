import type { InfiniteData } from "@tanstack/react-query";
import type { PostsPage } from "../types";

export function inCachePosts(cache: InfiniteData<PostsPage, unknown> | undefined, postID: string) {
    if (!cache) return false
    const exist = cache.pages.some(page => {
        return page.data.some(post => post.id === postID)
    })
    return exist
}

