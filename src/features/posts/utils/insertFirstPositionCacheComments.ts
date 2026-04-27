import type { InfiniteData } from "@tanstack/react-query";
import type { CommentsPage, CommentWithProfile } from "../types";

export function insertFirstPositionCacheComments(cache: InfiniteData<CommentsPage, unknown> | undefined, comment: CommentWithProfile) {
    return {
        ...cache,
        pages: cache!.pages.map((page, index) => {
            if (index === 0) {
                return {
                    ...page,
                    data: [comment, ...page.data]
                    ,
                }
            }
            else {
                return page
            }
        }),
    };
}

