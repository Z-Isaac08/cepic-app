const express = require('express');
const {
  checkEmail,
  loginExistingUser,
  registerNewUser,
  verify2FA,
  resend2FA,
  getCurrentUser,
  logout,
  refreshToken
} = require('../controllers/authController');
const { protect, requireVerified, cleanupExpiredSessions } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { authLimiter, strictAuthLimiter } = require('../middleware/security');
const {
  checkEmailSchema,
  loginSchema,
  registerSchema,
  verify2FASchema,
  resend2FASchema
} = require('../schemas/authSchemas');

const router = express.Router();

// Cleanup expired sessions occasionally
router.use(cleanupExpiredSessions);

// Public routes (with rate limiting and validation)
router.post('/check-email', 
  authLimiter, 
  validate(checkEmailSchema), 
  checkEmail
);

router.post('/login', 
  authLimiter, 
  validate(loginSchema), 
  loginExistingUser
);

router.post('/register', 
  strictAuthLimiter, 
  validate(registerSchema), 
  registerNewUser
);

router.post('/verify-2fa', 
  strictAuthLimiter, 
  validate(verify2FASchema), 
  verify2FA
);

router.post('/resend-2fa', 
  authLimiter, 
  validate(resend2FASchema), 
  resend2FA
);

router.post('/refresh', 
  authLimiter, 
  refreshToken
);

// Protected routes
router.get('/me', 
  protect, 
  getCurrentUser
);

router.post('/logout', 
  protect, 
  logout
);

// Admin only routes (example)
router.get('/sessions', 
  protect, 
  requireVerified,
  // restrictTo('ADMIN'), // Uncomment when needed
  async (req, res) => {
    // Get user's active sessions
    const sessions = await require('../lib/prisma').session.findMany({
      where: {
        userId: req.user.id,
        isRevoked: false,
        expiresAt: { gt: new Date() }
      },
      select: {
        id: true,
        createdAt: true,
        userAgent: true,
        ipAddress: true,
        expiresAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: { sessions }
    });
  }
);

router.delete('/sessions/:sessionId', 
  protect, 
  requireVerified,
  async (req, res) => {
    const { sessionId } = req.params;
    
    try {
      await require('../lib/prisma').session.update({
        where: {
          id: sessionId,
          userId: req.user.id // Ensure user can only revoke their own sessions
        },
        data: { isRevoked: true }
      });

      res.json({
        success: true,
        message: 'Session revoked successfully'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }
  }
);

module.exports = router;