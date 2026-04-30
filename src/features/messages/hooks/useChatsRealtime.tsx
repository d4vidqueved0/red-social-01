import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { chatKeys } from "../messages.keys";
import type { ChatWithProfile } from "../types";

export function useChatsRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("chats")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chats",
        },
        (info) => {

          queryClient.setQueryData(
            chatKeys.all,
            (cacheAntiguo: ChatWithProfile[]) => {

              return cacheAntiguo.map((chat) => {
                if (chat.id === info.new.id) {
                  return {
                    ...chat,
                    last_message_at: info.new.last_message_at,
                  };
                }
                return chat;
              });
            },
          );
        },
      )
      //   .on(
      //     "postgres_changes",
      //     {
      //       event: "DELETE",
      //       schema: "public",
      //       table: "chats",
      //     },
      //     (info) => {
      //       const idChatDelete = info.old.id;
      //       console.log(idChatDelete);
      //       queryClient.setQueryData(
      //         chatKeys.all,
      //         (cacheAntiguo: ChatWithProfile[]) => {
      //           console.log(
      //             cacheAntiguo.filter((chat) => chat.id !== idChatDelete),
      //           );
      //           return cacheAntiguo.filter((chat) => chat.id !== idChatDelete);
      //         },
      //       );
      //     },
      //   )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);
}
