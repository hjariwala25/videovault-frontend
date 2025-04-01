import Link from "next/link";
import Image from "next/image";
import { Video } from "@/types";
import { Clock, Play } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow as formatDistance } from "date-fns";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Handle owner data which might be a string ID or an object
  const owner = typeof video.owner === "string" ? null : video.owner;

  // Format the timestamp
  const timeAgo = formatDistance(new Date(video.createdAt), {
    addSuffix: true,
  });

  // Format view count
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M";
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K";
    }
    return views.toString();
  };

  // Format duration to MM:SS format
  const formatDuration = (duration: string | number | undefined) => {
    if (!duration) return "0:00";

    // If already formatted as MM:SS, return as is
    if (typeof duration === "string" && duration.includes(":")) {
      return duration;
    }

    // Convert to number of seconds if it's not already
    const totalSeconds =
      typeof duration === "number" ? duration : parseInt(duration);

    if (isNaN(totalSeconds)) return "0:00";

    // Calculate minutes and seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    // Format with leading zero for seconds if needed
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md dark:shadow-gray-900/20 transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/video/${video._id}`}
        className="block relative aspect-video overflow-hidden"
      >
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
    </div>
  );
}
