import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { postKeys } from "../keys.posts";
import type { PostsPage, PostWithProfileAndLikes } from "../types";
import { toggleLike } from "../utils/toggleLike";
import { updateCachePosts } from "../utils/updateCachePosts";

export function useToggleLike(post: PostWithProfileAndLikes) {
  const { session } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const isLike = post.user_likes.length > 0;
      if (isLike) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("user_id", session?.user.id)
          .eq("post_id", post.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("likes")
          .insert({ user_id: session?.user.id, post_id: post.id });
        if (error) throw error;
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: postKeys.all,
      });

      const cachesAnteriores = queryClient.getQueriesData({
        queryKey: postKeys.all,
      });

      const isLike = post.user_likes.length > 0;

      queryClient.setQueriesData(
        { queryKey: postKeys.all },
        (cache: InfiniteData<PostsPage, unknown> | undefined) => {
          const operation = (
            posts: PostWithProfileAndLikes[] | PostWithProfileAndLikes,
          ) => {
            if (Array.isArray(posts)) {
              return posts.map((p) =>
                p.id === post.id
                  ? toggleLike(isLike, post, String(session?.user.id))
                  : p,
              );
            } else {
              return toggleLike(isLike, post, String(session?.user.id));
            }
          };

          return updateCachePosts(cache, operation);
        },
      );

      return { cachesAnteriores };
    },

    onError: (error, _, context) => {
      context?.cachesAnteriores.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      console.log(context, error);
      toast.error(error.message);
    },
  });
}
