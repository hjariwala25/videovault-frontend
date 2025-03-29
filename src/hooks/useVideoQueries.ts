import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { queryKeys } from '@/lib/queryKeys';
import { Video } from '@/types';

// Get videos with optional filtering
export function useVideos(params = {}) {
  return useQuery({
    queryKey: queryKeys.videos.list(params),
    queryFn: async () => {
      const response = await api.get('/video/videos', { params });
      return response.data.data;
    },
  });
}

// Get video by ID
export function useVideoById(videoId: string) {
  return useQuery({
    queryKey: queryKeys.videos.detail(videoId),
    queryFn: async () => {
      const response = await api.get(`/video/v/${videoId}`);
      return response.data.data;
    },
    enabled: !!videoId,
  });
}

// Upload video
export function useUploadVideo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/video/videos', formData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.videos() });
    },
  });
}

// Update video
export function useUpdateVideo(videoId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.patch(`/video/v/${videoId}`, data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.videos.detail(videoId), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.videos() });
    },
  });
}

// Delete video
export function useDeleteVideo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (videoId: string) => {
      await api.delete(`/video/v/${videoId}`);
      return videoId;
    },
    onSuccess: (videoId) => {
      queryClient.removeQueries({ queryKey: queryKeys.videos.detail(videoId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.videos() });
    },
  });
}

// Toggle publish status
export function useTogglePublishStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (videoId: string) => {
      const response = await api.patch(`/video/toggle/publish/${videoId}`);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.videos.detail(data._id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.videos() });
    },
  });
}