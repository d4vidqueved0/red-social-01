import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { commentsKeys } from "../keys.posts";


export function useCommentsRealtime(postID: string | undefined) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!postID) return;
    const channel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postID}`,
        },
        (info) => {
          console.log(info);
          queryClient.invalidateQueries({ queryKey: commentsKeys.comments(postID) })
        },
      ).on(
        'postgres_changes',
        {
          event: "DELETE",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postID}`,
        },
        (info) => {
          console.log(info)
          queryClient.invalidateQueries({ queryKey: commentsKeys.comments(postID) })

        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postID, queryClient]);
}
