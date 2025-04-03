import Link from "next/link";
import { Playlist } from "@/types";
import { ListVideo, Eye, Clock } from "lucide-react";
import { formatTimeAgo, formatCount } from "@/utils/formatTime";

interface PlaylistCardProps {
  playlist: Playlist;
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const timeAgo = formatTimeAgo(playlist.updatedAt);

  // Gradient background based on playlist name length
  const colorIndex = playlist.name.length % 5;
  const gradients = [
    "from-blue-500 to-indigo-500",
    "from-purple-500 to-pink-500",
    "from-green-500 to-teal-500",
    "from-orange-500 to-red-500",
    "from-cyan-500 to-blue-500",
  ];
  const gradient = gradients[colorIndex];

  return (
    <Link
      href={`/playlist/${playlist._id}`}
      className="group block rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md dark:shadow-gray-900/20 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative">
        {/* Gradient header instead of thumbnail */}
        <div className={`h-32 bg-gradient-to-r ${gradient} relative`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex flex-wrap gap-2">
              <div className="bg-black/30 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <ListVideo className="w-3 h-3 mr-1" />
                <span>{playlist.totalVideos || 0} videos</span>
              </div>
              <div className="bg-black/30 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                <span>{formatCount(playlist.totalViews || 0)} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {playlist.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
          {playlist.description}
        </p>
        <div className="flex items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
          <Clock className="w-3 h-3 mr-1" />
          <span>Updated {timeAgo}</span>
        </div>
      </div>
    </Link>
  );
}
