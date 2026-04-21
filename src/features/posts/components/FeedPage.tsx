import { Button, FullscreenLoader } from "@/components/ui";
import { useFeedStore } from "@/store/feedStore";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowBigUpIcon } from "lucide-react";
import { useState } from "react";
import { usePostsQuery } from "../hooks/usePostsQuery";
import { usePostsRealtime } from "../hooks/usePostsRealtime";
import { CreatePost } from "./CreatePost";
import { DeletePost } from "./DeletePost";
import { PostList } from "./PostList";

export function FeedPage() {
  const { data, isError, isFetching, isLoading } = usePostsQuery();

  usePostsRealtime();
  const { newPostsCount, resetNewPosts } = useFeedStore();

  const queryClient = useQueryClient();

  const handleNewPosts = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    resetNewPosts();
  };

  const [postDelete, setDelete] = useState<string | null>(null);

  const handleDelete = (id: string | null) => {
    setDelete(id);
  };

  return (
    <>
      <CreatePost />
      {newPostsCount > 0 && (
        <div className="flex justify-center mt-5">
          <Button onClick={handleNewPosts}>
            {`Hay ${newPostsCount} ${newPostsCount > 1 ? "publicaciones nuevas" : "publicacion nueva"}`}
          </Button>
        </div>
      )}
      {isLoading && <FullscreenLoader />}
      {!isFetching && data && (
        <>
          <PostList posts={data} handleDelete={handleDelete} />
          <Button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            size={"icon"}
            className="rounded-full fixed z-50 bottom-0 right-0 m-3"
          >
            <ArrowBigUpIcon />
          </Button>

          {postDelete && (
            <DeletePost handleDelete={handleDelete} id={postDelete} />
          )}
        </>
      )}
      {!isFetching && data?.length === 0 && (
        <div className="text-center">No hay publicaciones.</div>
      )}
      {!isFetching && isError && (
        <div className="text-center">Error al cargar los datos.</div>
      )}
    </>
  );
}
