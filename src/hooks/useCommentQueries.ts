import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { queryKeys } from "@/lib/queryKeys";

// Get video comments 
export function useVideoComments(videoId: string) {
  return useQuery({
    queryKey: queryKeys.comments.list(videoId),
    queryFn: async () => {
      const response = await api.get(`/comments/${videoId}`);

      return response.data.data.docs;
    },
    enabled: !!videoId,
    refetchOnWindowFocus: false,
  });
}

// Add comment 
export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      videoId,
      content,
    }: {
      videoId: string;
      content: string;
    }) => {
      const response = await api.post(`/comments/${videoId}`, { content });
      return { ...response.data.data, videoId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(data.videoId),
      });
    },
  });
}

// Update comment 
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      content,
      videoId,
    }: {
      commentId: string;
      content: string;
      videoId: string;
    }) => {
      const response = await api.patch(`/comments/c/${commentId}`, { content });
      return { ...response.data.data, videoId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(data.videoId),
      });
    },
  });
}

// Delete comment 
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      videoId,
    }: {
      commentId: string;
      videoId: string;
    }) => {
      await api.delete(`/comments/c/${commentId}`);
      return { commentId, videoId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.list(variables.videoId),
      });
    },
  });
}
