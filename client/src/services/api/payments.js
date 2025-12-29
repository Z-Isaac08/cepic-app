import api from '../apiConfig';

// ============================================
// PAIEMENTS CINETPAY
// ============================================

/**
 * Initialiser un paiement CinetPay
 * @param {string} enrollmentId - ID de l'inscription
 * @returns {Promise}
 */
export const initiatePayment = async (enrollmentId, paymentData = {}) => {
  const response = await api.post('/payments/initiate', { enrollmentId, ...paymentData });
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
  verifyPayment,
};
