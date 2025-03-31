import Link from "next/link";
import Image from "next/image";
import { Video } from "@/types";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const owner = typeof video.owner === "string" ? null : video.owner;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/video/${video._id}`}>
        <Image
          src={video.thumbnail}
          alt={video.title}
          width={320}
          height={180}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link href={`/video/${video._id}`}>
          <h3 className="text-lg font-semibold truncate">{video.title}</h3>
        </Link>

        {/* Add channel link here */}
        {owner && (
          <Link
            href={`/channel/${owner.username}`}
            className="text-sm text-gray-700 hover:text-blue-600 mt-1 block"
          >
            {owner.fullname || owner.username}
          </Link>
        )}

        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
          {video.description}
        </p>
        <div className="mt-2 flex justify-between text-sm text-gray-500">
          <span>{video.views} views</span>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
