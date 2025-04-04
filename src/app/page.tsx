"use client";

import { useVideos } from "@/hooks/useVideoQueries";
import VideoCard from "@/components/common/VideoCard";
import MainLayout from "@/components/layout/MainLayout";
import { useState, useEffect } from "react";
import { Video } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data, isLoading, error } = useVideos();
  const [isClient, setIsClient] = useState(false);

  // Get videos array from the paginated response
  const videos = data?.videos || [];

  useEffect(() => {
    setIsClient(true);
    if (data) {
      console.log("Videos data received:", data);
    }
  }, [data]);

  if (!isClient) return null;

  if (isLoading)
    return (
      <MainLayout>
        <div className="p-4">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm"
                >
                  <Skeleton className="w-full aspect-video" />
                  <div className="p-4">
                    <Skeleton className="h-5 w-full mb-2" />
                    <div className="flex items-center mt-2">
                      <Skeleton className="h-8 w-8 rounded-full mr-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </MainLayout>
    );

  if (error)
    return (
      <MainLayout>
        <div className="text-center p-4 text-red-500">
          Error: {error.message}
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Videos</h1>
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video: Video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No videos found</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
