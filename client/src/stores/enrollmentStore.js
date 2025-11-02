import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as enrollmentsAPI from '../services/api/enrollments';
import * as paymentsAPI from '../services/api/payments';

const useEnrollmentStore = create(
  devtools(
    (set, get) => ({
      // État
      enrollments: [],
      currentEnrollment: null,
      loading: false,
      error: null,
      filters: {
        status: null // PENDING, CONFIRMED, COMPLETED, CANCELLED
      },

      // Actions - Inscriptions
      createEnrollment: async (trainingId) => {
        set({ loading: true, error: null });
        try {
          const response = await enrollmentsAPI.createEnrollment(trainingId);
          set((state) => ({
            enrollments: [response.data, ...state.enrollments],
            currentEnrollment: response.data,
            loading: false
          }));
          return response.data;
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Erreur lors de l\'inscription',
            loading: false 
          });
          throw error;
        }
      },

      fetchMyEnrollments: async (params) => {
        set({ loading: true, error: null });
        try {
          const response = await enrollmentsAPI.getMyEnrollments(params || get().filters);
          set({ enrollments: response.data, loading: false });
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Erreur lors du chargement des inscriptions',
            loading: false 
          });
        }
      },

      fetchEnrollmentById: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await enrollmentsAPI.getEnrollmentById(id);
          set({ currentEnrollment: response.data, loading: false });
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Inscription non trouvée',
            loading: false 
          });
        }
      },

      cancelEnrollment: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await enrollmentsAPI.cancelEnrollment(id);
          set((state) => ({
            enrollments: state.enrollments.map(e => 
              e.id === id ? response.data : e
            ),
            currentEnrollment: state.currentEnrollment?.id === id ? response.data : state.currentEnrollment,
            loading: false
          }));
          return response.data;
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Erreur lors de l\'annulation',
            loading: false 
          });
          throw error;
        }
      },

      // Actions - Paiement
      initiatePayment: async (enrollmentId) => {
        set({ loading: true, error: null });
        try {
          const response = await paymentsAPI.initiatePayment(enrollmentId);
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Erreur lors de l\'initialisation du paiement',
            loading: false 
          });
          throw error;
        }
      },

      verifyPayment: async (transactionId) => {
        set({ loading: true, error: null });
        try {
          const response = await paymentsAPI.verifyPayment(transactionId);
          
          // Mettre à jour l'inscription si le paiement est confirmé
          if (response.data.status === 'COMPLETED') {
            get().fetchMyEnrollments();
          }
          
          set({ loading: false });
          return response.data;
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Erreur lors de la vérification du paiement',
            loading: false 
          });
          throw error;
        }
      },

      // Actions - Filtres
      setFilters: (filters) => {
        set({ filters: { ...get().filters, ...filters } });
        get().fetchMyEnrollments();
      },

      resetFilters: () => {
        set({ filters: { status: null } });
        get().fetchMyEnrollments();
      },

      // Utilitaires
      clearError: () => set({ error: null }),
      clearCurrentEnrollment: () => set({ currentEnrollment: null }),

      // Statistiques
      getStats: () => {
        const enrollments = get().enrollments;
        return {
          total: enrollments.length,
          pending: enrollments.filter(e => e.status === 'PENDING').length,
          confirmed: enrollments.filter(e => e.status === 'CONFIRMED').length,
          completed: enrollments.filter(e => e.status === 'COMPLETED').length,
          cancelled: enrollments.filter(e => e.status === 'CANCELLED').length
        };
      }
    }),
    { name: 'EnrollmentStore' }
  )
);

// Export par défaut et nommé pour compatibilité
export { useEnrollmentStore };
export default useEnrollmentStore;
