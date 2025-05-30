import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      // Remove content-type to let browser set it with correct boundary
      delete config.headers["Content-Type"];
    } else {
      // Set JSON content type for non-FormData requests
      config.headers["Content-Type"] = "application/json";
    }

    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (
      config.method === "post" ||
      config.method === "put" ||
      config.method === "patch"
    ) {
      if (
        token &&
        config.data &&
        typeof config.data === "object" &&
        !(config.data instanceof FormData)
      ) {
        // Only add to JSON data, not FormData
        config.data.accessToken = token;
      }
    }
    // For GET requests, can add token as query param if needed
    if (config.method === "get" && token) {
      config.params = {
        ...config.params,
        accessToken: token,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const refreshUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/refresh-token`;

        const res = await axios.post(
          refreshUrl,
          { refreshToken },
          { withCredentials: true }
        );

        if (res.data) {
          localStorage.setItem("accessToken", res.data.data.accessToken);
          localStorage.setItem("refreshToken", res.data.data.refreshToken);
          api.defaults.headers.common.Authorization = `Bearer ${res.data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
