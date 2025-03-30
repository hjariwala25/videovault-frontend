import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { queryKeys } from '@/lib/queryKeys';

// Get video comments
export function useVideoComments(videoId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: queryKeys.comments.list(videoId, page),
    queryFn: async () => {
      const response = await api.get(`/comments/${videoId}`, {
        params: { page, limit }
      });
      return response.data.data;
    },
    enabled: !!videoId,
  });
}

// Add comment
export function useAddComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ videoId, content }: { videoId: string; content: string }) => {
      const response = await api.post(`/comments/${videoId}`, { content });
      return response.data.data;
    },
    onSuccess: (_, { videoId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.list(videoId) });
    },
  });
}

// Update comment
export function useUpdateComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ commentId, content, videoId }: { commentId: string; content: string; videoId: string }) => {
      const response = await api.patch(`/comments/c/${commentId}`, { content });
      return { ...response.data.data, videoId };
    },
    onSuccess: (data) => {
      // With videoId provided, we can now target just the specific video's comments
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.list(data.videoId) });
    },
  });
}

// Delete comment
export function useDeleteComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ commentId, videoId }: { commentId: string; videoId: string }) => {
      await api.delete(`/comments/c/${commentId}`);
      return { commentId, videoId };
    },
    onSuccess: (_, { videoId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.list(videoId) });
    },
  });
}