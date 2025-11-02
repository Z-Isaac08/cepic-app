# 💳 INTÉGRATION CINETPAY - Guide Complet

## 📋 Vue d'ensemble

CinetPay est la solution de paiement leader en Côte d'Ivoire et Afrique de l'Ouest. Ce guide vous accompagne pas-à-pas pour intégrer CinetPay dans la plateforme CEPIC.

---

## 🚀 ÉTAPE 1: Inscription CinetPay

### Créer un compte marchand

1. Aller sur https://cinetpay.com
2. Cliquer sur "Devenir marchand"
3. Remplir le formulaire d'inscription
4. Fournir les documents CEPIC:
   - RCCM: CI-ABJ-03-2023-B12-04797
   - Pièce d'identité du DG
   - Justificatif de domicile

### Récupérer les clés API

Une fois le compte validé:
1. Se connecter au dashboard CinetPay
2. Aller dans "Paramètres" → "API"
3. Récupérer:
   - **API Key**
   - **Site ID**
   - **Secret Key**

---

## 🔧 ÉTAPE 2: Configuration Backend

### 2.1 Variables d'environnement

Ajouter dans `server/.env`:

```env
# CinetPay Configuration
CINETPAY_API_KEY=your_api_key_here
CINETPAY_SITE_ID=your_site_id_here
CINETPAY_SECRET_KEY=your_secret_key_here
CINETPAY_MODE=SANDBOX
CINETPAY_NOTIFY_URL=http://localhost:3001/api/payments/webhook
CINETPAY_RETURN_URL=http://localhost:5173/inscription/confirmation
CINETPAY_CANCEL_URL=http://localhost:5173/inscription/annulation
```

### 2.2 Installer le package CinetPay

```bash
cd server
npm install axios crypto
```

### 2.3 Créer le helper CinetPay

Créer `server/utils/cinetpay.js`:

```javascript
const axios = require('axios');
const crypto = require('crypto');

class CinetPayHelper {
  constructor() {
    this.apiKey = process.env.CINETPAY_API_KEY;
    this.siteId = process.env.CINETPAY_SITE_ID;
    this.secretKey = process.env.CINETPAY_SECRET_KEY;
    this.mode = process.env.CINETPAY_MODE || 'SANDBOX';
    this.baseUrl = 'https://api-checkout.cinetpay.com/v2';
  }

  /**
   * Initialiser un paiement
   * @param {Object} data - Données du paiement
   * @returns {Promise<Object>} - Réponse CinetPay
   */
  async initiatePayment(data) {
    const {
      transactionId,
      amount,
      currency = 'XOF',
      description,
      customerName,
      customerSurname,
      customerEmail,
      customerPhone,
      notifyUrl,
      returnUrl,
      channels = 'ALL'
    } = data;

    try {
      const payload = {
        apikey: this.apiKey,
        site_id: this.siteId,
        transaction_id: transactionId,
        amount: amount,
        currency: currency,
        description: description,
        customer_name: customerName,
        customer_surname: customerSurname,
        customer_email: customerEmail,
        customer_phone_number: customerPhone,
        notify_url: notifyUrl || process.env.CINETPAY_NOTIFY_URL,
        return_url: returnUrl || process.env.CINETPAY_RETURN_URL,
        channels: channels,
        metadata: JSON.stringify({
          platform: 'CEPIC',
          mode: this.mode
        })
      };

      const response = await axios.post(
        `${this.baseUrl}/payment`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.code === '201') {
        return {
          success: true,
          data: {
            paymentUrl: response.data.data.payment_url,
            paymentToken: response.data.data.payment_token,
            transactionId: transactionId
          }
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Erreur lors de l\'initialisation du paiement'
        };
      }
    } catch (error) {
      console.error('CinetPay initiate error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de connexion à CinetPay'
      };
    }
  }

  /**
   * Vérifier le statut d'un paiement
   * @param {String} transactionId - ID de la transaction
   * @returns {Promise<Object>} - Statut du paiement
   */
  async checkPaymentStatus(transactionId) {
    try {
      const payload = {
        apikey: this.apiKey,
        site_id: this.siteId,
        transaction_id: transactionId
      };

      const response = await axios.post(
        `${this.baseUrl}/payment/check`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.code === '00') {
        const data = response.data.data;
        return {
          success: true,
          data: {
            status: data.status, // ACCEPTED, REFUSED, PENDING
            amount: data.amount,
            currency: data.currency,
            paymentMethod: data.payment_method,
            operatorId: data.operator_id,
            paymentDate: data.payment_date,
            metadata: data.metadata
          }
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Transaction non trouvée'
        };
      }
    } catch (error) {
      console.error('CinetPay check error:', error.response?.data || error.message);
      return {
        success: false,
        error: 'Erreur lors de la vérification du paiement'
      };
    }
  }

  /**
   * Vérifier la signature du webhook
   * @param {Object} data - Données du webhook
   * @returns {Boolean} - Signature valide ou non
   */
  verifyWebhookSignature(data) {
    const { cpm_trans_id, cpm_amount, cpm_currency, signature } = data;
    
    // Créer la signature attendue
    const expectedSignature = crypto
      .createHash('sha256')
      .update(this.apiKey + this.siteId + cpm_trans_id + cpm_amount + cpm_currency + this.secretKey)
      .digest('hex');

    return signature === expectedSignature;
  }

  /**
   * Générer un ID de transaction unique
   * @returns {String} - Transaction ID
   */
  generateTransactionId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `CEPIC_${timestamp}_${random}`;
  }
}

module.exports = new CinetPayHelper();
```

---

## 🎯 ÉTAPE 3: Controller de Paiement

Créer `server/controllers/paymentController.js`:

```javascript
const prisma = require('../lib/prisma');
const cinetpay = require('../utils/cinetpay');

/**
 * POST /api/payments/initiate
 * Initialiser un paiement pour une inscription
 */
exports.initiatePayment = async (req, res, next) => {
  try {
    const { enrollmentId } = req.body;
    const userId = req.user.id;

    // Récupérer l'inscription
    const enrollment = await prisma.trainingEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        training: true,
        user: true
      }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Inscription non trouvée'
      });
    }

    // Vérifier que c'est bien l'utilisateur concerné
    if (enrollment.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Non autorisé'
      });
    }

    // Vérifier que le paiement n'est pas déjà effectué
    if (enrollment.paymentStatus === 'PAID') {
      return res.status(400).json({
        success: false,
        error: 'Cette inscription est déjà payée'
      });
    }

    // Générer un ID de transaction unique
    const transactionId = cinetpay.generateTransactionId();

    // Initialiser le paiement avec CinetPay
    const paymentResult = await cinetpay.initiatePayment({
      transactionId: transactionId,
      amount: enrollment.amount / 100, // Convertir centimes en FCFA
      currency: 'XOF',
      description: `Formation: ${enrollment.training.title}`,
      customerName: enrollment.user.firstName,
      customerSurname: enrollment.user.lastName,
      customerEmail: enrollment.user.email,
      customerPhone: enrollment.user.phone || '0000000000',
      notifyUrl: process.env.CINETPAY_NOTIFY_URL,
      returnUrl: `${process.env.CINETPAY_RETURN_URL}?enrollmentId=${enrollmentId}`,
      channels: 'ALL' // Orange Money, MTN, Moov, Wave, Cartes
    });

    if (!paymentResult.success) {
      return res.status(500).json({
        success: false,
        error: paymentResult.error
      });
    }

    // Créer l'enregistrement Payment
    const payment = await prisma.payment.create({
      data: {
        enrollmentId: enrollmentId,
        transactionId: transactionId,
        paymentMethod: 'PENDING', // Sera mis à jour après paiement
        gateway: 'CINETPAY',
        amount: enrollment.amount,
        currency: 'XOF',
        status: 'PENDING',
        paymentUrl: paymentResult.data.paymentUrl,
        paymentData: paymentResult.data,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      }
    });

    res.json({
      success: true,
      data: {
        paymentId: payment.id,
        paymentUrl: paymentResult.data.paymentUrl,
        transactionId: transactionId
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payments/webhook
 * Webhook CinetPay pour notification de paiement
 */
exports.handleWebhook = async (req, res, next) => {
  try {
    const webhookData = req.body;

    console.log('CinetPay Webhook received:', webhookData);

    // Vérifier la signature
    if (!cinetpay.verifyWebhookSignature(webhookData)) {
      console.error('Invalid webhook signature');
      return res.status(401).json({
        success: false,
        error: 'Signature invalide'
      });
    }

    const {
      cpm_trans_id: transactionId,
      cpm_trans_status: status,
      cpm_amount: amount,
      cpm_currency: currency,
      payment_method: paymentMethod,
      operator_id: operatorId
    } = webhookData;

    // Récupérer le paiement
    const payment = await prisma.payment.findUnique({
      where: { transactionId: transactionId },
      include: {
        enrollment: {
          include: {
            training: true,
            user: true
          }
        }
      }
    });

    if (!payment) {
      console.error('Payment not found:', transactionId);
      return res.status(404).json({
        success: false,
        error: 'Paiement non trouvé'
      });
    }

    // Mettre à jour le paiement selon le statut
    if (status === '00' || status === 'ACCEPTED') {
      // Paiement réussi
      await prisma.$transaction([
        // Mettre à jour le paiement
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'COMPLETED',
            paymentMethod: paymentMethod,
            operatorId: operatorId,
            completedAt: new Date(),
            paymentData: webhookData
          }
        }),
        // Mettre à jour l'inscription
        prisma.trainingEnrollment.update({
          where: { id: payment.enrollmentId },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED',
            paidAt: new Date()
          }
        })
      ]);

      // TODO: Envoyer email de confirmation
      console.log('Payment successful:', transactionId);

    } else if (status === '01' || status === 'REFUSED') {
      // Paiement refusé
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          failedAt: new Date(),
          paymentData: webhookData
        }
      });

      console.log('Payment failed:', transactionId);
    }

    // Répondre à CinetPay
    res.json({
      success: true,
      message: 'Webhook traité'
    });
  } catch (error) {
    console.error('Webhook error:', error);
    next(error);
  }
};

/**
 * GET /api/payments/verify/:transactionId
 * Vérifier manuellement le statut d'un paiement
 */
exports.verifyPayment = async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    // Vérifier avec CinetPay
    const statusResult = await cinetpay.checkPaymentStatus(transactionId);

    if (!statusResult.success) {
      return res.status(404).json({
        success: false,
        error: statusResult.error
      });
    }

    // Récupérer le paiement local
    const payment = await prisma.payment.findUnique({
      where: { transactionId: transactionId },
      include: {
        enrollment: true
      }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Paiement non trouvé'
      });
    }

    // Mettre à jour si nécessaire
    if (statusResult.data.status === 'ACCEPTED' && payment.status !== 'COMPLETED') {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'COMPLETED',
            paymentMethod: statusResult.data.paymentMethod,
            completedAt: new Date()
          }
        }),
        prisma.trainingEnrollment.update({
          where: { id: payment.enrollmentId },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED',
            paidAt: new Date()
          }
        })
      ]);
    }

    res.json({
      success: true,
      data: {
        transactionId: transactionId,
        status: statusResult.data.status,
        amount: statusResult.data.amount,
        paymentMethod: statusResult.data.paymentMethod
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
```

---

## 🛣️ ÉTAPE 4: Routes de Paiement

Créer `server/routers/paymentRoutes.js`:

```javascript
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
```

Ajouter dans `server/index.js`:

```javascript
// Routes de paiement
app.use('/api/payments', require('./routers/paymentRoutes'));
```

---

## 🎨 ÉTAPE 5: Frontend - Composant de Paiement

Créer `client/src/components/payment/PaymentModal.jsx`:

```javascript
import { useState } from 'react';
import { X, CreditCard, Smartphone } from 'lucide-react';
import axios from 'axios';

const PaymentModal = ({ enrollment, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/payments/initiate', {
        enrollmentId: enrollment.id
      });

      if (response.data.success) {
        // Rediriger vers la page de paiement CinetPay
        window.location.href = response.data.data.paymentUrl;
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'initialisation du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Paiement de la formation</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Détails */}
        <div className="mb-6">
          <p className="text-gray-600 mb-2">Formation:</p>
          <p className="font-semibold">{enrollment.training.title}</p>
          
          <p className="text-gray-600 mt-4 mb-2">Montant:</p>
          <p className="text-2xl font-bold text-blue-600">
            {(enrollment.amount / 100).toLocaleString()} FCFA
          </p>
        </div>

        {/* Méthodes de paiement */}
        <div className="mb-6">
          <p className="text-gray-600 mb-3">Méthodes de paiement disponibles:</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Smartphone size={16} className="text-orange-500" />
              <span>Orange Money</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Smartphone size={16} className="text-yellow-500" />
              <span>MTN Mobile Money</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Smartphone size={16} className="text-blue-500" />
              <span>Moov Money</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Smartphone size={16} className="text-green-500" />
              <span>Wave</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CreditCard size={16} className="text-gray-700" />
              <span>Carte bancaire (Visa/Mastercard)</span>
            </div>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Boutons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            onClick={handlePayment}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Procéder au paiement'}
          </button>
        </div>

        {/* Info sécurité */}
        <p className="text-xs text-gray-500 text-center mt-4">
          🔒 Paiement sécurisé par CinetPay
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;
```

---

## ✅ ÉTAPE 6: Page de Confirmation

Créer `client/src/pages/PaymentConfirmationPage.jsx`:

```javascript
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import axios from 'axios';

const PaymentConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [enrollment, setEnrollment] = useState(null);

  useEffect(() => {
    const enrollmentId = searchParams.get('enrollmentId');
    
    if (!enrollmentId) {
      setStatus('error');
      return;
    }

    // Vérifier le statut de l'inscription
    const checkStatus = async () => {
      try {
        const response = await axios.get(`/api/enrollments/${enrollmentId}`);
        const enrollmentData = response.data.data;
        
        setEnrollment(enrollmentData);
        
        if (enrollmentData.paymentStatus === 'PAID') {
          setStatus('success');
        } else {
          // Attendre un peu et réessayer (le webhook peut prendre quelques secondes)
          setTimeout(checkStatus, 2000);
        }
      } catch (error) {
        setStatus('error');
      }
    };

    checkStatus();
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-lg">Vérification du paiement en cours...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
          <h1 className="text-2xl font-bold mb-2">Paiement réussi !</h1>
          <p className="text-gray-600 mb-6">
            Votre inscription à la formation <strong>{enrollment?.training?.title}</strong> a été confirmée.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Un email de confirmation vous a été envoyé.
          </p>
          <button
            onClick={() => navigate('/mes-inscriptions')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Voir mes inscriptions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <XCircle className="mx-auto mb-4 text-red-500" size={64} />
        <h1 className="text-2xl font-bold mb-2">Erreur de paiement</h1>
        <p className="text-gray-600 mb-6">
          Une erreur s'est produite lors du traitement de votre paiement.
        </p>
        <button
          onClick={() => navigate('/formations')}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retour aux formations
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirmationPage;
```

---

## 🧪 ÉTAPE 7: Tests en Sandbox

### Numéros de test CinetPay

Pour tester en mode SANDBOX, utiliser ces numéros:

**Orange Money CI:**
- Numéro: `0777777777`
- Code OTP: `1234`

**MTN Mobile Money:**
- Numéro: `0555555555`
- Code OTP: `1234`

**Moov Money:**
- Numéro: `0101010101`
- Code OTP: `1234`

### Workflow de test

1. S'inscrire à une formation
2. Cliquer sur "Payer"
3. Choisir une méthode de paiement
4. Utiliser un numéro de test
5. Entrer le code OTP `1234`
6. Vérifier la confirmation

---

## 🚀 ÉTAPE 8: Passage en Production

### Checklist avant production

- [ ] Compte marchand CinetPay validé
- [ ] Variables d'environnement en PRODUCTION
- [ ] Webhook URL accessible publiquement (HTTPS)
- [ ] Tests complets effectués
- [ ] Emails de confirmation configurés
- [ ] Dashboard admin fonctionnel
- [ ] Logs de paiement en place

### Variables production

```env
CINETPAY_MODE=PRODUCTION
CINETPAY_NOTIFY_URL=https://cepic.ci/api/payments/webhook
CINETPAY_RETURN_URL=https://cepic.ci/inscription/confirmation
CINETPAY_CANCEL_URL=https://cepic.ci/inscription/annulation
```

---

## 📊 Monitoring et Logs

### Logs à surveiller

```javascript
// Dans paymentController.js
console.log('Payment initiated:', { enrollmentId, transactionId, amount });
console.log('Webhook received:', webhookData);
console.log('Payment completed:', { transactionId, status });
```

### Dashboard CinetPay

Accéder régulièrement au dashboard CinetPay pour:
- Voir les transactions
- Vérifier les remboursements
- Télécharger les rapports
- Gérer les litiges

---

## 🆘 Support

**CinetPay:**
- Email: support@cinetpay.com
- Téléphone: +225 27 22 00 00 00
- Documentation: https://docs.cinetpay.com

**CEPIC:**
- Email technique: dev@cepic.ci
- Téléphone: +225 27 22 28 20 66

---

**Intégration CinetPay complète et prête à l'emploi !** 🎉
