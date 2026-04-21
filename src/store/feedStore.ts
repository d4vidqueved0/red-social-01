import { create } from "zustand";

interface useFeedStoreProps {
    newPostsCount: number
    incrementNewPosts: () => void
    resetNewPosts: () => void
}

export const useFeedStore = create<useFeedStoreProps>((set) => ({
    newPostsCount: 0,
    incrementNewPosts: () => set((state) => (
        {
            newPostsCount: state.newPostsCount + 1
        }
    )),
    resetNewPosts: () => set(({ newPostsCount: 0 })),
}))