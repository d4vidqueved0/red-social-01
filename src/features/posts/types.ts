import type { Post, Profile } from '@/types'

export type PostWithProfile = Post & {
    profiles: Pick<Profile, 'username' | 'avatar_url' | 'name'>
}

export type PostsPage = {
    data: PostWithProfile[]
    nextPage: number | null
}