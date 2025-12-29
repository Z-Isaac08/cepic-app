const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

/**
 * CONFIGURATION SÉCURISÉE DE MULTER POUR LES UPLOADS DE FICHIERS
 *
 * Ce module fournit une configuration centralisée et sécurisée pour le téléchargement de fichiers.
 * Il inclut:
 * - Validation des types de fichiers (whitelist)
 * - Limites de taille de fichiers
 * - Génération de noms de fichiers sécurisés
 * - Gestion d'erreurs complète
 *
 * SÉCURITÉ:
 * - Seuls les types de fichiers autorisés peuvent être téléchargés
 * - Les noms de fichiers sont générés aléatoirement pour éviter les conflits et attaques
 * - Des limites strictes de taille sont appliquées
 */

// Assurer que le dossier uploads existe
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Types de fichiers images autorisés
 * Format: { 'type/mime': 'extension' }
 */
const ALLOWED_IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/**
 * Types de documents autorisés
 * Format: { 'type/mime': 'extension' }
 */
const ALLOWED_DOCUMENT_TYPES = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

/**
 * Limites de taille de fichiers (en octets)
 */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB pour les images
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB pour les documents

/**
 * Configuration du stockage des fichiers
 * Utilise diskStorage pour un contrôle total sur les noms de fichiers
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier sécurisé et unique
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedName = file.fieldname + '-' + Date.now() + '-' + uniqueSuffix + ext;
    cb(null, sanitizedName);
  },
});

/**
 * Filtre de validation pour les images uniquement
 *
 * @param {object} req - Objet de requête Express
 * @param {object} file - Fichier en cours de téléchargement
 * @param {function} cb - Callback de validation
 */
const imageFileFilter = (req, file, cb) => {
  // Vérifier si le type MIME est autorisé
  if (ALLOWED_IMAGE_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Type de fichier invalide. Seuls ${Object.keys(ALLOWED_IMAGE_TYPES).join(
          ', '
        )} sont autorisés.`
      ),
      false
    );
  }
};

/**
 * Filtre de validation pour les documents uniquement
 *
 * @param {object} req - Objet de requête Express
 * @param {object} file - Fichier en cours de téléchargement
 * @param {function} cb - Callback de validation
 */
const documentFileFilter = (req, file, cb) => {
  // Vérifier si le type MIME est autorisé
  if (ALLOWED_DOCUMENT_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Type de fichier invalide. Seuls ${Object.keys(ALLOWED_DOCUMENT_TYPES).join(
          ', '
        )} sont autorisés.`
      ),
      false
    );
  }
};

/**
 * Filtre de validation pour images ET documents
 *
 * @param {object} req - Objet de requête Express
 * @param {object} file - Fichier en cours de téléchargement
 * @param {function} cb - Callback de validation
 */
const generalFileFilter = (req, file, cb) => {
  const allAllowed = { ...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES };

  if (allAllowed[file.mimetype]) {
    cb(null, true);
  } else {
    cb(
      new Error(`Type de fichier invalide. Seules les images et les documents sont autorisés.`),
      false
    );
  }
};

/**
 * Configuration Multer pour le téléchargement d'images
 * - Types autorisés: JPEG, PNG, GIF, WebP
 * - Taille maximale: 5MB
 * - Maximum 5 fichiers par requête
 */
const uploadImage = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: MAX_IMAGE_SIZE,
    files: 5, // Maximum 5 fichiers par requête
  },
});

/**
 * Configuration Multer pour le téléchargement de documents
 * - Types autorisés: PDF, DOC, DOCX
 * - Taille maximale: 10MB
 * - Maximum 3 fichiers par requête
 */
const uploadDocument = multer({
  storage: storage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: MAX_DOCUMENT_SIZE,
    files: 3, // Maximum 3 fichiers par requête
  },
});

/**
 * Configuration Multer pour le téléchargement général (images + documents)
 * - Accepte tous les types autorisés
 * - Taille maximale: 10MB
 * - Maximum 5 fichiers par requête
 */
const uploadGeneral = multer({
  storage: storage,
  fileFilter: generalFileFilter,
  limits: {
    fileSize: MAX_DOCUMENT_SIZE, // Utiliser la limite la plus grande
    files: 5,
  },
});

/**
 * Middleware de gestion des erreurs Multer
 *
 * @description Gère les erreurs spécifiques à Multer et retourne des messages clairs
 * @param {object} err - Objet d'erreur
 * @param {object} req - Objet de requête Express
 * @param {object} res - Objet de réponse Express
 * @param {function} next - Fonction next d'Express
 */
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Erreurs spécifiques à Multer
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error:
          'Fichier trop volumineux. Taille maximale: 5MB pour les images et 10MB pour les documents.',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Trop de fichiers. Maximum 5 fichiers par téléchargement.',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Champ de fichier inattendu.',
      });
    }

    return res.status(400).json({
      success: false,
      error: `Erreur de téléchargement: ${err.message}`,
    });
  }

  // Erreurs personnalisées du filtre de fichiers
  if (err.message.includes('Type de fichier invalide')) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  // Passer au gestionnaire d'erreurs suivant
  next(err);
};

/**
 * EXPORTS
 *
 * Usage:
 * const { uploadImage } = require('./config/multer.config');
 * router.post('/upload', uploadImage.single('photo'), controller);
 */
module.exports = {
  uploadImage,
  uploadDocument,
  uploadGeneral,
  handleMulterError,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  MAX_IMAGE_SIZE,
  MAX_DOCUMENT_SIZE,
};
