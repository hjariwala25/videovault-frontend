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
import {
  Edit,
  Eye,
  MoreVertical,
  Play,
  Trash2,
  Video,
  FileUp,
  ThumbsUp,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

export default function Videos() {
  const queryClient = useQueryClient();
  const {
    data: videos,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useChannelVideos();
  const deleteVideo = useDeleteVideo();
  const togglePublish = useTogglePublishStatus();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Set up automatic refresh when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Invalidate and refetch when tab becomes visible
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.videos(),
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [queryClient]);

  // Manually refresh data with visual feedback
  const handleManualRefresh = async () => {
    setIsRefreshing(true);

    try {
      // Invalidate the query to force a refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.videos() });
      await refetch();
      toast.success("Video data refreshed");
    } catch (error) {
      console.error("Refresh error:", error);
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDelete = async (videoId: string) => {
    toast.promise(
      deleteVideo.mutateAsync(videoId).then(() => {
      
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.videos(),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.stats(),
        });
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
        // Invalidate relevant queries after status change
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.videos(),
        });
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

  // loading skeleton
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="glass-effect rounded-xl border border-gray-100 dark:border-gray-800/40 shadow-sm">
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
          <Button onClick={() => refetch()} className="btn-dark">
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-adaptive-heading">
              Your Videos
            </h1>
            <Button
              variant="outline"
              size="icon"
              onClick={handleManualRefresh}
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
            {isFetching && !isLoading && (
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

        <div className="glass-effect rounded-xl border border-gray-200 dark:border-gray-800 shadow-md overflow-hidden">
          {videos && videos.length > 0 ? (
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
                  {videos.map(
                    (video: {
                      _id: string;
                      title: string;
                      isPublished: boolean;
                      views?: number | string | { count: number };
                      likesCount?: number;
                    }) => (
                      <TableRow
                        key={video._id}
                        className="border-b border-gray-100 dark:border-gray-800/40 transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-800/30"
                      >
                        <TableCell className="py-4 px-6 font-medium text-gray-900 dark:text-gray-50">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-6 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 mr-3 flex items-center justify-center">
                              <Video className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                            </div>
                            <span className="truncate max-w-[250px]">
                              {video.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge
                            variant={
                              video.isPublished ? "default" : "secondary"
                            }
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
                            <span>
                              {video.likesCount?.toLocaleString() || "0"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-right">
                          <div className="flex justify-end items-center gap-2">
                            <Link href={`/video/${video._id}`}>
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
                                <Link
                                  href={`/dashboard/videos/${video._id}/edit`}
                                >
                                  <DropdownMenuItem className="cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-black/40 rounded-md px-3 py-2 my-0.5">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem
                                  className="cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-black/40 rounded-md px-3 py-2 my-0.5"
                                  onClick={() =>
                                    handleTogglePublish(
                                      video._id,
                                      video.isPublished
                                    )
                                  }
                                >
                                  <FileUp className="mr-2 h-4 w-4" />
                                  {video.isPublished ? "Unpublish" : "Publish"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md px-3 py-2 my-0.5"
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
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800/60 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Video className="h-10 w-10 text-gray-400 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-adaptive-heading mb-2">
                No videos yet
              </h3>
              <p className="text-adaptive-muted mb-4 max-w-md mx-auto">
                Upload your first video to get started. You can manage all your
                content from this dashboard.
              </p>
              <Link href="/dashboard/upload">
                <Button className="gradient-bg text-white shadow-sm hover:shadow-md transition-all">
                  <Video className="mr-2 h-4 w-4" />
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
