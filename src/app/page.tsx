"use client";

import { useVideos } from "@/hooks/useVideoQueries";
import VideoCard from "@/components/common/VideoCard";
import MainLayout from "@/components/layout/MainLayout";
import { useState, useEffect, useRef, useCallback } from "react";
import { Video } from "@/types";
import VideoLoadingSkeleton from "@/components/common/VideoLoadingSkeleton";
import LoadMore from "@/components/common/LoadMore";

export default function Home() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVideos();
  const [isClient, setIsClient] = useState(false);

  // Create a ref for our loading element
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Flatten all videos from all pages
  const videos = data?.pages.flatMap((page) => page.videos || []) || [];

  // Set up the intersection observer to load more videos when scrolling
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingNextPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (isLoading && !data) {
    return (
      <MainLayout>
        <VideoLoadingSkeleton count={6} />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center p-4 text-red-500">
          Error: {(error as Error).message}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-adaptive-heading">
          Videos
        </h1>
        {videos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video: Video, index: number) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  ref={index === videos.length - 3 ? lastElementRef : undefined}
                />
              ))}
            </div>

            {/* Loading indicator */}
            <div ref={loadMoreRef}>
              <LoadMore
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={!!hasNextPage}
                hasItems={videos.length > 0}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-adaptive-muted">No videos found</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
