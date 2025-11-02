const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Valider les variables d'environnement au démarrage
const { validateEnv } = require('./utils/validateEnv');
validateEnv();

// Logger centralisé
const logger = require('./utils/logger');
const requestLogger = require('./middleware/logger');

const authRoutes = require('./routers/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const {
  helmetConfig,
  globalLimiter,
  speedLimiter,
  xssProtection,
  csrfProtection,
  inputValidation,
  trustProxy,
  compression,
  hpp,
  mongoSanitize
} = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for accurate IP detection
app.use(trustProxy);

// Request logging middleware
app.use(requestLogger);

// Security middleware
app.use(helmetConfig);
app.use(compression);
app.use(hpp);
app.use(mongoSanitize);

// CORS configuration
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
}));

// Rate limiting and speed limiting
app.use(globalLimiter);
app.use(speedLimiter);

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Store raw body for certain operations if needed
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing
app.use(cookieParser(process.env.COOKIE_SECRET));

// Security validation middleware
app.use(inputValidation);
app.use(xssProtection);
app.use(csrfProtection);

// Health check route (before other routes)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    security: 'enhanced'
  });
});

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
        audit: true
      },
      timestamp: new Date().toISOString()
    }
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
    error: 'API endpoint not found' 
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// 404 handler for non-API routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found' 
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