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
} from "@/components/ui";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { passwordReset, type passwordResetType } from "../schemas";
import { useShowPass } from "./useShowPass";

export function ResetPassword() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<passwordResetType>({
    resolver: zodResolver(passwordReset),
    defaultValues: {
      password: "",
      password_confirm: "",
    },
  });

  const onSubmit = async (data: passwordResetType) => {
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Se cambió la contraseña con exito.");
    supabase.auth.signOut();
  };

  const { isPass, handlePass, type } = useShowPass();

  const {
    isPass: isPass2,
    handlePass: handlePass2,
    type: type2,
  } = useShowPass();

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
              name="password"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Contraseña</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••"
                      type={type}
                    />
                    <InputGroupAddon align={"inline-end"}>
                      <Button
                        onClick={handlePass}
                        type="button"
                        variant={"link"}
                      >
                        {isPass ? <EyeOff /> : <Eye />}
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
            <Controller
              control={control}
              name="password_confirm"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Repetir contraseña</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••"
                      type={type2}
                    />
                    <InputGroupAddon align={"inline-end"}>
                      <Button
                        onClick={handlePass2}
                        type="button"
                        variant={"link"}
                      >
                        {isPass2 ? <EyeOff /> : <Eye />}
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
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
