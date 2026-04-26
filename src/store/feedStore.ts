import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { create } from "zustand";

interface useFeedStoreProps {
    newPostsCount: number
    fechaInicial: Dayjs
    incrementNewPosts: () => void
    decrementNewPosts: () => void
    resetNewPosts: () => void
    resetFechaInicial: () => void
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
    resetFechaInicial: () => set((state) => {
        return {
            ...state,
            fechaInicial: dayjs()
        }
    }),

}))