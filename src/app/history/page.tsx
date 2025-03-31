"use client";

import { useWatchHistory } from "@/hooks/useUserQueries";
import VideoCard from "@/components/common/VideoCard";
import MainLayout from "@/components/layout/MainLayout";
import { useState, useEffect } from "react";
import { Video } from "@/types";
import Link from "next/link"; 

export default function History() {
  const { data: historyData, isLoading, error } = useWatchHistory();
  const [isClient, setIsClient] = useState(false);

  // Get videos from history
  const history = historyData || [];

  // Prevent hydration errors
  useEffect(() => {
    setIsClient(true);
    if (historyData) {
      console.log("History data received:", historyData);
    }
  }, [historyData]);

  if (!isClient) return null;

  if (isLoading)
    return (
      <MainLayout>
        <div className="text-center p-4">Loading history...</div>
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
        <h1 className="text-2xl font-bold mb-4">Watch History</h1>

        {history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((video: Video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-lg shadow">
            <p className="text-lg text-gray-600">Your watch history is empty</p>
            <Link
              href="/"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Start watching videos
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
