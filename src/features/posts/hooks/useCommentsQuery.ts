import { useInfiniteQuery } from "@tanstack/react-query";
import { getComments } from "../api/getComments";
import { commentsKeys } from "../keys.posts";

export function useCommentsQuery(idPost: string | undefined, created_at: string | undefined) {
    return useInfiniteQuery({
        queryKey: commentsKeys.comments(idPost!),
        queryFn: getComments,
        initialPageParam: created_at,
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
        enabled: (!!idPost && !!created_at)
    })
}