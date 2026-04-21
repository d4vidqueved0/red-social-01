import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface deletePostProps {
  id: string;
  handleDelete: (id: string | null) => void;
}

export function DeletePost({ id, handleDelete }: deletePostProps) {
  const handleDeletePost = async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Se eliminó la publicacion.");
  };

  return (
    <AlertDialog
      onOpenChange={() => {
        handleDelete(null);
      }}
      open={!!id}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estas seguro de eliminar la publicación?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. La publicación se eliminará
            permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDeletePost(id)}
            variant={"destructive"}
          >
            Si, eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
