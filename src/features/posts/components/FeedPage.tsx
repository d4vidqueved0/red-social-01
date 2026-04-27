import { Button, FullscreenLoader } from "@/components/ui";
import { useFeedStore } from "@/store/feedStore";
import { useQueryClient } from "@tanstack/react-query";
import { useDeletePost } from "../hooks/useDeletePost";
import { useEditPost } from "../hooks/useEditPost";
import { useInfiniteScroll } from "../hooks/useInfinityQuery";
import { usePostsQuery } from "../hooks/usePostsQuery";
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

  const { observerRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const { newPostsCount, resetNewPosts, resetFechaInicial, fechaInicial } =
    useFeedStore();

  const queryClient = useQueryClient();

  const handleNewPosts = () => {
    queryClient.invalidateQueries({ queryKey: postKeys.feed(fechaInicial) });
    resetFechaInicial();
    resetNewPosts();
  };

  const { postDelete, handleDelete } = useDeletePost();

  const { postEdit, handleEdit, handleDialogEdit, dialogEdit } = useEditPost();

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

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
