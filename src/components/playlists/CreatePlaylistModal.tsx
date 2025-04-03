import { useState } from "react";
import { useCreatePlaylist } from "@/hooks/usePlaylistQueries";
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

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreatePlaylistModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePlaylistModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createPlaylistMutation = useCreatePlaylist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Playlist name is required");
      return;
    }

    try {
      await createPlaylistMutation.mutateAsync({ name, description });
      toast.success("Playlist created successfully");
      setName("");
      setDescription("");
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to create playlist");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Create New Playlist
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Create a new playlist to organize your favorite videos
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
              disabled={createPlaylistMutation.isPending}
            >
              {createPlaylistMutation.isPending
                ? "Creating..."
                : "Create Playlist"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
