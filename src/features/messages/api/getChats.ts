import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";

export const getChats = async () => {

  const { profile } = useAuthStore.getState()

  if (!profile) throw new Error('Profile undefined')

  const { data, error } = await supabase
    .from('chats')
    .select('*, profiles(*)')
    .order('last_message_at', { ascending: false })
    .neq('profiles.id', profile?.id)

  if (error) throw error
  return data
}