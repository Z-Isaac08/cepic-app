import { create } from "zustand";

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
      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Validation basique (simulation)
      if (!email || !password) {
        throw new Error("Email et mot de passe requis");
      }

      if (password.length < 6) {
        throw new Error("Mot de passe trop court");
      }

      // Simulation de génération de token temporaire
      const tempToken = `temp_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Simulation d'envoi de code 2FA par email
      console.log(`Code 2FA envoyé à ${email}: 123456`); // En réalité, serait envoyé par email

      set({
        authState: "awaiting_2fa",
        userEmail: email,
        tempToken,
        loading: false,
      });

      return {
        success: true,
        message: "Code de vérification envoyé par email",
      };
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  loginExistingUser: async (email, password) => {
    set({ loading: true, error: null });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Ici tu pourrais ajouter une vérification du mot de passe
      if (password.length < 6) {
        throw new Error("Mot de passe invalide");
      }

      set({
        user: { email, name: email.split("@")[0] },
        authState: "logged_in",
        loading: false,
      });
    } catch (error) {
      set({
        error: "Email ou mot de passe incorrect",
        loading: false,
      });
      throw error;
    }
  },

  registerNewUser: async ({ email, firstName, lastName }) => {
    set({ loading: true, error: null });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simule la création d'un compte utilisateur
      const fakeUser = {
        email,
        name: `${firstName} ${lastName}`,
      };

      set({
        user: fakeUser,
        authState: "awaiting_2fa", // Étape suivante : saisie du code 2FA
        loading: false,
      });
    } catch (error) {
      set({ error: "Erreur lors de la création du compte", loading: false });
      throw error;
    }
  },

  checkEmail: async (email) => {
    set({ loading: true, error: null });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const existingEmails = [
        "admin@test.com",
        "user@test.com",
        "demo@example.com",
      ];

      if (existingEmails.includes(email)) {
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
    } catch (error) {
      set({ error: "Erreur lors de la vérification", loading: false });
      throw error;
    }
  },

  // Étape 2 - Vérification du code 2FA
  verify2FA: async (code) => {
    set({ loading: true, error: null });

    try {
      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validation du code (simulation - en réalité serait vérifié côté serveur)
      if (code !== "123456") {
        throw new Error("Code de vérification incorrect");
      }

      // Création de l'utilisateur connecté
      const user = {
        id: `user_${Date.now()}`,
        email: get().userEmail,
        name: get().userEmail.split("@")[0],
        loginTime: new Date().toISOString(),
        role: "participant",
      };

      set({
        authState: "logged_in",
        user,
        loading: false,
        tempToken: "", // Clear temp token
      });

      return { success: true, message: "Connexion réussie" };
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Déconnexion
  logout: () => {
    set({
      authState: "logged_out",
      userEmail: "",
      tempToken: "",
      user: null,
      error: null,
    });
  },

  // Resend 2FA code
  resend2FA: async () => {
    const email = get().userEmail;
    if (!email) return;

    set({ loading: true, error: null });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(`Nouveau code 2FA envoyé à ${email}: 123456`);

      set({ loading: false });
      return { success: true, message: "Nouveau code envoyé" };
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
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
