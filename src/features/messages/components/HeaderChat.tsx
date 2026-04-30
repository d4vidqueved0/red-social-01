import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Profile } from "@/types";
import { EllipsisVertical } from "lucide-react";
import { toast } from "sonner";

export function HeaderChat({ profile }: { profile: Profile }) {
  const { name, avatar_url, username } = profile;

  return (
    <div className="flex items-center border-b min-h-18 max-h-18 gap-3 p-3">
      <Avatar className="h-13 w-13">
        <AvatarImage src={avatar_url || undefined} />
        <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <h1>{name}</h1>
        <small>@{username}</small>
      </div>
      <div className="ms-auto">
        <EllipsisVertical
          className="cursor-pointer active:scale-90 transition-all"
          onClick={() => {
            toast.info("Proximamente");
          }}
        />
      </div>
    </div>
  );
}
