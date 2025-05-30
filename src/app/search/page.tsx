"use client";

import { useSearchParams } from "next/navigation";
import { useVideos } from "@/hooks/useVideoQueries";
import VideoCard from "@/components/common/VideoCard";
import MainLayout from "@/components/layout/MainLayout";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVideos({ query }); // Pass the query parameter

  const [isClient, setIsClient] = useState(false);

  // Create a ref for our loading element
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Flatten all videos from all pages
  const videos = data?.pages.flatMap((page) => page.videos || []) || [];

  // Set up to load more videos when scrolling
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
          Error: {(error as Error).message}
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-8 text-adaptive-heading">
          {query ? `Search Results for "${query}"` : "All Videos"}
        </h1>
        {videos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  ref={index === videos.length - 3 ? lastElementRef : undefined}
                />
              ))}
            </div>

            {/* Loading indicator */}
            <div
              ref={loadMoreRef}
              className="flex justify-center items-center py-8"
            >
              {isFetchingNextPage && (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2 text-blue-500" />
                  <span className="text-adaptive-muted">
                    Loading more videos...
                  </span>
                </div>
              )}

              {!hasNextPage && videos.length > 0 && (
                <p className="text-adaptive-muted">No more videos to load</p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-adaptive-muted">
              No videos found for &quot;{query}&quot;
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

// Add a loading state for the Suspense boundary
function SearchLoading() {
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
                </div>
              </div>
            ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}
