import {
  Button,
  Card,
  Field,
  FieldError,
  FieldLabel,
  FullscreenLoader,
} from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import type { Comment } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Trash } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";
import { useCommentsQuery } from "../hooks/useCommentsQuery";
import { useCommentsRealtime } from "../hooks/useCommentsRealtime";
import { commentSchema, type commentSchemaType } from "../schemas";
import type { CommentWithProfile, PostDetail } from "../types";
import { PostCard } from "./PostCard";

export function PostPage() {
  const { id } = useParams();

  const { profile } = useAuthStore();

  const { data, isLoading, error } = useQuery<PostDetail>({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "*, profiles(*), likes(count),  user_likes:likes(user_id), comments(count)",
        )
        .eq("id", id)
        .single();
      if (error) {
        if (error.code === "22P02") {
          toast.error("No se encontró la publicación.");
        } else {
          toast.error(error.message);
        }
      }
      return data;
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<commentSchemaType>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSumbit = async (content: commentSchemaType) => {
    const Comment = {
      ...content,
      user_id: profile?.id,
      post_id: data?.id,
    };

    const { error } = await supabase.from("comments").insert(Comment);

    if (error) {
      toast.error(error.message);
      return;
    }
    reset();
    toast.success("Se publicó con exito el comentario.");
  };

  const {
    data: dataComments,
    isLoading: loadingComments,
    error: errorComments,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useCommentsQuery(id, data?.created_at);

  const comments = dataComments?.pages.flatMap((page) => page.data) || [];

  useCommentsRealtime(id);

  const deleteComment = async (comment: Comment) => {
    const { count, error } = await supabase
      .from("comments")
      .delete({ count: "exact" })
      .eq("id", comment.id);
    console.log(error);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (count === 0) {
      toast.error("No tienes permiso para eliminar el comentario.");
      return;
    }
    toast.success("Se eliminó el comentario.");
  };

  return (
    <>
      {!isLoading && error && (
        <div className="text-center text-xl">{error.message}</div>
      )}
      {isLoading && <FullscreenLoader />}
      {!error && !isLoading && data && (
        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-3  md:grid-cols-[3fr_2fr] items-start gap-x-3">
          <PostCard
            post={data}
            handleDelete={() => {}}
            handlePostEdit={() => {}}
          />

          <Card className="px-3 min-h-full max-w-2xl w-full mx-auto">
            <form onSubmit={handleSubmit(onSumbit)}>
              <h2 className="font-bold text-xl">Añadir un comentario</h2>
              <Controller
                control={control}
                name="content"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="comentario"></FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        aria-invalid={fieldState.invalid}
                        {...field}
                        id="comentario"
                        placeholder="Buena publicación!"
                      />
                      <InputGroupAddon
                        className={
                          field.value.length > 200 ? "text-red-500" : ""
                        }
                        align={"block-end"}
                      >
                        {field.value.length} / 200
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Button disabled={isSubmitting ? true : false} className="mt-3">
                {isSubmitting ? "Publicando..." : "Publicar"}
              </Button>
            </form>

            <h2 className="font-bold text-xl">Comentarios</h2>
            <ScrollArea>
              <div className="flex flex-col gap-5 max-h-150 pe-4">
                {comments.map((comment: CommentWithProfile) => (
                  <article
                    key={comment.id}
                    className="grid grid-cols-[1fr_10fr] gap-1"
                  >
                    <Avatar>
                      <AvatarImage
                        src={comment.profiles.avatar_url || "stock.webp"}
                      />
                      <AvatarFallback>
                        {comment.profiles.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex justify-between">
                        <small>@{comment.profiles.username}</small>
                        <small className="flex gap-3">
                          {dayjs(comment.created_at).fromNow()}{" "}
                          {(comment.user_id === profile?.id ||
                            data.user_id === profile?.id) && (
                            <Trash
                              className="cursor-pointer transition-all active:scale-90"
                              size={16}
                              onClick={() => {
                                deleteComment(comment);
                              }}
                            />
                          )}
                        </small>
                      </div>
                      <p className="break-all">{comment.content}</p>
                    </div>
                  </article>
                ))}

                {(loadingComments || isFetchingNextPage) && (
                  <FullscreenLoader />
                )}
                {!loadingComments && comments.length === 0 && (
                  <div>No hay comentarios.</div>
                )}
                {!loadingComments && errorComments && (
                  <div>Error al cargar los comentarios.</div>
                )}
                {hasNextPage && !isFetchingNextPage && (
                  <Button
                    onClick={() => {
                      fetchNextPage();
                    }}
                  >
                    Cargar más comentarios
                  </Button>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      )}
    </>
  );
}
