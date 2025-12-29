const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const crypto = require('crypto');

// Create DOMPurify instance for server-side use
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Enhanced Helmet configuration
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'blob:', 'http:', 'https:'],
      connectSrc: ["'self'", 'http:', 'https:'],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      childSrc: ["'self'"],
      workerSrc: ["'self'"],
      frameSrc: ["'none'"],
      formAction: ["'self'"],
      baseUri: ["'self'"],
      manifestSrc: ["'self'"],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  // Additional security headers
  frameguard: { action: 'deny' }, // X-Frame-Options: DENY
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  xssFilter: true,
});

// Additional security headers middleware
const additionalSecurityHeaders = (req, res, next) => {
  // X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Permissions-Policy (replaces Feature-Policy)
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  next();
};

// Rate limiting configurations
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(15 * 60), // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: Math.ceil(15 * 60),
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: async (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 sensitive auth requests per windowMs
  message: {
    error: 'Too many sensitive authentication attempts, please try again later.',
    retryAfter: Math.ceil(15 * 60),
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

// Speed limiting (progressive delays)
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests per 15 minutes, then...
  delayMs: () => 500, // begin adding 500ms of delay per request above 100
  maxDelayMs: 20000, // maximum delay of 20 seconds
  validate: { delayMs: false }, // Disable delayMs warning
});

// XSS Protection middleware
const xssProtection = (req, res, next) => {
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize URL parameters
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }

  next();
};

// Recursive object sanitization
const sanitizeObject = (obj) => {
  const sanitized = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (typeof value === 'string') {
        // Use DOMPurify to clean HTML/XSS
        sanitized[key] = purify.sanitize(value, {
          ALLOWED_TAGS: [], // No HTML tags allowed
          ALLOWED_ATTR: [], // No attributes allowed
        });
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = sanitizeObject(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map((item) =>
          typeof item === 'string'
            ? purify.sanitize(item, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
            : typeof item === 'object' && item !== null
            ? sanitizeObject(item)
            : item
        );
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
};

// CSRF Token Storage (in-memory, use Redis in production for distributed systems)
const csrfTokens = new Map();

// Clean up expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of csrfTokens.entries()) {
    if (data.expiresAt < now) {
      csrfTokens.delete(token);
    }
  }
}, 60000); // Clean every minute

/**
 * Generate CSRF token
 */
const generateCsrfToken = (sessionId) => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 3600000; // 1 hour

  csrfTokens.set(token, {
    sessionId,
    expiresAt,
  });

  return token;
};

/**
 * CSRF Token Generation Endpoint Middleware
 * Generates and returns a CSRF token for the client
 */
const getCsrfToken = (req, res, next) => {
  // Use session ID or user ID if authenticated
  const sessionId = req.session?.id || req.user?.id || req.cookies.session_id || 'anonymous';

  const token = generateCsrfToken(sessionId);

  // Set in cookie for automatic inclusion in requests
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false, // Allow JavaScript to read it for header inclusion
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000, // 1 hour
  });

  res.json({
    success: true,
    csrfToken: token,
  });
};

/**
 * Enhanced CSRF Protection Middleware
 */
const csrfProtection = (req, res, next) => {
  // Skip CSRF for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // 1. Origin/Referer validation (first line of defense)
  const origin = req.get('Origin') || req.get('Referer');
  const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
  ].filter(Boolean);

  if (!origin || !allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
    return res.status(403).json({
      success: false,
      error: 'CSRF protection: Invalid origin',
    });
  }

  // 2. Token validation (second line of defense)
  // Check for CSRF token in header or body
  const token =
    req.headers['x-csrf-token'] ||
    req.headers['x-xsrf-token'] ||
    req.body?._csrf ||
    req.query?._csrf;

  if (!token) {
    return res.status(403).json({
      success: false,
      error: 'CSRF token missing',
    });
  }

  // Validate token
  const tokenData = csrfTokens.get(token);

  if (!tokenData) {
    return res.status(403).json({
      success: false,
      error: 'Invalid CSRF token',
    });
  }

  // Check if token is expired
  if (tokenData.expiresAt < Date.now()) {
    csrfTokens.delete(token);
    return res.status(403).json({
      success: false,
      error: 'CSRF token expired',
    });
  }

  // Token is valid
  next();
};

// Input validation security
const inputValidation = (req, res, next) => {
  // Check for potential SQL injection patterns
  const sqlInjectionPattern =
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)|(\b(OR|AND)\s+\d+\s*=\s*\d+)|(-{2})|(\|\|)/gi;

  // Check for potential NoSQL injection
  const nosqlInjectionPattern = /(\$where|\$regex|\$ne|\$gt|\$lt|\$in|\$nin|\$exists)/gi;

  const checkString = (str, fieldPath) => {
    if (typeof str === 'string') {
      if (sqlInjectionPattern.test(str) || nosqlInjectionPattern.test(str)) {
        throw new Error(`Potential injection detected in ${fieldPath}`);
      }
    }
  };

  const validateObject = (obj, path = '') => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const fullPath = path ? `${path}.${key}` : key;
        const value = obj[key];

        if (typeof value === 'string') {
          checkString(value, fullPath);
        } else if (typeof value === 'object' && value !== null) {
          validateObject(value, fullPath);
        }
      }
    }
  };

  try {
    if (req.body) validateObject(req.body, 'body');
    if (req.query) validateObject(req.query, 'query');
    if (req.params) validateObject(req.params, 'params');

    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Oops ! Quelque chose s'est mal passée",
    });
  }
};

// Trust proxy for accurate IP detection
const trustProxy = (req, res, next) => {
  // Configure Express to trust proxy with specific setting for development
  if (process.env.NODE_ENV === 'production') {
    req.app.set('trust proxy', 1); // Trust first proxy in production
  } else {
    req.app.set('trust proxy', 'loopback'); // Only trust loopback in development
  }
  next();
};

module.exports = {
  helmetConfig,
  additionalSecurityHeaders,
  globalLimiter,
  authLimiter,
  strictAuthLimiter,
  speedLimiter,
  xssProtection,
  csrfProtection,
  getCsrfToken,
  inputValidation,
  trustProxy,
  compression: compression(),
  hpp: hpp(),
  mongoSanitize: mongoSanitize(),
};
