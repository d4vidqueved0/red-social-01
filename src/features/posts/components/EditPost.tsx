import { Button } from "@/components/ui";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import type { Post } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CATEGORIES, postSchema, type postSchemaType } from "../schemas";
import { PostForm } from "./PostForm";

interface EditPostProps {
  post: Post;
  handleDialogEdit: () => void;
  open: boolean;
}

export function EditPost({ post, handleDialogEdit, open }: EditPostProps) {
  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<postSchemaType>({
    resolver: zodResolver(postSchema),
    mode: "onChange",
    defaultValues: {
      content: post.content || "",
      category: post.category as (typeof CATEGORIES)[number],
      file: undefined,
    },
  });

  const { session } = useAuthStore();

  const onSubmit = async (postForm: postSchemaType) => {
    let image_url = post.image_url ?? null;

    const file = postForm.file?.[0];

    if (file) {
      const { data, error: uploadError } = await supabase.storage
        .from("posts")
        .upload(`${session!.user.id}/${dayjs().unix()}`, file);

      if (uploadError) {
        toast.error(uploadError.message);
        return;
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from("posts").getPublicUrl(data.path);

      image_url = publicUrl;
    } else if (!preview && post.image_url) {
      image_url = null;
    }

    const postWihtUrl = {
      content: postForm.content,
      category: postForm.category,
      image_url,
    };

    const { error } = await supabase
      .from("posts")
      .update(postWihtUrl)
      .eq("id", post.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Se editó la publicacion.");
    handleDialogEdit();
  };

  const [preview, setPreview] = useState<null | string>(post.image_url);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogEdit}>
        <DialogContent className="max-w-2xl w-full mx-auto px-5 gap-0">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-xl font-semibold ">
              Editar publicacion
            </DialogTitle>
            <DialogDescription className="text-md">
              Puedes editar los campos de tu publicaion
            </DialogDescription>
          </DialogHeader>
          <form
            id="edit_post_form"
            className="max-h-96 md:max-h-none overflow-scroll no-scrollbar"
            onSubmit={handleSubmit(onSubmit)}
          >
            <PostForm
              control={control}
              errors={errors}
              register={register}
              setValue={setValue}
              preview={preview}
              setPreview={setPreview}
            />
            <Button
              className="mt-5 w-full "
              disabled={isSubmitting}
              form="edit_post_form"
              type="submit"
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
            <DialogClose asChild>
              <Button className="w-full mt-3" variant={"secondary"}>
                Cancelar
              </Button>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
