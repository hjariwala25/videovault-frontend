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

// Update the useChannelVideos function
export function useChannelVideos() {
  return useQuery({
    queryKey: queryKeys.dashboard.videos(),
    queryFn: async () => {
      try {
        const response = await api.get("/video/videos");

        const videos = response.data.data?.videos || [];

        // Map the response to ensure view counts are properly formatted
        return videos.map((video: { views: number | string }) => ({
          ...video,
          // Ensure views is correctly extracted regardless of format
          views: typeof video.views === "number" ? video.views : 0,
        }));
      } catch (error) {
        console.error("Error fetching channel videos:", error);
        throw error;
      }
    },
  });
}
