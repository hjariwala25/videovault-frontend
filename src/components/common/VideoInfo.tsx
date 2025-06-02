import Link from "next/link";
import Image from "next/image";
import { formatTimeAgo, formatCount } from "@/utils/formatTime";
import { getOwnerDetails } from "./VideoHelpers";
import { Video } from "../../types/VideoTypes";

interface VideoInfoProps {
  video: Video;
}

export default function VideoInfo({ video }: VideoInfoProps) {
  const owner = typeof video.owner === "string" ? null : video.owner;

  // Format time ago and view count
  const timeAgo = formatTimeAgo(video.createdAt);
  const viewCount = formatCount(video.views);

  // Get owner details
  const { username, displayName, avatar } = getOwnerDetails(video.owner);

  return (
    <div className="p-3 pb-4 dark:bg-black">
      <div className="flex">
        {/* Channel avatar - visible only if we have owner data */}
        {owner && (
          <Link href={`/channel/${username}`} className="mr-3 flex-shrink-0">
            <Image
              src={avatar}
              alt={username}
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
  );
}
