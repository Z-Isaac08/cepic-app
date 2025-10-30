const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

// Initialiser un paiement (protégé)
router.post('/initiate', authenticate, paymentController.initiatePayment);

// Webhook CinetPay (public, mais vérifié par signature)
router.post('/webhook', paymentController.handleWebhook);

// Vérifier un paiement (protégé)
router.get('/verify/:transactionId', authenticate, paymentController.verifyPayment);

module.exports = router;
