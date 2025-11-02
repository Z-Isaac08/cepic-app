import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Instance axios avec configuration
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important pour les cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Rediriger vers connexion si non authentifié
      window.location.href = '/connexion';
    }
    return Promise.reject(error);
  }
);

// ============================================
// FORMATIONS
// ============================================

/**
 * Récupérer toutes les formations
 * @param {Object} params - Paramètres de filtrage
 * @returns {Promise}
 */
export const getAllTrainings = async (params = {}) => {
  const response = await api.get('/trainings', { params });
  return response.data;
};

/**
 * Récupérer une formation par ID
 * @param {string} id - ID de la formation
 * @returns {Promise}
 */
export const getTrainingById = async (id) => {
  const response = await api.get(`/trainings/${id}`);
  return response.data;
};

/**
 * Récupérer les catégories de formations
 * @returns {Promise}
 */
export const getCategories = async () => {
  const response = await api.get('/trainings/categories');
  return response.data;
};

/**
 * Ajouter/Retirer une formation des favoris
 * @param {string} id - ID de la formation
 * @returns {Promise}
 */
export const toggleBookmark = async (id) => {
  const response = await api.post(`/trainings/${id}/bookmark`);
  return response.data;
};

/**
 * Récupérer mes favoris
 * @returns {Promise}
 */
export const getMyBookmarks = async () => {
  const response = await api.get('/trainings/bookmarks/me');
  return response.data;
};

/**
 * Ajouter un avis sur une formation
 * @param {string} id - ID de la formation
 * @param {Object} reviewData - Données de l'avis (rating, comment)
 * @returns {Promise}
 */
export const addReview = async (id, reviewData) => {
  const response = await api.post(`/trainings/${id}/review`, reviewData);
  return response.data;
};

// ============================================
// ADMIN - GESTION DES FORMATIONS
// ============================================

/**
 * Créer une nouvelle formation (ADMIN)
 * @param {Object} trainingData - Données de la formation
 * @returns {Promise}
 */
export const createTraining = async (trainingData) => {
  const response = await api.post('/trainings', trainingData);
  return response.data;
};

/**
 * Modifier une formation (ADMIN)
 * @param {string} id - ID de la formation
 * @param {Object} trainingData - Données à modifier
 * @returns {Promise}
 */
export const updateTraining = async (id, trainingData) => {
  const response = await api.put(`/trainings/${id}`, trainingData);
  return response.data;
};

/**
 * Supprimer une formation (ADMIN)
 * @param {string} id - ID de la formation
 * @returns {Promise}
 */
export const deleteTraining = async (id) => {
  const response = await api.delete(`/trainings/${id}`);
  return response.data;
};

export default {
  getAllTrainings,
  getTrainingById,
  getCategories,
  toggleBookmark,
  getMyBookmarks,
  addReview,
  createTraining,
  updateTraining,
  deleteTraining
};
