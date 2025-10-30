const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { authenticate, authorize } = require('../middleware/auth');

// Routes publiques
router.get('/', galleryController.getAllPhotos);

// Routes admin
router.post('/', authenticate, authorize('ADMIN'), galleryController.addPhoto);
router.delete('/:id', authenticate, authorize('ADMIN'), galleryController.deletePhoto);

module.exports = router;
