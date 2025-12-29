# Nouvelles Fonctionnalités de Sécurité - Novembre 2025

## Vue d'Ensemble

Le backend de la plateforme CEPIC a été mis à niveau avec plusieurs améliorations de sécurité importantes:

### ✅ Améliorations Implémentées

1. **Protection CSRF Améliorée**

   - Génération de tokens cryptographiques sécurisés
   - Validation sur deux niveaux (origine + token)
   - Endpoint: `GET /api/csrf-token`

2. **Validation des Fichiers Téléchargés**

   - Whitelist stricte des types de fichiers
   - Limites de taille: 5MB (images), 10MB (documents)
   - Noms de fichiers générés aléatoirement
   - Gestion d'erreurs complète

3. **Traçage des Requêtes**

   - ID unique pour chaque requête
   - En-tête `X-Request-ID` dans les réponses
   - Traçage complet dans les logs

4. **En-têtes de Sécurité Renforcés**

   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Permissions-Policy` restrictive
   - `Referrer-Policy: strict-origin-when-cross-origin`

5. **Masquage des Données Sensibles**

   - Mots de passe masqués dans les logs
   - Tokens d'authentification protégés
   - Emails partiellement masqués
   - Numéros de carte bancaire cachés

6. **Health Checks Avancés**
   - `/health/live` - Serveur actif
   - `/health/ready` - Serveur + Base de données
   - Utile pour monitoring et orchestration

---

## Nouveaux Fichiers

### Backend

- `server/middleware/requestId.js` - Génération d'ID de requête
- `server/config/multer.config.js` - Configuration sécurisée uploads
- `server/middleware/logger.js` - Logging avec masquage (amélioré)
- `server/middleware/security.js` - Sécurité CSRF et headers (amélioré)

### Documentation

- `docs/GUIDE_ADMINISTRATEUR.md` - Guide complet pour administrateurs non-techniques

---

## Nouveaux Endpoints API

### CSRF Token

```
GET /api/csrf-token
```

Retourne un token CSRF à inclure dans les requêtes POST/PUT/DELETE/PATCH

**Réponse:**

```json
{
  "success": true,
  "csrfToken": "a3f5d8c2e1b4..."
}
```

### Health Checks

```
GET /health - Status général
GET /health/live - Serveur actif
GET /health/ready - Serveur + DB prêts
```

**Exemple /health/ready:**

```json
{
  "status": "ready",
  "timestamp": "2025-11-23T10:00:00.000Z",
  "checks": {
    "database": "connected"
  }
}
```

---

## Utilisation de la Config Multer

### Dans les Routes

```javascript
const { uploadImage, uploadDocument, handleMulterError } = require('../config/multer.config');

// Upload d'une seule image
router.post('/upload', uploadImage.single('photo'), controller);

// Upload de plusieurs images (max 5)
router.post('/gallery', uploadImage.array('photos', 5), controller);

// Upload de documents
router.post('/documents', uploadDocument.single('file'), controller);

// Ajouter le gestionnaire d'erreurs APRÈS les routes d'upload
router.use(handleMulterError);
```

### Limites et Types Autorisés

**Images:**

- Types: JPEG, JPG, PNG, GIF, WebP
- Taille max: 5 MB
- Maximum 5 fichiers par requête

**Documents:**

- Types: PDF, DOC, DOCX
- Taille max: 10 MB
- Maximum 3 fichiers par requête

---

## Intégration Frontend (CSRF)

### 1. Obtenir le Token CSRF

```javascript
// Au chargement de l'application
const fetchCsrfToken = async () => {
  const response = await fetch('/api/csrf-token', {
    credentials: 'include',
  });
  const data = await response.json();
  return data.csrfToken;
};

// Stocker le token (Redux, Zustand, Context, etc.)
const csrfToken = await fetchCsrfToken();
```

### 2. Inclure dans les Requêtes

```javascript
// Dans les headers (recommandé)
fetch('/api/some-endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
  },
  credentials: 'include',
  body: JSON.stringify(data),
});

// OU dans le corps de la requête
fetch('/api/some-endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ ...data, _csrf: csrfToken }),
});
```

### 3. Avec Axios

```javascript
// Intercepteur global
axios.interceptors.request.use((config) => {
  const csrfToken = store.getState().csrf.token;
  if (csrfToken && !['GET', 'HEAD', 'OPTIONS'].includes(config.method.toUpperCase())) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});
```

---

## Logs et Débogage

### Request ID

Toutes les requêtes incluent maintenant un ID unique:

```javascript
// Dans les logs
{
  "requestId": "a3f5d8c2e1b4f7a9d8e2c1b5a7f3d9e2",
  "method": "POST",
  "url": "/api/auth/login",
  "statusCode": 200,
  "responseTime": "145ms"
}

// Dans les réponses HTTP
X-Request-ID: a3f5d8c2e1b4f7a9d8e2c1b5a7f3d9e2
```

### Données Sensibles Masquées

Les logs masquent automatiquement:

- Mots de passe: `"password": "***MASQUÉ***"`
- Tokens: `"token": "***MASQUÉ***"`
- Emails: `jo***@example.com`
- Cartes bancaires: `****-****-****-****`

---

## Migration et Rétrocompatibilité

### Changements Requis

**Frontend:**

- ✅ Implémenter la récupération et inclusion des tokens CSRF
- ✅ Gérer les erreurs 403 liées au CSRF

**Backend:**

- ✅ Aucune modification requise (tout est déjà intégré)

### Rétrocompatibilité

- ✅ Tous les endpoints existants fonctionnent normalement
- ✅ La protection CSRF s'applique uniquement aux méthodes POST, PUT, PATCH, DELETE
- ✅ Les requêtes GET restent inchangées

---

## FAQ Technique

**Q: Que se passe-t-il si je n'envoie pas de token CSRF?**
R: Le serveur retournera une erreur 403 "CSRF token missing" pour les requêtes POST/PUT/PATCH/DELETE.

**Q: Le token CSRF expire-t-il?** R: Oui, après 1 heure. Récupérez-en un nouveau via `/api/csrf-token`.

**Q: Puis-je désactiver la protection CSRF temporairement?**
R: Oui, commentez la ligne `app.use(csrfProtection)` dans `server/index.js`, mais ce n'est pas recommandé.

**Q: Comment tester les uploads de fichiers?**
R: Utilisez Postman ou curl avec multipart/form-data et respectez les limites de taille/type.

**Q: Les Request IDs sont-ils persistés?**
R: Non, ils sont générés à la volée pour chaque requête et apparaissent uniquement dans les logs.

---

## Sécurité en Production

### Checklist

- [x] HTTPS activé (via serveur web/proxy)
- [x] Protection CSRF implémentée
- [x] Rate limiting actif
- [x] Logs avec masquage des données sensibles
- [x] Headers de sécurité configurés
- [x] Validation des uploads de fichiers
- [ ] Monitoring des health checks configuré
- [ ] Alertes sur `/health/ready` en erreur

### Recommandations

1. **Monitoring**

   - Surveillez `/health/ready` régulièrement
   - Alertez si retourne 503
   - Trackez les Request IDs pour le débogage

2. **Backups**

   - Sauvegardez régulièrement les logs
   - Archivez les anciens logs (rotation automatique activée)

3. **Mises à Jour**
   - Gardez les dépendances npm à jour
   - Surveillez les CVE de sécurité

---

**Dernière mise à jour:** 23 Novembre 2025  
**Version:** 2.0
