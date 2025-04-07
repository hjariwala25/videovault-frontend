"use client";

import { useParams } from "next/navigation";
import { useVideoById } from "@/hooks/useVideoQueries";
import { useToggleVideoLike } from "@/hooks/useLikeQueries";
import { useVideoComments, useAddComment } from "@/hooks/useCommentQueries";
import { useCurrentUser } from "@/hooks/useUserQueries";
import { useToggleSubscription } from "@/hooks/useSubscriptionQueries";
import Comment from "@/components/common/Comment";
import CommentForm from "@/components/common/CommentForm";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Comment as CommentType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  UserCheck,
  UserPlus,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { formatTimeAgo, formatCount } from "@/utils/formatTime";
import VideoActions from "@/components/video/VideoActions";
import { useUserPlaylists } from "@/hooks/usePlaylistQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function VideoPage() {
  const params = useParams();
  const videoId = params.id as string;
  const { data: video, isLoading, error } = useVideoById(videoId);
  const { data: comments, isLoading: commentsLoading } =
    useVideoComments(videoId);
  const { data: currentUser } = useCurrentUser();
  const toggleLike = useToggleVideoLike();
  const addComment = useAddComment();
  const [isClient, setIsClient] = useState(false);
  const toggleSubscription = useToggleSubscription();

  const [playlistChangeCounter, setPlaylistChangeCounter] = useState(0);

  const { data: userPlaylists, refetch: refetchPlaylists } = useUserPlaylists(
    currentUser?._id || ""
  );

  // Check if the video is in any playlist
  const [isInPlaylist, setIsInPlaylist] = useState(false);
  const [playlistId, setPlaylistId] = useState<string | null>(null);

  // Effect to check if video is in any playlist
  useEffect(() => {
    if (!userPlaylists || !videoId) return;

    // Reset the states
    setIsInPlaylist(false);
    setPlaylistId(null);

    // Check all playlists for this video
    for (const playlist of userPlaylists) {
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
  }, [userPlaylists, videoId, playlistChangeCounter]);

  useEffect(() => {
    setIsClient(true);
    console.log("Video ID:", videoId);
  }, [videoId]);

  const handlePlaylistChange = () => {
    toast.loading("Updating playlist information...");
    refetchPlaylists()
      .then(() => {
        setPlaylistChangeCounter((prev) => prev + 1);
        toast.success("Playlist updated");
      })
      .catch(() => {
        toast.error("Failed to update playlist");
      });
  };

  if (!isClient) return null;

  if (isLoading)
    return (
      <MainLayout>
        <div className="p-4 max-w-4xl mx-auto">
          <Skeleton className="w-full aspect-video rounded-lg" />

          <div className="flex justify-between items-center mt-4">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>

          <div className="flex items-center mt-2">
            <Skeleton className="h-4 w-32 mr-3" />
            <Skeleton className="h-4 w-4 rounded-full mr-3" />
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="flex items-center mt-4 mb-4">
            <Skeleton className="h-12 w-12 rounded-full mr-3" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <Skeleton className="w-full h-32 mb-6 rounded-lg" />

          <div className="flex gap-2 mb-6">
            <Skeleton className="h-10 w-28 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
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
          controls
          className="w-full rounded-lg"
          poster={video.thumbnail}
          crossOrigin="anonymous"
        >
          <source
            src={video.videoFile
              .split("/upload/")
              .join("/upload/q_auto,f_auto/")}
            type="video/mp4"
          />
          <source
            src={video.videoFile
              .replace(".mp4", ".webm")
              .split("/upload/")
              .join("/upload/q_auto,f_auto/")}
            type="video/webm"
          />
          Your browser doesn&apos;t support HTML5 video.
        </video>

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
            className={`flex-shrink-0 border-gray-200 dark:border-gray-800 ${
              video.isLiked
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-900 dark:text-white"
            } hover:bg-gray-100 dark:hover:bg-black/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}
          >
            {toggleLike.isPending ? (
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : video.isLiked ? (
              <>
                <ThumbsDown className="mr-1.5 h-4 w-4" />
                Unlike
              </>
            ) : (
              <>
                <ThumbsUp className="mr-1.5 h-4 w-4" />
                Like
              </>
            )}
            <span className="ml-1">{formatCount(video.likesCount || 0)}</span>
          </Button>
        </div>

        <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-3">
            <span>{formatCount(video.views || 0)} views</span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>
        </div>

        {/* Video description */}
        <div className="bg-gray-50 dark:bg-black/40 p-4 rounded-lg my-6">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {video.description}
          </p>
        </div>

        {/* Creator profile section */}
        <div className="flex items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
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
                  className="rounded-full h-10 w-10 border-2 border-white dark:border-gray-800 shadow-sm group-hover:border-blue-200 dark:group-hover:border-blue-700 transition-all"
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
                {owner.subscribersCount !== undefined && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatCount(owner.subscribersCount)} subscribers
                  </p>
                )}
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
              onClick={() => {
                if (owner?._id) {
                  // Store current subscription state
                  const wasSubscribed = owner.isSubscribed;

                  toggleSubscription.mutate(owner._id, {
                    onSuccess: () => {
                      owner.isSubscribed = !wasSubscribed;

                      toast.success(
                        wasSubscribed
                          ? "Unsubscribed successfully"
                          : "Subscribed successfully"
                      );
                    },
                    onError: () => {
                      toast.error("Failed to update subscription");
                    },
                  });
                }
              }}
              className={`flex-shrink-0 border-gray-200 dark:border-gray-800 ${
                owner.isSubscribed
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-900 dark:text-white"
              } hover:bg-gray-100 dark:hover:bg-black/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}
              disabled={toggleSubscription.isPending}
            >
              {toggleSubscription.isPending ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : owner.isSubscribed ? (
                <>
                  <UserCheck className="mr-1.5 h-4 w-4" />
                  Subscribed
                </>
              ) : (
                <>
                  <UserPlus className="mr-1.5 h-4 w-4" />
                  Subscribe
                </>
              )}
            </Button>
          )}
        </div>

        <VideoActions
          videoId={video._id}
          isInPlaylist={isInPlaylist}
          playlistId={playlistId}
          onPlaylistChange={handlePlaylistChange}
        />

        {/* Comment section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            Comments
            {comments?.length > 0 && (
              <span className="ml-3 text-base text-gray-600 dark:text-gray-400">
                {comments.length}
              </span>
            )}
          </h2>

          {currentUser ? (
            <CommentForm
              onSubmit={(content) => addComment.mutate({ videoId, content })}
              isSubmitting={addComment.isPending}
            />
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
              <Link
                href="/login"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign in
              </Link>{" "}
              to add a comment
            </div>
          )}

          {/* Comments list */}
          <div className="mt-6 space-y-4">
            {commentsLoading ? (
              // Comment skeletons while loading
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 bg-white dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800"
                  >
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-16 w-full mb-2" />
                      <Skeleton className="h-8 w-16 rounded-full" />
                    </div>
                  </div>
                ))
            ) : comments && comments.length > 0 ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                {comments.map((comment: CommentType) => (
                  <Comment
                    key={comment._id}
                    comment={comment}
                    videoId={videoId}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800 animate-in fade-in duration-300">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
