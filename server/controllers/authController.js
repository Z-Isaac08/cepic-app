const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { createSendToken, generateTempToken, generate2FACode, clearAuthCookies } = require('../utils/jwt');
const emailService = require('../utils/email');
const AuditLogger = require('../utils/auditLogger');

// Check if email exists
const checkEmail = async (req, res, next) => {
  try {
    const { email } = req.validatedData;

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, isActive: true }
    });

    await AuditLogger.logAuth('check_email', req, null, true, { email });

    res.status(200).json({
      success: true,
      data: {
        exists: !!existingUser && existingUser.isActive,
        email
      }
    });
  } catch (error) {
    await AuditLogger.logAuth('check_email', req, null, false, { error: error.message });
    next(error);
  }
};

// Login existing user
const loginExistingUser = async (req, res, next) => {
  try {
    const { email, password } = req.validatedData;
    
    // Find user with password for verification
    const user = await prisma.user.findUnique({
      where: { email, isActive: true }
    });

    if (!user) {
      await AuditLogger.logAuth('login_failed', req, null, false, { email, reason: 'user_not_found' });
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await AuditLogger.logAuth('login_failed', req, user.id, false, { reason: 'invalid_password' });
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate 2FA code and temp token
    const code = generate2FACode();
    const tempToken = generateTempToken();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store 2FA code
    await prisma.twoFACode.create({
      data: {
        userId: user.id,
        code,
        tempToken,
        type: 'LOGIN',
        expiresAt
      }
    });

    // Send 2FA code via email (in production)
    if (process.env.NODE_ENV === 'production') {
      await emailService.send2FACode(email, code, `${user.firstName} ${user.lastName}`);
    } else {
      console.log(`2FA Code for ${email}: ${code}`);
    }

    await AuditLogger.logAuth('login_2fa_sent', req, user.id, true);

    res.status(200).json({
      success: true,
      message: 'Please check your email for the verification code',
      data: {
        tempToken,
        requires2FA: true
      }
    });
  } catch (error) {
    await AuditLogger.logAuth('login_error', req, null, false, { error: error.message });
    next(error);
  }
};

// Register new user
const registerNewUser = async (req, res, next) => {
  try {
    const { email, firstName, lastName, password } = req.validatedData;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      await AuditLogger.logAuth('register_failed', req, null, false, { email, reason: 'user_exists' });
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'USER'
      }
    });

    // Generate 2FA code for email verification
    const code = generate2FACode();
    const tempToken = generateTempToken();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.twoFACode.create({
      data: {
        userId: newUser.id,
        code,
        tempToken,
        type: 'REGISTRATION',
        expiresAt
      }
    });

    // Send verification email
    if (process.env.NODE_ENV === 'production') {
      await emailService.send2FACode(email, code, `${firstName} ${lastName}`);
    } else {
      console.log(`Verification Code for ${email}: ${code}`);
    }

    await AuditLogger.logAuth('register_success', req, newUser.id, true);

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please verify your email.',
      data: {
        tempToken,
        requires2FA: true
      }
    });
  } catch (error) {
    await AuditLogger.logAuth('register_error', req, null, false, { error: error.message });
    next(error);
  }
};

// Verify 2FA code
const verify2FA = async (req, res, next) => {
  try {
    const { tempToken, code } = req.validatedData;
    
    // Find and verify 2FA code
    const twoFARecord = await prisma.twoFACode.findUnique({
      where: { tempToken },
      include: { user: true }
    });

    if (!twoFARecord || twoFARecord.isUsed || twoFARecord.expiresAt < new Date()) {
      await AuditLogger.logAuth('2fa_failed', req, null, false, { reason: 'invalid_token' });
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification code'
      });
    }

    if (twoFARecord.code !== code) {
      await AuditLogger.logAuth('2fa_failed', req, twoFARecord.userId, false, { reason: 'invalid_code' });
      return res.status(400).json({
        success: false,
        error: 'Invalid verification code'
      });
    }

    // Mark code as used
    await prisma.twoFACode.update({
      where: { id: twoFARecord.id },
      data: { isUsed: true }
    });

    // Mark user as verified and update last login
    const updatedUser = await prisma.user.update({
      where: { id: twoFARecord.userId },
      data: {
        isVerified: true,
        lastLogin: new Date()
      }
    });

    // Send welcome email for new registrations
    if (process.env.NODE_ENV === 'production' && twoFARecord.type === 'REGISTRATION') {
      await emailService.sendWelcomeEmail(updatedUser.email, `${updatedUser.firstName} ${updatedUser.lastName}`);
    }

    await AuditLogger.logAuth('2fa_success', req, updatedUser.id, true);

    // Generate JWT and send response with cookies
    await createSendToken(updatedUser, 200, res, req, 'Login successful');
  } catch (error) {
    await AuditLogger.logAuth('2fa_error', req, null, false, { error: error.message });
    next(error);
  }
};

// Resend 2FA code
const resend2FA = async (req, res, next) => {
  try {
    const { tempToken } = req.validatedData;
    
    // Find existing 2FA record
    const existingRecord = await prisma.twoFACode.findUnique({
      where: { tempToken },
      include: { user: true }
    });

    if (!existingRecord || existingRecord.isUsed) {
      await AuditLogger.logAuth('resend_2fa_failed', req, null, false, { reason: 'invalid_token' });
      return res.status(400).json({
        success: false,
        error: 'Invalid token'
      });
    }

    // Generate new code
    const newCode = generate2FACode();
    const newExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Update existing record
    await prisma.twoFACode.update({
      where: { id: existingRecord.id },
      data: {
        code: newCode,
        expiresAt: newExpiresAt
      }
    });

    // Send new code
    if (process.env.NODE_ENV === 'production') {
      await emailService.send2FACode(
        existingRecord.user.email, 
        newCode, 
        `${existingRecord.user.firstName} ${existingRecord.user.lastName}`
      );
    } else {
      console.log(`New 2FA Code for ${existingRecord.user.email}: ${newCode}`);
    }

    await AuditLogger.logAuth('resend_2fa_success', req, existingRecord.userId, true);

    res.status(200).json({
      success: true,
      message: 'New verification code sent'
    });
  } catch (error) {
    await AuditLogger.logAuth('resend_2fa_error', req, null, false, { error: error.message });
    next(error);
  }
};

// Get current user
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        isActive: true,
        lastLogin: true,
        createdAt: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// Logout user
const logout = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.auth_token;
    
    if (token) {
      // Mark session as revoked in database
      await prisma.session.updateMany({
        where: { 
          token,
          userId: req.user?.id 
        },
        data: { isRevoked: true }
      });
    }

    // Clear auth cookies
    clearAuthCookies(res);

    await AuditLogger.logAuth('logout', req, req.user?.id, true);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    // Still clear cookies even if database operation fails
    clearAuthCookies(res);
    await AuditLogger.logAuth('logout_error', req, req.user?.id, false, { error: error.message });
    next(error);
  }
};

// Refresh token
const refreshToken = async (req, res, next) => {
  try {
    const refreshTokenValue = req.cookies.refresh_token;
    
    if (!refreshTokenValue) {
      return res.status(401).json({
        success: false,
        error: 'No refresh token provided'
      });
    }

    // Find session with refresh token
    const session = await prisma.session.findUnique({
      where: { refreshToken: refreshTokenValue },
      include: { user: true }
    });

    if (!session || session.isRevoked || session.expiresAt < new Date()) {
      await AuditLogger.logSecurity('invalid_refresh_token', req);
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token'
      });
    }

    // Generate new tokens
    await createSendToken(session.user, 200, res, req, 'Token refreshed');
    
    // Revoke old session
    await prisma.session.update({
      where: { id: session.id },
      data: { isRevoked: true }
    });

    await AuditLogger.logAuth('token_refresh', req, session.userId, true);
  } catch (error) {
    await AuditLogger.logAuth('token_refresh_error', req, null, false, { error: error.message });
    next(error);
  }
};

module.exports = {
  checkEmail,
  loginExistingUser,
  registerNewUser,
  verify2FA,
  resend2FA,
  getCurrentUser,
  logout,
  refreshToken
};