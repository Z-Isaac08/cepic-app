import { create } from 'zustand';
import * as adminAPI from '../services/api/admin';

export const useAdminStore = create((set, get) => ({
  // État du dashboard
  dashboardData: null,
  users: [],
  trainings: [],
  categories: [],
  enrollments: [],
  galleryImages: [],
  messages: [],
  messagesLoading: false,
  loading: false,
  error: null,

  // Actions pour les données du dashboard
  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await adminAPI.getDashboardStats();
      // L'API retourne { success: true, data: {...} }
      // adminAPI.getDashboardStats retourne response.data donc on reçoit { success: true, data: {...} }
      // On extrait response.data pour obtenir les vraies données { userStats, recent, ... }
      const dashboardStats = response?.data || response;
      set({
        dashboardData: {
          ...get().dashboardData,
          ...dashboardStats,
          lastUpdated: new Date().toISOString(),
        },
        loading: false,
      });
    } catch (error) {
      console.error('Erreur fetchDashboardData:', error);
      set({
        error: error.response?.data?.error || 'Erreur lors du chargement des données',
        loading: false,
      });
    }
  },

  // Actions pour les statistiques utilisateurs
  fetchUserStats: async () => {
    try {
      const response = await adminAPI.getUserStats();
      set((state) => ({
        dashboardData: {
          ...state.dashboardData,
          userStats: response.data,
        },
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des stats utilisateurs:', error);
    }
  },

  // Actions pour la gestion des utilisateurs
  fetchUsers: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await adminAPI.getAllUsers(filters);
      set({ users: response.data.users || response.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Erreur lors du chargement des utilisateurs',
        loading: false,
      });
    }
  },

  updateUserStatus: async (userId, status) => {
    try {
      await adminAPI.updateUserStatus(userId, status);

      // Mettre à jour l'utilisateur dans la liste
      set((state) => ({
        users: state.users.map((user) => (user.id === userId ? { ...user, ...status } : user)),
      }));

      // Rafraîchir les stats
      get().fetchUserStats();
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la mise à jour');
    }
  },

  deleteUser: async (userId) => {
    try {
      await adminAPI.deleteUser(userId);

      // Supprimer l'utilisateur de la liste
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
      }));

      // Rafraîchir les stats
      get().fetchUserStats();
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la suppression');
    }
  },

  // Actions pour la santé du système
  fetchSystemHealth: async () => {
    try {
      const response = await adminAPI.getSystemHealth();
      set((state) => ({
        dashboardData: {
          ...state.dashboardData,
          systemHealth: response.data,
        },
      }));
    } catch (error) {
      console.error('Erreur lors du chargement de la santé système:', error);
    }
  },

  // Actions pour les logs de sécurité
  fetchSecurityLogs: async (filters = {}) => {
    try {
      const response = await adminAPI.getSecurityLogs(filters);
      set((state) => ({
        dashboardData: {
          ...state.dashboardData,
          securityLogs: response.data,
        },
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des logs de sécurité:', error);
    }
  },

  // Actions pour les analytics
  fetchAnalytics: async (timeRange = '7d', metric = 'users') => {
    try {
      const response = await adminAPI.getAnalytics(timeRange, metric);
      set((state) => ({
        dashboardData: {
          ...state.dashboardData,
          analytics: {
            ...state.dashboardData?.analytics,
            [metric]: {
              ...state.dashboardData?.analytics?.[metric],
              [timeRange]: response.data,
            },
          },
        },
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    }
  },

  // Actions pour les événements
  fetchEventStats: async () => {
    try {
      const response = await adminAPI.getEventStats();
      set((state) => ({
        dashboardData: {
          ...state.dashboardData,
          events: response.data,
        },
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des stats événements:', error);
    }
  },

  // Actions pour la bibliothèque
  fetchLibraryStats: async () => {
    try {
      const response = await adminAPI.getLibraryStats();
      set((state) => ({
        dashboardData: {
          ...state.dashboardData,
          library: response.data,
        },
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des stats bibliothèque:', error);
    }
  },

  // Actions pour les statistiques financières
  fetchFinancialStats: async () => {
    try {
      const response = await adminAPI.getFinancialStats();
      set((state) => ({
        dashboardData: {
          ...state.dashboardData,
          financial: response.data,
        },
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des stats financières:', error);
    }
  },

  // Action pour tout rafraîchir
  refreshAllData: async () => {
    const actions = [
      get().fetchDashboardData,
      get().fetchUserStats,
      get().fetchSystemHealth,
      get().fetchSecurityLogs,
      get().fetchEventStats,
      get().fetchLibraryStats,
      get().fetchFinancialStats,
    ];

    await Promise.allSettled(actions.map((action) => action()));
  },

  // Réinitialiser l'état
  reset: () => {
    set({
      dashboardData: null,
      users: [],
      loading: false,
      error: null,
    });
  },

  // Nettoyer les erreurs
  clearError: () => {
    set({ error: null });
  },

  // Actions pour la configuration
  updateSystemConfig: async (config) => {
    try {
      await adminAPI.updateSystemConfig(config);

      // Rafraîchir la santé du système
      get().fetchSystemHealth();
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 'Erreur lors de la mise à jour de la configuration'
      );
    }
  },

  // Actions pour les notifications admin
  sendNotification: async (notification) => {
    try {
      await adminAPI.sendNotification(notification);
    } catch (error) {
      throw new Error(error.response?.data?.error || "Erreur lors de l'envoi de la notification");
    }
  },

  // Actions pour les sauvegardes
  createBackup: async () => {
    try {
      const response = await adminAPI.createBackup();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la création de la sauvegarde');
    }
  },

  restoreBackup: async (backupId) => {
    try {
      await adminAPI.restoreBackup(backupId);
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la restauration');
    }
  },

  // Actions pour les rapports
  generateReport: async (type, period) => {
    try {
      const response = await adminAPI.generateReport(type, period);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la génération du rapport');
    }
  },

  // Actions pour les métriques en temps réel
  subscribeToRealTimeMetrics: () => {
    // Simulation d'une connexion WebSocket pour les métriques en temps réel
    const interval = setInterval(() => {
      const currentData = get().dashboardData;
      if (currentData) {
        set((state) => ({
          dashboardData: {
            ...state.dashboardData,
            onlineUsers: Math.floor(Math.random() * 50) + 10,
            realtimeMetrics: {
              activeConnections: Math.floor(Math.random() * 100) + 50,
              requestsPerMinute: Math.floor(Math.random() * 500) + 200,
              errorRate: Math.random() * 2,
              lastUpdate: new Date().toISOString(),
            },
          },
        }));
      }
    }, 5000); // Mise à jour toutes les 5 secondes

    return () => clearInterval(interval);
  },

  // Helpers pour les calculs
  calculateGrowthRate: (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  },

  formatNumber: (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  },

  // Validation des permissions admin
  validateAdminAccess: () => {
    const { user } = get();
    return user && user.role === 'ADMIN';
  },

  // ============================================
  // GESTION DES MESSAGES (CONTACT)
  // ============================================

  // Récupérer les messages de contact (admin)
  getMessages: async (params = {}) => {
    set({ messagesLoading: true, error: null });
    try {
      const response = await adminAPI.getAllMessages(params);
      // Normaliser et trier par date décroissante
      const items = (response.data?.messages || response.data || []).map((m) => ({
        id: m.id,
        name: m.name || m.fullName || `${m.firstName || ''} ${m.lastName || ''}`.trim(),
        email: m.email,
        subject: m.subject || m.title || 'Sans sujet',
        message: m.message || m.content || '',
        isRead: Boolean(m.isRead),
        createdAt: m.createdAt || m.date || new Date().toISOString(),
      }));
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      set({ messages: items, messagesLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Erreur lors du chargement des messages',
        messagesLoading: false,
      });
    }
  },

  // Marquer un message comme lu (et permettre le toggle en local pour non lu)
  markAsRead: async (id, isRead = true) => {
    try {
      if (isRead) {
        await adminAPI.markMessageAsRead(id);
      }
      // Mise à jour locale (permet de marquer comme non lu même si pas d'endpoint dédié)
      set((state) => ({
        messages: state.messages.map((m) => (m.id === id ? { ...m, isRead } : m)),
      }));
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la mise à jour du message');
    }
  },

  // Supprimer un message
  deleteMessage: async (id) => {
    try {
      await adminAPI.deleteMessage(id);
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== id),
      }));
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la suppression du message');
    }
  },

  // Compteur non lus
  getUnreadCount: () => {
    return get().messages.filter((m) => !m.isRead).length;
  },

  // ============================================
  // GESTION DES FORMATIONS
  // ============================================

  // Récupérer toutes les formations (admin)
  fetchTrainings: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await adminAPI.getTrainings(filters);
      set({ 
        trainings: Array.isArray(response) ? response : (response.data || []),
        loading: false 
      });
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         'Erreur lors du chargement des formations';
      set({ 
        error: errorMessage,
        loading: false 
      });
      throw new Error(errorMessage);
    }
  },

  // Créer une formation
  createTraining: async (trainingData) => {
    set({ loading: true, error: null });
    try {
      // Validation des champs requis
      const requiredFields = ['title', 'description', 'categoryId'];
      const missingFields = requiredFields.filter(field => !trainingData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Champs manquants : ${missingFields.join(', ')}`);
      }

      const response = await adminAPI.createTraining(trainingData);
      set((state) => ({
        trainings: [response, ...state.trainings],
        loading: false
      }));
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         error.message || 
                         'Erreur lors de la création de la formation';
      set({ 
        error: errorMessage,
        loading: false 
      });
      throw new Error(errorMessage);
    }
  },

  // Modifier une formation
  updateTraining: async (id, trainingData) => {
    set({ loading: true, error: null });
    try {
      const response = await adminAPI.updateTraining(id, trainingData);
      set((state) => ({
        trainings: state.trainings.map((training) =>
          training.id === id ? { ...training, ...response } : training
        ),
        loading: false
      }));
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         'Erreur lors de la mise à jour de la formation';
      set({ 
        error: errorMessage,
        loading: false 
      });
      throw new Error(errorMessage);
    }
  },

  // Supprimer une formation
  deleteTraining: async (id) => {
    set({ loading: true, error: null });
    try {
      await adminAPI.deleteTraining(id);
      set((state) => ({
        trainings: state.trainings.filter((training) => training.id !== id),
        loading: false
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         'Erreur lors de la suppression de la formation';
      set({ 
        error: errorMessage,
        loading: false 
      });
      throw new Error(errorMessage);
    }
  },

  // Toggle publié/non publié
  toggleTrainingPublish: async (id, currentStatus) => {
    set({ loading: true, error: null });
    try {
      // Mettre à jour l'état local immédiatement pour un retour visuel instantané
      set((state) => ({
        trainings: state.trainings.map((training) =>
          training.id === id 
            ? { ...training, isPublished: !currentStatus } 
            : training
        )
      }));
      
      // Appeler l'API
      const response = await adminAPI.toggleTrainingPublish(id);
      
      // Mettre à jour l'état avec la réponse du serveur
      set((state) => ({
        trainings: state.trainings.map((training) =>
          training.id === id 
            ? { ...training, isPublished: response.isPublished } 
            : training
        ),
        loading: false
      }));
      
      return response;
    } catch (error) {
      // En cas d'erreur, restaurer l'état précédent
      set((state) => ({
        trainings: state.trainings.map((training) =>
          training.id === id 
            ? { ...training, isPublished: currentStatus } 
            : training
        ),
        loading: false,
        error: error.response?.data?.error || 
               error.response?.data?.message || 
               'Erreur lors de la modification du statut de publication'
      }));
      
      throw error;
    }
  },

  // ============================================
  // GESTION DES INSCRIPTIONS
  // ============================================

  // Récupérer toutes les inscriptions
  fetchEnrollments: async (params = {}) => {
    try {
      const response = await adminAPI.getAllEnrollments(params);
      set({ enrollments: response.data?.enrollments || [] });
      return response;
    } catch (error) {
      console.error('Erreur lors du chargement des inscriptions:', error);
    }
  },

  // ============================================
  // GESTION DES CATÉGORIES
  // ============================================

  // Récupérer toutes les catégories
  fetchCategories: async () => {
    try {
      const response = await adminAPI.getCategories();
      set({ categories: response.data || [] });
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  },

  // Créer une catégorie
  createCategory: async (categoryData) => {
    try {
      const response = await adminAPI.createCategory(categoryData);

      set((state) => ({
        categories: [...state.categories, response.data],
      }));

      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la création');
    }
  },

  // Modifier une catégorie
  updateCategory: async (id, categoryData) => {
    try {
      const response = await adminAPI.updateCategory(id, categoryData);

      set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === id ? { ...cat, ...response.data } : cat
        ),
      }));

      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la modification');
    }
  },

  // Supprimer une catégorie
  deleteCategory: async (id) => {
    try {
      await adminAPI.deleteCategory(id);

      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== id),
      }));
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la suppression');
    }
  },

  // ============================================
  // GESTION DE LA GALERIE
  // ============================================

  // Récupérer toutes les images
  fetchGalleryImages: async () => {
    set({ loading: true, error: null });
    try {
      const response = await adminAPI.getAllGalleryImages();
      set({ galleryImages: response.data || [], loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Erreur lors du chargement des images',
        loading: false,
      });
    }
  },

  // Upload une image
  uploadGalleryImage: async (imageData) => {
    try {
      const response = await adminAPI.uploadGalleryPhoto(imageData);

      set((state) => ({
        galleryImages: [response.data, ...state.galleryImages],
      }));

      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Erreur lors de l'upload");
    }
  },

  // Modifier une image
  updateGalleryImage: async (id, imageData) => {
    try {
      const response = await adminAPI.updateGalleryPhoto(id, imageData);

      set((state) => ({
        galleryImages: state.galleryImages.map((img) =>
          img.id === id ? { ...img, ...response.data } : img
        ),
      }));

      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la modification');
    }
  },

  // Supprimer une image
  deleteGalleryImage: async (id) => {
    try {
      await adminAPI.deleteGalleryPhoto(id);

      set((state) => ({
        galleryImages: state.galleryImages.filter((img) => img.id !== id),
      }));
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erreur lors de la suppression');
    }
  },
}));
