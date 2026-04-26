import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useFeedStore } from "@/store/feedStore";
import type { Post } from "@/types";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useEffect } from "react";
import { postKeys } from "../keys.posts";
import type { PostsPage, PostWithProfileAndLikes } from "../types";
import { inCachePosts } from "../utils/inCachePosts";
import { updateCachePosts } from "../utils/updateCachePosts";

export function usePostsRealtime() {
  const {
    incrementNewPosts,
    resetNewPosts,
    decrementNewPosts,
    fechaInicial,
    postsLocales,
    updatePostLocal,
    deletePostLocal,
    setPostsLocales,
  } = useFeedStore();

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
            console.log(info.new);
            if (!profile) return;
            const newPostWithProfile: PostWithProfileAndLikes = {
              ...(info.new as Post),
              profiles: {
                ...profile,
              },
              likes: [{ count: 0 }],
              user_likes: [],
              comments: []
            };
            console.log(newPostWithProfile);
            setPostsLocales(newPostWithProfile);
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

          queryClient.setQueryData(
            postKeys.feed(fechaInicial),
            (cacheActual: InfiniteData<PostsPage, unknown> | undefined) => {
              inCache = inCachePosts(cacheActual, idPost);
              if (!inCache) {
                return cacheActual;
              }
              const operation = (data: PostWithProfileAndLikes[]) => {
                return data.filter((post) => post.id !== idPost);
              };
              return updateCachePosts(cacheActual, operation);
            },
          );
          const existe = postsLocales.find((p) => p.id === idPost);
          if (existe) {
            deletePostLocal(idPost);
          }
          if (!inCache && !existe) {
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
          let inCache;
          const idPost = info.new.id;
          queryClient.setQueryData(
            postKeys.feed(fechaInicial),
            (cacheActual: InfiniteData<PostsPage, unknown> | undefined) => {
              inCache = inCachePosts(cacheActual, idPost);
              if (!inCache) {
                return cacheActual;
              }
              const operation = (data: PostWithProfileAndLikes[]) => {
                return data.map((post) =>
                  post.id === info.new.id ? { ...post, ...info.new } : post,
                );
              };
              return updateCachePosts(cacheActual, operation);
            },
          );

          if (info.new.user_id === profile?.id) {
            const postLocal = postsLocales.find((post) => post.id === idPost);
            if (postLocal) updatePostLocal({ ...postLocal, ...info.new });
          }
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
    setPostsLocales,
    fechaInicial,
    postsLocales,
    updatePostLocal,
    deletePostLocal,
  ]);
}
