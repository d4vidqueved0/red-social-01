import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../api/postApi";
import type { PostWithProfile } from "../types";

export function usePostsQuery() {
  return useQuery<PostWithProfile[]>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
}
