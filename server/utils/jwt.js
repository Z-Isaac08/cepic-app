const jwt = require('jsonwebtoken');

const signToken = (id, email, role = 'user') => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message = 'Success') => {
  const token = signToken(user.id, user.email, user.role);
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    message,
    token,
    data: {
      user
    },
  });
};

const generateTempToken = () => {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const generate2FACode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  signToken,
  createSendToken,
  generateTempToken,
  generate2FACode
};