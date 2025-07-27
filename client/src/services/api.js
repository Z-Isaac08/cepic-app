import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // No need to manually add auth token - cookies are sent automatically
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Évite une boucle infinie : si /auth/refresh échoue, ne réessaye pas
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") // << ajoute cette ligne
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");

        return api(originalRequest);
      } catch (refreshError) {
        // Clear authentication data without redirecting
        if (typeof window !== "undefined") {
          // Clear cookies
          document.cookie = "auth_token=; Max-Age=0; path=/;";
          document.cookie = "refresh_token=; Max-Age=0; path=/;";
          
          // Only redirect if this is not an initialization request
          if (!originalRequest.url.includes("/auth/me")) {
            window.location.href = "/";
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  checkEmail: async (email) => {
    const response = await api.post("/auth/check-email", { email });
    return response.data;
  },

  loginExistingUser: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  registerNewUser: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  verify2FA: async (tempToken, code) => {
    const response = await api.post("/auth/verify-2fa", { tempToken, code });
    return response.data;
  },

  resend2FA: async (tempToken) => {
    const response = await api.post("/auth/resend-2fa", { tempToken });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};

export default api;
