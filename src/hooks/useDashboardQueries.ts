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
        // Get videos from your dashboard (includes unpublished)
        const dashboardResponse = await api.get("/dashboard/videos");

        // Get videos from the public endpoint (view counts)
        const publicResponse = await api.get("/video/videos");

        console.log("Dashboard response:", dashboardResponse.data);
        console.log("Public videos response:", publicResponse.data);

        // Extract videos from both responses
        let dashboardVideos = [];
        if (dashboardResponse.data?.data?.videos) {
          dashboardVideos = dashboardResponse.data.data.videos;
        } else if (dashboardResponse.data?.videos) {
          dashboardVideos = dashboardResponse.data.videos;
        } else if (Array.isArray(dashboardResponse.data?.data)) {
          dashboardVideos = dashboardResponse.data.data;
        }

        // Extract public videos with view counts
        const publicVideos = publicResponse.data.data?.videos || [];

        // Create a map of public videos by ID for easy lookup
        const publicVideoMap = new Map();
        publicVideos.forEach((video: { _id: string; views?: number | { count?: number } }) => {
          publicVideoMap.set(video._id, video);
        });

        // Combine both sets of data
        const combinedVideos = dashboardVideos.map((video: { _id: string; views?: number | { count?: number } }) => {
          // Get the matching public video if it exists
          const publicVersion = publicVideoMap.get(video._id);

          // Return a merged object with view count from public version if available
          return {
            ...video,
            views: publicVersion
              ? typeof publicVersion.views === "number"
                ? publicVersion.views
                : publicVersion.views?.count || 0
              : 0,
          };
        });

        console.log("Combined videos:", combinedVideos);
        return combinedVideos;
      } catch (error) {
        console.error("Error fetching channel videos:", error);
        throw error;
      }
    },
  });
}
