import Link from "next/link";
import Image from "next/image";
import { Video } from "@/types";
import { Clock, Play, Save } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow as formatDistance } from "date-fns";
import AddToPlaylistModal from "@/components/playlists/AddToPlaylistModal";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  // Handle owner data which might be a string ID or an object
  const owner = typeof video.owner === "string" ? null : video.owner;

  // Format the timestamp with proper error handling
  const timeAgo = video.createdAt
    ? formatDistance(new Date(video.createdAt), new Date(), {
        addSuffix: true,
      })
    : "Recently added";

  // Format view count
  const formatViews = (views: number) => {
    if (!views && views !== 0) return "0";
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M";
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K";
    }
    return views.toString();
  };

  // Format duration to MM:SS format with fallback
  const formatDuration = (duration: number | string | undefined) => {
    if (!duration) return "00:00";

    let seconds = 0;
    if (typeof duration === "string") {
      // Try to parse the string as a number
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

  // Get a valid href
  const href = `/video/${video._id}`;

  return (
    <div
      className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md dark:shadow-gray-900/20 transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={href} className="block relative aspect-video overflow-hidden">
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
          <div className="bg-white/90 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Play size={20} className="text-blue-600" />
          </div>
        </div>

        <Image
          src={video.thumbnail}
          alt={video.title}
          width={640}
          height={360}
          className={`w-full h-full object-cover transform transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded z-20">
          {formatDuration(video.duration)}
        </div>

        {/* Views badge */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded flex items-center z-20">
          <Clock size={10} className="mr-1" />
          {formatViews(video.views || 0)} views
        </div>

        {/* Save button */}
        <button
          onClick={(e) => {
            e.preventDefault(); // Stop link navigation
            e.stopPropagation();
            setShowPlaylistModal(true);
          }}
          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <Save className="w-4 h-4" />
        </button>
      </Link>

      <div className="p-3 pb-4">
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
                className="rounded-full border-2 border-white shadow-sm"
              />
            </Link>
          )}

          <div className="flex-1 min-w-0">
            <Link href={`/video/${video._id}`}>
              <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {video.title}
              </h3>
            </Link>

            {owner && (
              <Link
                href={`/channel/${owner.username}`}
                className="text-xs text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mt-1 block"
              >
                {owner.fullname || owner.username}
              </Link>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {timeAgo}
            </p>
          </div>
        </div>
      </div>

      <AddToPlaylistModal
        isOpen={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
        videoId={video._id}
      />
    </div>
  );
}
