const logger = require('../utils/logger');

/**
 * Middleware de logging des requêtes HTTP
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Capturer la fin de la réponse
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    logger.http(req, res, responseTime);
  });
  
  next();
};

module.exports = requestLogger;
