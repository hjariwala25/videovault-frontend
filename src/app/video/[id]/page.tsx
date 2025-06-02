"use client";

import { useParams } from "next/navigation";
import { useVideoById } from "@/hooks/useVideoQueries";
import { useToggleVideoLike } from "@/hooks/useLikeQueries";
import { useVideoComments, useAddComment } from "@/hooks/useCommentQueries";
import { useCurrentUser } from "@/hooks/useUserQueries";
import { useToggleSubscription } from "@/hooks/useSubscriptionQueries";
import MainLayout from "@/components/layout/MainLayout";
import { useState, useEffect } from "react";
import { formatTimeAgo, formatCount } from "@/utils/formatTime";
import VideoActions from "@/components/video/VideoActions";
import VideoSkeleton from "@/components/video/VideoSkeleton";
import LikeButton from "@/components/video/LikeButton";
import ChannelInfo from "@/components/video/ChannelInfo";
import CommentSection from "@/components/video/CommentSection";

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
  // Simple client-side rendering check
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (isLoading) {
    return (
      <MainLayout>
        <VideoSkeleton />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center p-4 text-red-500">
          Error: {error.message}
        </div>
      </MainLayout>
    );
  }

  if (!video) {
    return (
      <MainLayout>
        <div className="text-center p-4">Video not found</div>
      </MainLayout>
    );
  }

  // Get owner data from the video object
  const owner = typeof video.owner === "object" ? video.owner : null;
  const timeAgo = formatTimeAgo(video.createdAt);

  return (
    <MainLayout>
      <div className="p-4 max-w-4xl mx-auto">
        {/* Video Player */}
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
        {/* Title and like button */}
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-2xl font-bold pr-4 text-gray-900 dark:text-white">
            {video.title}
          </h1>

          <LikeButton
            isLiked={video.isLiked}
            likesCount={video.likesCount || 0}
            toggleLike={toggleLike}
            videoId={videoId}
          />
        </div>
        {/* Video metadata */}
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
        {/* Channel information section */}
        <ChannelInfo
          owner={owner || video.ownerDetails}
          currentUser={currentUser}
          toggleSubscription={toggleSubscription}
        />{" "}
        {/* Video actions (save, share, etc) */}
        <VideoActions
          videoId={video._id}
          isInPlaylist={false}
          playlistId={null}
          onPlaylistChange={() => {}}
        />
        {/* Comment section */}
        <CommentSection
          videoId={videoId}
          comments={comments}
          commentsLoading={commentsLoading}
          currentUser={currentUser}
          addComment={addComment}
        />
      </div>
    </MainLayout>
  );
}
