/**
 * Application Configuration
 * Contains feature flags and app settings
 */

module.exports = {
  // Email verification / 2FA settings
  // Set to true to skip email verification (useful when email service is not configured)
  // Set to false to require email verification with 2FA code
  SKIP_EMAIL_VERIFICATION: true,

  // Other feature flags can be added here
  // ENABLE_NOTIFICATIONS: false,
  // MAX_LOGIN_ATTEMPTS: 5,
};
