import { create } from "zustand";

interface useMessagesStoreProps {
    idProfileChat: string | undefined,
    resetProfileChat: () => void
    setProfileChat: (idProfile: string | undefined) => void
}

export const useMessagesStore = create<useMessagesStoreProps>((set) => ({
    idProfileChat: undefined,
    resetProfileChat: () => set((state) => ({ ...state, idProfileChat: undefined })),
    setProfileChat: (idProfile) => set((state) => ({ ...state, idProfileChat: idProfile })),

}))