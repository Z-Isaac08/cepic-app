const AuditLogger = require('../utils/auditLogger');

// Middleware pour vérifier les privilèges administrateur
const requireAdmin = async (req, res, next) => {
  try {
    // Vérifier que l'utilisateur est connecté (normalement fait par protect middleware)
    if (!req.user) {
      await AuditLogger.logAdmin('admin_access_denied', req, null, false, { reason: 'no_user' });
      return res.status(401).json({
        success: false,
        error: 'Authentification requise'
      });
    }

    // Vérifier que l'utilisateur a le rôle ADMIN
    if (req.user.role !== 'ADMIN') {
      await AuditLogger.logAdmin('admin_access_denied', req, req.user.id, false, { 
        reason: 'insufficient_privileges',
        userRole: req.user.role 
      });
      return res.status(403).json({
        success: false,
        error: 'Privilèges administrateur requis'
      });
    }

    // Vérifier que le compte admin est actif et vérifié
    if (!req.user.isActive || !req.user.isVerified) {
      await AuditLogger.logAdmin('admin_access_denied', req, req.user.id, false, { 
        reason: 'account_status',
        isActive: req.user.isActive,
        isVerified: req.user.isVerified
      });
      return res.status(403).json({
        success: false,
        error: 'Compte administrateur inactif ou non vérifié'
      });
    }

    // Logger l'accès admin réussi
    await AuditLogger.logAdmin('admin_access_granted', req, req.user.id, true, {
      endpoint: req.path,
      method: req.method
    });

    next();
  } catch (error) {
    await AuditLogger.logAdmin('admin_middleware_error', req, req.user?.id, false, { 
      error: error.message 
    });
    next(error);
  }
};

// Middleware pour les actions super-administrateur (optionnel)
const requireSuperAdmin = async (req, res, next) => {
  try {
    // D'abord vérifier les privilèges admin normaux
    await new Promise((resolve, reject) => {
      requireAdmin(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Vérifier le rôle super admin (si implémenté)
    if (req.user.role !== 'SUPER_ADMIN') {
      await AuditLogger.logAdmin('super_admin_access_denied', req, req.user.id, false, { 
        userRole: req.user.role 
      });
      return res.status(403).json({
        success: false,
        error: 'Privilèges super-administrateur requis'
      });
    }

    await AuditLogger.logAdmin('super_admin_access_granted', req, req.user.id, true, {
      endpoint: req.path,
      method: req.method
    });

    next();
  } catch (error) {
    await AuditLogger.logAdmin('super_admin_middleware_error', req, req.user?.id, false, { 
      error: error.message 
    });
    next(error);
  }
};

// Middleware pour valider les paramètres d'administration
const validateAdminParams = (requiredParams = []) => {
  return async (req, res, next) => {
    try {
      const missingParams = [];

      // Vérifier les paramètres requis
      for (const param of requiredParams) {
        if (param.includes('.')) {
          // Support pour les paramètres imbriqués (ex: 'body.userId')
          const [source, key] = param.split('.');
          if (!req[source] || req[source][key] === undefined) {
            missingParams.push(param);
          }
        } else {
          if (req.params[param] === undefined && req.query[param] === undefined && req.body[param] === undefined) {
            missingParams.push(param);
          }
        }
      }

      if (missingParams.length > 0) {
        await AuditLogger.logAdmin('admin_validation_failed', req, req.user?.id, false, { 
          missingParams 
        });
        return res.status(400).json({
          success: false,
          error: 'Paramètres manquants',
          missingParams
        });
      }

      next();
    } catch (error) {
      await AuditLogger.logAdmin('admin_validation_error', req, req.user?.id, false, { 
        error: error.message 
      });
      next(error);
    }
  };
};

// Middleware pour limiter les actions sensibles (avec confirmation)
const requireConfirmation = (action) => {
  return async (req, res, next) => {
    try {
      const { confirmation } = req.body;

      if (!confirmation || confirmation !== `CONFIRM_${action.toUpperCase()}`) {
        await AuditLogger.logAdmin('admin_confirmation_failed', req, req.user.id, false, { 
          action,
          providedConfirmation: confirmation 
        });
        return res.status(400).json({
          success: false,
          error: `Confirmation requise. Veuillez inclure "confirmation": "CONFIRM_${action.toUpperCase()}" dans votre requête`
        });
      }

      await AuditLogger.logAdmin('admin_confirmation_success', req, req.user.id, true, { action });
      next();
    } catch (error) {
      await AuditLogger.logAdmin('admin_confirmation_error', req, req.user?.id, false, { 
        error: error.message 
      });
      next(error);
    }
  };
};

// Middleware pour la journalisation des actions admin
const logAdminAction = (action) => {
  return async (req, res, next) => {
    // Stocker l'action dans la requête pour l'utiliser après
    req.adminAction = action;
    
    // Intercepter la réponse pour logger le résultat
    const originalSend = res.send;
    res.send = function(data) {
      // Logger le résultat de l'action
      const isSuccess = res.statusCode >= 200 && res.statusCode < 300;
      AuditLogger.logAdmin(
        `admin_${action}_${isSuccess ? 'success' : 'failed'}`, 
        req, 
        req.user?.id, 
        isSuccess,
        {
          statusCode: res.statusCode,
          responseData: typeof data === 'string' ? JSON.parse(data) : data
        }
      );
      
      return originalSend.call(this, data);
    };

    next();
  };
};

// Middleware de rate limiting spécifique aux admins
const adminRateLimit = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Plus élevé pour les admins
  message: {
    success: false,
    error: 'Trop de requêtes admin. Veuillez patienter.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    await AuditLogger.logAdmin('admin_rate_limit_exceeded', req, req.user?.id, false);
    res.status(429).json({
      success: false,
      error: 'Trop de requêtes admin. Veuillez patienter.'
    });
  }
});

module.exports = {
  requireAdmin,
  requireSuperAdmin,
  validateAdminParams,
  requireConfirmation,
  logAdminAction,
  adminRateLimit
};