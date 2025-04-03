"use client";

import { useParams } from "next/navigation";
import { useVideoById } from "@/hooks/useVideoQueries";
import { useToggleVideoLike } from "@/hooks/useLikeQueries";
import { useVideoComments, useAddComment } from "@/hooks/useCommentQueries";
import { useCurrentUser } from "@/hooks/useUserQueries";
import Comment from "@/components/common/Comment";
import CommentForm from "@/components/common/CommentForm";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Comment as CommentType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { formatTimeAgo, formatCount } from "@/utils/formatTime";
import VideoActions from "@/components/video/VideoActions";
// Add this import for checking playlists
import { useUserPlaylists } from "@/hooks/usePlaylistQueries";

export default function VideoPage() {
  const params = useParams();
  const videoId = params.id as string;
  const { data: video, isLoading, error } = useVideoById(videoId);
  const { data: comments } = useVideoComments(videoId);
  const { data: currentUser } = useCurrentUser();
  const toggleLike = useToggleVideoLike();
  const addComment = useAddComment();
  const [isClient, setIsClient] = useState(false);

  // This will force a refresh of the playlist check
  const [playlistChangeCounter, setPlaylistChangeCounter] = useState(0);

  // Add this to fetch user playlists with a refetch function
  const { data: userPlaylists, refetch: refetchPlaylists } = useUserPlaylists(
    currentUser?._id || ""
  );

  // Check if the video is in any playlist
  const [isInPlaylist, setIsInPlaylist] = useState(false);
  const [playlistId, setPlaylistId] = useState<string | null>(null);

  // Effect to check if video is in any playlist
  useEffect(() => {
    if (!userPlaylists || !videoId) return;

    // Reset the states first
    setIsInPlaylist(false);
    setPlaylistId(null);

    // Check all playlists for this video
    for (const playlist of userPlaylists) {
      // Check if videos array exists and contains this video
      if (playlist.videos && Array.isArray(playlist.videos)) {
        const flattenedIds = playlist.videos.flat();
        if (flattenedIds.includes(videoId)) {
          setIsInPlaylist(true);
          setPlaylistId(playlist._id);
          break;
        }
      }
    }

    console.log("Checked if video is in playlist:", isInPlaylist, playlistId);
  }, [userPlaylists, videoId, playlistChangeCounter]); // Add playlistChangeCounter to dependencies

  useEffect(() => {
    setIsClient(true);
    console.log("Video ID:", videoId);
  }, [videoId]);

  const handlePlaylistChange = () => {
    // This function will be called when a playlist is updated
    refetchPlaylists();
    setPlaylistChangeCounter((prev) => prev + 1);
  };

  if (!isClient) return null;

  if (isLoading)
    return (
      <MainLayout>
        <div className="text-center p-4">Loading video...</div>
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

  if (!video)
    return (
      <MainLayout>
        <div className="text-center p-4">Video not found</div>
      </MainLayout>
    );

  // Get owner data from the video object
  const owner = typeof video.owner === "object" ? video.owner : null;

  // timeStamp for the video upload date
  const timeAgo = formatTimeAgo(video.createdAt);

  return (
    <MainLayout>
      <div className="p-4 max-w-4xl mx-auto">
        <video
          src={video.videoFile}
          controls
          className="w-full rounded-lg"
          poster={video.thumbnail}
        />

        {/* Title and like button in same row */}
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-2xl font-bold pr-4 text-gray-900 dark:text-white">
            {video.title}
          </h1>

          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleLike.mutate(videoId)}
            disabled={toggleLike.isPending}
            className="flex-shrink-0 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-black/40 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {video.isLiked ? "Unlike" : "Like"} ({video.likesCount || 0})
          </Button>
        </div>

        {/* Video stats and upload info - use formatCount here */}
        <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-3">
            <span>{formatCount(video.views || 0)} views</span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>
        </div>

        {/* Creator profile section */}
        <div className="flex items-center mt-6 mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
          {owner ? (
            <Link
              href={`/channel/${owner.username}`}
              className="flex items-center group flex-1"
            >
              <div className="relative mr-3 flex-shrink-0">
                <Image
                  src={owner.avatar || "/default-avatar.png"}
                  alt={owner.username}
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-white dark:border-gray-800 shadow-sm group-hover:border-blue-200 dark:group-hover:border-blue-700 transition-all"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center">
                  {owner.fullname || owner.username}
                  <ExternalLink size={14} className="ml-1.5 opacity-60" />
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  @{owner.username}
                </p>
                {/* Subscriber count  */}
                {/* {owner.subscribersCount !== undefined && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatCount(owner.subscribersCount)} subscribers
                  </p>
                )} */}
              </div>
            </Link>
          ) : (
            <div className="flex items-center">
              <div className="relative mr-3 flex-shrink-0">
                <Image
                  src="/default-avatar.png"
                  alt="Channel"
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {video.ownerDetails?.fullname ||
                    video.ownerDetails?.username ||
                    "Channel"}
                </p>
                {video.ownerDetails?.username && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    @{video.ownerDetails.username}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Subscribe button  */}
          {owner && currentUser && owner._id !== currentUser._id && (
            <Button
              variant="outline"
              className="ml-auto border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-black/40 hover:text-blue-600 dark:hover:text-blue-400"
              // Replace with your subscription mutation
              // onClick={() => subscribeToChannel.mutate(owner._id)}
            >
              {owner.isSubscribed ? "Unsubscribe" : "Subscribe"}
            </Button>
          )}
        </div>

        {/* Video description */}
        <div className="bg-gray-50 dark:bg-black/40 p-4 rounded-lg mb-6">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {video.description}
          </p>
        </div>

        <VideoActions
          videoId={video._id}
          isInPlaylist={isInPlaylist}
          playlistId={playlistId}
          onPlaylistChange={handlePlaylistChange}
        />

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Comments
          </h2>
          {currentUser && (
            <CommentForm
              onSubmit={(content) => addComment.mutate({ videoId, content })}
            />
          )}
          {comments && comments.length > 0 ? (
            <div className="mt-4 space-y-4">
              {comments.map((comment: CommentType) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  currentUserId={currentUser?._id}
                />
              ))}
            </div>
          ) : (
            <p className="text-center mt-4 text-gray-500 dark:text-gray-400">
              No comments yet
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
