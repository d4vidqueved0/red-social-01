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
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";
import { signInGoogle } from "../api/signInGoogle";
import { loginSchema, type loginSchemaType } from "../schemas";
import { useShowPass } from "./useShowPass";

export function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: loginSchemaType) => {
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Se inició sesión con exito.");
    navigate("/feed");
  };

  const { isPass, handlePass, type } = useShowPass();

  return (
    <Card className="mt-12 max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Iniciar sesión</CardTitle>
        <CardDescription>
          Rellene los siguientes campos para iniciar sesión.
        </CardDescription>
        <CardAction>
          <NavLink to={"/auth/register"}>Crear cuenta</NavLink>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
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
            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <Field>
                  <div className="flex justify-between items-center">
                    <FieldLabel>Contraseña</FieldLabel>
                    <NavLink to={"/auth/send_reset_password"}>
                      ¿Olvidaste la contraseña?
                    </NavLink>
                  </div>
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
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button
          form="login-form"
          type="submit"
          className="w-full"
          variant={"default"}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
        <Button
          onClick={signInGoogle}
          type="button"
          variant={"secondary"}
          className="w-full"
        >
          Iniciar sesión con Google
        </Button>
      </CardFooter>
    </Card>
  );
}
