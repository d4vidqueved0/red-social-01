import type { PostWithProfile } from "@/features/posts/types";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { create } from "zustand";

interface useFeedStoreProps {
    newPostsCount: number
    postsLocales: PostWithProfile[] | [],
    fechaInicial: Dayjs
    incrementNewPosts: () => void
    decrementNewPosts: () => void
    resetNewPosts: () => void
    setPostsLocales: (post: PostWithProfile) => void
    resetPostsLocales: () => void
    resetFechaInicial: () => void
    updatePostLocal: (post: PostWithProfile) => void
    deletePostLocal: (id: string) => void
}

export const useFeedStore = create<useFeedStoreProps>((set) => ({
    newPostsCount: 0,
    postsLocales: [],
    fechaInicial: dayjs(),
    incrementNewPosts: () => set((state) => (
        {
            newPostsCount: state.newPostsCount + 1
        }
    )),
    decrementNewPosts: () => set((state) => (
        { newPostsCount: state.newPostsCount === 0 ? 0 : state.newPostsCount - 1 }
    )),
    resetNewPosts: () => set(({ newPostsCount: 0 })),
    setPostsLocales: (post) => set((state) => {
        return {
            ...state,
            postsLocales: [post, ...state.postsLocales]
        }
    }),
    resetPostsLocales: () => set((state) => {
        return {
            ...state,
            postsLocales: []
        }
    }),
    resetFechaInicial: () => set((state) => {
        return {
            ...state,
            fechaInicial: dayjs()
        }
    }),
    updatePostLocal: (post) => set((state) => ({
        postsLocales: state.postsLocales.map(p => p.id === post.id ? { ...p, ...post } : p)
    })),
    deletePostLocal: (id) => set((state) => ({
        postsLocales: state.postsLocales.filter(p => p.id !== id)
    }))
}))