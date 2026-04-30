import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Message } from "react-hook-form";
import { chatKeys } from "../messages.keys";

export function useMessagesRealtime() {
  const queryClient = useQueryClient();
  const { profile } = useAuthStore();
  useEffect(() => {
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (info) => {
          if (info.new.user_id !== profile?.id)
            queryClient.setQueryData(
              chatKeys.chat(info.new.chat_id),
              (cacheActual: Message[]) => {
                if (!cacheActual) return;
                return [...cacheActual, info.new];
              },
            );
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient, profile]);
}
