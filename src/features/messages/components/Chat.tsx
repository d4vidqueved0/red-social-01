import { FullscreenLoader } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useMessagesStore } from "@/store/messagesStore";
import type { Message, Profile } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { chatKeys } from "../messages.keys";
import { HeaderChat } from "./HeaderChat";
import { MessageForm } from "./MessageForm";
import { MessageList } from "./MessageList";

export function Chat() {
  const { idProfileChat } = useMessagesStore();

  const { profile } = useAuthStore();

  // Query para obtener los datos del usuario al que se le enviara el mensaje
  const { data, isLoading } = useQuery<Profile>({
    queryKey: ["chat", "profile", idProfileChat],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", idProfileChat)
        .single();

      if (error) {
        toast.error(error.message);
        throw error;
      }

      return data;
    },
    enabled: !!idProfileChat,
  });

  // Query para obtener chat ID
  const { data: chatID } = useQuery({
    queryKey: ["chat", idProfileChat],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_chat_between_users", {
        user1: profile?.id,
        user2: idProfileChat,
      });

      if (error) {
        toast.error(error?.message);
        throw error;
      }
      return data;
    },
    enabled: !!idProfileChat,
  });

  // Query para obtener mensajes del chat
  const { data: messagesChat, isLoading: loadingMessages } = useQuery({
    queryKey: chatKeys.chat(chatID),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatID);

      if (error) throw error;

      return data;
    },
    enabled: !!chatID,
  });

  return (
    <div className="border rounded-xl relative flex flex-col justify-between h-full max-h-150 md:max-h-200 md:min-h-200">
      {data && (
        <>
          <HeaderChat profile={data} />

          {loadingMessages && <FullscreenLoader />}
          {(messagesChat || []).length > 0 && (
            <MessageList messages={messagesChat as Message[]} />
          )}
          <MessageForm chatID={chatID} />
        </>
      )}
      {!isLoading && !data && (
        <div className="absolute bottom-1/2 right-1/2 translate-1/2">
          Seleccione un chat
        </div>
      )}
    </div>
  );
}
