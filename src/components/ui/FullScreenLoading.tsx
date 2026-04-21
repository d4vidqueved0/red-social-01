import { LoaderCircle } from "lucide-react";

export function FullscreenLoader() {
  return (
    <div className="mt-12 flex w-full justify-center">
      <LoaderCircle className="animate-spin" size={24} />
    </div>
  );
}
