import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============================================
// INSCRIPTIONS
// ============================================

/**
 * Créer une inscription à une formation
 * @param {string} trainingId - ID de la formation
 * @returns {Promise}
 */
export const createEnrollment = async (trainingId) => {
  const response = await api.post('/enrollments', { trainingId });
  return response.data;
};

/**
 * Récupérer mes inscriptions
 * @param {Object} params - Paramètres de filtrage (status, etc.)
 * @returns {Promise}
 */
export const getMyEnrollments = async (params = {}) => {
  const response = await api.get('/enrollments', { params });
  return response.data;
};

/**
 * Récupérer une inscription par ID
 * @param {string} id - ID de l'inscription
 * @returns {Promise}
 */
export const getEnrollmentById = async (id) => {
  const response = await api.get(`/enrollments/${id}`);
  return response.data;
};

/**
 * Annuler une inscription
 * @param {string} id - ID de l'inscription
 * @returns {Promise}
 */
export const cancelEnrollment = async (id) => {
  const response = await api.put(`/enrollments/${id}/cancel`);
  return response.data;
};

/**
 * Marquer une inscription comme complétée (ADMIN)
 * @param {string} id - ID de l'inscription
 * @returns {Promise}
 */
export const completeEnrollment = async (id) => {
  const response = await api.put(`/enrollments/${id}/complete`);
  return response.data;
};

export default {
  createEnrollment,
  getMyEnrollments,
  getEnrollmentById,
  cancelEnrollment,
  completeEnrollment
};
