const { z } = require("zod");

// Common validation patterns
const emailSchema = z
  .email("Invalid email format")
  .min(1, "Email is required")
  .max(255, "Email too long")
  .transform((email) => email.toLowerCase().trim());

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
    "Password must contain at least one lowercase letter, one uppercase letter, and one number"
  );

const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name too long")
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Name contains invalid characters")
  .transform((name) => name.trim());

const codeSchema = z
  .string()
  .length(6, "Code must be exactly 6 digits")
  .regex(/^\d{6}$/, "Code must contain only numbers");

const tempTokenSchema = z
  .string()
  .min(10, "Invalid token format")
  .max(100, "Token too long");

// Request validation schemas
const checkEmailSchema = z.object({
  email: emailSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  email: emailSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  password: passwordSchema,
});

const verify2FASchema = z.object({
  tempToken: tempTokenSchema,
  code: codeSchema,
});

const resend2FASchema = z.object({
  tempToken: tempTokenSchema,
});

// Security validation
const ipAddressSchema = z
  .string()
  .regex(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^127\.0\.0\.1$|^localhost$/,
    "Invalid IP address"
  )
  .or(z.literal("127.0.0.1"))
  .or(z.literal("::1"))
  .or(z.literal("localhost"));

const userAgentSchema = z.string().max(500, "User agent too long");

// Database model validation schemas
const userCreateSchema = z.object({
  email: emailSchema,
  password: z.string().min(60).max(60), // bcrypt hash length
  firstName: nameSchema,
  lastName: nameSchema,
  role: z.enum(["USER", "ADMIN", "MODERATOR"]).default("USER"),
});

const sessionCreateSchema = z.object({
  userId: z.cuid(),
  token: z.string().min(1),
  refreshToken: z.string().optional(),
  expiresAt: z.date(),
  userAgent: userAgentSchema,
  ipAddress: ipAddressSchema,
});

const twoFACodeCreateSchema = z.object({
  userId: z.cuid(),
  code: codeSchema,
  tempToken: tempTokenSchema,
  type: z.enum(["LOGIN", "REGISTRATION", "PASSWORD_RESET"]),
  expiresAt: z.date(),
});

// Audit log schema
const auditLogSchema = z.object({
  userId: z.cuid().optional(),
  action: z.string().min(1).max(100),
  resource: z.string().max(100).optional(),
  details: z.record(z.any()).default({}),
  ipAddress: ipAddressSchema.default("127.0.0.1"),
  userAgent: userAgentSchema.default("Unknown"),
  success: z.boolean().default(true),
});

module.exports = {
  // Request schemas
  checkEmailSchema,
  loginSchema,
  registerSchema,
  verify2FASchema,
  resend2FASchema,

  // Model schemas
  userCreateSchema,
  sessionCreateSchema,
  twoFACodeCreateSchema,
  auditLogSchema,

  // Individual field schemas
  emailSchema,
  passwordSchema,
  nameSchema,
  codeSchema,
  tempTokenSchema,
  ipAddressSchema,
  userAgentSchema,
};
