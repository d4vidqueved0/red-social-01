import { Header } from "@/components/Header";
import { Button } from "@/components/ui";
import { usePostsRealtime } from "@/features/posts/hooks/usePostsRealtime";
import { useMobile } from "@/hooks/useMobile";
import { useScroll } from "@/hooks/useScroll";
import { ArrowBigUpIcon } from "lucide-react";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

export function AppLayout() {
  usePostsRealtime();

  const { isMobile } = useMobile();

  const { scroll } = useScroll();

  return (
    <div>
      <Header />
      <main className="mt-24 px-3">
        <Outlet />
        <Toaster
          theme="dark"
          position={isMobile ? "top-center" : "bottom-right"}
        />

        <Button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          size={"icon"}
          className={`rounded-full fixed z-50 bottom-0 max-w-5xl m-3 ${scroll ? "" : "opacity-0"} transition-all`}
        >
          <ArrowBigUpIcon />
        </Button>
      </main>
    </div>
  );
}
