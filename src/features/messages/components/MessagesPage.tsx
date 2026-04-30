import { FullscreenLoader } from "@/components/ui";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { useChatsRealtime } from "../hooks/useChatsRealtime";
import { useMessagesRealtime } from "../hooks/useMessageRealtime";
import { chatKeys } from "../messages.keys";
import { Chat } from "./Chat";
import { ChatsList } from "./ChatsList";

export function MessagesPage() {
  const { profile } = useAuthStore();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: chatKeys.all });
  }, []);

  useMessagesRealtime();
  useChatsRealtime();

  if (profile === undefined) return <FullscreenLoader />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-3 w-full max-w-5xl mx-auto mb-5 items-start">
      {" "}
      <ChatsList />
      <Chat />
    </div>
  );
}
