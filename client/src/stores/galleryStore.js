import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as galleryAPI from '../services/api/gallery';

const useGalleryStore = create(
  devtools(
    (set, get) => ({
      // State
      photos: [],
      currentPhoto: null,
      loading: false,
      error: null,
      filters: {
        category: null,
      },

      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      setFilters: (filters) => set({ filters }),

      /**
       * Fetch all photos
       */
      fetchPhotos: async (params = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await galleryAPI.getAllPhotos(params);
          set({ 
            photos: response.data || response,
            loading: false 
          });
          return response;
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Erreur lors du chargement des photos';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      /**
       * Fetch photo by ID
       */
      fetchPhotoById: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await galleryAPI.getPhotoById(id);
          set({ 
            currentPhoto: response.data || response,
            loading: false 
          });
          return response;
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Erreur lors du chargement de la photo';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      /**
       * Upload new photo (ADMIN)
       */
      uploadPhoto: async (formData) => {
        set({ loading: true, error: null });
        try {
          const response = await galleryAPI.uploadPhoto(formData);
          const newPhoto = response.data || response;
          
          set((state) => ({
            photos: [newPhoto, ...state.photos],
            loading: false
          }));
          
          return response;
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de l\'upload de la photo';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      /**
       * Update photo (ADMIN)
       */
      updatePhoto: async (id, photoData) => {
        set({ loading: true, error: null });
        try {
          const response = await galleryAPI.updatePhoto(id, photoData);
          const updatedPhoto = response.data || response;
          
          set((state) => ({
            photos: state.photos.map(photo => 
              photo.id === id ? updatedPhoto : photo
            ),
            currentPhoto: state.currentPhoto?.id === id ? updatedPhoto : state.currentPhoto,
            loading: false
          }));
          
          return response;
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la modification de la photo';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      /**
       * Delete photo (ADMIN)
       */
      deletePhoto: async (id) => {
        set({ loading: true, error: null });
        try {
          await galleryAPI.deletePhoto(id);
          
          set((state) => ({
            photos: state.photos.filter(photo => photo.id !== id),
            currentPhoto: state.currentPhoto?.id === id ? null : state.currentPhoto,
            loading: false
          }));
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la suppression de la photo';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      /**
       * Filter photos by category
       */
      filterByCategory: async (category) => {
        set({ filters: { category } });
        await get().fetchPhotos({ category });
      },

      /**
       * Clear filters
       */
      clearFilters: async () => {
        set({ filters: { category: null } });
        await get().fetchPhotos();
      },

      /**
       * Clear current photo
       */
      clearCurrentPhoto: () => set({ currentPhoto: null }),
    }),
    { name: 'GalleryStore' }
  )
);

export { useGalleryStore };
