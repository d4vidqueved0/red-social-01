import {
  Button,
  Card,
  CardAction,
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
} from "@/components/ui/index";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { NavLink } from "react-router";
import { toast } from "sonner";
import { registerSchema, type registerSchemaType } from "../schemas";
import { useShowPass } from "./useShowPass";

export function RegisterForm() {
  const { isPass, handlePass, type } = useShowPass();

  const {
    isPass: isPass2,
    handlePass: handlePass2,
    type: type2,
  } = useShowPass();

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      username: "",
      password: "",
      password_confirm: "",
    },
  });

  const onSubmit = async (data: registerSchemaType) => {
    const { email, password, username, name } = data;

    const { data: existing } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", data.username)
      .single();

    if (existing) {
      setError("username", {
        message: "Este nombre de usuario ya está en uso.",
      });
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, username },
      },
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    // toast.success("Se envio un correo de confirmacion a tu email.");
    toast.success("Se creó la cuenta con exito.");
    supabase.auth.signOut();
  };

  return (
    <Card className="mt-12 max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Registrarse</CardTitle>
        <CardDescription>
          Rellene los siguientes campos para crear una cuenta.
        </CardDescription>
        <CardAction>
          <NavLink to={"/auth/login"}>Iniciar sesión</NavLink>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={handleSubmit(onSubmit)}>
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
                    placeholder="Ilia@topuria.com"
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Nombre</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Chiwiwisss"
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <Controller
              control={control}
              name="username"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Usuario</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="charles_do_bronx"
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
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
      <CardFooter>
        <Button
          form="register-form"
          type="submit"
          className="cursor-pointer"
          variant={"default"}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </CardFooter>
    </Card>
  );
}
