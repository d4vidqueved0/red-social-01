import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useFeedStore } from "@/store/feedStore";
import type { Post } from "@/types";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useEffect } from "react";
import { postKeys } from "../keys.posts";
import type { PostsPage, PostWithProfileAndLikes } from "../types";
import { inCachePosts } from "../utils/inCachePosts";
import { insertFirstPositionCache } from "../utils/insertFirstPositionCache";
import { updateCachePosts } from "../utils/updateCachePosts";

export function usePostsRealtime() {
  const { incrementNewPosts, resetNewPosts, decrementNewPosts, fechaInicial } =
    useFeedStore();

  const { session, profile } = useAuthStore();

  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (info) => {
          if (info.new.user_id === session?.user.id) {
            if (!profile) return;
            const newPostWithProfile: PostWithProfileAndLikes = {
              ...(info.new as Post),
              profiles: {
                ...profile,
              },
              likes: [{ count: 0 }],
              user_likes: [],
              comments: [{ count: 0 }],
            };
            queryClient.setQueryData(
              postKeys.feed(fechaInicial),
              (cacheActual: InfiniteData<PostsPage, unknown> | undefined) => {
                const newCache = insertFirstPositionCache(
                  cacheActual,
                  newPostWithProfile,
                );
                return newCache;
              },
            );
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
        (info) => {
          let inCache;
          const idPost = info.old.id;
          queryClient.setQueriesData(
            { queryKey: postKeys.all },
            (cacheActual: InfiniteData<PostsPage, unknown> | undefined) => {
              inCache = inCachePosts(cacheActual, idPost);
              const operation = (
                data: PostWithProfileAndLikes[] | PostWithProfileAndLikes,
              ) => {
                if (Array.isArray(data)) {
                  return data.filter((post) => post.id !== idPost);
                } else {
                  return null;
                }
              };
              return updateCachePosts(cacheActual, operation);
            },
          );
          if (!inCache) {
            decrementNewPosts();
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "posts",
        },
        (info) => {
          queryClient.setQueriesData(
            { queryKey: postKeys.all },
            (cacheActual: InfiniteData<PostsPage, unknown> | undefined) => {
              const operation = (
                data: PostWithProfileAndLikes[] | PostWithProfileAndLikes,
              ) => {
                if (Array.isArray(data)) {
                  return data.map((post) =>
                    post.id === info.new.id ? { ...post, ...info.new } : post,
                  );
                } else {
                  return { ...data, ...info.new };
                }
              };
              return updateCachePosts(cacheActual, operation);
            },
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    incrementNewPosts,
    queryClient,
    resetNewPosts,
    session,
    decrementNewPosts,
    profile,
    fechaInicial,
  ]);
}
