import { create } from "zustand";
import { authAPI } from "../services/api";

export const useAuthStore = create((set, get) => ({
  // États d'authentification
  authState: "logged_out", // 'logged_out' | 'awaiting_2fa' | 'logged_in'
  userEmail: "",
  tempToken: "",
  user: null,
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Étape 1 - Connexion avec email/password
  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const response = await authAPI.loginExistingUser(email, password);
      
      set({
        authState: "awaiting_2fa",
        userEmail: email,
        tempToken: response.data.tempToken,
        loading: false,
      });

      return {
        success: true,
        message: response.message || "Code de vérification envoyé par email",
      };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || "Erreur de connexion";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  loginExistingUser: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const response = await authAPI.loginExistingUser(email, password);
      
      set({
        authState: "awaiting_2fa",
        userEmail: email,
        tempToken: response.data.tempToken,
        loading: false,
      });

      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || "Email ou mot de passe incorrect";
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  },

  registerNewUser: async ({ email, firstName, lastName, password }) => {
    set({ loading: true, error: null });

    try {
      const response = await authAPI.registerNewUser({ 
        email, 
        firstName, 
        lastName, 
        password 
      });

      set({
        authState: "awaiting_2fa",
        userEmail: email,
        tempToken: response.data.tempToken,
        loading: false,
      });

      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || "Erreur lors de la création du compte";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  checkEmail: async (email) => {
    set({ loading: true, error: null });

    try {
      const response = await authAPI.checkEmail(email);

      if (response.data.exists) {
        set({
          authState: "existing_user_login",
          userEmail: email,
          loading: false,
        });
      } else {
        set({
          authState: "new_user_registration",
          userEmail: email,
          loading: false,
        });
      }

      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || "Erreur lors de la vérification";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Étape 2 - Vérification du code 2FA
  verify2FA: async (code) => {
    set({ loading: true, error: null });

    try {
      const tempToken = get().tempToken;
      const response = await authAPI.verify2FA(tempToken, code);

      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      set({
        authState: "logged_in",
        user: response.data.user,
        loading: false,
        tempToken: "", // Clear temp token
      });

      return { success: true, message: response.message || "Connexion réussie" };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || "Code de vérification incorrect";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      // Always clear local state and storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      set({
        authState: "logged_out",
        userEmail: "",
        tempToken: "",
        user: null,
        error: null,
      });
    }
  },

  // Resend 2FA code
  resend2FA: async () => {
    const tempToken = get().tempToken;
    if (!tempToken) return;

    set({ loading: true, error: null });

    try {
      const response = await authAPI.resend2FA(tempToken);

      set({ loading: false });
      return { success: true, message: response.message || "Nouveau code envoyé" };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || "Erreur lors du renvoi";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Retour à l'étape de login depuis 2FA
  backToLogin: () => {
    set({
      authState: "logged_out",
      userEmail: "",
      tempToken: "",
      error: null,
    });
  },

  // Helpers
  isLoggedIn: () => get().authState === "logged_in",
  isAwaitingTwoFA: () => get().authState === "awaiting_2fa",
  isLoggedOut: () => get().authState === "logged_out",

  // Nouveaux helpers nécessaires pour le flow
  isEmailVerification: () => get().authState === "email_verification",
  isNewUserRegistration: () => get().authState === "new_user_registration",
  isExistingUserLogin: () => get().authState === "existing_user_login",
}));
