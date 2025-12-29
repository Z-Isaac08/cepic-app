const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../lib/prisma');

const signToken = (id, email, role = 'USER') => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = async (user, statusCode, res, req, message = 'Success') => {
  const token = signToken(user.id, user.email, user.role);
  const refreshToken = crypto.randomBytes(40).toString('hex');
  
  // Calculate expiry dates
  const jwtExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const refreshExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  
  // Save session to database
  try {
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        refreshToken,
        expiresAt: jwtExpires,
        userAgent: req?.get('User-Agent') || 'unknown',
        ipAddress: req?.ip || req?.connection?.remoteAddress || 'unknown'
      }
    });
  } catch (error) {
    // Session creation failed - log only in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to create session:', error.message);
    }
  }

  // Set secure HTTP-only cookies
  // Use sameSite: 'none' for cross-site cookies in production (client and server on different domains)
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    expires: jwtExpires,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  };

  const refreshCookieOptions = {
    expires: refreshExpires,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/api/auth'
  };

  res.cookie('auth_token', token, cookieOptions);
  res.cookie('refresh_token', refreshToken, refreshCookieOptions);

  // Remove sensitive data from response
  const { password, ...userWithoutPassword } = user;

  res.status(statusCode).json({
    success: true,
    message,
    data: {
      user: userWithoutPassword
    },
  });
};

const generateTempToken = () => {
  return `temp_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
};

const generate2FACode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
};

const clearAuthCookies = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  });

  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/api/auth'
  });
};

module.exports = {
  signToken,
  createSendToken,
  generateTempToken,
  generate2FACode,
  verifyToken,
  clearAuthCookies
};