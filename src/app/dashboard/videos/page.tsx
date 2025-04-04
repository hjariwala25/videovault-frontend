"use client";

import { useChannelVideos } from "@/hooks/useDashboardQueries";
import {
  useDeleteVideo,
  useTogglePublishStatus,
} from "@/hooks/useVideoQueries";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreVertical, Play, Trash2, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Videos() {
  const { data: videos, isLoading, error, refetch } = useChannelVideos();
  const deleteVideo = useDeleteVideo();
  const togglePublish = useTogglePublishStatus();
  //   const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  const handleDelete = async (videoId: string) => {
    toast.promise(
      deleteVideo.mutateAsync(videoId).then(() => {
        refetch();
      }),
      {
        loading: "Deleting video...",
        success: "Video deleted successfully",
        error: "Failed to delete video",
      }
    );
  };

  const handleTogglePublish = async (
    videoId: string,
    isCurrentlyPublished: boolean
  ) => {
    toast.promise(
      togglePublish.mutateAsync(videoId).then(() => {
        refetch();
      }),
      {
        loading: `${
          isCurrentlyPublished ? "Unpublishing" : "Publishing"
        } video...`,
        success: `Video ${
          isCurrentlyPublished ? "unpublished" : "published"
        } successfully`,
        error: `Failed to ${
          isCurrentlyPublished ? "unpublish" : "publish"
        } video`,
      }
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-4 w-16" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-4 w-12" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-5 w-full max-w-[200px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-24" />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <div className="text-red-600 dark:text-red-400 mb-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
            Error loading videos: {error.message}
          </div>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Videos
          </h1>
          <Link href="/dashboard/upload">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Video className="mr-2 h-4 w-4" /> Upload New Video
            </Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          {videos && videos.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-900/60">
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stats</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map(
                  (video: {
                    _id: string;
                    title: string;
                    isPublished: boolean;
                    views?: number;
                  }) => (
                    <TableRow key={video._id}>
                      <TableCell className="font-medium">
                        {video.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={video.isPublished ? "default" : "secondary"}
                        >
                          {video.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          <span>{video.views || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Link href={`/video/${video._id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View video"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </Link>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                            >
                              <Link
                                href={`/dashboard/videos/${video._id}/edit`}
                              >
                                <DropdownMenuItem className="cursor-pointer">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() =>
                                  handleTogglePublish(
                                    video._id,
                                    video.isPublished
                                  )
                                }
                              >
                                <Play className="mr-2 h-4 w-4" />
                                {video.isPublished ? "Unpublish" : "Publish"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-red-600 dark:text-red-400"
                                onClick={() => handleDelete(video._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center">
              <Video className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No videos yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Upload your first video to get started.
              </p>
              <Link href="/dashboard/upload">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Upload New Video
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
