const winston = require('winston');
const path = require('path');

/**
 * Configuration du logger centralisé avec Winston
 */

// Format personnalisé pour les logs
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    // Ajouter les métadonnées si présentes
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    
    // Ajouter la stack trace pour les erreurs
    if (stack) {
      log += `\n${stack}`;
    }
    
    return log;
  })
);

// Configuration des transports
const transports = [
  // Console (toujours actif)
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      customFormat
    ),
  }),
];

// En production, ajouter des fichiers de log
if (process.env.NODE_ENV === 'production') {
  transports.push(
    // Logs d'erreurs
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
      format: customFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Tous les logs
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      format: customFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Créer le logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: customFormat,
  transports,
  // Ne pas quitter sur erreur
  exitOnError: false,
});

/**
 * Logger pour les requêtes HTTP
 */
logger.http = (req, res, responseTime) => {
  const { method, originalUrl, ip } = req;
  const { statusCode } = res;
  
  const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
  
  logger.log(level, `${method} ${originalUrl}`, {
    statusCode,
    ip,
    responseTime: `${responseTime}ms`,
    userAgent: req.get('user-agent'),
  });
};

/**
 * Logger pour les erreurs de base de données
 */
logger.db = (operation, error) => {
  logger.error(`Database ${operation} failed`, {
    error: error.message,
    code: error.code,
    stack: error.stack,
  });
};

/**
 * Logger pour les événements de sécurité
 */
logger.security = (event, details) => {
  logger.warn(`Security event: ${event}`, details);
};

/**
 * Logger pour les événements métier
 */
logger.business = (event, details) => {
  logger.info(`Business event: ${event}`, details);
};

module.exports = logger;
