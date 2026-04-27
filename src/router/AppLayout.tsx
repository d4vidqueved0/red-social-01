import { Header } from "@/components/Header";
import { usePostsRealtime } from "@/features/posts/hooks/usePostsRealtime";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

export function AppLayout() {
  usePostsRealtime();

  const [isMobile, setMobile] = useState(() => {
    return window.innerWidth < 768 ? true : false;
  });

  const handleMobile = () => {
    setMobile(window.innerWidth < 768 ? true : false);
  };

  useEffect(() => {
    window.addEventListener("resize", handleMobile);

    return () => {
      window.removeEventListener("resize", handleMobile);
    };
  }, []);

  console.log(isMobile);
  return (
    <div>
      <Header />
      <main className="mt-24 px-3">
        <Outlet />
        <Toaster
          theme="dark"
          position={isMobile ? "top-center" : "bottom-right"}
        />
      </main>
    </div>
  );
}
