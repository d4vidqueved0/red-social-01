import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SkeletonImg } from "@/components/ui/SkeletonPosts";
import { useAuthStore } from "@/store/authStore";
import type { Post } from "@/types";
import dayjs from "dayjs";
import { EllipsisVertical, Heart, Pencil, Share2, Trash } from "lucide-react";
import { useToggleLike } from "../hooks/useToggleLike";
import type { PostWithProfileAndLikes } from "../types";

interface PostCardProps {
  post: PostWithProfileAndLikes;
  handleDelete: (id: string) => void;
  handlePostEdit: (post: Post | null) => void;
}

export function PostCard({
  post,
  handleDelete,
  handlePostEdit,
}: PostCardProps) {
  const {
    content,
    created_at,
    category,
    profiles: { username, avatar_url, name },
  } = post;

  const { session } = useAuthStore();

  const { mutate } = useToggleLike(post);

  return (
    <>
      <div className="flex flex-col rounded-xl bg-black/50 border w-full max-w-2xl p-5 mx-auto">
        <div className="grid grid-cols-[1fr_9fr] sm:grid-cols-[1fr_11fr] w-full gap-1">
          <div className="flex items-center">
            {/* <SkeletonImg
              className="m-0 rounded-full overflow-hidden"
              img={avatar_url ?? "/stock.webp"}
            /> */}
            <Avatar size="lg">
              <AvatarImage src={avatar_url || "stock.webp"} alt="shadcn" />
            </Avatar>
          </div>

          <div className="flex flex-col mb-2">
            <div className="flex justify-between items-center">
              <h3 className="lg:text-xl">{name}</h3>
              {post.user_id === session?.user.id ? (
                <div className="flex items-center lg:gap-3">
                  <small>{dayjs(created_at).fromNow()}</small>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger>
                      <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="z-40">
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => handlePostEdit(post)}>
                          <Pencil />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            handleDelete(post.id);
                          }}
                          variant="destructive"
                        >
                          <Trash />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <small>{dayjs(created_at).fromNow()}</small>
              )}
            </div>
            <small>@{username}</small>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_9fr] sm:grid-cols-[1fr_11fr] w-full gap-1">
          <div className="flex justify-center grow items-end"></div>
          <div>
            <p className="break-all">{content}</p>
            {post.image_url && <SkeletonImg img={post.image_url} />}

            <div className="flex justify-between mt-5 sm:flex-row flex-col gap-1 sm:gap-0">
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
        {post.user_likes && (
          <div className="grid grid-cols-[1fr_9fr] sm:grid-cols-[1fr_11fr] w-full gap-1 mt-7 ">
            <div></div>
            <div className="flex justify-between">
              <div>
                <Share2 size={24} />
              </div>
              <div className="flex gap-8">
                <div className="flex gap-2">
                  {/* <MessageCircle size={24} />
                  {2} */}
                </div>
                <div className="flex gap-2">
                  <Heart
                    className="cursor-pointer transition-all active:scale-90"
                    onClick={() => mutate()}
                    fill={post.user_likes.length > 0 ? "red" : ""}
                    color={post.user_likes.length > 0 ? "red" : "white"}
                    size={24}
                  />
                  {post.id === '995c98af-11b8-4563-a283-f27fa435b90d' ? '7M' : (post.likes[0].count || " ")}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
