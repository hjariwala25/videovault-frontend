import { FolderPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyPlaylistViewProps {
  onCreateNew: () => void;
}

export default function EmptyPlaylistView({
  onCreateNew,
}: EmptyPlaylistViewProps) {
  return (
    <div className="text-center p-6">
      <FolderPlus className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
      <p className="text-gray-600 dark:text-gray-400">
        You don&apos;t have any playlists yet.
      </p>
      <Button
        onClick={onCreateNew}
        className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
      >
        <Plus className="w-4 h-4 mr-2" /> Create New Playlist
      </Button>
    </div>
  );
}
