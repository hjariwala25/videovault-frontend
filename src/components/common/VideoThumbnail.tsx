import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Play, Save } from "lucide-react";
import { formatDuration } from "./VideoHelpers";
import { Video } from "../../types/VideoTypes";

interface VideoThumbnailProps {
  video: Video;
  href: string;
  onSaveClick: () => void;
  forwardedRef?: React.Ref<HTMLDivElement>;
}

export default function VideoThumbnail({
  video,
  href,
  onSaveClick,
  forwardedRef,
}: VideoThumbnailProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={forwardedRef}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={href} className="block relative aspect-video overflow-hidden">
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

        {/* Save button - updated to show "Saved" status */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!video.isInPlaylist) {
              onSaveClick();
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
    </div>
  );
}
