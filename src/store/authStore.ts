import type { Session, User } from '@supabase/supabase-js'
import { create } from 'zustand'

interface useAuthStoreProps {
    user: User | null | undefined
    session: Session | null | undefined
    setUser: (user: User | null) => void
    setSession: (session: Session | null) => void
}

export const useAuthStore = create<useAuthStoreProps>((set) => ({
    user: undefined,
    session: undefined,
    setUser: (user) => set(({ user })),
    setSession: (session) => set(({ session }))
}))