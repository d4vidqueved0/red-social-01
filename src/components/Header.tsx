import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { NavLink } from "react-router";
import { toast } from "sonner";
import { Button } from "./ui";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Header() {
  const { session, profile } = useAuthStore();

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

        {session && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className=" flex gap-3 items-center">
                {profile?.name}
                {profile && (
                  <Avatar>
                    <AvatarImage
                      src={profile?.avatar_url || undefined}
                      alt="shadcn"
                    />
                    <AvatarFallback>{profile?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </Button>
            </DropdownMenuTrigger>{" "}
            <DropdownMenuContent className="w-32">
              <DropdownMenuGroup>
                <DropdownMenuItem>Perfil</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleSession} variant="destructive">
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {session === null && (
          <NavLink to={"/auth/login"}>Iniciar sesión</NavLink>
        )}
      </nav>
    </header>
  );
}
