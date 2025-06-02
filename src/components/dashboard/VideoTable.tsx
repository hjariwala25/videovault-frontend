import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VideoEmptyState } from "./VideoEmptyState";
import { VideoTableRow } from "./VideoTableRow";
import { VideoData } from "@/types/video";

interface VideoTableProps {
  videos: VideoData[];
  onTogglePublish: (
    videoId: string,
    isCurrentlyPublished: boolean
  ) => Promise<void>;
  onDelete: (videoId: string) => Promise<void>;
}

export function VideoTable({
  videos,
  onTogglePublish,
  onDelete,
}: VideoTableProps) {
  if (videos.length === 0) {
    return <VideoEmptyState />;
  }

  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableHeader className="bg-gray-50/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <TableRow className="hover:bg-transparent">
            <TableHead className="py-4 px-6 text-gray-700 dark:text-gray-200 font-medium text-sm">
              Title
            </TableHead>
            <TableHead className="py-4 px-6 text-gray-700 dark:text-gray-200 font-medium text-sm">
              Status
            </TableHead>
            <TableHead className="py-4 px-6 text-gray-700 dark:text-gray-200 font-medium text-sm">
              Views
            </TableHead>
            <TableHead className="py-4 px-6 text-gray-700 dark:text-gray-200 font-medium text-sm">
              Likes
            </TableHead>
            <TableHead className="py-4 px-6 text-right text-gray-700 dark:text-gray-200 font-medium text-sm">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white/70 dark:bg-gray-900/80">
          {videos.map((video) => (
            <VideoTableRow
              key={video._id}
              video={video}
              onTogglePublish={onTogglePublish}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
