import api from '../apiConfig';

// ============================================
// DASHBOARD STATS
// ============================================

/**
 * Récupérer les statistiques du dashboard
 * @returns {Promise}
 */
export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

// ============================================
// USERS MANAGEMENT
// ============================================

/**
 * Récupérer tous les utilisateurs
 * @param {Object} params - Paramètres de filtrage (page, limit, search, role)
 * @returns {Promise}
 */
export const getAllUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

/**
 * Récupérer un utilisateur par ID
 * @param {string} id - ID de l'utilisateur
 * @returns {Promise}
 */
export const getUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

/**
 * Mettre à jour un utilisateur
 * @param {string} id - ID de l'utilisateur
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise}
 */
export const updateUser = async (id, data) => {
  const response = await api.put(`/admin/users/${id}`, data);
  return response.data;
};

/**
 * Supprimer un utilisateur
 * @param {string} id - ID de l'utilisateur
 * @returns {Promise}
 */
export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

/**
 * Activer/Désactiver un utilisateur
 * @param {string} id - ID de l'utilisateur
 * @returns {Promise}
 */
export const toggleUserStatus = async (id) => {
  const response = await api.patch(`/admin/users/${id}/toggle-status`);
  return response.data;
};

// ============================================
// TRAININGS MANAGEMENT
// ============================================

/**
 * Récupérer toutes les formations
 * @param {Object} params - Paramètres de filtrage et de pagination
 * @returns {Promise}
 */
export const getTrainings = async (params = {}) => {
  try {
    const response = await api.get('/admin/trainings', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching trainings:', error);
    throw error;
  }
};

/**
 * Créer une formation
 * @param {Object} data - Données de la formation
 * @returns {Promise}
 */
export const createTraining = async (data) => {
  try {
    const response = await api.post('/trainings', data);
    return response.data;
  } catch (error) {
    console.error('Error creating training:', error);
    throw error;
  }
};

/**
 * Mettre à jour une formation
 * @param {string} id - ID de la formation
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise}
 */
export const updateTraining = async (id, data) => {
  try {
    const response = await api.put(`/admin/trainings/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating training ${id}:`, error);
    throw error;
  }
};

/**
 * Supprimer une formation
 * @param {string} id - ID de la formation
 * @returns {Promise}
 */
export const deleteTraining = async (id) => {
  try {
    const response = await api.delete(`/admin/trainings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting training ${id}:`, error);
    throw error;
  }
};

/**
 * Publier/Dépublier une formation
 * @param {string} id - ID de la formation
 * @returns {Promise}
 */
export const toggleTrainingPublish = async (id) => {
  const response = await api.patch(`/admin/trainings/${id}/toggle-publish`);
  return response.data;
};

// ============================================
// CATEGORIES MANAGEMENT
// ============================================

/**
 * Récupérer toutes les catégories
 * @returns {Promise}
 */
export const getCategories = async () => {
  const response = await api.get('/trainings/categories');
  return response.data;
};

/**
 * Créer une catégorie
 * @param {Object} data - Données de la catégorie
 * @returns {Promise}
 */
export const createCategory = async (data) => {
  const response = await api.post('/admin/categories', data);
  return response.data;
};

/**
 * Mettre à jour une catégorie
 * @param {string} id - ID de la catégorie
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise}
 */
export const updateCategory = async (id, data) => {
  const response = await api.put(`/admin/categories/${id}`, data);
  return response.data;
};

/**
 * Supprimer une catégorie
 * @param {string} id - ID de la catégorie
 * @returns {Promise}
 */
export const deleteCategory = async (id) => {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
};

// ============================================
// ENROLLMENTS MANAGEMENT
// ============================================

/**
 * Récupérer toutes les inscriptions
 * @param {Object} params - Paramètres de filtrage
 * @returns {Promise}
 */
export const getAllEnrollments = async (params = {}) => {
  const response = await api.get('/admin/enrollments', { params });
  return response.data;
};

/**
 * Mettre à jour le statut d'une inscription
 * @param {string} id - ID de l'inscription
 * @param {string} status - Nouveau statut
 * @returns {Promise}
 */
export const updateEnrollmentStatus = async (id, status) => {
  const response = await api.patch(`/admin/enrollments/${id}/status`, { status });
  return response.data;
};

// ============================================
// GALLERY MANAGEMENT
// ============================================

/**
 * Récupérer toutes les images de la galerie
 * @returns {Promise}
 */
export const getAllGalleryImages = async () => {
  const response = await api.get('/gallery');
  return response.data;
};

/**
 * Upload une photo dans la galerie
 * @param {FormData} formData - Données du formulaire avec l'image
 * @returns {Promise}
 */
export const uploadGalleryPhoto = async (formData) => {
  const response = await api.post('/admin/gallery', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });
  return response.data;
};

/**
 * Mettre à jour une photo de galerie
 * @param {string} id - ID de la photo
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise}
 */
export const updateGalleryPhoto = async (id, data) => {
  const response = await api.put(`/admin/gallery/${id}`, data);
  return response.data;
};

/**
 * Supprimer une photo de galerie
 * @param {string} id - ID de la photo
 * @returns {Promise}
 */
export const deleteGalleryPhoto = async (id) => {
  const response = await api.delete(`/admin/gallery/${id}`);
  return response.data;
};

// ============================================
// MESSAGES/CONTACTS MANAGEMENT
// ============================================

/**
 * Récupérer tous les messages
 * @param {Object} params - Paramètres de filtrage
 * @returns {Promise}
 */
export const getAllMessages = async (params = {}) => {
  const response = await api.get('/admin/messages', { params });
  return response.data;
};

/**
 * Marquer un message comme lu
 * @param {string} id - ID du message
 * @returns {Promise}
 */
export const markMessageAsRead = async (id) => {
  const response = await api.patch(`/admin/messages/${id}/read`);
  return response.data;
};

/**
 * Supprimer un message
 * @param {string} id - ID du message
 * @returns {Promise}
 */
export const deleteMessage = async (id) => {
  const response = await api.delete(`/admin/messages/${id}`);
  return response.data;
};

export default {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getTrainings,
  createTraining,
  updateTraining,
  deleteTraining,
  toggleTrainingPublish,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllEnrollments,
  updateEnrollmentStatus,
  getAllGalleryImages,
  uploadGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto,
  getAllMessages,
  markMessageAsRead,
  deleteMessage,
};
