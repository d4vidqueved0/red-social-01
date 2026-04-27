import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { Outlet } from "react-router";

export function RootLayout() {
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      useAuthStore.getState().setSession(session);
      if (session) {
        (async () => {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          useAuthStore.getState().setProfile(data);
        })();
      } else if (event === "SIGNED_OUT") {
        useAuthStore.getState().setProfile(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return <Outlet />; // aquí se renderizan las rutas hijas
}
