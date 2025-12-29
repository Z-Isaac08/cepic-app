const crypto = require('crypto');

/**
 * Middleware de génération d'ID unique pour chaque requête
 * Permet le traçage et le debugging des requêtes à travers les logs
 *
 * @description Génère un ID aléatoire sécurisé de 16 octets pour chaque requête
 * @description Ajoute l'ID à l'objet req et comme en-tête de réponse
 */
const requestIdMiddleware = (req, res, next) => {
  // Générer un ID unique cryptographiquement sécurisé
  const requestId = crypto.randomBytes(16).toString('hex');

  // Attacher l'ID à l'objet de requête
  req.id = requestId;

  // Ajouter l'ID dans les en-têtes de réponse pour le traçage côté client
  res.setHeader('X-Request-ID', requestId);

  next();
};

module.exports = requestIdMiddleware;
