import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { Outlet } from "react-router";

export function RootLayout() {
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      useAuthStore.getState().setSession(session);
      useAuthStore.getState().setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return <Outlet />; // aquí se renderizan las rutas hijas
}
