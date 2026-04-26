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
  return (
    <>
      {posts && (
        <div className="flex flex-col gap-5 my-5">
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
