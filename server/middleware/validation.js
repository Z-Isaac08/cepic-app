const { z } = require('zod');

/**
 * Helper pour formater les erreurs Zod de manière cohérente
 */
const formatZodError = (error) => ({
  success: false,
  error: 'Validation failed',
  details: error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
    // Utile pour le debug : affiche ce qui était attendu vs reçu
    ...(issue.expected && { expected: issue.expected }),
    ...(issue.received && { received: issue.received }),
  })),
});

/**
 * Middleware de validation universel
 * @param {'body' | 'query' | 'params'} target - La partie de la requête à valider
 */
const validateRequest = (schema, target = 'body') => {
  return async (req, res, next) => {
    try {
      // .parseAsync est recommandé pour supporter les raffinements asynchrones (ex: check DB)
      const validatedData = await schema.parseAsync(req[target]);

      // Nommage simple et cohérent
      if (target === 'body') {
        req.validatedData = validatedData;
      } else if (target === 'query') {
        req.validatedQuery = validatedData;
      } else if (target === 'params') {
        req.validatedParams = validatedData;
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json(formatZodError(error));
      }

      // Erreur interne imprévue
      console.error(`Internal validation error on ${target}:`, error);
      next(error);
    }
  };
};

// Export des fonctions spécialisées
module.exports = {
  validate: (schema) => validateRequest(schema, 'body'),
  validateQuery: (schema) => validateRequest(schema, 'query'),
  validateParams: (schema) => validateRequest(schema, 'params'),
  formatZodError, // Exporté pour usage manuel si besoin
};
