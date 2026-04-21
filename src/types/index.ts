import type { Database } from './database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type PostInsert = Database['public']['Tables']['posts']['Insert']