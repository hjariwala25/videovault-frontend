import { Check } from "lucide-react";
import { Playlist } from "@/types";

interface PlaylistListProps {
  playlists: Playlist[];
  selectedPlaylists: string[];
  togglePlaylist: (playlistId: string) => void;
}

export default function PlaylistList({
  playlists,
  selectedPlaylists,
  togglePlaylist,
}: PlaylistListProps) {
  return (
    <div className="space-y-2">
      {playlists.map((playlist) => (
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
  );
}
