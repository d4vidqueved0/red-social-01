import { Header } from "@/components/Header";
import { Outlet } from "react-router";

export function AppLayout() {
  return (
    <div>
      <Header />
      <main className="mt-24 px-3">
        <Outlet />
      </main>
    </div>
  );
}
