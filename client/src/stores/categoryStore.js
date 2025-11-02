import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as categoriesAPI from '../services/api/categories';

const useCategoryStore = create(
  devtools(
    (set, get) => ({
      // State
      categories: [],
      currentCategory: null,
      loading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      /**
       * Fetch all categories
       */
      fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
          const response = await categoriesAPI.getAllCategories();
          set({ 
            categories: response.data || response,
            loading: false 
          });
          return response;
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Erreur lors du chargement des catégories';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      /**
       * Fetch category by ID
       */
      fetchCategoryById: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await categoriesAPI.getCategoryById(id);
          set({ 
            currentCategory: response.data || response,
            loading: false 
          });
          return response;
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Erreur lors du chargement de la catégorie';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      /**
       * Create new category (ADMIN)
       */
      createCategory: async (categoryData) => {
        set({ loading: true, error: null });
        try {
          const response = await categoriesAPI.createCategory(categoryData);
          const newCategory = response.data || response;
          
          set((state) => ({
            categories: [...state.categories, newCategory],
            loading: false
          }));
          
          return response;
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la création de la catégorie';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      /**
       * Update category (ADMIN)
       */
      updateCategory: async (id, categoryData) => {
        set({ loading: true, error: null });
        try {
          const response = await categoriesAPI.updateCategory(id, categoryData);
          const updatedCategory = response.data || response;
          
          set((state) => ({
            categories: state.categories.map(cat => 
              cat.id === id ? updatedCategory : cat
            ),
            currentCategory: state.currentCategory?.id === id ? updatedCategory : state.currentCategory,
            loading: false
          }));
          
          return response;
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la modification de la catégorie';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      /**
       * Delete category (ADMIN)
       */
      deleteCategory: async (id) => {
        set({ loading: true, error: null });
        try {
          await categoriesAPI.deleteCategory(id);
          
          set((state) => ({
            categories: state.categories.filter(cat => cat.id !== id),
            currentCategory: state.currentCategory?.id === id ? null : state.currentCategory,
            loading: false
          }));
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la suppression de la catégorie';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      /**
       * Clear current category
       */
      clearCurrentCategory: () => set({ currentCategory: null }),
    }),
    { name: 'CategoryStore' }
  )
);

export { useCategoryStore };
