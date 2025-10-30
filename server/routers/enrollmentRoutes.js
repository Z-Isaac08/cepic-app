const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { authenticate, authorize } = require('../middleware/auth');

// Toutes les routes nécessitent l'authentification
router.use(authenticate);

router.post('/', enrollmentController.createEnrollment);
router.get('/', enrollmentController.getMyEnrollments);
router.get('/:id', enrollmentController.getEnrollmentById);
router.put('/:id/cancel', enrollmentController.cancelEnrollment);

// Routes admin
router.put('/:id/complete', authorize('ADMIN'), enrollmentController.completeEnrollment);

module.exports = router;
