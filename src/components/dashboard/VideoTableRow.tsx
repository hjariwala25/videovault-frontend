import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, ThumbsUp, Video } from "lucide-react";
import { VideoActionDropdown } from "./VideoActionDropdown";
import { VideoData } from "@/types/video";

interface VideoTableRowProps {
  video: VideoData;
  onTogglePublish: (
    videoId: string,
    isCurrentlyPublished: boolean
  ) => Promise<void>;
  onDelete: (videoId: string) => Promise<void>;
}

export function VideoTableRow({
  video,
  onTogglePublish,
  onDelete,
}: VideoTableRowProps) {
  return (
    <TableRow className="border-b border-gray-100 dark:border-gray-800/40 transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-800/30">
      <TableCell className="py-4 px-6 font-medium text-gray-900 dark:text-gray-50">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-6 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 mr-3 flex items-center justify-center">
            <Video className="h-3 w-3 text-gray-500 dark:text-gray-400" />
          </div>
          <span className="truncate max-w-[250px]">{video.title}</span>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6">
        <Badge
          variant={video.isPublished ? "default" : "secondary"}
          className={
            video.isPublished
              ? "bg-green-50 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-500/40 dark:border-green-500/60 font-medium px-3 py-1"
              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-medium px-3 py-1"
          }
        >
          {video.isPublished ? "Published" : "Draft"}
        </Badge>
      </TableCell>
      <TableCell className="py-4 px-6">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 font-medium">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1.5 mr-2">
            <Eye className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
          </div>
          <span>
            {typeof video.views === "number"
              ? video.views.toLocaleString()
              : "0"}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 font-medium">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1.5 mr-2">
            <ThumbsUp className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
          </div>
          <span>{video.likesCount?.toLocaleString() || "0"}</span>
        </div>
      </TableCell>
      <TableCell className="py-4 px-6 text-right">
        <VideoActionDropdown
          videoId={video._id}
          isPublished={video.isPublished}
          onTogglePublish={onTogglePublish}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
}
