const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { verifyToken } = require('../utils/jwt');
const AuditLogger = require('../utils/auditLogger');

// Verify JWT token middleware (cookie-based)
const protect = async (req, res, next) => {
  try {
    // 1) Check if token exists in cookies
    let token = req.cookies.auth_token;
    
    // Fallback to Authorization header for API compatibility
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'You are not logged in! Please log in to get access.'
      });
    }

    // 2) Verify token
    const decoded = await verifyToken(token);

    // 3) Check if session is valid in database
    const session = await prisma.session.findFirst({
      where: {
        token,
        userId: decoded.id,
        isRevoked: false,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            isVerified: true
          }
        }
      }
    });

    if (!session || !session.user.isActive) {
      await AuditLogger.logSecurity('invalid_session_blocked', req, {
        sessionExists: !!session,
        userActive: session?.user.isActive
      });
      
      return res.status(401).json({
        success: false,
        error: 'Invalid session. Please log in again!'
      });
    }

    // 4) Attach user to request
    req.user = session.user;
    req.session = session;

    next();
  } catch (error) {
    await AuditLogger.logSecurity('token_verification_failed', req, {
      error: error.message
    });
    
    return res.status(401).json({
      success: false,
      error: 'Invalid token. Please log in again!'
    });
  }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    
    if (token) {
      const decoded = await verifyToken(token);
      
      const session = await prisma.session.findFirst({
        where: {
          token,
          userId: decoded.id,
          isRevoked: false,
          expiresAt: {
            gt: new Date()
          }
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
              isActive: true,
              isVerified: true
            }
          }
        }
      });

      if (session && session.user.isActive) {
        req.user = session.user;
        req.session = session;
      }
    }
    
    next();
  } catch (error) {
    // For optional auth, we just continue without user
    next();
  }
};

// Role-based access control
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

// Require email verification
const requireVerified = (req, res, next) => {
  if (!req.user || !req.user.isVerified) {
    return res.status(403).json({
      success: false,
      error: 'Please verify your email address to access this resource'
    });
  }
  next();
};

// Session management
const cleanupExpiredSessions = async (req, res, next) => {
  try {
    // Clean up expired sessions (run occasionally)
    if (Math.random() < 0.01) { // 1% chance to run cleanup
      await prisma.session.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      });
    }
    next();
  } catch (error) {
    // Don't fail the request if cleanup fails
    next();
  }
};

// Middleware pour vérifier les privilèges administrateur
const requireAdmin = async (req, res, next) => {
  try {
    // Vérifier que l'utilisateur est connecté
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise'
      });
    }

    // Vérifier que l'utilisateur a le rôle ADMIN
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Privilèges administrateur requis'
      });
    }

    // Vérifier que le compte admin est actif et vérifié
    if (!req.user.isActive || !req.user.isVerified) {
      return res.status(403).json({
        success: false,
        error: 'Compte administrateur inactif ou non vérifié'
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect,
  optionalAuth,
  restrictTo,
  requireVerified,
  requireAdmin,
  cleanupExpiredSessions
};