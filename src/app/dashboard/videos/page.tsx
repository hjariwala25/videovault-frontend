"use client";

import { useChannelVideos } from "@/hooks/useDashboardQueries";
import {
  useDeleteVideo,
  useTogglePublishStatus,
} from "@/hooks/useVideoQueries";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Imported components
import { VideoTableSkeleton } from "@/components/dashboard/VideoTableSkeleton";
import { ErrorDisplay } from "@/components/dashboard/ErrorDisplay";
import { VideosPageHeader } from "@/components/dashboard/VideosPageHeader";
import { VideoTable } from "@/components/dashboard/VideoTable";
import { VideoData } from "@/types/video";

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
          <VideoTableSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorDisplay message={error.message} onRetry={refetch} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <VideosPageHeader
          isRefreshing={isRefreshing}
          isFetching={isFetching}
          onRefresh={handleManualRefresh}
        />

        <div className="glass-effect rounded-xl border border-gray-200 dark:border-gray-800 shadow-md overflow-hidden">
          <VideoTable
            videos={videos as VideoData[]}
            onTogglePublish={handleTogglePublish}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
