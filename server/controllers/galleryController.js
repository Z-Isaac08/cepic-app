const prisma = require('../lib/prisma');

// GET /api/gallery - Liste des photos
exports.getAllPhotos = async (req, res, next) => {
  try {
    const { category } = req.query;

    const where = { isActive: true };
    if (category) {
      where.category = category;
    }

    const photos = await prisma.galleryPhoto.findMany({
      where,
      orderBy: { order: 'asc' }
    });

    res.json({
      success: true,
      data: photos
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/gallery - Ajouter une photo (ADMIN)
exports.addPhoto = async (req, res, next) => {
  try {
    const { title, description, imageUrl, category, order } = req.body;
    const uploadedBy = req.user.id;

    const photo = await prisma.galleryPhoto.create({
      data: {
        title,
        description,
        imageUrl,
        category,
        order: order || 0,
        uploadedBy
      }
    });

    res.status(201).json({
      success: true,
      data: photo
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/gallery/:id - Supprimer une photo (ADMIN)
exports.deletePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.galleryPhoto.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Photo supprimée'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
