import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useCommentsStore } from "@/store/commentsStore";
import type { Comment } from "@/types";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useEffect } from "react";
import { commentsKeys } from "../keys.posts";
import type { CommentsPage, CommentWithProfile } from "../types";
import { inCacheComments } from "../utils/inCacheComments";
import { insertFirstPositionCacheComments } from "../utils/insertFirstPositionCacheComments";
import { updateCacheComments } from "../utils/updateCacheComments";


export function useCommentsRealtime(postID: string | undefined) {
  const queryClient = useQueryClient()


  const { profile } = useAuthStore()

  const { incrementCommentsCount, decreaseCommentsCount } = useCommentsStore()

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
          if (!profile) return
          if (info.new.user_id === profile.id) {
            const newComment = {
              ...info.new as Comment,
              profiles: {
                ...profile
              }
            }
            queryClient.setQueryData(commentsKeys.comments(postID), (cacheActual: InfiniteData<CommentsPage>) => {
              return insertFirstPositionCacheComments(cacheActual, newComment)
            })
          } else {
            incrementCommentsCount()
          }

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
          const commentID = info.old.id
          let inCache;
          queryClient.setQueryData(commentsKeys.comments(postID), (cacheActual: InfiniteData<CommentsPage>) => {
            inCache = inCacheComments(cacheActual, commentID)
            if (!inCache) {
              decreaseCommentsCount()
              return cacheActual
            }
            const operation = (data: CommentWithProfile[]) => {
              return data.filter(comment => comment.id !== commentID)
            }
            return updateCacheComments(cacheActual, operation)
          })

        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postID, queryClient, profile, decreaseCommentsCount, incrementCommentsCount]);
}
