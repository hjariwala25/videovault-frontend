import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import Link from "next/link";

export function VideoEmptyState() {
  return (
    <div className="p-8 text-center">
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800/60 rounded-full mx-auto mb-4 flex items-center justify-center">
        <Video className="h-10 w-10 text-gray-400 dark:text-gray-600" />
      </div>
      <h3 className="text-lg font-medium text-adaptive-heading mb-2">
        No videos yet
      </h3>
      <p className="text-adaptive-muted mb-4 max-w-md mx-auto">
        Upload your first video to get started. You can manage all your content
        from this dashboard.
      </p>
      <Link href="/dashboard/upload">
        <Button className="gradient-bg text-white shadow-sm hover:shadow-md transition-all">
          <Video className="mr-2 h-4 w-4" />
          Upload New Video
        </Button>
      </Link>
    </div>
  );
}
