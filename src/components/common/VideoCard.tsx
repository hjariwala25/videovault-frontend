import React, { forwardRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Play, Save } from "lucide-react";
import { useState } from "react";
import { formatTimeAgo, formatCount } from "@/utils/formatTime";
import AddToPlaylistModal from "@/components/playlists/AddToPlaylistModal";

// Define types for the video object
interface Owner {
  _id?: string;
  username: string;
  fullname?: string;
  avatar?: string;
}

interface Video {
  _id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
  views: number;
  duration?: number | string;
  isPublished?: boolean;
  owner: string | Owner;
  isInPlaylist?: boolean;
  playlistId?: string;
}

interface VideoCardProps {
  video: Video;
}

const VideoCard = forwardRef<HTMLDivElement, VideoCardProps>(
  ({ video }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);

    const owner = typeof video.owner === "string" ? null : video.owner;

    // Format time ago and view count
    const timeAgo = formatTimeAgo(video.createdAt);
    const viewCount = formatCount(video.views);

    // Format duration to MM:SS format with fallback
    const formatDuration = (duration: number | string | undefined) => {
      if (!duration) return "00:00";

      let seconds = 0;
      if (typeof duration === "string") {
        seconds = parseInt(duration, 10) || 0;
      } else {
        seconds = duration;
      }

      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    };

    const href = `/video/${video._id}`;

    // Get owner details with fallback
    const getOwnerDetails = () => {
      if (!video.owner  || typeof video.owner === "string") {
        return {
          username: "channel",
          displayName: "Channel",
          avatar: "/default-avatar.png",
        };
      }
      return {
        username: video.owner.username,
        displayName: video.owner.fullname || video.owner.username,
        avatar: video.owner.avatar || "/default-avatar.png",
      };
    };

    const { username, displayName} = getOwnerDetails();

    return (
      <div
        ref={ref}
        className="bg-white dark:bg-black rounded-xl overflow-hidden  hover:shadow-md dark:shadow-gray-700 transition-all duration-300 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          href={href}
          className="block relative aspect-video overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center rounded-xl">
            <div className="bg-white rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <Play size={20} className="text-blue-600" />
            </div>
          </div>

          <Image
            src={video.thumbnail}
            alt={video.title}
            width={640}
            height={360}
            className={`w-full h-full object-cover rounded-xl transform transition-transform duration-700 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded z-20">
            {formatDuration(video.duration)}
          </div>

          {/* Views badge */}
          {/* <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded flex items-center z-20">
            <Clock size={10} className="mr-1" />
            {viewCount} views
          </div> */}

          {/* Save button - updated to show "Saved" status */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!video.isInPlaylist) {
                setShowPlaylistModal(true);
              }
            }}
            className={`absolute top-2 right-2 p-1.5 ${
              video.isInPlaylist
                ? "bg-green-600/80 hover:bg-green-700"
                : "bg-black/60 hover:bg-blue-600"
            } text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20`}
            title={video.isInPlaylist ? "Already saved" : "Save to playlist"}
          >
            {video.isInPlaylist ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
          </button>
        </Link>

        <div className="p-3 pb-4 dark:bg-black">
          <div className="flex">
            {/* Channel avatar - visible only if we have owner data */}
            {owner && (
              <Link
                href={`/channel/${owner.username}`}
                className="mr-3 flex-shrink-0"
              >
                <Image
                  src={owner.avatar || "/default-avatar.png"}
                  alt={owner.username}
                  width={40}
                  height={40}
                  className="rounded-full h-10 w-10 object-cover border-2 shadow-sm"
                />
              </Link>
            )}

            <div className="flex-1 min-w-0">
              <Link href={`/video/${video._id}`}>
                <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {video.title}
                </h3>
              </Link>

              <Link
                href={`/channel/${username}`}
                className="text-xs text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mt-1 block"
              >
                {displayName}
              </Link>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {timeAgo} • {viewCount} views
              </p>
            </div>
          </div>
        </div>

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
