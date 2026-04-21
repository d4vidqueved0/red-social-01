import { useState } from "react";

export function SkeletonPosts({ img }: { img: string }) {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="my-3 relative">
      <img
        onLoad={() => {
          setLoading(false);
        }}
        className={
          (isLoading ? "absolute" : " ") +
          ` object-cover w-full max-w-xl mx-auto`
        }
        src={img}
      />
      {isLoading && (
        <div className="animate-pulse rounded-xl w-xl aspect-square bg-gray-600"></div>
      )}
    </div>
  );
}
