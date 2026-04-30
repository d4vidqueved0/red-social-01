import { Button, FullscreenLoader } from "@/components/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, RotateCw } from "lucide-react";
import { useState } from "react";
import { getChats } from "../api/getChats";
import { chatKeys } from "../messages.keys";
import type { ChatWithProfile } from "../types";
import { ChatCard } from "./ChatCard";

export function ChatsList() {
  const { data, isLoading, isFetching } = useQuery<ChatWithProfile[]>({
    queryKey: chatKeys.all,
    queryFn: getChats,
  });

  const queryClient = useQueryClient();

  const handleReload = () => {
    queryClient.invalidateQueries({ queryKey: chatKeys.all });
  };

  const [isVisible, setVisible] = useState(false);

  const handleVisible = () => {
    setVisible((prev) => !prev);
  };

  return (
    <div
      className={`border flex flex-col rounded-xl overflow-y-auto no-scrollbar
  ${!isVisible ? "h-auto self-start" : "max-h-[70vh]"}`}
    >
      <div className="min-h-18 max-h-18 border-b p-3 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Conversaciones</h2>
        <div className="flex gap-3">
          <Button disabled={isFetching} onClick={handleReload}>
            <RotateCw />
          </Button>
          <Button onClick={handleVisible}>
            {isVisible ? <ArrowUp /> : <ArrowDown />}
          </Button>
        </div>
      </div>
      {!isVisible ? (
        ""
      ) : (
        <>
          {isLoading && <FullscreenLoader />}
          {!isLoading && !data?.length && (
            <div className="px-3 mt-5">No hay chats.</div>
          )}
          <div className="flex flex-col gap-5 mt-3 p-3 transition-all">
            {data?.map((chat) => (
              <ChatCard key={chat.id} chat={chat} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
