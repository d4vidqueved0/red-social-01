import type { InfiniteData } from "@tanstack/react-query";
import type { CommentsPage } from "../types";

export function inCacheComments(cache: InfiniteData<CommentsPage, unknown> | undefined, commentID: string) {
    if (!cache) return false
    const exist = cache.pages.some(page => {
        return page.data.some(comment => comment.id === commentID)
    })
    return exist
}

