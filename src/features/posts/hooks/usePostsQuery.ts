import { useFeedStore } from "@/store/feedStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../api/postApi";
import { postKeys } from "../keys.posts";

export function usePostsQuery() {
  const { fechaInicial } = useFeedStore();

  return useInfiniteQuery({
    queryKey: postKeys.feed(fechaInicial),
    queryFn: getPosts,
    initialPageParam: fechaInicial,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
}
