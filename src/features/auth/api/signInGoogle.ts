import { supabase } from "@/lib/supabase"

export const signInGoogle = async () => {
    supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/feed`
        }
    })
}