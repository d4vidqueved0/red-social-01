import { useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getComments } from "../api/getComments";
import { commentsKeys } from "../keys.posts";

export function useCommentsQuery(idPost: string | undefined) {
    return useInfiniteQuery({
        queryKey: commentsKeys.comments(idPost!),
        queryFn: getComments,
        initialPageParam: dayjs().format(),
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
        enabled: !!idPost
    })
}