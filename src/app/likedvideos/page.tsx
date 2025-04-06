"use client";

import { useState, useEffect } from "react";
import { useLikedVideos } from "@/hooks/useLikeQueries";
import VideoCard from "@/components/common/VideoCard";
import MainLayout from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/skeleton";
import {  ThumbsUp } from "lucide-react";
import { Video as VideoType } from "@/types";

export default function LikedVideosPage() {
  const { data, isLoading, error } = useLikedVideos();
  const [isClient, setIsClient] = useState(false);
  const [processedVideos, setProcessedVideos] = useState<VideoType[]>([]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      // Process the data to extract video information
      const videos = data.map((item) => ({
        ...item.video,
        isLiked: true, 
      }));
      setProcessedVideos(videos);
    }
  }, [data]);

  // Client-side rendering guard
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (isLoading)
    return (
      <MainLayout>
        <div className="p-4">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          Error: {(error as Error).message}
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="p-4">
        <div className="flex items-center mb-6">
          {/* <ThumbsUp className="h-6 w-6 mr-3 text-blue-500 dark:text-blue-400" /> */}
          <h1 className="text-2xl font-bold text-adaptive-heading">
            Liked Videos
          </h1>
        </div>

        {processedVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <ThumbsUp className="h-8 w-8 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-adaptive-heading mb-2">
              No liked videos yet
            </h3>
            <p className="text-adaptive-muted max-w-md">
              Videos you like will appear here. Start exploring and liking
              videos to build your collection.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
