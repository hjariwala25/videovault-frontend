import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { queryKeys } from "@/lib/queryKeys";
import { ChannelProfile } from "@/types";

// Get current user
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.user.current(),
    queryFn: async () => {
      const response = await api.get("/users/current-user");
      return response.data.data;
    },
    retry: false,
  });
}

// Get user channel profile
export function useChannelProfile(username: string) {
  return useQuery({
    queryKey: queryKeys.user.channel(username),
    queryFn: async () => {
      const response = await api.get(`/users/c/${username}`);
      return response.data.data as ChannelProfile;
    },
    enabled: !!username,
  });
}

// Get user watch history
export function useWatchHistory() {
  return useQuery({
    queryKey: queryKeys.user.watchHistory(),
    queryFn: async () => {
      const response = await api.get("/users/history");
      return response.data.data;
    },
  });
}

// Login user
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: {
      email?: string;
      username?: string;
      password: string;
    }) => {
      const response = await api.post("/users/login", credentials);
      return response.data.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      queryClient.setQueryData(queryKeys.user.current(), data.user);
    },
  });
}

// Register user
export function useRegister() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("/users/register", formData);
      return response.data.data;
    },
  });
}

// Logout user
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post("/users/logout");
    },
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      queryClient.resetQueries();
    },
  });
}

// Update account details
export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { fullname: string; email: string }) => {
      const response = await api.patch("/users/update-account", data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.user.current(), data);
    },
  });
}

// Update avatar
export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await api.patch("/users/avatar", formData);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.user.current(), data);
    },
  });
}

// Update cover image
export function useUpdateCoverImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("coverImage", file);
      const response = await api.patch("/users/cover-image", formData);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.user.current(), data);
    },
  });
}

// Change password
export function useChangePassword() {
  return useMutation({
    mutationFn: async ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => {
      await api.post("/users/change-password", { oldPassword, newPassword });
    },
  });
}
