import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { NavLink } from "react-router";
import { toast } from "sonner";
import { Button } from "./ui";

export function Header() {
  const { session } = useAuthStore();

  const handleSession = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Se cerró la sesión.");
  };

  return (
    <header className="fixed z-50 top-0 left-0 w-full bg-black/30 backdrop-blur-xl border-b-2">
      <nav className="max-w-5xl mx-auto w-full min-h-16  flex items-center justify-between px-3">
        <div className="flex gap-12">
          <NavLink to={"/feed"}>Inicio</NavLink>
        </div>

        {session ? (
          <Button variant={"link"} onClick={handleSession}>
            Cerrar sesión
          </Button>
        ) : (
          <NavLink to={"/auth/login"}>Iniciar sesión</NavLink>
        )}
      </nav>
    </header>
  );
}
