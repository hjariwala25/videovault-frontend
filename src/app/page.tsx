"use client";

import { useVideos } from "@/hooks/useVideoQueries";
import VideoCard from "@/components/common/VideoCard";
import MainLayout from "@/components/layout/MainLayout";
import { useState, useEffect } from "react";
import { Video } from "@/types";

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
        <div className="text-center p-4">Loading videos...</div>
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
