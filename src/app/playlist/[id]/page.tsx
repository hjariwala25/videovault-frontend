"use client";

import { useParams } from "next/navigation";
import {
  usePlaylistById,
  useRemoveVideoFromPlaylist,
} from "@/hooks/usePlaylistQueries";
import { useVideosByIds } from "@/hooks/useVideoQueries";
import VideoCard from "@/components/common/VideoCard";
import MainLayout from "@/components/layout/MainLayout";
import { Video } from "@/types";
import {
  ListVideo,
  Clock,
  Eye,
  Trash2,
  Edit,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useState, useEffect } from "react";
import EditPlaylistModal from "@/components/playlists/EditPlaylistModal";
import DeletePlaylistDialog from "@/components/playlists/DeletePlaylistDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function PlaylistPage() {
  const params = useParams();
  const playlistId = params.id as string;
  const {
    data: playlist,
    isLoading,
    error,
    refetch,
  } = usePlaylistById(playlistId);
  const removeVideoMutation = useRemoveVideoFromPlaylist();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [processedVideos, setProcessedVideos] = useState<Video[]>([]);
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const { data: videoDetails } = useVideosByIds(videoIds) as {
    data?: { videos?: Video[]; data?: Video[] };
  };

  useEffect(() => {
    if (!playlist) return;

    console.log("Raw playlist data:", playlist);

    try {
      if (
        playlist.playlistVideos &&
        Array.isArray(playlist.playlistVideos) &&
        playlist.playlistVideos.length > 0 &&
        playlist.playlistVideos[0].videos
      ) {
        const completeVideos = playlist.playlistVideos[0].videos;

        const markedVideos = completeVideos.map((video: Video) => ({
          ...video,
          isInPlaylist: true,
          playlistId: playlistId,
        }));

        setProcessedVideos(markedVideos);

        const ids = completeVideos.map((video: Video) => video._id);
        setVideoIds(ids);
      } else {
        // Fallback to extracting IDs if the structure is different
        let extractedIds = [];

        if (playlist.videos && Array.isArray(playlist.videos)) {
          extractedIds = playlist.videos.map((item: string | string[]) =>
            Array.isArray(item) ? item[0] : item
          );
          console.log("Falling back to IDs in playlist.videos:", extractedIds);
          setVideoIds(extractedIds);

          // Create placeholder objects
          const placeholders = extractedIds.map((id: string) => ({
            _id: id,
            title: `Video ${id.slice(-5)}`,
            thumbnail: "/default-thumbnail.png",
            description: "Loading video details...",
            views: 0,
            duration: 0,
            createdAt: new Date().toISOString(),
          }));

          setProcessedVideos(placeholders);
        }
      }
    } catch (error) {
      console.error("Error processing playlist data:", error);
      setProcessedVideos([]);
    }
  }, [playlist]);

  useEffect(() => {
    if (!videoDetails) {
      console.log("No video details returned from API");
      return;
    }

    console.log("Video details received:", videoDetails);

    const currentVideos = [...processedVideos];

    const videoMap: { [key: string]: Video } = {};

    // Handle both array and object responses
    const videos = Array.isArray(videoDetails)
      ? videoDetails
      : videoDetails?.videos || videoDetails?.data || [];

    videos.forEach((video: Video) => {
      if (video && video._id) {
        videoMap[video._id] = video;
      }
    });

    console.log("Video map created:", videoMap);

    // Update only if we found any video details
    if (Object.keys(videoMap).length > 0) {
      const enhancedVideos = currentVideos.map((video) => {
        const details = videoMap[video._id];
        if (details) {
          console.log(`Found details for video ${video._id}:`, details.title);
          return {
            ...video,
            title: details.title || video.title,
            description: details.description || video.description,
            thumbnail: details.thumbnail || video.thumbnail,
            duration: details.duration || video.duration,
            views: details.views || video.views,
            createdAt: details.createdAt || video.createdAt,
          };
        }
        return video;
      });

      console.log("Enhanced videos:", enhancedVideos);
      setProcessedVideos(enhancedVideos);
    }
  }, [videoDetails]);

  const handleRemoveVideo = async (videoId: string) => {
    toast.promise(
      // Return the promise chain
      async () => {
        const result = await removeVideoMutation.mutateAsync({
          playlistId,
          videoId,
        });

        // Optimistically update the UI
        setProcessedVideos((prev) =>
          prev.filter((video) => video._id !== videoId)
        );

        return result;
      },
      {
        loading: "Removing video...",
        success: "Video removed from playlist",
        error: "Failed to remove video",
      }
    );
  };

  if (isLoading)
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Playlist Header Skeleton */}
          <div className="rounded-xl overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 mb-8">
            <div className="relative h-48 sm:h-64 overflow-hidden">
              <Skeleton className="w-full h-full" />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                <Skeleton className="h-8 w-1/3 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-3" />
                <div className="flex flex-wrap gap-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </div>
          </div>

          {/* Videos Grid Skeleton */}
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm"
                >
                  <Skeleton className="w-full aspect-video" />
                  <div className="p-3">
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-24 mt-2" />
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
            Error loading playlist: {error.message}
          </p>
          <Button
            onClick={() => refetch()}
            className="mt-4 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            Retry
          </Button>
        </div>
      </MainLayout>
    );

  const thumbnailImage =
    processedVideos.length > 0 && processedVideos[0]?.thumbnail
      ? processedVideos[0].thumbnail
      : "/default-thumbnail.png";

  const totalViews = processedVideos.reduce(
    (sum, video) => sum + (video.views || 0),
    0
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Playlist Header */}
        <div className="rounded-xl overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 mb-8">
          <div className="relative">
            {/* Cover Image */}
            <div className="relative h-48 sm:h-64 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
              <Image
                src={thumbnailImage}
                alt={playlist?.name || "Playlist"}
                width={1200}
                height={400}
                className="w-full h-full object-cover"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 text-shadow-sm">
                  {/* Handle the nested structure correctly */}
                  {playlist?.playlist?.name ||
                    playlist?.name ||
                    "Untitled Playlist"}
                </h1>
                <p className="text-gray-200 mb-4 max-w-2xl text-shadow-sm leading-relaxed">
                  {playlist?.playlist?.description ||
                    playlist?.description ||
                    "No description available"}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                  <div className="flex items-center">
                    <ListVideo className="w-4 h-4 mr-1.5" />
                    <span>{processedVideos.length || videoIds.length}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1.5" />
                    <span>{totalViews.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1.5" />
                    <span>
                      Updated{" "}
                      {new Date(
                        playlist?.playlist?.updatedAt ||
                          playlist?.updatedAt ||
                          Date.now()
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Videos
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <MoreVertical className="h-4 w-4 mr-1" />
                <span className="text-sm">Manage</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
            >
              <DropdownMenuItem
                onClick={() => setShowEditModal(true)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Playlist
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Playlist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {processedVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedVideos.map((video) => (
              <div key={video._id} className="group relative">
                <VideoCard video={video} />

                {/* Existing hover remove button */}
                <button
                  onClick={() => handleRemoveVideo(video._id)}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove from playlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* New persistent remove button below the video card */}
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveVideo(video._id);
                    }}
                    className="border-gray-200 dark:border-gray-800 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800 p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              This playlist doesn&apos;t have any videos yet.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <EditPlaylistModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        playlist={playlist?.playlist || playlist} // Pass the right object
        onSuccess={() => {
          refetch(); // Refetch playlist data
          toast.success("Playlist refreshed with updated data");
        }}
      />
      <DeletePlaylistDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        playlistId={playlistId}
        playlistName={
          playlist?.playlist?.name || playlist?.name || "this playlist"
        }
      />
    </MainLayout>
  );
}
