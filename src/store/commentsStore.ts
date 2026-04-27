import { create } from "zustand";

interface useCommentStoreProps {
    newCommentsCount: number,
    resetCommentsCount: () => void
    incrementCommentsCount: () => void
    decreaseCommentsCount: () => void

}

export const useCommentsStore = create<useCommentStoreProps>((set) => ({
    newCommentsCount: 0,
    resetCommentsCount: () => set((state) => ({
        ...state, newCommentsCount: 0
    })),
    decreaseCommentsCount: () => set((state) => ({ ...state, newCommentsCount: state.newCommentsCount - 1 })),
    incrementCommentsCount: () => set((state) => ({ ...state, newCommentsCount: state.newCommentsCount + 1 })),

}))