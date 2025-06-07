import axios from "axios";
import { toast } from "sonner";

// Simple environment check
// const isProd = process.env.NODE_ENV === "production";
// console.log(`Running in ${isProd ? "PRODUCTION" : "DEVELOPMENT"} mode`);
// console.log(`API URL: ${process.env.NEXT_PUBLIC_API_URL}`);
// console.log(`Frontend URL: ${process.env.NEXT_PUBLIC_FRONTEND_URL}`);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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

    // Add debug info in development
    if (process.env.NODE_ENV !== "production") {
      // console.log(`${config.method?.toUpperCase()} ${config.url}`, {
      //   withCredentials: config.withCredentials,
      //   headers: config.headers,
      // });
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
    //handle 401 errors during logout
    if (window.__loggingOut && error.response?.status === 401) {
      return Promise.reject(error);
    }

    // Enhanced error logging
    if (process.env.NODE_ENV !== "production") {
      console.error("API Error:", {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data?.message || error.message,
      });
    }

    const originalRequest = error.config;
    const isRefreshRequest = originalRequest.url?.includes("refresh-token"); 
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest &&
      !originalRequest.url?.includes("login") &&
      !window.__loggingOut
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
          // Log success message in development
          if (process.env.NODE_ENV !== "production") {
            // console.log("Token refreshed successfully");
          }
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
    } // For network errors (common in mobile when offline)
    if (!error.response && error.message.includes("Network Error")) {
      toast.error(
        "Network connection issue. Please check your internet connection."
      );
    }

    // If we're logging out, suppress 401 error toasts to avoid disrupting the user experience
    if (window.__loggingOut && error.response?.status === 401) {
      // Silently reject without showing toasts for 401 errors during logout
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
