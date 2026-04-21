import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
} from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { type justEmailType, justEmail } from "../schemas";

export function SendResetPassword() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<justEmailType>({
    resolver: zodResolver(justEmail),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: justEmailType) => {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/reset_password`,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(
      "Se envió un correo con el enlace para cambiar tu contraseña.",
    );
  };

  return (
    <Card className="mt-12 max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Recuperar contraseña</CardTitle>
        <CardDescription>
          Ingrese su email para enviar un correo con las instrucciones para
          recuperar su contraseña.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form_send_reset_password" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="correo@ejemplo.com"
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button
          form="form_send_reset_password"
          type="submit"
          className="w-full"
          variant={"default"}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando correo..." : "Enviar correo"}
        </Button>
      </CardFooter>
    </Card>
  );
}
