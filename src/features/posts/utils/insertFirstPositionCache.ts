import type { InfiniteData } from "@tanstack/react-query";
import type { PostsPage, PostWithProfileAndLikes } from "../types";

export function insertFirstPositionCache(cache: InfiniteData<PostsPage, unknown> | undefined, post: PostWithProfileAndLikes) {
    return {
        ...cache,
        pages: cache!.pages.map((page, index) => {
            if (index === 0) {
                return {
                    ...page,
                    data: [post, ...page.data]
                    ,
                }
            }
            else {
                return page
            }
        }),
    };
}

