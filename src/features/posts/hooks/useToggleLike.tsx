import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useFeedStore } from "@/store/feedStore";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { PostsPage, PostWithProfileAndLikes } from "../types";
import { updateCachePosts } from "../utils/updateCachePosts";

export function useToggleLike(post: PostWithProfileAndLikes) {
  const { session } = useAuthStore();
  const queryClient = useQueryClient();
  const { fechaInicial } = useFeedStore();

  return useMutation({
    mutationFn: async () => {
      const isLike = post.user_likes.length > 0;
      if (isLike) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("user_id", session?.user.id)
          .eq("post_id", post.id);

        if (error) throw error
      } else {
        const { error } = await supabase
          .from("likes")
          .insert({ user_id: session?.user.id, post_id: post.id });
        if (error) throw error
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts", fechaInicial] });

      const cacheAnterior = queryClient.getQueryData(["posts", fechaInicial]);

      const isLike = post.user_likes.length > 0;

      queryClient.setQueryData(
        ["posts", fechaInicial],
        (cache: InfiniteData<PostsPage, unknown> | undefined) => {
          return updateCachePosts(cache, (posts) =>
            posts.map((p) =>
              p.id === post.id
                ? {
                    ...p,
                    user_likes: !isLike
                      ? [{ user_id: String(session?.user.id) }]
                      : [],
                    likes: [
                      {
                        count: !isLike
                          ? p.likes[0].count + 1
                          : p.likes[0].count - 1,
                      },
                    ],
                  }
                : p,
            ),
          );
        },
      );
      return { cacheAnterior };
    },

    onError: (error, _, context) => {
      queryClient.setQueryData(["posts", fechaInicial], context?.cacheAnterior);
      toast.error(error.message);
    },
  });
}
