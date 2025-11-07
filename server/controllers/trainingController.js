const prisma = require('../lib/prisma');

// GET /api/trainings - Liste des formations
exports.getAllTrainings = async (req, res, next) => {
  try {
    const {
      category,
      categoryId,
      search,
      featured,
      deliveryMode,
      isFree,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const where = {
      isPublished: true,
    };

    // Filtre par slug de catégorie
    if (category) {
      where.category = { slug: category };
    }

    // Filtre par ID de catégorie
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Recherche textuelle (moins stricte - cherche dans plusieurs champs)
    if (search) {
      const searchTerms = search.trim().split(/\s+/); // Séparer les mots

      where.OR = [
        // Recherche dans le titre
        { title: { contains: search, mode: 'insensitive' } },
        // Recherche dans la description
        { description: { contains: search, mode: 'insensitive' } },
        // Recherche dans les objectifs
        { objectives: { contains: search, mode: 'insensitive' } },
        // Recherche dans le contenu
        { content: { contains: search, mode: 'insensitive' } },
        // Recherche dans la catégorie
        {
          category: {
            name: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    // Filtre featured
    if (featured === 'true') {
      where.isFeatured = true;
    }

    // Filtre mode de formation
    if (deliveryMode) {
      where.deliveryMode = deliveryMode;
    }

    // Filtre gratuit/payant
    if (isFree === 'true') {
      where.isFree = true;
    } else if (isFree === 'false') {
      where.isFree = false;
    }

    // Filtre prix minimum
    if (minPrice) {
      where.cost = { ...where.cost, gte: parseFloat(minPrice) };
    }

    // Filtre prix maximum
    if (maxPrice) {
      where.cost = { ...where.cost, lte: parseFloat(maxPrice) };
    }

    // Construire l'orderBy
    const orderByField = sortBy || 'createdAt';
    const orderByDirection = sortOrder || 'desc';
    const orderBy = { [orderByField]: orderByDirection };

    const trainings = await prisma.training.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: { enrollments_rel: true, reviews: true },
        },
      },
      orderBy,
    });

    // Ajouter isBookmarked pour chaque formation si utilisateur connecté
    let trainingsWithBookmarks = trainings;
    if (req.user) {
      const userBookmarks = await prisma.trainingBookmark.findMany({
        where: { userId: req.user.id },
        select: { trainingId: true },
      });

      const bookmarkedIds = new Set(userBookmarks.map((b) => b.trainingId));

      trainingsWithBookmarks = trainings.map((training) => ({
        ...training,
        isBookmarked: bookmarkedIds.has(training.id),
      }));
    }

    res.json({
      success: true,
      data: trainingsWithBookmarks,
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
          select: { firstName: true, lastName: true },
        },
        reviews: {
          where: { isPublic: true },
          include: {
            user: {
              select: { firstName: true, lastName: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        sessions: {
          where: {
            status: 'SCHEDULED',
            startDate: { gte: new Date() },
          },
          orderBy: { startDate: 'asc' },
        },
      },
    });

    if (!training) {
      return res.status(404).json({
        success: false,
        error: 'Formation non trouvée',
      });
    }

    // Incrémenter les vues
    await prisma.training.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    // Vérifier si l'utilisateur a mis en favoris (si connecté)
    let isBookmarked = false;
    if (req.user) {
      const bookmark = await prisma.trainingBookmark.findUnique({
        where: {
          userId_trainingId: {
            userId: req.user.id,
            trainingId: id,
          },
        },
      });
      isBookmarked = !!bookmark;
    }

    res.json({
      success: true,
      data: {
        ...training,
        isBookmarked,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/trainings/categories - Liste des catégories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.trainingCategory.findMany({
      include: {
        _count: {
          select: {
            trainings: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    });

    res.json({
      success: true,
      data: categories,
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
        userId_trainingId: { userId, trainingId: id },
      },
    });

    if (existing) {
      await prisma.trainingBookmark.delete({
        where: { id: existing.id },
      });
      return res.json({
        success: true,
        message: 'Retiré des favoris',
        bookmarked: false,
      });
    }

    await prisma.trainingBookmark.create({
      data: { userId, trainingId: id },
    });

    res.json({
      success: true,
      message: 'Ajouté aux favoris',
      bookmarked: true,
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
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: bookmarks,
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
        userId_trainingId: { userId, trainingId: id },
      },
    });

    if (!enrollment || enrollment.status !== 'COMPLETED') {
      return res.status(403).json({
        success: false,
        error: 'Vous devez avoir terminé la formation pour laisser un avis',
      });
    }

    const review = await prisma.trainingReview.upsert({
      where: {
        userId_trainingId: { userId, trainingId: id },
      },
      update: { rating, comment },
      create: {
        userId,
        trainingId: id,
        rating,
        comment,
      },
    });

    // Mettre à jour la note moyenne
    const avgRating = await prisma.trainingReview.aggregate({
      where: { trainingId: id },
      _avg: { rating: true },
    });

    await prisma.training.update({
      where: { id },
      data: { rating: avgRating._avg.rating },
    });

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/trainings - Créer une formation (ADMIN)
exports.createTraining = async (req, res, next) => {
  try {
    console.log('=== REQUEST BODY ===');
    console.log(JSON.stringify(req.body, null, 2));
    console.log('===================');

    // Vérification de l'utilisateur
    console.log('User ID from request:', req.user?.id);
    if (!req.user?.id) {
      console.error('No user ID found in request');
      return res.status(401).json({
        success: false,
        error: 'Authentification requise',
      });
    }
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
      price,
      capacity,
      schedule,
      startDate,
      endDate,
      instructor,
      categoryId,
      tags,
      isPublished,
      isFeatured,
    } = req.body;

    // Validation des champs obligatoires
    if (!title || !slug || !categoryId) {
      console.error('Missing required fields:', {
        hasTitle: !!title,
        hasSlug: !!slug,
        hasCategoryId: !!categoryId,
      });
      return res.status(400).json({
        success: false,
        error: 'Champs obligatoires manquants',
        details: {
          title: !title ? 'Le titre est requis' : undefined,
          slug: !slug ? 'Le slug est requis' : undefined,
          categoryId: !categoryId ? 'La catégorie est requise' : undefined,
        },
      });
    }

    try {
      console.log('Attempting to create training with data:', {
        title: title,
        slug: slug,
        categoryId: categoryId,
        createdBy: req.user.id,
        duration: duration,
        price: price,
      });

      const training = await prisma.training.create({
        data: {
          title,
          slug,
          description,
          objectives: objectives || [],
          prerequisites: prerequisites || [],
          targetAudience,
          program,
          coverImage: coverImage || null,
          duration,
          price: price || 0,
          capacity: capacity || 20,
          instructor: instructor || null,
          schedule: schedule || null,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          categoryId,
          tags: tags || [],
          isPublished: isPublished || false,
          isFeatured: isFeatured || false,
          createdBy: req.user.id,
        },
        include: {
          category: true,
        },
      });

      res.status(201).json({
        success: true,
        data: training,
        message: 'Formation créée avec succès',
      });
    } catch (error) {
      console.error('Error creating training:', error);
      if (error.code === 'P2002') {
        // Prisma unique constraint error
        return res.status(400).json({
          success: false,
          error: 'Une formation avec ce slug existe déjà',
        });
      }
      next(error);
    }
  } catch (error) {
    console.error('Unexpected error in createTraining:', error);
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
        category: true,
      },
    });

    res.json({
      success: true,
      data: training,
      message: 'Formation mise à jour',
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/trainings/:id/toggle-publish - Publier/Dépublier une formation (ADMIN)
exports.togglePublish = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Vérifier si la formation existe
    const training = await prisma.training.findUnique({
      where: { id },
    });

    if (!training) {
      return res.status(404).json({
        success: false,
        error: 'Formation non trouvée',
      });
    }

    // Inverser le statut de publication
    const updatedTraining = await prisma.training.update({
      where: { id },
      data: {
        isPublished: !training.isPublished,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedTraining,
    });
  } catch (error) {
    console.error('Error toggling training publish status:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du changement de statut de publication',
    });
  }
};

// DELETE /api/trainings/:id - Supprimer une formation (ADMIN)
exports.deleteTraining = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Vérifier s'il y a des inscriptions
    const enrollmentCount = await prisma.trainingEnrollment.count({
      where: { trainingId: id },
    });

    if (enrollmentCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Impossible de supprimer cette formation. ${enrollmentCount} inscription(s) existe(nt).`,
      });
    }

    await prisma.training.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Formation supprimée',
    });
  } catch (error) {
    next(error);
  }
};
