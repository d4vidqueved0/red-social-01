import type { Profile } from '@/types'
import type { Session } from '@supabase/supabase-js'
import { create } from 'zustand'

interface useAuthStoreProps {
    profile: Profile | null | undefined
    session: Session | null | undefined,
    setProfile: (profile: Profile | null) => void
    setSession: (session: Session | null) => void
}

export const useAuthStore = create<useAuthStoreProps>((set) => ({
    profile: undefined,
    session: undefined,
    setProfile: (profile) => set(({ profile })),
    setSession: (session) => set(({ session })),

}))