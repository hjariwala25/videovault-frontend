import { useDeletePlaylist } from "@/hooks/usePlaylistQueries";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeletePlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
  playlistName: string;
}

export default function DeletePlaylistDialog({
  isOpen,
  onClose,
  playlistId,
  playlistName,
}: DeletePlaylistDialogProps) {
  const deletePlaylistMutation = useDeletePlaylist();
  const router = useRouter();

  const handleDelete = async () => {
    const loadingToastId = toast.loading("Deleting playlist...");

    try {
      await deletePlaylistMutation.mutateAsync(playlistId);
      toast.dismiss(loadingToastId);
      toast.success("Playlist deleted successfully");
      onClose();
      router.push("/playlists");
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("Failed to delete playlist");
      console.error(error);
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Delete Playlist
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete{" "}
            <span className="font-medium text-gray-800 dark:text-gray-200">
              &quot;{playlistName}&quot;
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
            disabled={deletePlaylistMutation.isPending}
          >
            {deletePlaylistMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
