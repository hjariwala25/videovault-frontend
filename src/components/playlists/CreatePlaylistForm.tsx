import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CreatePlaylistFormProps {
  newPlaylistName: string;
  setNewPlaylistName: (value: string) => void;
  newPlaylistDescription: string;
  setNewPlaylistDescription: (value: string) => void;
  onCancel: () => void;
  onCreate: () => void;
  isCreating: boolean;
}

export default function CreatePlaylistForm({
  newPlaylistName,
  setNewPlaylistName,
  newPlaylistDescription,
  setNewPlaylistDescription,
  onCancel,
  onCreate,
  isCreating,
}: CreatePlaylistFormProps) {
  return (
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
          onClick={onCancel}
          className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Cancel
        </Button>
        <Button
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          disabled={!newPlaylistName.trim() || isCreating}
          onClick={onCreate}
        >
          {isCreating ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  );
}
