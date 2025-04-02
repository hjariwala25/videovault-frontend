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
      // The API response has a very specific structure:
      // playlist.playlistVideos[0].videos contains the fully populated video objects

      if (
        playlist.playlistVideos &&
        Array.isArray(playlist.playlistVideos) &&
        playlist.playlistVideos.length > 0 &&
        playlist.playlistVideos[0].videos
      ) {
        // These are the complete video objects with all details including thumbnails
        const completeVideos = playlist.playlistVideos[0].videos;
        console.log(
          "Found complete videos in playlistVideos:",
          completeVideos.length
        );

        // Use the complete video objects directly
        setProcessedVideos(completeVideos);

        // Also set videoIds for any additional processing if needed
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

    // Make a fresh copy of processed videos to avoid dependency loop
    const currentVideos = [...processedVideos];

    // Create a map of video objects by ID for faster lookups
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
    try {
      await removeVideoMutation.mutateAsync({ playlistId, videoId });
      toast.success("Video removed from playlist");
      refetch(); // Refresh the playlist data
    } catch (error) {
      toast.error("Failed to remove video from playlist");
      console.error(error);
    }
  };

  if (isLoading)
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
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
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {playlist?.name}
                </h1>
                <p className="text-gray-200 mb-3 max-w-2xl">
                  {playlist?.description}
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-300">
                  <div className="flex items-center">
                    <ListVideo className="w-4 h-4 mr-1" />
                    <span>
                      {processedVideos.length || playlist?.totalVideos || 0}{" "}
                      videos
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{playlist?.totalViews || 0} views</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      Updated{" "}
                      {new Date(
                        playlist?.updatedAt || Date.now()
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Videos in this playlist
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
                  <button
                    onClick={() => handleRemoveVideo(video._id)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove from playlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
      </div>

      {/* Modals */}
      <EditPlaylistModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        playlist={playlist}
      />

      <DeletePlaylistDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        playlistId={playlistId}
        playlistName={playlist?.name || "this playlist"}
      />
    </MainLayout>
  );
}
