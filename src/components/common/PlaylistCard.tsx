import Link from 'next/link';
import { Playlist, Video } from '@/types';
import Image from 'next/image';

interface PlaylistCardProps {
  playlist: Playlist;
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const thumbnail =
    (Array.isArray(playlist.videos) && playlist.videos.length > 0
      ? (playlist.videos[0] as Video)?.thumbnail
      : null) || '/default-thumbnail.png';

  return (
    <Link href={`/playlist/${playlist._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <Image
          src={thumbnail}
          alt={playlist.name}
          width={320}
          height={180}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{playlist.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {playlist.description}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {playlist.totalVideos} videos
          </p>
        </div>
      </div>
    </Link>
  );
}