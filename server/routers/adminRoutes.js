const express = require('express');
const {
  getDashboardStats,
  getUsers,
  getUser,
  updateUser,
  updateUserStatus,
  deleteUser,
  getSecurityLogs,
  getSystemHealth,
  getAnalytics,
  getAllTrainingsAdmin,
  getAllEnrollments,
  updateEnrollmentStatus,
  getAllMessages,
  markMessageAsRead,
  deleteMessage,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto
} = require('../controllers/adminController');
const { protect, requireAdmin } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Tous les routes admin nécessitent une authentification et des privilèges admin
router.use(protect);
router.use(requireAdmin);

// Routes des statistiques du dashboard
router.get('/dashboard', authLimiter, getDashboardStats);

// Routes de gestion des utilisateurs
router.get('/users', authLimiter, getUsers);
router.get('/users/:userId', authLimiter, getUser);
router.put('/users/:userId', authLimiter, updateUser);
router.patch('/users/:userId/status', authLimiter, updateUserStatus);
router.delete('/users/:userId', authLimiter, deleteUser);

// Routes de gestion des formations (admin)
router.get('/trainings', authLimiter, getAllTrainingsAdmin);

// Routes de gestion des inscriptions
router.get('/enrollments', authLimiter, getAllEnrollments);
router.patch('/enrollments/:id/status', authLimiter, updateEnrollmentStatus);

// Routes de gestion des catégories
router.post('/categories', authLimiter, createCategory);
router.put('/categories/:id', authLimiter, updateCategory);
router.delete('/categories/:id', authLimiter, deleteCategory);

// Routes de gestion de la galerie
router.post('/gallery', upload.single('image'), uploadGalleryPhoto);
router.put('/gallery/:id', authLimiter, updateGalleryPhoto);
router.delete('/gallery/:id', authLimiter, deleteGalleryPhoto);

// Routes de gestion des messages
router.get('/messages', authLimiter, getAllMessages);
router.patch('/messages/:id/read', authLimiter, markMessageAsRead);
router.delete('/messages/:id', authLimiter, deleteMessage);

// Routes de sécurité et audit
router.get('/security/logs', authLimiter, getSecurityLogs);

// Routes de santé système
router.get('/system/health', authLimiter, getSystemHealth);

// Routes d'analytics
router.get('/analytics', authLimiter, getAnalytics);

module.exports = router;