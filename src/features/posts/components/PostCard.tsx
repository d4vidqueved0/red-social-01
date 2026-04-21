import { Button } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { SkeletonImg } from "@/components/ui/SkeletonPosts";
import { useAuthStore } from "@/store/authStore";
import dayjs from "dayjs";
import { TrashIcon } from "lucide-react";
import type { PostWithProfile } from "../types";

interface PostCardProps {
  post: PostWithProfile;
  handleDelete: (id: string) => void;
}

export function PostCard({ post, handleDelete }: PostCardProps) {
  const {
    content,
    created_at,
    category,
    profiles: { username, avatar_url, name },
  } = post;

  const { session } = useAuthStore();

  return (
    <>
      <div className="flex flex-col rounded-xl bg-black/50 border w-full max-w-2xl ps-1 p-5 mx-auto">
        <div className="grid grid-cols-[2fr_9fr] sm:grid-cols-[1fr_10fr] w-full">
          <div>
            <SkeletonImg
              className="m-0 rounded-full overflow-hidden"
              img={avatar_url ?? "/stock.png"}
            />
          </div>

          <div className="flex flex-col mb-2">
            <div className="flex justify-between items-center">
              <h3 className="lg:text-xl">{name}</h3>
              <small>{dayjs(created_at).fromNow()}</small>
            </div>
            <small>@{username}</small>
          </div>
        </div>
        <div className="grid grid-cols-[2fr_9fr] sm:grid-cols-[1fr_10fr] grow">
          <div className="flex justify-center grow items-end">
            {session?.user.id === post.user_id && (
              <Button
                onClick={() => {
                  handleDelete(post.id);
                }}
                className="w-fit h-fit"
                variant={"link"}
              >
                <TrashIcon />
              </Button>
            )}
          </div>
          <div>
            <p className="break-all">{content}</p>
            {post.image_url && <SkeletonImg img={post.image_url} />}

            <div className="flex justify-between mt-5 sm:flex-row flex-col gap-3 sm:gap-0">
              <Badge className="text-xs" variant={"default"}>
                {category &&
                  category?.charAt(0).toUpperCase() +
                    category?.slice(1).replace("_", " ")}
              </Badge>
              <small className="text-xs lg:text-md">
                {dayjs(created_at).format("DD [de] MMMM [del] YYYY [-] hh:mmA")}
              </small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
