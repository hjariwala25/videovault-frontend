import Link from "next/link";
import { Playlist, Video } from "@/types";
import Image from "next/image";
import { ListVideo } from "lucide-react";

interface PlaylistCardProps {
  playlist: Playlist;
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const thumbnail =
    (Array.isArray(playlist.videos) && playlist.videos.length > 0
      ? (playlist.videos[0] as Video)?.thumbnail
      : null) || "/default-thumbnail.png";

  return (
    <Link
      href={`/playlist/${playlist._id}`}
      className="group block rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black p-0.5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] dark:shadow-gray-900/30"
    >
      <div className="rounded-[10px] overflow-hidden bg-white dark:bg-black/40 h-full">
        <div className="relative">
          {/* Thumbnail with overlay gradient */}
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
            <Image
              src={thumbnail}
              alt={playlist.name}
              width={320}
              height={180}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="absolute bottom-2 left-2 z-20 flex items-center space-x-1.5 text-white">
            <ListVideo className="w-4 h-4" />
            <span className="text-xs font-medium">
              {playlist.totalVideos} videos
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{playlist.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {playlist.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
