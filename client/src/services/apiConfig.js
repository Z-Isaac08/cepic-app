import axios from 'axios';
import csrfService from './csrfService';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Créer une instance axios configurée avec CSRF et gestion d'erreurs
 * @returns {axios.AxiosInstance} Instance axios configurée
 */
export const createApiInstance = () => {
  const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important pour les cookies
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // ============================================
  // INTERCEPTEUR DE REQUÊTE - Ajouter token CSRF
  // ============================================
  api.interceptors.request.use(
    async (config) => {
      // Ajouter le token CSRF uniquement pour les méthodes qui modifient les données
      const methodsNeedingCSRF = ['POST', 'PUT', 'PATCH', 'DELETE'];

      if (methodsNeedingCSRF.includes(config.method?.toUpperCase())) {
        let token = csrfService.getToken();

        // Si pas de token, le récupérer
        if (!token) {
          token = await csrfService.fetchToken();
        }

        // Ajouter le token dans les headers
        if (token) {
          config.headers['X-CSRF-Token'] = token;
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // ============================================
  // INTERCEPTEUR DE RÉPONSE - Gérer les erreurs
  // ============================================
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Gestion des erreurs CSRF (403)
      if (
        error.response?.status === 403 &&
        error.response?.data?.error?.includes('CSRF') &&
        !originalRequest._retryCSRF
      ) {
        console.log("🔄 Token CSRF invalide, récupération d'un nouveau token...");
        originalRequest._retryCSRF = true;

        // Récupérer un nouveau token
        const newToken = await csrfService.fetchToken();

        if (newToken) {
          // Réessayer la requête avec le nouveau token
          originalRequest.headers['X-CSRF-Token'] = newToken;
          return api(originalRequest);
        }
      }

      // Note: 401 errors are handled by auth.js interceptor with token refresh logic
      // Do not handle 401 here to avoid conflicts

      return Promise.reject(error);
    }
  );

  return api;
};

// Instance par défaut
const api = createApiInstance();

export default api;
