import api from '../apiConfig';

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
  deleteCategory,
};
