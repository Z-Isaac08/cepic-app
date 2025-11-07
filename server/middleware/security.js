const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

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
      manifestSrc: ["'self'"]
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Rate limiting configurations
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(15 * 60) // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: Math.ceil(15 * 60)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: async (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  }
});

const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 sensitive auth requests per windowMs
  message: {
    error: 'Too many sensitive authentication attempts, please try again later.',
    retryAfter: Math.ceil(15 * 60)
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  }
});

// Speed limiting (progressive delays)
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests per 15 minutes, then...
  delayMs: () => 500, // begin adding 500ms of delay per request above 100
  maxDelayMs: 20000, // maximum delay of 20 seconds
  validate: { delayMs: false } // Disable delayMs warning
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
          ALLOWED_ATTR: []  // No attributes allowed
        });
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = sanitizeObject(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
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

// CSRF Protection (simple implementation)
const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // For now, we'll implement a simple origin check
  const origin = req.get('Origin') || req.get('Referer');
  const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ].filter(Boolean);

  if (!origin || !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
    
    return res.status(403).json({
      success: false,
      error: 'CSRF protection: Invalid origin'
    });
  }

  next();
};

// Input validation security
const inputValidation = (req, res, next) => {
  // Check for potential SQL injection patterns
  const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)|(\b(OR|AND)\s+\d+\s*=\s*\d+)|(-{2})|(\|\|)|(\*|;|'|"|`)/gi;
  
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
      error: 'Invalid input detected'
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
  globalLimiter,
  authLimiter,
  strictAuthLimiter,
  speedLimiter,
  xssProtection,
  csrfProtection,
  inputValidation,
  trustProxy,
  compression: compression(),
  hpp: hpp(),
  mongoSanitize: mongoSanitize()
};