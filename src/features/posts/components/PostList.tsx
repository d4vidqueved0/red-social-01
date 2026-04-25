import { useFeedStore } from "@/store/feedStore";
import type { Post } from "@/types";
import type { PostWithProfileAndLikes } from "../types";
import { PostCard } from "./PostCard";

interface PostListProps {
  posts: PostWithProfileAndLikes[] | undefined;
  handleDelete: (id: string) => void;
  handlePostEdit: (post: Post | null) => void;
}

export function PostList({
  posts,
  handleDelete,
  handlePostEdit,
}: PostListProps) {
  const { postsLocales } = useFeedStore();

  return (
    <>
      {posts && (
        <div className="flex flex-col gap-5 my-5">
          {postsLocales.map((postLocal) => (
            <PostCard
              key={postLocal.id}
              handlePostEdit={handlePostEdit}
              handleDelete={handleDelete}
              post={postLocal}
            />
          ))}
          {posts.map((post) => (
            <PostCard
              key={post.id}
              handlePostEdit={handlePostEdit}
              handleDelete={handleDelete}
              post={post}
            />
          ))}
        </div>
      )}
    </>
  );
}
