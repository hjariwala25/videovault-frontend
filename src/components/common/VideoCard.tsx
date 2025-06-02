import React, { forwardRef, useState } from "react";
import AddToPlaylistModal from "@/components/playlists/AddToPlaylistModal";
import { Video } from "../../types/VideoTypes";
import VideoThumbnail from "./VideoThumbnail";
import VideoInfo from "./VideoInfo";

interface VideoCardProps {
  video: Video;
}

const VideoCard = forwardRef<HTMLDivElement, VideoCardProps>(
  ({ video }, ref) => {
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const href = `/video/${video._id}`;

    const handleSaveClick = () => {
      setShowPlaylistModal(true);
    };

    return (
      <div className="bg-white dark:bg-black rounded-xl overflow-hidden hover:shadow-md dark:shadow-gray-700 transition-all duration-300 group">
        <VideoThumbnail
          video={video}
          href={href}
          onSaveClick={handleSaveClick}
          forwardedRef={ref}
        />

        <VideoInfo video={video} />

        {/* Modal with updated props to check for existing videos */}
        <AddToPlaylistModal
          isOpen={showPlaylistModal}
          onClose={() => setShowPlaylistModal(false)}
          videoId={video._id}
          currentPlaylistId={video.playlistId}
        />
      </div>
    );
  }
);

VideoCard.displayName = "VideoCard";

export default VideoCard;
