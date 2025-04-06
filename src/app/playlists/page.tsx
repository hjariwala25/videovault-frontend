"use client";

import { useCurrentUser } from "@/hooks/useUserQueries";
import { useUserPlaylists } from "@/hooks/usePlaylistQueries";
import PlaylistCard from "@/components/common/PlaylistCard";
import MainLayout from "@/components/layout/MainLayout";
import { Playlist } from "@/types";
import { PlusCircle, FolderPlus, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CreatePlaylistModal from "@/components/playlists/CreatePlaylistModal";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Playlists() {
  const { data: currentUser } = useCurrentUser();
  const {
    data: playlists,
    isLoading,
    error,
    refetch,
  } = useUserPlaylists(currentUser?._id || "");
  const [isClient, setIsClient] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);


  useEffect(() => {
  
    if (!currentUser?._id) return;

    // Refetch immediately when component mounts
    refetch();

    // Set up interval to refetch playlists every 10 seconds
    const intervalId = setInterval(() => {
      refetch(); // Refetch playlists
    }, 10000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [currentUser?._id, refetch]);

  
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refetch(); // Refetch when tab becomes visible again
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refetch]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (isLoading)
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm"
                >
                  <Skeleton className="w-full aspect-video" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-4/5 mb-3" />
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-3 w-20" />
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
        <div className="text-center p-8 mt-4">
          <p className="text-red-600 dark:text-red-400 text-lg mb-2">
            Error loading playlists: {error.message}
          </p>
          <Button
            onClick={() => {
              toast.loading("Retrying...");
              refetch().then(() => toast.success("Refreshed!"));
            }}
            className="mt-4 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            Retry
          </Button>
        </div>
      </MainLayout>
    );

  const handlePlaylistCreated = () => {
    toast.success("Playlist created successfully!");
    refetch();
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Playlists
          </h1>
          <div className="flex gap-2">
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow transition-all"
              onClick={() => setShowCreateModal(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create Playlist
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                toast.promise(refetch(), {
                  loading: "Refreshing...",
                  success: "Playlists updated",
                  error: "Failed to refresh",
                });
              }}
              className="h-10 w-10 border-gray-200 dark:border-gray-800"
              title="Refresh playlists"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {playlists && playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist: Playlist) => (
              <PlaylistCard key={playlist._id} playlist={playlist} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800 p-8 text-center shadow-sm dark:shadow-gray-900/10">
            <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
              <FolderPlus className="h-9 w-9 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
              No playlists yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Create your first playlist to organize your favorite videos and
              share collections with others
            </p>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-300"
              onClick={() => setShowCreateModal(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Playlist
            </Button>
          </div>
        )}
      </div>

      <CreatePlaylistModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          refetch();
        }}
        onSuccess={handlePlaylistCreated}
      />
    </MainLayout>
  );
}
