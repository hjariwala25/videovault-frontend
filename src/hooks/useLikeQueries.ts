import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { queryKeys } from '@/lib/queryKeys';

// Get liked videos
export function useLikedVideos() {
  return useQuery({
    queryKey: queryKeys.videos.liked(),
    queryFn: async () => {
      const response = await api.get('/likes/videos');
      return response.data.data;
    },
  });
}

// Toggle video like
export function useToggleVideoLike() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (videoId: string) => {
      const response = await api.post(`/likes/toggle/v/${videoId}`);
      return { videoId, isLiked: response.data.data.isliked };
    },
    onSuccess: ({ videoId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.detail(videoId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.liked() });
    },
  });
}

// Toggle comment like
export function useToggleCommentLike() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (commentId: string) => {
      const response = await api.post(`/likes/toggle/c/${commentId}`);
      return { commentId, isLiked: response.data.data.isliked };
    },
    onSuccess: () => {
      // Since we don't know which video's comments these are, invalidate all comments
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.all });
    },
  });
}

// Toggle tweet like
export function useToggleTweetLike() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tweetId: string) => {
      const response = await api.post(`/likes/toggle/t/${tweetId}`);
      return { tweetId, isLiked: response.data.data.isliked };
    },
    onSuccess: () => {
      // Invalidate all tweets since we don't know which user's tweets these are
      queryClient.invalidateQueries({ queryKey: queryKeys.tweets.all });
    },
  });
}