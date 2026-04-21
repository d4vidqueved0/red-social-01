import type { PostWithProfile } from "../types";
import { PostCard } from "./PostCard";

interface PostListProps {
  posts: PostWithProfile[] | undefined;
  handleDelete: (id: string) => void;
}

export function PostList({ posts, handleDelete }: PostListProps) {
  return (
    <>
      {posts && (
        <div className="flex flex-col gap-5 my-5">
          {posts.map((post) => (
            <PostCard key={post.id} handleDelete={handleDelete} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
