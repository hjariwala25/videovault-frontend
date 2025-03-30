import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { queryKeys } from '@/lib/queryKeys';

// Get user tweets
export function useUserTweets(userId: string) {
  return useQuery({
    queryKey: queryKeys.tweets.user(userId),
    queryFn: async () => {
      const response = await api.get(`/tweets/user/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
  });
}

// Create tweet
export function useCreateTweet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (content: string) => {
      const response = await api.post('/tweets', { content });
      return response.data.data;
    },
    onSuccess: () => {
      const currentUser = queryClient.getQueryData<{ _id: string }>(queryKeys.user.current());
      if (currentUser?._id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.user(currentUser._id) });
      }
    },
  });
}

// Update tweet
export function useUpdateTweet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ tweetId, content }: { tweetId: string; content: string }) => {
      const response = await api.patch(`/tweets/${tweetId}`, { content });
      return response.data.data;
    },
    onSuccess: () => {
      const currentUser = queryClient.getQueryData<{ _id: string }>(queryKeys.user.current());
      if (currentUser?._id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.user(currentUser._id) });
      }
    },
  });
}

// Delete tweet
export function useDeleteTweet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tweetId: string) => {
      await api.delete(`/tweets/${tweetId}`);
      return tweetId;
    },
    onSuccess: () => {
      const currentUser = queryClient.getQueryData<{ _id: string }>(queryKeys.user.current());
      if (currentUser?._id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.tweets.user(currentUser._id) });
      }
    },
  });
}