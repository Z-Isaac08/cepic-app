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
// PAIEMENTS CINETPAY
// ============================================

/**
 * Initialiser un paiement CinetPay
 * @param {string} enrollmentId - ID de l'inscription
 * @returns {Promise}
 */
export const initiatePayment = async (enrollmentId) => {
  const response = await api.post('/payments/initiate', { enrollmentId });
  return response.data;
};

/**
 * Vérifier le statut d'un paiement
 * @param {string} transactionId - ID de la transaction CinetPay
 * @returns {Promise}
 */
export const verifyPayment = async (transactionId) => {
  const response = await api.get(`/payments/verify/${transactionId}`);
  return response.data;
};

export default {
  initiatePayment,
  verifyPayment
};
