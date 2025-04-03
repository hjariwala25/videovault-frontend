import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { queryKeys } from "@/lib/queryKeys";

// Get user playlists
export function useUserPlaylists(userId: string) {
  return useQuery({
    queryKey: queryKeys.playlists.user(userId),
    queryFn: async () => {
      const response = await api.get(`/playlists/user/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
  });
}

// Get playlist by ID
export function usePlaylistById(playlistId: string) {
  return useQuery({
    queryKey: queryKeys.playlists.detail(playlistId),
    queryFn: async () => {
      const response = await api.get(`/playlists/${playlistId}`);
      return response.data.data;
    },
    enabled: !!playlistId,
  });
}

// Create playlist
export function useCreatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => {
      const response = await api.post("/playlists", { name, description });
      return response.data.data;
    },
    onSuccess: () => {
      const currentUser = queryClient.getQueryData<{ _id: string }>(
        queryKeys.user.current()
      );
      if (currentUser?._id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.playlists.user(currentUser._id),
        });
      }
    },
  });
}

// Update playlist
export function useUpdatePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playlistId,
      name,
      description,
    }: {
      playlistId: string;
      name: string;
      description: string;
    }) => {
      const response = await api.patch(`/playlists/${playlistId}`, {
        name,
        description,
      });
      return response.data.data;
    },
    onSuccess: (data, { playlistId }) => {
      // Update the cached data
      queryClient.setQueryData(queryKeys.playlists.detail(playlistId), data);

      // Also invalidate the query to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: queryKeys.playlists.detail(playlistId),
      });

      // Invalidate user playlists to update the list view
      const currentUser = queryClient.getQueryData<{ _id: string }>(
        queryKeys.user.current()
      );
      if (currentUser?._id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.playlists.user(currentUser._id),
        });
      }
    },
  });
}

// Delete playlist
export function useDeletePlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (playlistId: string) => {
      await api.delete(`/playlists/${playlistId}`);
      return playlistId;
    },
    onSuccess: (playlistId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.playlists.detail(playlistId),
      });

      const currentUser = queryClient.getQueryData<{ _id: string }>(
        queryKeys.user.current()
      );
      if (currentUser?._id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.playlists.user(currentUser._id),
        });
      }
    },
  });
}

// Add video to playlist
export function useAddVideoToPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playlistId,
      videoId,
    }: {
      playlistId: string;
      videoId: string;
    }) => {
      const response = await api.patch(
        `/playlists/add/${videoId}/${playlistId}`
      );
      return response.data.data;
    },
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.playlists.detail(playlistId),
      });
    },
  });
}

// Remove video from playlist
export function useRemoveVideoFromPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playlistId,
      videoId,
    }: {
      playlistId: string;
      videoId: string;
    }) => {
      const response = await api.patch(
        `/playlists/remove/${videoId}/${playlistId}`
      );
      return response.data.data;
    },
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.playlists.detail(playlistId),
      });
    },
  });
}
