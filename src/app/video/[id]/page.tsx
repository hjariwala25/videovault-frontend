'use client';

import { useParams } from 'next/navigation';
import { useVideoById } from '@/hooks/useVideoQueries';
import { useToggleVideoLike } from '@/hooks/useLikeQueries';
import { useVideoComments, useAddComment } from '@/hooks/useCommentQueries';
import { useCurrentUser } from '@/hooks/useUserQueries';
import Comment from '@/components/common/Comment';
import CommentForm from '@/components/common/CommentForm';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Comment as CommentType } from '@/types';

export default function VideoPage() {
  const params = useParams();
  const videoId = params.id as string;
  const { data: video, isLoading, error } = useVideoById(videoId);
  const { data: comments } = useVideoComments(videoId);
  const { data: currentUser } = useCurrentUser();
  const toggleLike = useToggleVideoLike();
  const addComment = useAddComment();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    console.log("Video ID:", videoId);
  }, [videoId]);

  if (!isClient) return null;

  if (isLoading) return (
    <MainLayout>
      <div className="text-center p-4">Loading video...</div>
    </MainLayout>
  );
  
  if (error) return (
    <MainLayout>
      <div className="text-center p-4 text-red-500">Error: {error.message}</div>
    </MainLayout>
  );

  if (!video) return (
    <MainLayout>
      <div className="text-center p-4">Video not found</div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="p-4 max-w-4xl mx-auto">
        <video
          src={video.videoFile}
          controls
          className="w-full rounded-lg"
          poster={video.thumbnail}
        />
        <h1 className="text-2xl font-bold mt-4">{video.title}</h1>
        <p className="text-gray-600 mt-2">{video.description}</p>
        
        <div className="flex items-center gap-4 mt-4">
          <Button 
            onClick={() => toggleLike.mutate(videoId)}
            disabled={toggleLike.isPending}
          >
            {video.isLiked ? 'Unlike' : 'Like'} ({video.likesCount || 0})
          </Button>
          <span>{video.views || 0} views</span>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Comments</h2>
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
            <p className="text-center mt-4 text-gray-500">No comments yet</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}