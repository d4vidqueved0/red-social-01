import { useState } from "react";

export function SkeletonImg({
  img,
  className = "my-3",
}: {
  img: string;
  className?: string;
}) {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className={`${className} relative`}>
      <img
        onLoad={() => {
          setLoading(false);
        }}
        className={
          (isLoading ? "absolute opacity-0" : " ") +
          ` object-cover w-full mx-auto`
        }
        src={img}
      />
      {isLoading && (
        <div className="animate-pulse rounded-xl w-full max-w-xl aspect-square bg-gray-600"></div>
      )}
    </div>
  );
}
