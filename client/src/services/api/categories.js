import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Instance axios avec configuration
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/connexion';
    }
    return Promise.reject(error);
  }
);

// ============================================
// CATEGORIES
// ============================================

/**
 * Récupérer toutes les catégories
 * @returns {Promise}
 */
export const getAllCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

/**
 * Récupérer une catégorie par ID
 * @param {string} id - ID de la catégorie
 * @returns {Promise}
 */
export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

/**
 * Créer une nouvelle catégorie (ADMIN)
 * @param {Object} categoryData - Données de la catégorie
 * @returns {Promise}
 */
export const createCategory = async (categoryData) => {
  const response = await api.post('/categories', categoryData);
  return response.data;
};

/**
 * Modifier une catégorie (ADMIN)
 * @param {string} id - ID de la catégorie
 * @param {Object} categoryData - Données à modifier
 * @returns {Promise}
 */
export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
};

/**
 * Supprimer une catégorie (ADMIN)
 * @param {string} id - ID de la catégorie
 * @returns {Promise}
 */
export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
