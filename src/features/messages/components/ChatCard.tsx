import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMessagesStore } from "@/store/messagesStore";
import dayjs from "dayjs";
import type { ChatWithProfile } from "../types";

export function ChatCard({ chat }: { chat: ChatWithProfile }) {
  const { setProfileChat } = useMessagesStore();

  const profile = chat.profiles[0];

  return (
    <article
      onClick={() => {
        setProfileChat(profile.id);
      }}
      className="flex gap-3 "
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={profile.avatar_url || undefined} />
        <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-center">
        <h4>{profile.name}</h4>
        <span className=" block text-xs">
          Ultimo mensaje {dayjs(chat.last_message_at).fromNow()}
        </span>
      </div>
    </article>
  );
}
