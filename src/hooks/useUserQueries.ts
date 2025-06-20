import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { queryKeys } from "@/lib/queryKeys";
import { ChannelProfile } from "@/types";
import { toast } from "sonner";

// Get current user
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.user.current(),
    queryFn: async () => {
      const response = await api.get("/users/current-user");
      return response.data.data;
    },
    retry: 1,
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

// login user
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
    },    onSuccess: (data) => {
      // Set user data immediately
      queryClient.setQueryData(queryKeys.user.current(), data.user);

      // Invalidate and refetch user queries
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });

      // Store authentication status in localStorage to maintain session
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("authTimestamp", String(new Date().getTime()));

      // Give cookies more time to be properly set and recognized by the browser
      setTimeout(() => {
        // Use a much longer timeout to ensure cookies are properly set
        // Adding query param to bypass any cache and force a full page load
        window.location.href = "/?auth=" + new Date().getTime();
      }, 1500);
    },
    onError: (error) => {
      toast.error(`Login failed: ${error}`);
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
      // Mark that we are logging out to prevent unnecessary errors
      window.__loggingOut = true;
      // Clear all cache
      queryClient.cancelQueries();
      queryClient.clear();

      // Clear the authentication session cookie by setting an expired date
      document.cookie =
        "authSession=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

      await api.post("/users/logout");
    },onSuccess: () => {
      // Reset all queries and clear cache fully
      queryClient.resetQueries();
      queryClient.clear();

      // Clear authentication data from localStorage
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("authTimestamp");

      toast.success("Logged out successfully");
    },
    onError: () => {
      toast.error("Failed to logout. Please try again.");
    },
    onSettled: () => {
      // Reset the logging out flag
      window.__loggingOut = false;
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
      const response = await api.patch("/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.user.current(), data.data);
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
      const response = await api.patch("/users/cover-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.user.current(), data.data);
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
