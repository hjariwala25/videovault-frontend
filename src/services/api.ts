import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true, 
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest.url?.includes("refresh-token");

    // Don't attempt refresh for login/refresh endpoints
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest &&
      !originalRequest.url?.includes("login")
    ) {
      originalRequest._retry = true;

      try {
        const refreshUrl = `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
        }/users/refresh-token`;

        const refreshResponse = await axios.post(
          refreshUrl,
          {},
          {
            withCredentials: true,
          }
        );

        if (refreshResponse.status === 200) {
          return api(originalRequest);
        }
      } catch {
        if (!window.location.pathname.includes("/login")) {
          toast.error("Your session has expired. Please log in again.");
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
