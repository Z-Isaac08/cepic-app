const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const {
  createSendToken,
  generateTempToken,
  generate2FACode,
  clearAuthCookies,
} = require('../utils/jwt');
const emailService = require('../utils/email');
const { SKIP_EMAIL_VERIFICATION } = require('../config/app.config');

// Check if email exists
const checkEmail = async (req, res, next) => {
  try {
    const { email } = req.validatedData;

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, isActive: true },
    });

    res.status(200).json({
      success: true,
      data: {
        exists: !!existingUser && existingUser.isActive,
        email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login existing user
const loginExistingUser = async (req, res, next) => {
  try {
    const { email, password } = req.validatedData;

    // Find user with password for verification
    const user = await prisma.user.findUnique({
      where: { email, isActive: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect',
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect',
      });
    }

    // Login directly without 2FA
    // Create session and send token
    await createSendToken(user, 200, res, req, 'Connexion réussie');
  } catch (error) {
    next(error);
  }
};

// Register new user
const registerNewUser = async (req, res, next) => {
  try {
    const { email, firstName, lastName, password } = req.validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Un compte avec cet email existe déjà',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // If email verification is skipped, create verified user and login directly
    if (SKIP_EMAIL_VERIFICATION) {
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: 'USER',
          isVerified: true,
        },
      });

      return await createSendToken(newUser, 201, res, req, 'Compte créé avec succès');
    }

    // Otherwise, use 2FA email verification flow
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'USER',
        isVerified: false,
      },
    });

    // Generate 2FA code and temp token
    const code = generate2FACode();
    const tempToken = generateTempToken();

    // Save 2FA code
    await prisma.twoFACode.create({
      data: {
        code,
        tempToken,
        type: 'REGISTRATION',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        userId: newUser.id,
      },
    });

    // Send verification email (non-blocking)
    emailService.send2FACode(
      email,
      code,
      `${firstName} ${lastName}`
    ).catch((err) => {
      console.error('Failed to send 2FA code:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Compte créé. Veuillez vérifier votre email.',
      data: {
        tempToken,
        email,
        requiresVerification: true,
      },
    });
  } catch (error) {
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
      include: { user: true },
    });

    if (!twoFARecord || twoFARecord.isUsed || twoFARecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Code de vérification invalide ou expiré',
      });
    }

    if (twoFARecord.code !== code) {
      return res.status(400).json({
        success: false,
        error: 'Code de vérification incorrect',
      });
    }

    // Mark code as used
    await prisma.twoFACode.update({
      where: { id: twoFARecord.id },
      data: { isUsed: true },
    });

    // Mark user as verified and update last login
    const updatedUser = await prisma.user.update({
      where: { id: twoFARecord.userId },
      data: {
        isVerified: true,
        lastLogin: new Date(),
      },
    });

    // Send welcome email for new registrations (non-blocking)
    if (process.env.NODE_ENV === 'production' && twoFARecord.type === 'REGISTRATION') {
      emailService.sendWelcomeEmail(
        updatedUser.email,
        `${updatedUser.firstName} ${updatedUser.lastName}`
      ).catch((err) => {
        console.error('Failed to send welcome email:', err.message);
      });
    }

    // Generate JWT and send response with cookies
    await createSendToken(updatedUser, 200, res, req, 'Connexion réussie');
  } catch (error) {
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
      include: { user: true },
    });

    if (!existingRecord || existingRecord.isUsed) {
      return res.status(400).json({
        success: false,
        error: 'Token invalide',
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
        expiresAt: newExpiresAt,
      },
    });

    // Send new code (non-blocking)
    if (process.env.NODE_ENV === 'production') {
      emailService.send2FACode(
        existingRecord.user.email,
        newCode,
        `${existingRecord.user.firstName} ${existingRecord.user.lastName}`
      ).catch((err) => {
        console.error('Failed to resend 2FA code:', err.message);
      });
    } else {
      console.log(`New 2FA Code for ${existingRecord.user.email}: ${newCode}`);
    }

    res.status(200).json({
      success: true,
      message: 'Nouveau code de vérification envoyé',
    });
  } catch (error) {
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
        createdAt: true,
      },
    });

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
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
          userId: req.user?.id,
        },
        data: { isRevoked: true },
      });
    }

    // Clear auth cookies
    clearAuthCookies(res);

    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie',
    });
  } catch (error) {
    // Still clear cookies even if database operation fails
    clearAuthCookies(res);
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
        error: 'Aucun token de rafraîchissement fourni',
      });
    }

    // Find session with refresh token
    const session = await prisma.session.findUnique({
      where: { refreshToken: refreshTokenValue },
      include: { user: true },
    });

    if (!session || session.isRevoked || session.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        error: 'Token de rafraîchissement invalide ou expiré',
      });
    }

    // Generate new tokens
    await createSendToken(session.user, 200, res, req, 'Token rafraîchi');

    // Revoke old session
    await prisma.session.update({
      where: { id: session.id },
      data: { isRevoked: true },
    });
  } catch (error) {
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
  refreshToken,
};
