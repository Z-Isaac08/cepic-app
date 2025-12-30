import { create } from 'zustand';
import * as authAPI from '../services/api/auth';

// Helper pour parser les erreurs de validation Zod
const parseValidationErrors = (error) => {
  const data = error.response?.data;
  console.log('=== DEBUG parseValidationErrors ===');
  console.log('Error response data:', data);
  console.log('Details:', data?.details);

  // Si c'est une erreur de validation avec des détails par champ
  if (data?.details && Array.isArray(data.details)) {
    const fieldErrors = {};
    data.details.forEach((detail) => {
      console.log('Processing detail:', detail);
      // Utilise 'path' (nouveau format) ou 'field' (ancien format)
      const fieldName = detail.path || detail.field;
      if (fieldName) {
        fieldErrors[fieldName] = detail.message;
      }
    });

    console.log('Parsed fieldErrors:', fieldErrors);

    // Retourne les erreurs par champ + un message général
    if (Object.keys(fieldErrors).length > 0) {
      return {
        message: 'Veuillez corriger les erreurs ci-dessous',
        fieldErrors,
      };
    }
  }

  // Message d'erreur simple
  console.log('No field errors found, returning simple message');
  return {
    message: data?.error || 'Une erreur est survenue',
    fieldErrors: {},
  };
};

export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  loading: false, // Pour les opérations auth (login, register, etc.)
  initializing: true, // Pour le checkAuth initial uniquement
  error: null,
  fieldErrors: {}, // Erreurs par champ
  tempToken: '', // For 2FA flow
  awaitingTwoFA: false,

  // Actions
  login: async (email, password) => {
    set({ loading: true, error: null, fieldErrors: {} });
    try {
      const response = await authAPI.loginExistingUser(email, password);

      // If 2FA required
      if (response.data.tempToken) {
        set({
          tempToken: response.data.tempToken,
          awaitingTwoFA: true,
          loading: false,
        });
        return { requiresTwoFA: true };
      }

      // Direct login (no 2FA)
      set({
        user: response.data.user,
        loading: false,
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const { message, fieldErrors } = parseValidationErrors(error);
      set({ error: message, fieldErrors, loading: false });
      throw { message, fieldErrors };
    }
  },

  register: async ({ email, firstName, lastName, password }) => {
    set({ loading: true, error: null, fieldErrors: {} });
    try {
      const response = await authAPI.registerNewUser({
        email,
        firstName,
        lastName,
        password,
      });

      // If 2FA required after registration
      if (response.data.tempToken) {
        set({
          tempToken: response.data.tempToken,
          awaitingTwoFA: true,
          loading: false,
        });
        return { requiresTwoFA: true };
      }

      // Direct registration
      set({
        user: response.data.user,
        loading: false,
      });
      return { success: true };
    } catch (error) {
      const { message, fieldErrors } = parseValidationErrors(error);
      set({ error: message, fieldErrors, loading: false });
      throw { message, fieldErrors };
    }
  },

  verifyTwoFA: async (code) => {
    set({ loading: true, error: null });
    try {
      const { tempToken } = get();
      const response = await authAPI.verify2FA(tempToken, code);

      set({
        user: response.data.user,
        awaitingTwoFA: false,
        tempToken: '',
        loading: false,
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Invalid code';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  resendTwoFA: async () => {
    set({ loading: true, error: null });
    try {
      const { tempToken } = get();
      await authAPI.resend2FA(tempToken);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to resend code';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({
        user: null,
        tempToken: '',
        awaitingTwoFA: false,
        error: null,
      });
    }
  },

  checkAuth: async () => {
    set({ initializing: true });
    try {
      const response = await authAPI.getCurrentUser();
      set({
        user: response.data.user,
        initializing: false,
      });
      return response.data.user;
    } catch (error) {
      set({
        user: null,
        initializing: false,
      });
      return null;
    }
  },

  clearError: () => set({ error: null, fieldErrors: {} }),

  cancelTwoFA: () =>
    set({
      awaitingTwoFA: false,
      tempToken: '',
      error: null,
    }),
}));
