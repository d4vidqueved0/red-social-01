import { Button, FullscreenLoader } from "@/components/ui";
import { useFeedStore } from "@/store/feedStore";
import type { Post } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowBigUpIcon } from "lucide-react";
import { useState } from "react";
import { useInfiniteScroll } from "../hooks/useInfinityQuery";
import { usePostsQuery } from "../hooks/usePostsQuery";
import { usePostsRealtime } from "../hooks/usePostsRealtime";
import { postKeys } from "../keys.posts";
import { CreatePost } from "./CreatePost";
import { DeletePost } from "./DeletePost";
import { EditPost } from "./EditPost";
import { PostList } from "./PostList";

export function FeedPage() {
  const {
    data,
    isError,
    isFetching,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostsQuery();

  usePostsRealtime();

  const { observerRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const {
    newPostsCount,
    resetNewPosts,
    resetFechaInicial,
    fechaInicial,
  } = useFeedStore();

  const queryClient = useQueryClient();

  const handleNewPosts = () => {
    queryClient.invalidateQueries({ queryKey: postKeys.feed(fechaInicial) });
    resetFechaInicial();
    resetNewPosts();
  };

  const [postDelete, setDelete] = useState<string | null>(null);

  const handleDelete = (id: string | null) => {
    setDelete(id);
  };

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  const [postEdit, setPostEdit] = useState<Post | null>(null);

  const handleEdit = (post: Post | null) => {
    if (post) {
      setDialogEdit(true);
    } else {
      setDialogEdit(false);
    }
    setPostEdit(post);
  };

  const [dialogEdit, setDialogEdit] = useState(false);

  const handleDialogEdit = () => {
    setDialogEdit((prev) => !prev);
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

      {data && (
        <>
          <PostList
            posts={posts}
            handleDelete={handleDelete}
            handlePostEdit={handleEdit}
          />
          <div className="mx-auto w-full min-h-12" ref={observerRef}></div>

          <Button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            size={"icon"}
            className="rounded-full fixed z-50 bottom-0 left-0 m-3"
          >
            <ArrowBigUpIcon />
          </Button>

          {postDelete && (
            <DeletePost handleDelete={handleDelete} id={postDelete} />
          )}
          {postEdit && (
            <EditPost
              key={postEdit.id}
              post={postEdit}
              handleDialogEdit={handleDialogEdit}
              open={dialogEdit}
            />
          )}
        </>
      )}

      {!isFetching && posts?.length === 0 && (
        <div className="text-center">No hay publicaciones.</div>
      )}
      {!isFetching && isError && (
        <div className="text-center">Error al cargar los datos.</div>
      )}
    </>
  );
}
