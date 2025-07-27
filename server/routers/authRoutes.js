const express = require('express');
const { body } = require('express-validator');
const {
  checkEmail,
  loginExistingUser,
  registerNewUser,
  verify2FA,
  resend2FA,
  getCurrentUser,
  logout
} = require('../controllers/authController');
const { protect, authRateLimit } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const emailValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

const loginValidation = [
  ...emailValidation,
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const registerValidation = [
  ...emailValidation,
  body('firstName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters long'),
  body('lastName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters long'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number')
];

const verify2FAValidation = [
  body('tempToken')
    .notEmpty()
    .withMessage('Temporary token is required'),
  body('code')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('Verification code must be 6 digits')
];

// Public routes (with rate limiting)
router.post('/check-email', authRateLimit, emailValidation, checkEmail);
router.post('/login', authRateLimit, loginValidation, loginExistingUser);
router.post('/register', authRateLimit, registerValidation, registerNewUser);
router.post('/verify-2fa', authRateLimit, verify2FAValidation, verify2FA);
router.post('/resend-2fa', authRateLimit, resend2FA);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.post('/logout', protect, logout);

module.exports = router;