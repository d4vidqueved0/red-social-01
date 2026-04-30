import type { Database } from './database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type PostInsert = Database['public']['Tables']['posts']['Insert']

export type Comment = Database['public']['Tables']['comments']['Row']

export type Message = Database['public']['Tables']['messages']['Row']
export type Chat = Database['public']['Tables']['chats']['Row']
export type ChatParticipants = Database['public']['Tables']['chat_participants']['Row']

