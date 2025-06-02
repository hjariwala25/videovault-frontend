import { Button } from "@/components/ui/button";
import { RefreshCw, Video } from "lucide-react";
import Link from "next/link";

interface VideosPageHeaderProps {
  isRefreshing: boolean;
  isFetching: boolean;
  onRefresh: () => Promise<void>;
}

export function VideosPageHeader({ 
  isRefreshing, 
  isFetching, 
  onRefresh 
}: VideosPageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-adaptive-heading">
          Your Videos
        </h1>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          className="rounded-full h-8 w-8 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Refresh video data"
          disabled={isRefreshing || isFetching}
        >
          <RefreshCw
            className={`h-4 w-4 text-gray-700 dark:text-gray-300 ${
              isRefreshing || isFetching ? "animate-spin" : ""
            }`}
          />
        </Button>
        {isFetching && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Refreshing...
          </span>
        )}
      </div>
      <Link href="/dashboard/upload">
        <Button className="gradient-bg text-white shadow-sm hover:shadow transition-all">
          <Video className="mr-2 h-4 w-4" /> Upload New Video
        </Button>
      </Link>
    </div>
  );
}
