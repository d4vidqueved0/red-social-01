import {
  Button,
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
import { ImagePlus, XIcon } from "lucide-react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { CATEGORIES, postSchema, type postSchemaType } from "../schemas";

interface PostFormProps {
  control: Control<postSchemaType>;
  errors: FieldErrors<postSchemaType>;
  register: UseFormRegister<postSchemaType>;
  setValue: UseFormSetValue<postSchemaType>;
  preview: string | null;
  setPreview: (preview: string | null) => void;
}

export function PostForm({
  control,
  errors,
  register,
  setValue,
  preview,
  setPreview,
}: PostFormProps) {
  const { onChange, ...restRegisters } = register("file");

  return (
    <FieldGroup>
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
                  className={field.value.length > 200 ? "text-red-500" : ""}
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
        <FieldLabel htmlFor="imagen">Imagen</FieldLabel>
        {!preview && (
          <div className="relative max-w-fit overflow-hidden">
            <ImagePlus size={100} className="border rounded-2xl p-3" />
            <input
              id="imagen"
              className="absolute top-0 h-full opacity-0"
              aria-invalid={Boolean(errors.file)}
              {...restRegisters}
              onChange={(ev) => {
                const file = ev.target.files?.[0];
                onChange(ev);

                const result = postSchema.shape.file.safeParse(ev.target.files);

                if (!result.success) {
                  setPreview(null);
                  return;
                }
                if (file) {
                  setPreview(URL.createObjectURL(file));
                }
              }}
              type="file"
              accept="image/*"
            />
          </div>
        )}

        <FieldError>{errors.file?.message}</FieldError>
        {preview && !errors.file && (
          <>
            <div className="relative max-w-fit">
              <img className="max-w-xs w-full object-contain" src={preview} />
              <Button
                type="button"
                onClick={() => {
                  setValue("file", undefined);
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
                  <SelectItem value=" ">Selecciona una categoria</SelectItem>
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
    </FieldGroup>
  );
}
