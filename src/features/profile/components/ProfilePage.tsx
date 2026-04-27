import LightRays from "@/components/LightRays";
import { FullscreenLoader } from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeletePost } from "@/features/posts/components/DeletePost";
import { EditPost } from "@/features/posts/components/EditPost";
import { PostCard } from "@/features/posts/components/PostCard";
import { useDeletePost } from "@/features/posts/hooks/useDeletePost";
import { useEditPost } from "@/features/posts/hooks/useEditPost";
import { postKeys } from "@/features/posts/keys.posts";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useParams } from "react-router";
import { toast } from "sonner";
import { getPostsProfile } from "../api/getPostsProfile";

export function ProfilePage() {
  const { id } = useParams();

  const { data, isLoading } = useQuery<Profile>({
    queryKey: ["profile", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Error al cargar el perfil.");
        return;
      }
      console.log(data);
      return data;
    },
    enabled: !!id,
  });

  const { data: postsData, isLoading: loadingPosts } = useInfiniteQuery({
    queryKey: postKeys.profile(id),
    queryFn: getPostsProfile,
    initialPageParam: dayjs().toISOString(),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? null,
    enabled: !!data && !!id,
  });

  const { handleDelete, postDelete } = useDeletePost();

  const { dialogEdit, handleDialogEdit, handleEdit, postEdit } = useEditPost();

  if (isLoading) return <FullscreenLoader />;

  if (!data) return;

  const { name, username, avatar_url, biography, created_at } = data;
  const posts = postsData?.pages.flatMap((page) => page.data) || [];
  return (
    <section className="mx-auto w-full max-w-5xl flex flex-col items-center">
      <div className="w-full h-100 -m-12">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          className="custom-rays"
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>

      <div className="-mt-15 z-50 flex flex-col items-center">
        <Avatar className="w-30 h-30 border-white border-2">
          <AvatarImage src={avatar_url || undefined} />
          <AvatarFallback className="text-3xl z-50">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-3xl mt-2">{name}</h1>
        <small className="text-lg">@{username}</small>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] w-full mt-12">
        <div>
          <h3>Biografia</h3>
          <p>{biography || "No hay biografia."}</p>
          <small>
            Cuenta creada {dayjs(created_at).format("DD [de] MMMM [del] YYYY")}
          </small>
        </div>
        <div>
          <h2 className="text-2xl">Publicaciones</h2>
          {loadingPosts && <FullscreenLoader />}
          <div className="flex flex-col gap-3 my-5">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                handleDelete={handleDelete}
                handlePostEdit={handleEdit}
              />
            ))}
          </div>
        </div>
      </div>
      {postDelete && <DeletePost handleDelete={handleDelete} id={postDelete} />}
      {postEdit && (
        <EditPost
          key={postEdit.id}
          post={postEdit}
          handleDialogEdit={handleDialogEdit}
          open={dialogEdit}
        />
      )}
    </section>
  );
}
