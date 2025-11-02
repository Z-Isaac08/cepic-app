import { create } from "zustand";
import * as authAPI from "../services/api/auth";

export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  loading: false,
  error: null,
  tempToken: "", // For 2FA flow
  awaitingTwoFA: false,

  // Actions
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.loginExistingUser(email, password);
      
      console.log('=== LOGIN RESPONSE ===');
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('User from response:', response.data?.user);
      console.log('=====================');
      
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
      
      console.log('User set in store:', response.data.user);
      console.log('Current store state:', get());
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || "Login failed";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  register: async ({ email, firstName, lastName, password, phone }) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.registerNewUser({
        email,
        firstName,
        lastName,
        password,
        phone,
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
      const errorMessage = error.response?.data?.error || "Registration failed";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
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
        tempToken: "",
        loading: false,
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Invalid code";
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
      const errorMessage = error.response?.data?.error || "Failed to resend code";
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({
        user: null,
        tempToken: "",
        awaitingTwoFA: false,
        error: null,
      });
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      const response = await authAPI.getCurrentUser();
      set({
        user: response.data.user,
        loading: false,
      });
      return response.data.user;
    } catch (error) {
      set({
        user: null,
        loading: false,
      });
      return null;
    }
  },

  clearError: () => set({ error: null }),
  
  cancelTwoFA: () => set({ 
    awaitingTwoFA: false, 
    tempToken: "", 
    error: null 
  }),
}));