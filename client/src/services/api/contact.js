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

// ============================================
// CONTACT
// ============================================

/**
 * Envoyer un message de contact
 * @param {Object} messageData - Données du message
 * @param {string} messageData.name - Nom
 * @param {string} messageData.email - Email
 * @param {string} messageData.phone - Téléphone (optionnel)
 * @param {string} messageData.subject - Sujet
 * @param {string} messageData.message - Message
 * @returns {Promise}
 */
export const sendMessage = async (messageData) => {
  const response = await api.post('/contact', messageData);
  return response.data;
};

/**
 * Récupérer tous les messages (ADMIN)
 * @param {Object} params - Paramètres de filtrage
 * @returns {Promise}
 */
export const getAllMessages = async (params = {}) => {
  const response = await api.get('/contact/messages', { params });
  return response.data;
};

/**
 * Récupérer un message par ID (ADMIN)
 * @param {string} id - ID du message
 * @returns {Promise}
 */
export const getMessageById = async (id) => {
  const response = await api.get(`/contact/messages/${id}`);
  return response.data;
};

/**
 * Mettre à jour le statut d'un message (ADMIN)
 * @param {string} id - ID du message
 * @param {string} status - Nouveau statut (NEW, READ, REPLIED)
 * @returns {Promise}
 */
export const updateMessageStatus = async (id, status) => {
  const response = await api.patch(`/contact/messages/${id}`, { status });
  return response.data;
};

/**
 * Supprimer un message (ADMIN)
 * @param {string} id - ID du message
 * @returns {Promise}
 */
export const deleteMessage = async (id) => {
  const response = await api.delete(`/contact/messages/${id}`);
  return response.data;
};

export default {
  sendMessage,
  getAllMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage
};
