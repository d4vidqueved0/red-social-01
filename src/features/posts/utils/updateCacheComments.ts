import type { InfiniteData } from "@tanstack/react-query";
import type { CommentsPage, CommentWithProfile } from "../types";

export function updateCacheComments(cache: InfiniteData<CommentsPage, unknown> | undefined, operation: (data: CommentWithProfile[]) => CommentWithProfile[] | null) {
    if (cache)
        return {
            ...cache,
            pages: cache!.pages.map((page) => {
                return {
                    ...page,
                    data: operation(page.data)
                    ,
                };
            }),
        };
}
