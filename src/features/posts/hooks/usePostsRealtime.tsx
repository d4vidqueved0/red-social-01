import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useFeedStore } from "@/store/feedStore";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function usePostsRealtime() {
  const { incrementNewPosts, resetNewPosts } = useFeedStore();
  const { session } = useAuthStore();

  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (info) => {
          if (info.new.user_id === session?.user.id) {
            resetNewPosts();
            queryClient.invalidateQueries({ queryKey: ["posts"] });
          } else {
            incrementNewPosts();
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "posts",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["posts"] });
          resetNewPosts();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [incrementNewPosts, queryClient, resetNewPosts, session]);
}
