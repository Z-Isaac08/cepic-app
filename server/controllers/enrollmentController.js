const prisma = require('../lib/prisma');

// POST /api/enrollments - Créer une inscription
exports.createEnrollment = async (req, res, next) => {
  try {
    const { trainingId } = req.body;
    const userId = req.user.id;

    // Vérifier que la formation existe
    const training = await prisma.training.findUnique({
      where: { id: trainingId }
    });

    if (!training) {
      return res.status(404).json({
        success: false,
        error: 'Formation non trouvée'
      });
    }

    if (!training.isPublished || !training.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Cette formation n\'est pas disponible'
      });
    }

    // Vérifier si déjà inscrit
    const existing = await prisma.trainingEnrollment.findUnique({
      where: {
        userId_trainingId: { userId, trainingId }
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Vous êtes déjà inscrit à cette formation'
      });
    }

    // Créer l'inscription
    const enrollment = await prisma.trainingEnrollment.create({
      data: {
        userId,
        trainingId,
        amount: training.cost,
        status: 'PENDING',
        paymentStatus: 'UNPAID'
      },
      include: {
        training: {
          include: {
            category: true
          }
        }
      }
    });

    // Incrémenter le compteur d'inscriptions
    await prisma.training.update({
      where: { id: trainingId },
      data: { enrollments: { increment: 1 } }
    });

    res.status(201).json({
      success: true,
      data: enrollment,
      message: 'Inscription créée avec succès. Procédez au paiement pour confirmer.'
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/enrollments - Mes inscriptions
exports.getMyEnrollments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const where = { userId };
    if (status) {
      where.status = status;
    }

    const enrollments = await prisma.trainingEnrollment.findMany({
      where,
      include: {
        training: {
          include: {
            category: true
          }
        },
        payment: true
      },
      orderBy: { enrolledAt: 'desc' }
    });

    res.json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/enrollments/:id - Détail inscription
exports.getEnrollmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const enrollment = await prisma.trainingEnrollment.findUnique({
      where: { id },
      include: {
        training: {
          include: {
            category: true
          }
        },
        payment: true,
        user: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Inscription non trouvée'
      });
    }

    // Vérifier que c'est bien l'utilisateur ou un admin
    if (enrollment.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Non autorisé'
      });
    }

    res.json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/enrollments/:id/cancel - Annuler une inscription
exports.cancelEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const enrollment = await prisma.trainingEnrollment.findUnique({
      where: { id }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Inscription non trouvée'
      });
    }

    if (enrollment.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Non autorisé'
      });
    }

    if (enrollment.paymentStatus === 'PAID') {
      return res.status(400).json({
        success: false,
        error: 'Impossible d\'annuler une inscription déjà payée. Contactez l\'administration.'
      });
    }

    const updated = await prisma.trainingEnrollment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date()
      }
    });

    res.json({
      success: true,
      data: updated,
      message: 'Inscription annulée'
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/enrollments/:id/complete - Marquer comme complétée (ADMIN)
exports.completeEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enrollment = await prisma.trainingEnrollment.findUnique({
      where: { id }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Inscription non trouvée'
      });
    }

    if (enrollment.paymentStatus !== 'PAID') {
      return res.status(400).json({
        success: false,
        error: 'Le paiement doit être confirmé avant de marquer comme complété'
      });
    }

    const updated = await prisma.trainingEnrollment.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });

    res.json({
      success: true,
      data: updated,
      message: 'Formation marquée comme complétée'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
