import type { Post } from "@/types";
import { useState } from "react";

export function useEditPost() {
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

  return {postEdit, handleEdit, dialogEdit, handleDialogEdit};
}
