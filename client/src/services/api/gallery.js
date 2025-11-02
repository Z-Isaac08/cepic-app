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
// GALLERY
// ============================================

/**
 * Récupérer toutes les photos de la galerie
 * @param {Object} params - Paramètres de filtrage (category, etc.)
 * @returns {Promise}
 */
export const getAllPhotos = async (params = {}) => {
  const response = await api.get('/gallery', { params });
  return response.data;
};

/**
 * Récupérer une photo par ID
 * @param {string} id - ID de la photo
 * @returns {Promise}
 */
export const getPhotoById = async (id) => {
  const response = await api.get(`/gallery/${id}`);
  return response.data;
};

/**
 * Uploader une nouvelle photo (ADMIN)
 * @param {FormData} formData - Données de la photo avec fichier
 * @returns {Promise}
 */
export const uploadPhoto = async (formData) => {
  const response = await api.post('/gallery', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

/**
 * Modifier une photo (ADMIN)
 * @param {string} id - ID de la photo
 * @param {Object} photoData - Données à modifier
 * @returns {Promise}
 */
export const updatePhoto = async (id, photoData) => {
  const response = await api.put(`/gallery/${id}`, photoData);
  return response.data;
};

/**
 * Supprimer une photo (ADMIN)
 * @param {string} id - ID de la photo
 * @returns {Promise}
 */
export const deletePhoto = async (id) => {
  const response = await api.delete(`/gallery/${id}`);
  return response.data;
};

export default {
  getAllPhotos,
  getPhotoById,
  uploadPhoto,
  updatePhoto,
  deletePhoto
};
