import type { Message } from "@/types";
import { useEffect, useRef } from "react";
import { MessageCard } from "./MessageCard";

export function MessageList({ messages }: { messages: Message[] }) {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef && chatRef.current)
      chatRef.current.scrollTop = chatRef.current?.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={chatRef}
      className="grow flex flex-col px-3 my-3 gap-3 overflow-scroll no-scrollbar"
    >
      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </div>
  );
}
