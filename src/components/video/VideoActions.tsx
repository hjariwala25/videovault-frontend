import { useState } from "react";
import { Button } from "@/components/ui/button";
import {  Share, Save } from "lucide-react";
import AddToPlaylistModal from "@/components/playlists/AddToPlaylistModal";

interface VideoActionsProps {
  videoId: string;
}

export default function VideoActions({ videoId }: VideoActionsProps) {
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 gap-2"
          onClick={() => setShowPlaylistModal(true)}
        >
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Save</span>
        </Button>
        <Button
          variant="outline"
          className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 gap-2"
        >
          <Share className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </div>

      <AddToPlaylistModal
        isOpen={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
        videoId={videoId}
      />
    </>
  );
}
