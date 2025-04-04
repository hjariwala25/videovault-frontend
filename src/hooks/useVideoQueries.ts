import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { queryKeys } from "@/lib/queryKeys";
// import { Video } from '@/types';

// Get videos with optional filtering
export function useVideos(params = {}) {
  return useQuery({
    queryKey: queryKeys.videos.list(params),
    queryFn: async () => {
      const response = await api.get("/video/videos", { params });
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

// Get multiple videos by IDs
export function useVideosByIds(videoIds: string[]) {
  return useQuery({
    queryKey: queryKeys.videos.byIds(videoIds),
    queryFn: async () => {
      if (!videoIds.length) return [];

      console.log("Fetching individual videos for IDs:", videoIds);
      const videos = [];

      for (const id of videoIds) {
        try {
        
          const response = await api.get(`/video/v/${id}`);
          console.log(`Fetched video ${id}:`, response.data);

          if (response.data.data) {
            videos.push(response.data.data);
          } else if (response.data) {
            // If the response doesn't have 'data', but has the video object directly
            videos.push(response.data);
          }
        } catch (error) {
          console.error(`Error fetching video ${id}:`, error);
        }
      }

      console.log("Successfully fetched videos:", videos.length);
      return videos;
    },
    enabled: videoIds.length > 0,
  });
}

// Upload video
export function useUploadVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/video/videos", formData, {
        headers: {
          // Let axios set the content type automatically
        },
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.videos() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.all });
    },
  });
}

// Update video
export function useUpdateVideo(videoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.patch(`/video/v/${videoId}`, formData, {
        headers: {
          // Let axios set the content type automatically
        },
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.videos.detail(videoId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.videos() });
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.all });
    },
  });
}

// Delete video
export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      const response = await api.delete(`/video/videos/${videoId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.videos() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.all });
    },
  });
}

// Toggle publish status
export function useTogglePublishStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      const response = await api.patch(`/video/toggle/publish/${videoId}`);
      return response.data;
    },
    onSuccess: (data, videoId) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.videos.detail(videoId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.videos() });
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.all });
    },
  });
}
