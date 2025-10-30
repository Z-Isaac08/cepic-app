const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticate, authorize } = require('../middleware/auth');

// Route publique
router.post('/', contactController.sendMessage);

// Routes admin
router.get('/', authenticate, authorize('ADMIN'), contactController.getAllMessages);
router.put('/:id/reply', authenticate, authorize('ADMIN'), contactController.replyToMessage);

module.exports = router;
