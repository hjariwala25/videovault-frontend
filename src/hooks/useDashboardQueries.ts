import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { queryKeys } from '@/lib/queryKeys';

// Get channel stats
export function useChannelStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data.data;
    },
  });
}

// Get channel videos
export function useChannelVideos() {
  return useQuery({
    queryKey: queryKeys.dashboard.videos(),
    queryFn: async () => {
      const response = await api.get('/dashboard/videos');
      return response.data.data;
    },
  });
}