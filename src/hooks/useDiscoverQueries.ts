import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { queryKeys } from "@/lib/queryKeys";

// Discover channels
export function useDiscoverChannels(options: {
  sort?: string;
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { sort = "subscribers", page = 1, limit = 20, search = "" } = options;
  
  return useQuery({
    queryKey: queryKeys.discover.channels(sort, page, limit, search),
    queryFn: async () => {
      // Construct query params
      const queryParams = new URLSearchParams();
      queryParams.append("sort", sort);
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());
      
      if (search) {
        queryParams.append("search", search);
      }
      
      const response = await api.get(`/discover/channels?${queryParams.toString()}`);
      return response.data.data;
    },
  });
}