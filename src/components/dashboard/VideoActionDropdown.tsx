import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, FileUp, MoreVertical, Play, Trash2 } from "lucide-react";
import Link from "next/link";

interface VideoActionDropdownProps {
  videoId: string;
  isPublished: boolean;
  onTogglePublish: (
    videoId: string,
    isCurrentlyPublished: boolean
  ) => Promise<void>;
  onDelete: (videoId: string) => Promise<void>;
}

export function VideoActionDropdown({
  videoId,
  isPublished,
  onTogglePublish,
  onDelete,
}: VideoActionDropdownProps) {
  return (
    <div className="flex justify-end items-center gap-2">
      <Link href={`/video/${videoId}`}>
        <Button
          variant="ghost"
          size="icon"
          title="View video"
          className="icon-btn-dark rounded-full h-9 w-9 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Play className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="icon-btn-dark rounded-full h-9 w-9 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <MoreVertical className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="glass-effect border border-gray-100 dark:border-gray-800/40 shadow-lg rounded-lg p-1 min-w-[160px]"
        >
          <Link href={`/dashboard/videos/${videoId}/edit`}>
            <DropdownMenuItem className="cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-black/40 rounded-md px-3 py-2 my-0.5">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            className="cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-black/40 rounded-md px-3 py-2 my-0.5"
            onClick={() => onTogglePublish(videoId, isPublished)}
          >
            <FileUp className="mr-2 h-4 w-4" />
            {isPublished ? "Unpublish" : "Publish"}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md px-3 py-2 my-0.5"
            onClick={() => onDelete(videoId)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
