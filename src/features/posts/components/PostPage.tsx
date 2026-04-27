import {
  Button,
  Card,
  Field,
  FieldError,
  FieldLabel,
  FullscreenLoader,
} from "@/components/ui";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";
import { useCommentsQuery } from "../hooks/useCommentsQuery";
import { useCommentsRealtime } from "../hooks/useCommentsRealtime";
import { useDeletePost } from "../hooks/useDeletePost";
import { useEditPost } from "../hooks/useEditPost";
import { postKeys } from "../keys.posts";
import { commentSchema, type commentSchemaType } from "../schemas";
import type { CommentWithProfile, PostWithProfileAndLikes } from "../types";
import { CommentCard } from "./CommentCard";
import { DeletePost } from "./DeletePost";
import { EditPost } from "./EditPost";
import { PostCard } from "./PostCard";

export function PostPage() {
  const { id } = useParams();

  const { profile } = useAuthStore();

  const { data, isLoading, error } = useQuery<PostWithProfileAndLikes>({
    queryKey: postKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "*, profiles(*), likes(count),  user_likes:likes(user_id), comments(count)",
        )
        .filter("user_likes.user_id", "eq", profile?.id)
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
    enabled: !!id && !!profile,
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

  const { postDelete, handleDelete } = useDeletePost();

  const { postEdit, handleEdit, handleDialogEdit, dialogEdit } = useEditPost();

  return (
    <>
      {!isLoading && error && (
        <div className="text-center text-xl">{error.message}</div>
      )}
      {isLoading && <FullscreenLoader />}
      {!error && !isLoading && data && (
        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-3  md:grid-cols-[3fr_2fr] items-start gap-x-3 mb-3">
          <PostCard
            post={data}
            handleDelete={handleDelete}
            handlePostEdit={handleEdit}
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
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    idPost={data.id}
                  />
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
      {postDelete && <DeletePost handleDelete={handleDelete} id={postDelete} />}
      {postEdit && (
        <EditPost
          key={postEdit.id}
          post={postEdit}
          handleDialogEdit={handleDialogEdit}
          open={dialogEdit}
        />
      )}
    </>
  );
}
