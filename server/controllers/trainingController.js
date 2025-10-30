const prisma = require('../lib/prisma');

// GET /api/trainings - Liste des formations
exports.getAllTrainings = async (req, res, next) => {
  try {
    const { category, search, featured } = req.query;
    
    const where = {
      isPublished: true,
      isActive: true
    };

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const trainings = await prisma.training.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: { enrollments_rel: true, reviews: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: trainings
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/trainings/:id - Détail formation
exports.getTrainingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const training = await prisma.training.findUnique({
      where: { id },
      include: {
        category: true,
        creator: {
          select: { firstName: true, lastName: true }
        },
        reviews: {
          where: { isPublic: true },
          include: {
            user: {
              select: { firstName: true, lastName: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        sessions: {
          where: {
            status: 'SCHEDULED',
            startDate: { gte: new Date() }
          },
          orderBy: { startDate: 'asc' }
        }
      }
    });

    if (!training) {
      return res.status(404).json({
        success: false,
        error: 'Formation non trouvée'
      });
    }

    // Incrémenter les vues
    await prisma.training.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    res.json({
      success: true,
      data: training
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/trainings/categories - Liste des catégories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.trainingCategory.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { 
            trainings: {
              where: {
                isPublished: true,
                isActive: true
              }
            }
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/trainings/:id/bookmark - Ajouter/Retirer des favoris
exports.toggleBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await prisma.trainingBookmark.findUnique({
      where: {
        userId_trainingId: { userId, trainingId: id }
      }
    });

    if (existing) {
      await prisma.trainingBookmark.delete({
        where: { id: existing.id }
      });
      return res.json({
        success: true,
        message: 'Retiré des favoris',
        bookmarked: false
      });
    }

    await prisma.trainingBookmark.create({
      data: { userId, trainingId: id }
    });

    res.json({
      success: true,
      message: 'Ajouté aux favoris',
      bookmarked: true
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/trainings/bookmarks - Mes favoris
exports.getMyBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const bookmarks = await prisma.trainingBookmark.findMany({
      where: { userId },
      include: {
        training: {
          include: {
            category: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: bookmarks
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/trainings/:id/review - Ajouter un avis
exports.addReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Vérifier que l'utilisateur a suivi la formation
    const enrollment = await prisma.trainingEnrollment.findUnique({
      where: {
        userId_trainingId: { userId, trainingId: id }
      }
    });

    if (!enrollment || enrollment.status !== 'COMPLETED') {
      return res.status(403).json({
        success: false,
        error: 'Vous devez avoir terminé la formation pour laisser un avis'
      });
    }

    const review = await prisma.trainingReview.upsert({
      where: {
        userId_trainingId: { userId, trainingId: id }
      },
      update: { rating, comment },
      create: {
        userId,
        trainingId: id,
        rating,
        comment
      }
    });

    // Mettre à jour la note moyenne
    const avgRating = await prisma.trainingReview.aggregate({
      where: { trainingId: id },
      _avg: { rating: true }
    });

    await prisma.training.update({
      where: { id },
      data: { rating: avgRating._avg.rating }
    });

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/trainings - Créer une formation (ADMIN)
exports.createTraining = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      description,
      objectives,
      prerequisites,
      targetAudience,
      program,
      coverImage,
      duration,
      durationUnit,
      cost,
      originalCost,
      isFree,
      deliveryMode,
      location,
      maxParticipants,
      minParticipants,
      schedule,
      startDate,
      endDate,
      instructor,
      instructorBio,
      instructorPhoto,
      categoryId,
      tags,
      isPublished,
      isFeatured
    } = req.body;

    const training = await prisma.training.create({
      data: {
        title,
        slug,
        description,
        objectives: objectives || [],
        prerequisites: prerequisites || [],
        targetAudience,
        program,
        coverImage,
        duration,
        durationUnit: durationUnit || 'hours',
        cost,
        originalCost,
        isFree: isFree || false,
        deliveryMode: deliveryMode || 'PRESENTIAL',
        location,
        maxParticipants,
        minParticipants,
        schedule,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        instructor,
        instructorBio,
        instructorPhoto,
        categoryId,
        tags: tags || [],
        isPublished: isPublished || false,
        isFeatured: isFeatured || false,
        createdBy: req.user.id
      },
      include: {
        category: true
      }
    });

    res.status(201).json({
      success: true,
      data: training,
      message: 'Formation créée avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/trainings/:id - Modifier une formation (ADMIN)
exports.updateTraining = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Convertir les dates si présentes
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    // Retirer les champs non modifiables
    delete updateData.id;
    delete updateData.createdBy;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const training = await prisma.training.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    });

    res.json({
      success: true,
      data: training,
      message: 'Formation mise à jour'
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/trainings/:id - Supprimer une formation (ADMIN)
exports.deleteTraining = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Vérifier s'il y a des inscriptions
    const enrollmentCount = await prisma.trainingEnrollment.count({
      where: { trainingId: id }
    });

    if (enrollmentCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Impossible de supprimer cette formation. ${enrollmentCount} inscription(s) existe(nt).`
      });
    }

    await prisma.training.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Formation supprimée'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
