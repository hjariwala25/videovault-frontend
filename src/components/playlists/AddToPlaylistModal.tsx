import { useState, useEffect } from "react";
import {
  useUserPlaylists,
  useAddVideoToPlaylist,
  useCreatePlaylist,
} from "@/hooks/usePlaylistQueries";
import { useCurrentUser } from "@/hooks/useUserQueries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Playlist } from "@/types";
import { Check, Plus, FolderPlus, Loader2 } from "lucide-react";

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  currentPlaylistId?: string; 
}

export default function AddToPlaylistModal({
  isOpen,
  onClose,
  videoId,
}: AddToPlaylistModalProps) {
  const { data: currentUser } = useCurrentUser();
  const {
    data: playlists,
    isLoading,
    refetch,
  } = useUserPlaylists(currentUser?._id || "");
  const addToPlaylistMutation = useAddVideoToPlaylist();
  const createPlaylistMutation = useCreatePlaylist();
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");

  // Reset selections when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedPlaylists([]);
      setShowCreateForm(false);
      setNewPlaylistName("");
      setNewPlaylistDescription("");
    }
  }, [isOpen]);

  const togglePlaylist = (playlistId: string) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const handleAddToPlaylists = async () => {
    if (selectedPlaylists.length === 0) {
      toast.error("Please select at least one playlist");
      return;
    }

    try {
      // Add to all selected playlists
      await Promise.all(
        selectedPlaylists.map((playlistId) =>
          addToPlaylistMutation.mutateAsync({ playlistId, videoId })
        )
      );

      toast.success(
        `Added to ${selectedPlaylists.length} playlist${
          selectedPlaylists.length > 1 ? "s" : ""
        }`
      );
      onClose();
    } catch (error) {
      toast.error("Failed to add to playlist");
      console.error(error);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      toast.error("Playlist name is required");
      return;
    }

    try {
      const result = await createPlaylistMutation.mutateAsync({
        name: newPlaylistName,
        description: newPlaylistDescription,
      });

      if (result?.data?._id) {
        setSelectedPlaylists([...selectedPlaylists, result.data._id]);
      }

      toast.success("Playlist created successfully");
      setShowCreateForm(false);
      setNewPlaylistName("");
      setNewPlaylistDescription("");

      // Refresh playlists
      refetch();
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
            Save to Playlist
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 max-h-[300px] overflow-y-auto overflow-x-hidden">
          {isLoading ? (
            <div className="flex justify-center p-6">
              <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
          ) : playlists && playlists.length > 0 ? (
            <div className="space-y-2">
              {playlists.map((playlist: Playlist) => (
                <div
                  key={playlist._id}
                  onClick={() => togglePlaylist(playlist._id)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedPlaylists.includes(playlist._id)
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      : "bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {playlist.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {playlist.totalVideos || 0} videos
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      selectedPlaylists.includes(playlist._id)
                        ? "bg-blue-600 dark:bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {selectedPlaylists.includes(playlist._id) && (
                      <Check className="w-4 h-4" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6">
              <FolderPlus className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                You don&apos;t have any playlists yet.
              </p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" /> Create New Playlist
              </Button>
            </div>
          )}

          {!showCreateForm && playlists && playlists.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowCreateForm(true)}
              className="w-full mt-4 border-dashed border-2 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60"
            >
              <Plus className="w-4 h-4 mr-2" /> Create New Playlist
            </Button>
          )}

          {showCreateForm && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Create New Playlist
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label
                    htmlFor="playlist-name"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </Label>
                  <Input
                    id="playlist-name"
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="My Awesome Playlist"
                    className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="playlist-description"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    Description (Optional)
                  </Label>
                  <Input
                    id="playlist-description"
                    type="text"
                    value={newPlaylistDescription}
                    onChange={(e) => setNewPlaylistDescription(e.target.value)}
                    placeholder="A collection of my favorite videos"
                    className="w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  disabled={
                    !newPlaylistName.trim() || createPlaylistMutation.isPending
                  }
                  onClick={handleCreatePlaylist}
                >
                  {createPlaylistMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddToPlaylists}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            disabled={
              selectedPlaylists.length === 0 || addToPlaylistMutation.isPending
            }
          >
            {addToPlaylistMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
