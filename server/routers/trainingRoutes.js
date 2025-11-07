const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');
const { authenticate, authorize } = require('../middleware/auth');

// Routes publiques
router.get('/', trainingController.getAllTrainings);
router.get('/categories', trainingController.getCategories);

// Routes protégées (avant /:id pour éviter les conflits)
router.get('/bookmarks/me', authenticate, trainingController.getMyBookmarks);

// Routes ADMIN - Gestion des formations
router.post('/', authenticate, authorize('ADMIN'), trainingController.createTraining);
router.put('/:id', authenticate, authorize('ADMIN'), trainingController.updateTraining);
router.delete('/:id', authenticate, authorize('ADMIN'), trainingController.deleteTraining);
router.patch('/:id/toggle-publish', authenticate, authorize('ADMIN'), trainingController.togglePublish);

// Routes publiques avec ID
router.get('/:id', trainingController.getTrainingById);

// Routes protégées avec ID
router.post('/:id/bookmark', authenticate, trainingController.toggleBookmark);
router.post('/:id/review', authenticate, trainingController.addReview);

module.exports = router;
