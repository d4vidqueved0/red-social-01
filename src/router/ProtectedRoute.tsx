import { FullscreenLoader } from "@/components/ui/index";
import { useAuthStore } from "@/store/authStore";
import type { ReactNode } from "react";
import { Navigate } from "react-router";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session } = useAuthStore();

  if (session === undefined) return <FullscreenLoader />;

  if (!session) return <Navigate to={"/auth/login"} />;

  return children;
}
