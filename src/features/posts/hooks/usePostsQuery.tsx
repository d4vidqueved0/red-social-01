import { useFeedStore } from "@/store/feedStore";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../api/postApi";

export function usePostsQuery() {
  const { fechaInicial } = useFeedStore();

  return useInfiniteQuery({
    queryKey: ["posts", fechaInicial],
    queryFn: getPosts,
    initialPageParam: fechaInicial,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });
}
