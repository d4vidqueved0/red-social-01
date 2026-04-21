import { LoginForm } from "@/features/auth/components/LoginForm";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { ResetPassword } from "@/features/auth/components/ResetPassword";
import { SendResetPassword } from "@/features/auth/components/SendResetPassword";
import { FeedPage } from "@/features/posts/components/FeedPage";
import { createBrowserRouter, Navigate } from "react-router";
import { AppLayout } from "./AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { RootLayout } from "./RootLayout";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <Navigate to="/feed" />,
          },
          {
            path: "/feed",
            element: <ProtectedRoute>{<FeedPage />}</ProtectedRoute>,
          },
          {
            path: "/auth/login",
            element: (
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            ),
          },
          {
            path: "/auth/send_reset_password",
            element: (
              <PublicRoute>
                <SendResetPassword />
              </PublicRoute>
            ),
          },
          {
            path: "/auth/reset_password",
            element: (
              <ProtectedRoute>
                <ResetPassword />
              </ProtectedRoute>
            ),
          },
          {
            path: "/auth/register",
            element: (
              <PublicRoute>
                <RegisterForm />
              </PublicRoute>
            ),
          },
          {
            path: "/messages",
            element: <ProtectedRoute>d</ProtectedRoute>,
          },
          {
            path: "/profile/:username",
            element: <ProtectedRoute>d</ProtectedRoute>,
          },
        ],
      },
    ],
  },
]);
