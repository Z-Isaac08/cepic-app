const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Créer le dossier uploads s'il n'existe pas
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Dossier uploads créé à: ${uploadDir}`);
}

// Valider les variables d'environnement au démarrage
const { validateEnv } = require('./utils/validateEnv');
validateEnv();

// Logger centralisé
const logger = require('./utils/logger');
const requestLogger = require('./middleware/logger');

const authRoutes = require('./routers/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const requestIdMiddleware = require('./middleware/requestId');
const {
  helmetConfig,
  additionalSecurityHeaders,
  globalLimiter,
  speedLimiter,
  xssProtection,
  csrfProtection,
  getCsrfToken,
  inputValidation,
  trustProxy,
  compression,
  hpp,
  mongoSanitize,
} = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for accurate IP detection
app.use(trustProxy);

// Request ID middleware (must be early)
app.use(requestIdMiddleware);

// Request logging middleware
app.use(requestLogger);

// Security middleware
app.use(helmetConfig);
app.use(additionalSecurityHeaders);
app.use(compression);
app.use(hpp);
app.use(mongoSanitize);

// CORS configuration
const corsOptions = {
  origin: [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'X-XSRF-Token',
  ],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours
};
app.use(cors(corsOptions));

// Ajouter les en-têtes CORS pour les requêtes OPTIONS (prévol)
app.options('*', cors(corsOptions));

// Rate limiting and speed limiting
app.use(globalLimiter);
app.use(speedLimiter);

// Body parsing middleware
app.use(
  express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
      // Store raw body for certain operations if needed
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing
app.use(cookieParser(process.env.COOKIE_SECRET));

// Servir les fichiers statiques du dossier uploads avec les bons en-têtes CORS
app.use('/uploads', (req, res, next) => {
  // Validation dynamique de l'origin pour CORS (un seul origin à la fois)
  const requestOrigin = req.headers.origin;
  if (requestOrigin && corsOptions.origin.includes(requestOrigin)) {
    res.header('Access-Control-Allow-Origin', requestOrigin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Désactiver la politique de même origine pour les images
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');

  // Servir le fichier statique
  express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res) => {
      // Définir les en-têtes pour le cache
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      // Désactiver la politique de sécurité du contenu (CSP) pour les images
      res.setHeader('Content-Security-Policy', "default-src 'self'");
    },
  })(req, res, next);
});

// Security validation middleware (non-CSRF)
app.use(inputValidation);
app.use(xssProtection);

// Health check routes (exempted from CSRF - must be before csrfProtection middleware)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    security: 'enhanced',
  });
});

// Liveness probe - server is running
app.get('/health/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
});

// Readiness probe - server + dependencies are ready
app.get('/health/ready', async (req, res) => {
  try {
    // Check database connection
    const prisma = require('./lib/prisma');
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'connected',
      },
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'disconnected',
      },
      error: error.message,
    });
  }
});

// CSRF Token endpoint (must be accessible without CSRF validation - chicken-egg problem)
app.get('/api/csrf-token', getCsrfToken);

// Apply CSRF protection AFTER routes that need to be exempted
app.use(csrfProtection);

// API status endpoint
app.get('/api/status', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      server: 'ProjectMoney API',
      version: '2.0.0',
      status: 'operational',
      features: {
        authentication: true,
        rateLimit: true,
        csrf: true,
        xss: true,
        cookies: true,
        audit: true,
      },
      timestamp: new Date().toISOString(),
    },
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', require('./routers/adminRoutes'));

// CEPIC Routes
app.use('/api/trainings', require('./routers/trainingRoutes'));
app.use('/api/enrollments', require('./routers/enrollmentRoutes'));
app.use('/api/payments', require('./routers/paymentRoutes'));
app.use('/api/gallery', require('./routers/galleryRoutes'));
app.use('/api/contact', require('./routers/contactRoutes'));

// Catch all for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// 404 handler for non-API routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  const prisma = require('./lib/prisma');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  const prisma = require('./lib/prisma');
  await prisma.$disconnect();
  process.exit(0);
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔒 Security: Enhanced with CSRF, XSS, Rate Limiting`);
  logger.info(`🍪 Cookies: Secure HTTP-only cookies enabled`);
  logger.info(`🗄️  Database: PostgreSQL with Prisma ORM`);
  logger.info(`📊 Audit: Comprehensive logging enabled`);
});

module.exports = app;
