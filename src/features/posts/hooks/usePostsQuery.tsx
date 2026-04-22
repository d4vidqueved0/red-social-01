import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { getPosts } from "../api/postApi";
import type { PostsPage } from "../types";

export function usePostsQuery() {
  return useInfiniteQuery<PostsPage, Error, InfiniteData<PostsPage>, string[], number>({
    queryKey: ["posts"],
    queryFn: getPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
}
