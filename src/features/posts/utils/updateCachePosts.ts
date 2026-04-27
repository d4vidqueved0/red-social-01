import type { InfiniteData } from "@tanstack/react-query";
import type { PostsPage, PostWithProfileAndLikes } from "../types";

export function updateCachePosts(cache: InfiniteData<PostsPage, unknown> | PostWithProfileAndLikes | undefined, operation: (data: PostWithProfileAndLikes[] | PostWithProfileAndLikes) => PostWithProfileAndLikes[] | PostWithProfileAndLikes | null) {
    if (cache && 'pages' in cache)
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
    else if (cache) {
        return operation(cache)
    }
}

