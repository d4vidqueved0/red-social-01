import type { InfiniteData } from "@tanstack/react-query";
import type { PostsPage, PostWithProfile } from "../types";

export function updateCachePosts(cache: InfiniteData<PostsPage, unknown> | undefined, operation: (data: PostWithProfile[], index?: number) => PostWithProfile[]) {
    return {
        ...cache,
        pages: cache!.pages.map((page, index) => {
            return {
                ...page,
                data: operation(page.data, index)
                ,
            };
        }),
    };
}

