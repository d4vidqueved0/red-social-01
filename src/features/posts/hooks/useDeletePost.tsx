import { useState } from "react";

export function useDeletePost() {
  const [postDelete, setDelete] = useState<string | null>(null);

  const handleDelete = (id: string | null) => {
    setDelete(id);
  };

  return { postDelete, handleDelete };
}
