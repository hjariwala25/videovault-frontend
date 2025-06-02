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
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import PlaylistList from "./PlaylistList";
import EmptyPlaylistView from "./EmptyPlaylistView";
import CreatePlaylistForm from "./CreatePlaylistForm";

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

    toast.promise(
      Promise.all(
        selectedPlaylists.map((playlistId) =>
          addToPlaylistMutation.mutateAsync({ playlistId, videoId })
        )
      ),
      {
        loading: "Adding to playlists...",
        success: () => {
          onClose();
          return `Added to ${selectedPlaylists.length} playlist${
            selectedPlaylists.length > 1 ? "s" : ""
          }`;
        },
        error: (err) => {
          console.error(err);
          return "Failed to add to playlist";
        },
      }
    );
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      toast.error("Playlist name is required");
      return;
    }

    toast.promise(
      createPlaylistMutation.mutateAsync({
        name: newPlaylistName,
        description: newPlaylistDescription,
      }),
      {
        loading: "Creating playlist...",
        success: (result) => {
          if (result?.data?._id) {
            setSelectedPlaylists([...selectedPlaylists, result.data._id]);
          }
          setShowCreateForm(false);
          setNewPlaylistName("");
          setNewPlaylistDescription("");
          refetch();
          return "Playlist created successfully";
        },
        error: (err) => {
          console.error(err);
          return "Failed to create playlist";
        },
      }
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center p-6">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
        </div>
      );
    }

    if (!playlists || playlists.length === 0) {
      return <EmptyPlaylistView onCreateNew={() => setShowCreateForm(true)} />;
    }

    return (
      <>
        <PlaylistList
          playlists={playlists}
          selectedPlaylists={selectedPlaylists}
          togglePlaylist={togglePlaylist}
        />

        {!showCreateForm && (
          <Button
            variant="outline"
            onClick={() => setShowCreateForm(true)}
            className="w-full mt-4 border-dashed border-2 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60"
          >
            <Plus className="w-4 h-4 mr-2" /> Create New Playlist
          </Button>
        )}
      </>
    );
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
          {renderContent()}

          {showCreateForm && (
            <CreatePlaylistForm
              newPlaylistName={newPlaylistName}
              setNewPlaylistName={setNewPlaylistName}
              newPlaylistDescription={newPlaylistDescription}
              setNewPlaylistDescription={setNewPlaylistDescription}
              onCancel={() => setShowCreateForm(false)}
              onCreate={handleCreatePlaylist}
              isCreating={createPlaylistMutation.isPending}
            />
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
