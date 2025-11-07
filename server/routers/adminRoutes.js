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
  toggleTrainingPublish,
  deleteTraining,
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
const path = require('path');
const fs = require('fs');

// Créer le dossier uploads s'il n'existe pas
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Conserver le nom d'origine du fichier (sans l'extension)
    const nameWithoutExt = path.parse(file.originalname).name;
    // Générer un nom unique avec l'extension d'origine
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  }
});

// Filtre pour n'accepter que les images
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif)'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

const router = express.Router();

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
router.patch('/trainings/:id/toggle-publish', authLimiter, toggleTrainingPublish);
router.delete('/trainings/:id', authLimiter, deleteTraining);

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