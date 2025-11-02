const { z } = require('zod');

/**
 * Schema de validation des variables d'environnement
 */
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().min(1000).max(65535)).default('3001'),
  
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL doit être une URL valide'),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET doit faire au moins 32 caractères'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32).optional(),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  
  // CORS
  CORS_ORIGIN: z.string().url().or(z.literal('*')).default('http://localhost:5173'),
  
  // Email
  EMAIL_SERVICE: z.string().default('gmail'),
  EMAIL_USER: z.string().email().optional(),
  EMAIL_PASS: z.string().optional(),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'), // 15 min
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  
  // Security
  BCRYPT_ROUNDS: z.string().transform(Number).pipe(z.number().min(10).max(15)).default('12'),
  
  // Redis (optionnel)
  REDIS_URL: z.string().url().optional(),
  
  // Monitoring (optionnel)
  SENTRY_DSN: z.string().url().optional(),
  
  // Payment (placeholder pour plus tard)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  CINETPAY_API_KEY: z.string().optional(),
  CINETPAY_SITE_ID: z.string().optional(),
});

/**
 * Valide les variables d'environnement au démarrage
 * @throws {Error} Si la validation échoue
 */
function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    
    console.log('✅ Variables d\'environnement validées avec succès');
    console.log(`📍 Environnement: ${env.NODE_ENV}`);
    console.log(`🚀 Port: ${env.PORT}`);
    console.log(`🔒 JWT configuré: ${!!env.JWT_SECRET}`);
    console.log(`📧 Email configuré: ${!!env.EMAIL_USER && !!env.EMAIL_PASS}`);
    console.log(`🗄️  Redis configuré: ${!!env.REDIS_URL}`);
    
    return env;
  } catch (error) {
    console.error('❌ Erreur de validation des variables d\'environnement:');
    
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    } else {
      console.error(error.message);
    }
    
    console.error('\n💡 Vérifiez votre fichier .env et assurez-vous que toutes les variables requises sont définies.');
    console.error('📄 Consultez .env.example pour un exemple de configuration.\n');
    
    process.exit(1);
  }
}

module.exports = { validateEnv, envSchema };
