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
        featured: false,
      },

      // Actions - Formations
      fetchTrainings: async (params) => {
        set({ loading: true, error: null });
        try {
          // Récupérer les formations
          const response = await trainingsAPI.getAllTrainings(params || get().filters);

          // Récupérer les favoris de l'utilisateur connecté
          let bookmarks = [];

          // Vérifier si l'utilisateur est connecté via l'API
          try {
            const bookmarksResponse = await trainingsAPI.getMyBookmarks();
            if (bookmarksResponse && bookmarksResponse.data) {
              bookmarks = bookmarksResponse.data;
            }
          } catch (err) {
            console.error('Erreur lors du chargement des favoris:', err);
          }

          // Mettre à jour l'état avec les formations et les favoris
          set({
            trainings: response.data.map((training) => ({
              ...training,
              isBookmarked: bookmarks.some((b) => b.trainingId === training.id),
            })),
            bookmarks,
            loading: false,
          });
        } catch (error) {
          console.error('Erreur lors du chargement des formations:', error);
          set({
            error: error.response?.data?.error || 'Erreur lors du chargement des formations',
            loading: false,
          });
        }
      },

      fetchTrainingById: async (id) => {
        set({ loading: true, error: null });
        try {
          // Récupérer les détails de la formation
          const response = await trainingsAPI.getTrainingById(id);

          // Vérifier si l'utilisateur a mis en favori cette formation
          try {
            const bookmarksResponse = await trainingsAPI.getMyBookmarks();
            const isBookmarked = bookmarksResponse?.data?.some((b) => b.trainingId === id) || false;

            // Mettre à jour la formation avec le statut de bookmark
            set({
              currentTraining: {
                ...response.data,
                isBookmarked,
              },
              loading: false,
            });
          } catch (bookmarkError) {
            console.error('Erreur lors du chargement des favoris:', bookmarkError);
            // Si erreur, charger la formation sans le statut de bookmark
            set({
              currentTraining: {
                ...response.data,
                isBookmarked: false,
              },
              loading: false,
            });
          }
        } catch (error) {
          console.error('Erreur lors du chargement de la formation:', error);
          set({
            error: error.response?.data?.error || 'Formation non trouvée',
            loading: false,
          });
        }
      },

      fetchCategories: async () => {
        try {
          const response = await trainingsAPI.getCategories();
          set({ categories: response.data });
        } catch (error) {
          set({
            error: error.response?.data?.error || 'Erreur lors du chargement des catégories',
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
              bookmarks: [...state.bookmarks, { trainingId: id }],
              // Mettre à jour le statut de bookmark dans la liste des formations
              trainings: state.trainings.map((training) =>
                training.id === id ? { ...training, isBookmarked: true } : training
              ),
              // Mettre à jour la formation courante si c'est celle qui est affichée
              currentTraining:
                state.currentTraining?.id === id
                  ? { ...state.currentTraining, isBookmarked: true }
                  : state.currentTraining,
            }));
          } else {
            set((state) => ({
              bookmarks: state.bookmarks.filter((b) => b.trainingId !== id),
              // Mettre à jour le statut de bookmark dans la liste des formations
              trainings: state.trainings.map((training) =>
                training.id === id ? { ...training, isBookmarked: false } : training
              ),
              // Mettre à jour la formation courante si c'est celle qui est affichée
              currentTraining:
                state.currentTraining?.id === id
                  ? { ...state.currentTraining, isBookmarked: false }
                  : state.currentTraining,
            }));
          }

          return response;
        } catch (error) {
          console.error('Erreur lors de la mise à jour du favori:', error);
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
            loading: false,
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
                reviews: [...(state.currentTraining.reviews || []), response.data],
              },
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
            featured: false,
          },
        });
        get().fetchTrainings();
      },

      // Actions - Admin
      createTraining: async (trainingData) => {
        try {
          const response = await trainingsAPI.createTraining(trainingData);
          set((state) => ({
            trainings: [response.data, ...state.trainings],
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
            trainings: state.trainings.map((t) => (t.id === id ? response.data : t)),
            currentTraining:
              state.currentTraining?.id === id ? response.data : state.currentTraining,
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
            trainings: state.trainings.filter((t) => t.id !== id),
            currentTraining: state.currentTraining?.id === id ? null : state.currentTraining,
          }));
        } catch (error) {
          throw error;
        }
      },

      // Utilitaires
      clearError: () => set({ error: null }),
      clearCurrentTraining: () => set({ currentTraining: null }),
    }),
    { name: 'TrainingStore' }
  )
);

// Export par défaut et nommé pour compatibilité
export { useTrainingStore };
export default useTrainingStore;
