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
import { toggleLike } from "../utils/toggleLike";
import { updateCachePosts } from "../utils/updateCachePosts";
import { postKeys } from "../keys.posts";

export function useToggleLike(post: PostWithProfileAndLikes) {
  const { session } = useAuthStore();
  const queryClient = useQueryClient();
  const { postsLocales, updatePostLocal, fechaInicial } = useFeedStore();

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
      await queryClient.cancelQueries({ queryKey: postKeys.feed(fechaInicial) });

      const cacheAnterior = queryClient.getQueryData(postKeys.feed(fechaInicial));

      const isLike = post.user_likes.length > 0;
      console.log(
        "todas las keys:",
        queryClient
          .getQueryCache()
          .getAll()
          .map((q) => q.queryKey),
      );

      queryClient.setQueryData(
        postKeys.feed(fechaInicial),
        (cache: InfiniteData<PostsPage, unknown> | undefined) => {
          return updateCachePosts(cache, (posts) => {
            console.log(cache);
            return posts.map((p) =>
              p.id === post.id
                ? toggleLike(isLike, post, String(session?.user.id))
                : p,
            );
          });
        },
      );

      const exist = postsLocales.find((p) => p.id === post.id);
      console.log(exist);
      console.log(post);
      if (exist) {
        updatePostLocal(toggleLike(isLike, post, String(session?.user.id)));
      }

      return { cacheAnterior };
    },

    onError: (error, _, context) => {
      queryClient.setQueryData(postKeys.feed(fechaInicial), context?.cacheAnterior);
      console.log(context, error);
      toast.error(error.message);
    },
  });
}
