const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { createSendToken, generateTempToken, generate2FACode } = require('../utils/jwt');
const emailService = require('../utils/email');

// In-memory storage for demo (replace with database)
const users = [
  {
    id: 1,
    email: 'admin@test.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewMpx0Db6ZOGRNPe', // secret123
    name: 'Admin User',
    role: 'admin',
    isVerified: true
  },
  {
    id: 2,
    email: 'user@test.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewMpx0Db6ZOGRNPe', // secret123
    name: 'Regular User',
    role: 'user',
    isVerified: true
  }
];

// In-memory storage for 2FA codes and temp tokens
const tempTokens = new Map();
const twoFACodes = new Map();

// Check if email exists
const checkEmail = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
        details: errors.array()
      });
    }

    const { email } = req.body;
    const existingUser = users.find(u => u.email === email);

    res.status(200).json({
      success: true,
      data: {
        exists: !!existingUser,
        email
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login existing user
const loginExistingUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate 2FA code
    const code = generate2FACode();
    const tempToken = generateTempToken();
    
    // Store temp token and 2FA code (expires in 10 minutes)
    tempTokens.set(tempToken, { 
      userId: user.id, 
      email: user.email,
      expires: Date.now() + 10 * 60 * 1000 
    });
    
    twoFACodes.set(tempToken, { 
      code, 
      expires: Date.now() + 10 * 60 * 1000 
    });

    // Send 2FA code via email (in production)
    if (process.env.NODE_ENV === 'production') {
      await emailService.send2FACode(email, code, user.name);
    } else {
      console.log(`2FA Code for ${email}: ${code}`);
    }

    res.status(200).json({
      success: true,
      message: 'Please check your email for the verification code',
      data: {
        tempToken,
        requires2FA: true
      }
    });
  } catch (error) {
    next(error);
  }
};

// Register new user
const registerNewUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, firstName, lastName, password } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      role: 'user',
      isVerified: false,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);

    // Generate 2FA code for email verification
    const code = generate2FACode();
    const tempToken = generateTempToken();
    
    tempTokens.set(tempToken, { 
      userId: newUser.id, 
      email: newUser.email,
      expires: Date.now() + 10 * 60 * 1000 
    });
    
    twoFACodes.set(tempToken, { 
      code, 
      expires: Date.now() + 10 * 60 * 1000 
    });

    // Send verification email
    if (process.env.NODE_ENV === 'production') {
      await emailService.send2FACode(email, code, newUser.name);
    } else {
      console.log(`Verification Code for ${email}: ${code}`);
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please verify your email.',
      data: {
        tempToken,
        requires2FA: true
      }
    });
  } catch (error) {
    next(error);
  }
};

// Verify 2FA code
const verify2FA = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { tempToken, code } = req.body;
    
    // Verify temp token exists and is valid
    const tokenData = tempTokens.get(tempToken);
    if (!tokenData || tokenData.expires < Date.now()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Verify 2FA code
    const codeData = twoFACodes.get(tempToken);
    if (!codeData || codeData.expires < Date.now()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification code'
      });
    }

    if (codeData.code !== code) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification code'
      });
    }

    // Find user and verify
    const user = users.find(u => u.id === tokenData.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Mark user as verified if not already
    if (!user.isVerified) {
      user.isVerified = true;
    }

    // Clean up temp data
    tempTokens.delete(tempToken);
    twoFACodes.delete(tempToken);

    // Send welcome email for new users
    if (process.env.NODE_ENV === 'production' && !user.lastLogin) {
      await emailService.sendWelcomeEmail(user.email, user.name);
    }

    // Update last login
    user.lastLogin = new Date().toISOString();

    // Generate JWT and send response
    createSendToken(user, 200, res, 'Login successful');
  } catch (error) {
    next(error);
  }
};

// Resend 2FA code
const resend2FA = async (req, res, next) => {
  try {
    const { tempToken } = req.body;
    
    // Verify temp token exists
    const tokenData = tempTokens.get(tempToken);
    if (!tokenData) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token'
      });
    }

    // Generate new 2FA code
    const code = generate2FACode();
    
    // Update expiry time
    tokenData.expires = Date.now() + 10 * 60 * 1000;
    twoFACodes.set(tempToken, { 
      code, 
      expires: Date.now() + 10 * 60 * 1000 
    });

    // Send new code
    if (process.env.NODE_ENV === 'production') {
      const user = users.find(u => u.id === tokenData.userId);
      await emailService.send2FACode(tokenData.email, code, user?.name);
    } else {
      console.log(`New 2FA Code for ${tokenData.email}: ${code}`);
    }

    res.status(200).json({
      success: true,
      message: 'New verification code sent'
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
const getCurrentUser = async (req, res, next) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: {
        user: userWithoutPassword
      }
    });
  } catch (error) {
    next(error);
  }
};

// Logout user
const logout = async (req, res, next) => {
  try {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
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
  logout
};