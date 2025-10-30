import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as trainingsAPI from '../services/api/trainings';

const useTrainingStore = create(
  devtools(
    (set, get) => ({
      // État
      trainings: [],
      categories: [],
      currentTraining: null,
      bookmarks: [],
      loading: false,
      error: null,
      filters: {
        category: null,
        search: '',
        featured: false
      },

      // Actions - Formations
      fetchTrainings: async (params) => {
        set({ loading: true, error: null });
        try {
          const response = await trainingsAPI.getAllTrainings(params || get().filters);
          set({ trainings: response.data, loading: false });
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Erreur lors du chargement des formations',
            loading: false 
          });
        }
      },

      fetchTrainingById: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await trainingsAPI.getTrainingById(id);
          set({ currentTraining: response.data, loading: false });
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Formation non trouvée',
            loading: false 
          });
        }
      },

      fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
          const response = await trainingsAPI.getCategories();
          set({ categories: response.data, loading: false });
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Erreur lors du chargement des catégories',
            loading: false 
          });
        }
      },

      // Actions - Favoris
      toggleBookmark: async (id) => {
        try {
          const response = await trainingsAPI.toggleBookmark(id);
          
          // Mettre à jour la liste des favoris
          if (response.bookmarked) {
            set((state) => ({
              bookmarks: [...state.bookmarks, { trainingId: id }]
            }));
          } else {
            set((state) => ({
              bookmarks: state.bookmarks.filter(b => b.trainingId !== id)
            }));
          }
          
          return response;
        } catch (error) {
          throw error;
        }
      },

      fetchBookmarks: async () => {
        set({ loading: true, error: null });
        try {
          const response = await trainingsAPI.getMyBookmarks();
          set({ bookmarks: response.data, loading: false });
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Erreur lors du chargement des favoris',
            loading: false 
          });
        }
      },

      // Actions - Avis
      addReview: async (id, reviewData) => {
        try {
          const response = await trainingsAPI.addReview(id, reviewData);
          
          // Mettre à jour la formation actuelle avec le nouvel avis
          if (get().currentTraining?.id === id) {
            set((state) => ({
              currentTraining: {
                ...state.currentTraining,
                reviews: [...(state.currentTraining.reviews || []), response.data]
              }
            }));
          }
          
          return response;
        } catch (error) {
          throw error;
        }
      },

      // Actions - Filtres
      setFilters: (filters) => {
        set({ filters: { ...get().filters, ...filters } });
        get().fetchTrainings();
      },

      resetFilters: () => {
        set({ 
          filters: {
            category: null,
            search: '',
            featured: false
          }
        });
        get().fetchTrainings();
      },

      // Actions - Admin
      createTraining: async (trainingData) => {
        try {
          const response = await trainingsAPI.createTraining(trainingData);
          set((state) => ({
            trainings: [response.data, ...state.trainings]
          }));
          return response;
        } catch (error) {
          throw error;
        }
      },

      updateTraining: async (id, trainingData) => {
        try {
          const response = await trainingsAPI.updateTraining(id, trainingData);
          set((state) => ({
            trainings: state.trainings.map(t => 
              t.id === id ? response.data : t
            ),
            currentTraining: state.currentTraining?.id === id ? response.data : state.currentTraining
          }));
          return response;
        } catch (error) {
          throw error;
        }
      },

      deleteTraining: async (id) => {
        try {
          await trainingsAPI.deleteTraining(id);
          set((state) => ({
            trainings: state.trainings.filter(t => t.id !== id),
            currentTraining: state.currentTraining?.id === id ? null : state.currentTraining
          }));
        } catch (error) {
          throw error;
        }
      },

      // Utilitaires
      clearError: () => set({ error: null }),
      clearCurrentTraining: () => set({ currentTraining: null })
    }),
    { name: 'TrainingStore' }
  )
);

export default useTrainingStore;
