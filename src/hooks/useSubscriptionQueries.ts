import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { queryKeys } from '@/lib/queryKeys';

// Get channel subscribers
export function useChannelSubscribers(channelId: string) {
  return useQuery({
    queryKey: queryKeys.subscriptions.channelSubscribers(channelId),
    queryFn: async () => {
      const response = await api.get(`/subscriptions/c/${channelId}`);
      return response.data.data;
    },
    enabled: !!channelId,
  });
}

// Get subscribed channels
export function useSubscribedChannels(userId: string) {
  return useQuery({
    queryKey: queryKeys.subscriptions.subscribedChannels(userId),
    queryFn: async () => {
      const response = await api.get(`/subscriptions/u/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
  });
}

// Toggle subscription
export function useToggleSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (channelId: string) => {
      const response = await api.post(`/subscriptions/c/${channelId}`);
      return { channelId, isSubscribed: response.data.data.issubscribed };
    },
    onSuccess: ({ channelId }) => {
      // Invalidate channel subscribers
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.subscriptions.channelSubscribers(channelId) 
      });
      
      // Invalidate user's subscribed channels
      interface CurrentUser {
        _id: string;
        // Add other properties of the user object if needed
      }
      const currentUser = queryClient.getQueryData<CurrentUser>(queryKeys.user.current());
      if (currentUser?._id) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.subscriptions.subscribedChannels(currentUser._id) 
        });
      }
      
      // Invalidate channel profile if we're looking at it
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.user.all
      });
    },
  });
}