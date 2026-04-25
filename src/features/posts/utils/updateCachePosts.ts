import type { InfiniteData } from "@tanstack/react-query";
import type { PostsPage, PostWithProfileAndLikes } from "../types";

export function updateCachePosts(cache: InfiniteData<PostsPage, unknown> | undefined, operation: (data: PostWithProfileAndLikes[]) => PostWithProfileAndLikes[]) {
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

