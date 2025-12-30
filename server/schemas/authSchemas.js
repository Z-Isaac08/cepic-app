const { z } = require("zod");

// Common validation patterns
const emailSchema = z
  .string({ required_error: "L'email est requis" })
  .email("Format d'email invalide")
  .min(1, "L'email est requis")
  .max(255, "L'email est trop long (max 255 caractères)")
  .transform((email) => email.toLowerCase().trim());

const passwordSchema = z
  .string({ required_error: "Le mot de passe est requis" })
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .max(128, "Le mot de passe est trop long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~]).*$/,
    "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial"
  );

const nameSchema = z
  .string({ required_error: "Ce champ est requis" })
  .min(2, "Le nom doit contenir au moins 2 caractères")
  .max(50, "Le nom est trop long (max 50 caractères)")
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le nom contient des caractères invalides")
  .transform((name) => name.trim());

const codeSchema = z
  .string({ required_error: "Le code est requis" })
  .length(6, "Le code doit contenir exactement 6 chiffres")
  .regex(/^\d{6}$/, "Le code doit contenir uniquement des chiffres");

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
  password: z.string().min(1, "Le mot de passe est requis"),
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

  // Individual field schemas
  emailSchema,
  passwordSchema,
  nameSchema,
  codeSchema,
  tempTokenSchema,
  ipAddressSchema,
  userAgentSchema,
};
