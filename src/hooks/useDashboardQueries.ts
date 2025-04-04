import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { queryKeys } from "@/lib/queryKeys";
import { useCurrentUser } from "./useUserQueries";

// Get channel statistics
export function useChannelStats() {
  const { data: currentUser } = useCurrentUser();

  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: async () => {
      const response = await api.get("/dashboard/stats");
      return response.data.data;
    },
    enabled: !!currentUser?._id,
  });
}

// Get videos uploaded by the current channel
export function useChannelVideos() {
  const { data: currentUser } = useCurrentUser();

  return useQuery({
    queryKey: queryKeys.dashboard.videos(),
    queryFn: async () => {
      const response = await api.get("/dashboard/videos");
      return response.data.data;
    },
    enabled: !!currentUser?._id,
  });
}
