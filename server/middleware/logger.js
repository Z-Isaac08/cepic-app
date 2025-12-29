const logger = require('../utils/logger');

/**
 * MIDDLEWARE DE LOGGING DES REQUÊTES HTTP
 *
 * Enregistre toutes les requêtes HTTP avec les détails suivants:
 * - ID de requête unique (pour le traçage)
 * - Méthode HTTP (GET, POST, etc.)
 * - URL de la requête
 * - Temps de réponse
 * - Code de statut HTTP
 * - Adresse IP du client
 * - Agent utilisateur
 *
 * SÉCURITÉ: Les données sensibles sont masquées automatiquement:
 * - Mots de passe
 * - Tokens d'authentification
 * - Adresses email (partiellement masquées)
 * - Numéros de carte bancaire
 * - Clés API et secrets
 */

/**
 * Patterns de détection des données sensibles à masquer dans les logs
 */
const SENSITIVE_PATTERNS = {
  password: /("password"\s*:\s*)"[^"]*"/gi,
  token: /("token"\s*:\s*)"[^"]*"/gi,
  auth: /(authorization:\s*bearer\s+)[^\s]+/gi,
  email: /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi,
  creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
  apiKey: /("api[_-]?key"\s*:\s*)"[^"]*"/gi,
  secret: /("secret"\s*:\s*)"[^"]*"/gi,
};

/**
 * Masquer les données sensibles dans les chaînes de caractères
 *
 * @param {string|object} data - Données à masquer
 * @returns {string} Données avec les informations sensibles masquées
 */
const maskSensitiveData = (data) => {
  if (!data) return data;

  let maskedData = typeof data === 'string' ? data : JSON.stringify(data);

  // Masquer les mots de passe
  maskedData = maskedData.replace(SENSITIVE_PATTERNS.password, '$1"***MASQUÉ***"');

  // Masquer les tokens
  maskedData = maskedData.replace(SENSITIVE_PATTERNS.token, '$1"***MASQUÉ***"');

  // Masquer les en-têtes d'autorisation
  maskedData = maskedData.replace(SENSITIVE_PATTERNS.auth, '$1***MASQUÉ***');

  // Masquer partiellement les emails (garder les 2 premiers caractères et le domaine)
  maskedData = maskedData.replace(SENSITIVE_PATTERNS.email, (match, user, domain) => {
    const maskedUser = user.length > 2 ? user.substring(0, 2) + '***' : '***';
    return `${maskedUser}@${domain}`;
  });

  // Masquer les numéros de carte bancaire
  maskedData = maskedData.replace(SENSITIVE_PATTERNS.creditCard, '****-****-****-****');

  // Masquer les clés API
  maskedData = maskedData.replace(SENSITIVE_PATTERNS.apiKey, '$1"***MASQUÉ***"');

  // Masquer les secrets
  maskedData = maskedData.replace(SENSITIVE_PATTERNS.secret, '$1"***MASQUÉ***"');

  return typeof data === 'string' ? maskedData : maskedData;
};

/**
 * Enregistrer les détails de la requête avec masquage des données sensibles
 *
 * @param {object} req - Objet de requête Express
 * @param {object} res - Objet de réponse Express
 * @param {number} startTime - Temps de début de la requête (timestamp)
 * @param {*} responseData - Données de réponse (facultatif)
 */
const logRequest = (req, res, startTime, responseData) => {
  // Marquer comme enregistré pour éviter les doublons
  res.locals.logged = true;

  const responseTime = Date.now() - startTime;
  const { method, originalUrl, ip } = req;
  const { statusCode } = res;

  // Déterminer le niveau de log basé sur le code de statut
  const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

  // Préparer le corps de requête masqué
  const maskedBody = req.body ? maskSensitiveData(req.body) : undefined;

  // Préparer la réponse masquée (seulement pour les erreurs)
  let maskedResponse;
  if (statusCode >= 400 && responseData) {
    maskedResponse = maskSensitiveData(responseData);
  }

  // Enregistrer avec l'ID de requête pour le traçage
  logger.log(level, `${method} ${originalUrl}`, {
    requestId: req.id || 'inconnu',
    statusCode,
    ip,
    responseTime: `${responseTime}ms`,
    userAgent: req.get('user-agent'),
    userId: req.user?.id,
    body: maskedBody,
    response: maskedResponse,
  });
};

/**
 * Middleware principal de logging des requêtes avec masquage des données sensibles
 *
 * @description Capture les requêtes et réponses HTTP pour les enregistrer
 * @description Masque automatiquement toutes les données sensibles
 * @description Inclut l'ID de requête unique pour le traçage distribué
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Capturer les détails de la réponse
  const originalSend = res.send;
  const originalJson = res.json;

  res.send = function (data) {
    res.send = originalSend;
    logRequest(req, res, startTime, data);
    return res.send(data);
  };

  res.json = function (data) {
    res.json = originalJson;
    logRequest(req, res, startTime, data);
    return res.json(data);
  };

  // Enregistrer également lors de la fin de la réponse (pour les cas où send/json ne sont pas appelés)
  res.on('finish', () => {
    if (!res.locals.logged) {
      logRequest(req, res, startTime);
    }
  });

  next();
};

module.exports = requestLogger;
