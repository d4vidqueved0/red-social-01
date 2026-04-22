import {
  Button,
  Card,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { ChevronDown, ImagePlus, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CATEGORIES, postSchema, type postSchemaType } from "../schemas";

export function CreatePost() {
  const {
    control,
    handleSubmit,
    reset,
    register,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<postSchemaType>({
    resolver: zodResolver(postSchema),
    mode: "onChange",
    defaultValues: {
      content: "",
      category: undefined,
    },
  });

  const { user } = useAuthStore();

  const onSubmit = async (post: postSchemaType) => {
    let image_url = null;

    const file = post.file?.[0];

    if (file) {
      const { data, error: uploadError } = await supabase.storage
        .from("posts")
        .upload(`${user!.id}/${dayjs().unix()}`, file);

      if (uploadError) {
        toast.error(uploadError.message);
        return;
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from("posts").getPublicUrl(data.path);

      image_url = publicUrl;
    }

    const postWithUseId = {
      content: post.content,
      category: post.category,
      user_id: user!.id,
      image_url,
    };

    const { error } = await supabase.from("posts").insert(postWithUseId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Se guardó la publicacion.");

    reset();
    setPreview(null);
  };

  const { onChange, ...restRegisters } = register("file");

  const [preview, setPreview] = useState<null | string>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const [isShow, setShow] = useState(false);

  const handleShow = () => {
    setShow((prev) => !prev);
  };

  return (
    <>
      <Card className="max-w-2xl w-full mx-auto mt-12">
        <form
          className={`px-3 `}
          id="create-post-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold mb-3">Añadir publicacion</h2>
            <Button onClick={handleShow} type="button">
              <ChevronDown />
            </Button>
          </div>
          <FieldGroup className={isShow ? "flex" : "hidden"}>
            <Controller
              control={control}
              name="content"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="content">Contenido *</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      id="content"
                      className="field-sizing-content"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Tu publicacion aqui"
                    />
                    <InputGroupAddon align={"block-end"}>
                      <InputGroupText
                        className={
                          field.value.length > 200 ? "text-red-500" : ""
                        }
                      >
                        {field.value.length + "/200"}
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Field>
              <FieldLabel>Imagen</FieldLabel>
              <div className="relative max-w-fit overflow-hidden">
                <ImagePlus size={100} className="border rounded-2xl p-3" />
                <input
                  className="absolute top-0 h-full opacity-0"
                  aria-invalid={Boolean(errors.file)}
                  {...restRegisters}
                  onChange={(ev) => {
                    onChange(ev);
                    const file = ev.target.files?.[0];
                    if (file) setPreview(URL.createObjectURL(file));
                    else {
                      setPreview(null);
                    }
                  }}
                  type="file"
                  accept="image/*"
                />
              </div>

              <FieldError>{errors.file?.message}</FieldError>
              {preview && !errors.file && (
                <>
                  <div className="relative max-w-fit">
                    <img
                      className="max-w-xs w-full object-contain"
                      src={preview}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        setValue("file", undefined);
                        URL.revokeObjectURL(preview);
                        setPreview(null);
                      }}
                      className="rounded-full m-1 absolute top-0 right-0"
                    >
                      <XIcon />
                    </Button>
                  </div>
                </>
              )}
            </Field>
            <Controller
              control={control}
              name="category"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="category">Categoria *</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value || " "}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="category"
                      aria-invalid={fieldState.invalid}
                      className="w-45"
                    >
                      <SelectValue className="capitalize" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value=" ">
                          Selecciona una categoria
                        </SelectItem>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() +
                              cat.slice(1).replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
            <Button
              className="mt-3"
              disabled={isSubmitting}
              form="create-post-form"
              type="submit"
            >
              {isSubmitting ? "Publicando..." : "Publicar"}
            </Button>
          </FieldGroup>
        </form>
      </Card>
    </>
  );
}
