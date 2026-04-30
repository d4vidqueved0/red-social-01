import { Button } from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import type { Comment } from "@/types";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Trash } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { CommentWithProfile } from "../types";

export function CommentCard({
  comment,
  idUser,
}: {
  comment: CommentWithProfile;
  idUser: string | null;
}) {
  const { profile } = useAuthStore();

  const { mutate, isPending } = useMutation({
    mutationFn: async (comment: Comment) => {
      const { count, error } = await supabase
        .from("comments")
        .delete({ count: "exact" })
        .eq("id", comment.id);
      if (error) {
        toast.error(error.message);
        return;
      }
      if (count === 0) {
        toast.error("No tienes permiso para eliminar el comentario.");
        return;
      }
      toast.success("Se eliminó el comentario.");
    },
  });

  const navigate = useNavigate();

  return (
    <article className="grid grid-cols-[1fr_10fr] gap-1">
      <Avatar
      className="cursor-pointer active:scale-90 transition-all"
        onClick={() => {
          if (window.location.pathname !== `/profile/${comment.user_id}`)
            navigate(`/profile/${comment.user_id}`, { relative: "path" });
        }}
      >
        <AvatarImage src={comment.profiles.avatar_url || "stock.webp"} />
        <AvatarFallback>{comment.profiles.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <div className="flex justify-between items-center">
          <small>@{comment.profiles.username}</small>
          <small className="flex gap-3">
            {dayjs(comment.created_at).fromNow()}{" "}
            {(comment.user_id === profile?.id || idUser === profile?.id) && (
              <Button
                disabled={isPending}
                type="button"
                variant={"link"}
                className="p-0 m-0 w-fit h-fit"
                onClick={() => {
                  mutate(comment);
                }}
              >
                <Trash size={16} />
              </Button>
            )}
          </small>
        </div>
        <p className="break-all">{comment.content}</p>
      </div>
    </article>
  );
}
