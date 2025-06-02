import { useState, useEffect } from "react";
import { useUserPlaylists } from "@/hooks/usePlaylistQueries";
import { toast } from "sonner";

interface VideoPlaylistCheckerProps {
  videoId: string;
  userId: string;
  onPlaylistStatus: (isInPlaylist: boolean, playlistId: string | null) => void;
}

export default function VideoPlaylistChecker({
  videoId,
  userId,
  onPlaylistStatus,
}: VideoPlaylistCheckerProps) {
  const [playlistChangeCounter, setPlaylistChangeCounter] = useState(0);
  const { data: userPlaylists, refetch: refetchPlaylists } = useUserPlaylists(
    userId || ""
  );

  // Effect to check if video is in any playlist
  useEffect(() => {
    if (!userPlaylists || !videoId) return;

    let foundInPlaylist = false;
    let foundPlaylistId = null;

    // Check all playlists for this video
    for (const playlist of userPlaylists) {
      if (playlist.videos && Array.isArray(playlist.videos)) {
        const flattenedIds = playlist.videos.flat();
        if (flattenedIds.includes(videoId)) {
          foundInPlaylist = true;
          foundPlaylistId = playlist._id;
          break;
        }
      }
    }

    onPlaylistStatus(foundInPlaylist, foundPlaylistId);
  }, [userPlaylists, videoId, playlistChangeCounter, onPlaylistStatus]);

  const handlePlaylistChange = () => {
    toast.loading("Updating playlist information...");
    refetchPlaylists()
      .then(() => {
        setPlaylistChangeCounter((prev) => prev + 1);
        toast.success("Playlist updated");
      })
      .catch(() => {
        toast.error("Failed to update playlist");
      });
  };

  return { handlePlaylistChange };
}
