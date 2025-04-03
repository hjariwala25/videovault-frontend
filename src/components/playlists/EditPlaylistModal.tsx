import { useState, useEffect } from "react";
import { useUpdatePlaylist } from "@/hooks/usePlaylistQueries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Playlist } from "@/types";

interface EditPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: Playlist | null;
  onSuccess?: () => void;
}

export default function EditPlaylistModal({
  isOpen,
  onClose,
  playlist,
  onSuccess,
}: EditPlaylistModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const updatePlaylistMutation = useUpdatePlaylist();
  const [playlistId, setPlaylistId] = useState<string | null>(null);

  // Reset form data when modal opens or playlist changes
  useEffect(() => {
    if (playlist) {
      console.log("Playlist received in modal:", playlist);

      let id = null;

      if (playlist._id) {
        id = playlist._id;
        console.log("Found ID directly:", id);
      } //  else if (playlist.playlistVideos && playlist.playlistVideos[0]?._id) {
      //   id = playlist.playlistVideos[0]._id;
      //   console.log("Found ID in nested structure:", id);
      // }

      // Set the ID
      setPlaylistId(id);

      // Set form values with reasonable defaults
      setName(playlist.name || "");
      setDescription(playlist.description || "");

      // Log current form values for debugging
      console.log("Set form values:", {
        id,
        name: playlist.name || "",
        description: playlist.description || "",
      });
    }
  }, [playlist, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!playlist) {
      toast.error("No playlist selected. Please try again.");
      return;
    }

    const urlId = window.location.pathname.split("/").pop();

    const idToUse = playlistId || playlist._id || urlId;

    if (!idToUse) {
      console.error("Missing playlist ID:", { playlist, playlistId, urlId });
      toast.error("Cannot identify playlist. Please refresh and try again.");
      return;
    }

    if (!name.trim()) {
      toast.error("Playlist name is required");
      return;
    }


  
    let successCalled = false;

    // Use toast.promise to avoid stuck loading states
    toast.promise(
      updatePlaylistMutation
        .mutateAsync({
          playlistId: idToUse,
          name: name.trim(),
          description: description.trim(),
        })
        .then((result) => {
          // Flag to prevent double execution
          if (!successCalled) {
            successCalled = true;


        
            if (onSuccess) onSuccess();

            // Close the modal
            onClose();
          }
          return result;
        }),
      {
        loading: "Updating playlist...",
        success: "Playlist updated successfully",
        error: "Failed to update playlist",
      }
    );
  };

  // Guard clause if no playlist
  if (!playlist) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Edit Playlist
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Update your playlist details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-900 dark:text-white">
              Playlist Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Playlist"
              className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-gray-900 dark:text-white"
            >
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A collection of my favorite videos"
              className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[100px]"
            />
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              disabled={updatePlaylistMutation.isPending}
            >
              {updatePlaylistMutation.isPending
                ? "Updating..."
                : "Update Playlist"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
