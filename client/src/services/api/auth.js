import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Instance axios avec configuration
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important pour les cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour gérer les erreurs et refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 - try to refresh token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh') &&
      !originalRequest.url.includes('/auth/login')
    ) {
      originalRequest._retry = true;

      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        // Clear cookies and redirect
        if (typeof window !== 'undefined') {
          document.cookie = 'auth_token=; Max-Age=0; path=/;';
          document.cookie = 'refresh_token=; Max-Age=0; path=/;';
          
          if (!originalRequest.url.includes('/auth/me')) {
            window.location.href = '/connexion';
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// AUTHENTICATION
// ============================================

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise}
 */
export const registerNewUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

/**
 * Login existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise}
 */
export const loginExistingUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

/**
 * Verify 2FA code
 * @param {string} tempToken - Temporary token
 * @param {string} code - 2FA code
 * @returns {Promise}
 */
export const verify2FA = async (tempToken, code) => {
  const response = await api.post('/auth/verify-2fa', { tempToken, code });
  return response.data;
};

/**
 * Resend 2FA code
 * @param {string} tempToken - Temporary token
 * @returns {Promise}
 */
export const resend2FA = async (tempToken) => {
  const response = await api.post('/auth/resend-2fa', { tempToken });
  return response.data;
};

/**
 * Get current authenticated user
 * @returns {Promise}
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * Logout current user
 * @returns {Promise}
 */
export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

/**
 * Refresh authentication token
 * @returns {Promise}
 */
export const refreshToken = async () => {
  const response = await api.post('/auth/refresh');
  return response.data;
};

/**
 * Check if email exists
 * @param {string} email - Email to check
 * @returns {Promise}
 */
export const checkEmail = async (email) => {
  const response = await api.post('/auth/check-email', { email });
  return response.data;
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise}
 */
export const requestPasswordReset = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise}
 */
export const resetPassword = async (token, newPassword) => {
  const response = await api.post('/auth/reset-password', { token, newPassword });
  return response.data;
};

/**
 * Verify email with token
 * @param {string} token - Verification token
 * @returns {Promise}
 */
export const verifyEmail = async (token) => {
  const response = await api.post('/auth/verify-email', { token });
  return response.data;
};

export default {
  registerNewUser,
  loginExistingUser,
  verify2FA,
  resend2FA,
  getCurrentUser,
  logout,
  refreshToken,
  checkEmail,
  requestPasswordReset,
  resetPassword,
  verifyEmail
};
