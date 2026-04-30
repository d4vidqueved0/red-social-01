import { useAuthStore } from "@/store/authStore";
import type { Message } from "@/types";
import dayjs from "dayjs";

export function MessageCard({ message }: { message: Message }) {
  const { profile } = useAuthStore();

  return (
    <>
      <article
        className={`text-black bg-neutral-200 border min-w-24 px-2 py-1 rounded-xl max-w-2/3 break-all ${profile?.id === message.user_id ? "ms-auto" : "me-auto"}`}
      >
        {" "}
        <p className="inline text-xs">{message.content}</p>
        <small className="float-right mt-2 ps-1 scale-75">
          {dayjs(message.created_at).format("hh:mm A")}
        </small>
      </article>
    </>
  );
}
