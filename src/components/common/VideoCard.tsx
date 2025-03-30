import Image from 'next/image';
import Link from 'next/link';
import { Video } from '@/types';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/video/${video._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <Image
          src={video.thumbnail}
          alt={video.title}
          width={320}
          height={180}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{video.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {video.description}
          </p>
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>{video.views} views</span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}