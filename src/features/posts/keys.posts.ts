import type { Dayjs } from "dayjs"

export const postKeys = {
    all: ['posts'] as const,
    feed: (fechaInicial: Dayjs) => [...postKeys.all, fechaInicial] as const,
    detail: (postID: string | undefined) => [...postKeys.all, 'detail', postID] as const
}

export const commentsKeys = {
    all: ['comments'] as const,
    comments: (postID: string) => [...commentsKeys.all, postID] as const
}