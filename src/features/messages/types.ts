import type { Chat, Message, Profile } from "@/types";

export type ChatWithProfile = Chat & {
    profiles: Profile[]
}

export type ProfileWithMessages = Profile & {
    messages: Message[]
}