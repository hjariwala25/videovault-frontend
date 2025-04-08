import Link from "next/link";
import Image from "next/image";
import { Playlist } from "@/types";
import { ListVideo, Eye, Clock } from "lucide-react";
import { formatTimeAgo, formatCount } from "@/utils/formatTime";
import { useState } from "react";

interface PlaylistCardProps {
  playlist: Playlist;
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const timeAgo = formatTimeAgo(playlist.updatedAt);

  // Generate gradient based on playlist name to ensure consistent colors for playlists
  const colorIndex = (playlist.name.length + playlist._id.length) % 6;
  const gradients = [
    "from-blue-600 to-indigo-600",
    "from-purple-600 to-pink-600",
    "from-indigo-600 to-blue-500",
    "from-blue-500 to-cyan-500",
    "from-cyan-500 to-teal-500",
    "from-violet-600 to-purple-600",
  ];
  const gradient = gradients[colorIndex];

  // Check if playlist has videos with thumbnails
  const hasVideos = playlist.videos && playlist.videos.length > 0;
  const firstVideo =
    hasVideos && typeof playlist.videos[0] === "object"
      ? playlist.videos[0]
      : null;
  const thumbnailUrl = firstVideo?.thumbnail || null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card stack effect */}
      <div className="absolute -top-3 left-[5%] right-[5%] bottom-3 bg-gray-200 dark:bg-gray-800 rounded-xl z-0"></div>

      {/* Card stack effect - middle card */}
      <div className="absolute -top-1.5 left-[2%] right-[2%] bottom-1.5 bg-gray-100 dark:bg-gray-700 rounded-xl z-10"></div>

      {/* Main card */}
      <div className="bg-white dark:bg-black rounded-xl overflow-hidden hover:shadow-md dark:shadow-black transition-all duration-300 group relative z-20">
        <Link
          href={`/playlist/${playlist._id}`}
          className="block relative aspect-video overflow-hidden"
        >
          <div className="aspect-video relative overflow-hidden">
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/20 dark:bg-black/40 z-10 transition-opacity duration-300"></div>

            {/* Play icon */}
            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white dark:bg-gray-900 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                <ListVideo
                  size={20}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
            </div>

            {thumbnailUrl ? (
              // Thumbnail image when available
              <Image
                src={thumbnailUrl}
                alt={playlist.name}
                width={640}
                height={360}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isHovered ? "scale-110" : "scale-100"
                }`}
              />
            ) : (
              // Gradient fallback with pattern overlay
              <div
                className={`w-full h-full bg-gradient-to-r ${gradient} relative flex items-center justify-center`}
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                ></div>
                <ListVideo className="w-12 h-12 text-white/70" />
              </div>
            )}

            {/* Video count badge */}
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded z-20 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <rect x="7" y="7" width="10" height="14" rx="2" />
                <rect x="3" y="3" width="10" height="14" rx="2" />
              </svg>
              {playlist.totalVideos || 0} videos
            </div>

            {/* Playlist name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20">
              <h3 className="text-lg font-bold text-white line-clamp-1">
                {playlist.name}
              </h3>
            </div>
          </div>
        </Link>

        <div className="p-3 pb-4 dark:bg-black">
          <div className="flex">
            {/* Playlist details to match VideoCard text sizing */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 min-h-[30px]">
                {playlist.description || "No description"}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {formatCount(playlist.totalViews || 0)} views
                </div>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {timeAgo}
                </div>
              </div>

              {playlist.owner && typeof playlist.owner !== "string" && (
                <div className="flex items-center mt-1.5 border-gray-100 dark:border-gray-800">
                  <Image
                    src={playlist.owner.avatar || "/default-avatar.png"}
                    alt={playlist.owner.username}
                    width={24}
                    height={24}
                    className="rounded-full w-6 h-6 mr-2 border border-white dark:border-gray-800"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {playlist.owner.fullname || playlist.owner.username}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
