const prisma = require('../lib/prisma');
const cinetpay = require('../utils/cinetpay');

/**
 * POST /api/payments/initiate
 * Initialiser un paiement pour une inscription
 */
exports.initiatePayment = async (req, res, next) => {
  try {
    const { enrollmentId, phone, isSimulation } = req.body;
    const userId = req.user.id;

    // Récupérer l'inscription
    const enrollment = await prisma.trainingEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        training: true,
        user: true,
      },
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Inscription non trouvée',
      });
    }

    // Vérifier que c'est bien l'utilisateur concerné
    if (enrollment.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Non autorisé',
      });
    }

    // Vérifier que le paiement n'est pas déjà effectué
    if (enrollment.paymentStatus === 'PAID') {
      return res.status(400).json({
        success: false,
        error: 'Cette inscription est déjà payée',
      });
    }

    // Générer un ID de transaction unique
    const transactionId = cinetpay.generateTransactionId();

    // MODE SIMULATION
    if (isSimulation) {
      // Créer le paiement directement comme COMPLETED
      const payment = await prisma.payment.create({
        data: {
          enrollmentId: enrollmentId,
          userId: userId,
          transactionId: transactionId,
          paymentMethod: 'SIMULATION',
          gateway: 'SIMULATOR',
          amount: enrollment.amount,
          currency: 'XOF',
          status: 'COMPLETED',
          paymentUrl: null,
          paymentData: { simulated: true, date: new Date() },
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          completedAt: new Date(),
        },
      });

      // Mettre à jour l'inscription
      await prisma.trainingEnrollment.update({
        where: { id: enrollmentId },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          paidAt: new Date(),
        },
      });

      return res.json({
        success: true,
        data: {
          paymentId: payment.id,
          paymentUrl: null, // Pas d'URL de redirection pour la simulation
          transactionId: transactionId,
          isSimulation: true,
        },
      });
    }

    // Initialiser le paiement avec CinetPay
    const paymentResult = await cinetpay.initiatePayment({
      transactionId: transactionId,
      amount: enrollment.amount, // Montant en FCFA
      currency: 'XOF',
      description: `Formation: ${enrollment.training.title}`,
      customerName: enrollment.user.firstName,
      customerSurname: enrollment.user.lastName,
      customerEmail: enrollment.user.email,
      customerPhone: phone || '0000000000',
      notifyUrl: process.env.CINETPAY_NOTIFY_URL,
      returnUrl: `${process.env.CINETPAY_RETURN_URL}?enrollmentId=${enrollmentId}`,
      channels: 'ALL', // Orange Money, MTN, Moov, Wave, Cartes
    });

    if (!paymentResult.success) {
      return res.status(500).json({
        success: false,
        error: paymentResult.error,
      });
    }

    // Créer l'enregistrement Payment
    const payment = await prisma.payment.create({
      data: {
        enrollmentId: enrollmentId,
        userId: userId,
        transactionId: transactionId,
        paymentMethod: 'PENDING', // Sera mis à jour après paiement
        gateway: 'CINETPAY',
        amount: enrollment.amount,
        currency: 'XOF',
        status: 'PENDING',
        paymentUrl: paymentResult.data.paymentUrl,
        paymentData: paymentResult.data,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    res.json({
      success: true,
      data: {
        paymentId: payment.id,
        paymentUrl: paymentResult.data.paymentUrl,
        transactionId: transactionId,
      },
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
        error: 'Signature invalide',
      });
    }

    const {
      cpm_trans_id: transactionId,
      cpm_trans_status: status,
      cpm_amount: amount,
      cpm_currency: currency,
      payment_method: paymentMethod,
      operator_id: operatorId,
    } = webhookData;

    // Récupérer le paiement
    const payment = await prisma.payment.findUnique({
      where: { transactionId: transactionId },
      include: {
        enrollment: {
          include: {
            training: true,
            user: true,
          },
        },
      },
    });

    if (!payment) {
      console.error('Payment not found:', transactionId);
      return res.status(404).json({
        success: false,
        error: 'Paiement non trouvé',
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
            paymentData: webhookData,
          },
        }),
        // Mettre à jour l'inscription
        prisma.trainingEnrollment.update({
          where: { id: payment.enrollmentId },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED',
            paidAt: new Date(),
          },
        }),
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
          paymentData: webhookData,
        },
      });

      console.log('Payment failed:', transactionId);
    }

    // Répondre à CinetPay
    res.json({
      success: true,
      message: 'Webhook traité',
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
        error: statusResult.error,
      });
    }

    // Récupérer le paiement local
    const payment = await prisma.payment.findUnique({
      where: { transactionId: transactionId },
      include: {
        enrollment: true,
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Paiement non trouvé',
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
            completedAt: new Date(),
          },
        }),
        prisma.trainingEnrollment.update({
          where: { id: payment.enrollmentId },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED',
            paidAt: new Date(),
          },
        }),
      ]);
    }

    res.json({
      success: true,
      data: {
        transactionId: transactionId,
        status: statusResult.data.status,
        amount: statusResult.data.amount,
        paymentMethod: statusResult.data.paymentMethod,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
