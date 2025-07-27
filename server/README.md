# 🔧 Backend API - ProjectMoney

API REST sécurisée construite avec Node.js, Express et PostgreSQL avec authentification avancée et sécurité renforcée.

## 📋 Table des Matières

- [🔍 Aperçu](#-aperçu)
- [🛠️ Technologies](#️-technologies)
- [🚀 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [📁 Structure](#-structure)
- [🔐 Authentification](#-authentification)
- [📊 Base de Données](#-base-de-données)
- [🛡️ Sécurité](#️-sécurité)
- [📱 API Endpoints](#-api-endpoints)
- [🧪 Tests](#-tests)
- [🐳 Docker](#-docker)
- [📈 Monitoring](#-monitoring)

## 🔍 Aperçu

L'API backend de ProjectMoney fournit une infrastructure robuste pour la gestion financière avec :

- **Authentification sécurisée** avec 2FA obligatoire
- **Architecture RESTful** avec validation stricte
- **Base de données PostgreSQL** avec Prisma ORM
- **Sécurité avancée** (CSRF, XSS, Rate limiting)
- **Audit complet** de toutes les actions
- **Performance optimisée** avec mise en cache

## 🛠️ Technologies

### Core
- **Node.js 18+** - Runtime JavaScript
- **Express.js** - Framework web minimaliste et rapide
- **Prisma ORM** - ORM type-safe avec migrations automatiques
- **PostgreSQL** - Base de données relationnelle performante

### Authentification & Sécurité
- **JWT (jsonwebtoken)** - Tokens d'authentification
- **bcryptjs** - Hachage sécurisé des mots de passe
- **Helmet.js** - Sécurisation des headers HTTP
- **Express Rate Limit** - Protection contre les attaques par déni de service
- **CORS** - Configuration cross-origin sécurisée
- **Express Validator** - Validation et sanitisation des données

### Utilitaires
- **Nodemailer** - Envoi d'emails transactionnels
- **Cookie Parser** - Gestion des cookies sécurisés
- **Morgan** - Logging des requêtes HTTP
- **Dotenv** - Gestion des variables d'environnement

## 🚀 Installation

### Prérequis
```bash
# Versions requises
Node.js >= 18.0.0
PostgreSQL >= 13.0
npm >= 8.0.0
```

### 1. Installation des Dépendances
```bash
cd server
npm install
```

### 2. Configuration de la Base de Données
```bash
# Créer une base de données PostgreSQL
createdb projectmoney

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos paramètres
```

### 3. Migration et Initialisation
```bash
# Appliquer les migrations Prisma
npx prisma migrate dev

# Générer le client Prisma
npx prisma generate

# Peupler avec des données de test (optionnel)
npx prisma db seed
```

### 4. Démarrage du Serveur
```bash
# Développement
npm run dev

# Production
npm start

# Mode debug
npm run debug
```

## ⚙️ Configuration

### Variables d'Environnement (.env)

```bash
# Configuration du serveur
NODE_ENV=development
PORT=3001

# Base de données PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/projectmoney"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=projectmoney
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe

# Sécurité et authentification
JWT_SECRET=votre_clé_jwt_ultra_sécurisée_256_bits
JWT_REFRESH_SECRET=votre_clé_refresh_ultra_sécurisée_256_bits
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECRET=votre_clé_cookie_sécurisée

# Configuration email (production)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_app
EMAIL_FROM=noreply@projectmoney.com

# URLs et CORS
CLIENT_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
STRICT_RATE_LIMIT_MAX=5

# Mode debug
DEBUG_MODE=false
LOG_LEVEL=info
```

### Configuration Prisma

```javascript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 📁 Structure

```
server/
├── 📁 controllers/           # Contrôleurs de routes
│   └── authController.js     # Authentification et utilisateurs
├── 📁 middleware/            # Middlewares Express
│   ├── auth.js              # Authentification et autorisation
│   ├── errorHandler.js      # Gestion globale des erreurs
│   ├── security.js          # Sécurité (rate limiting, headers)
│   └── validation.js        # Validation des données
├── 📁 routers/              # Définition des routes
│   └── authRoutes.js        # Routes d'authentification
├── 📁 schemas/              # Schémas de validation
│   └── authSchemas.js       # Validation des données auth
├── 📁 utils/                # Utilitaires
│   ├── auditLogger.js       # Journalisation des audits
│   ├── email.js             # Service d'envoi d'emails
│   └── jwt.js               # Gestion des tokens JWT
├── 📁 lib/                  # Bibliothèques
│   └── prisma.js            # Client Prisma configuré
├── 📁 prisma/               # Configuration base de données
│   ├── schema.prisma        # Schéma de la base de données
│   ├── migrations/          # Migrations automatiques
│   └── seed.js              # Données d'initialisation
├── 📄 index.js              # Point d'entrée principal
├── 📄 package.json          # Dépendances et scripts
└── 📄 README.md             # Ce fichier
```

## 🔐 Authentification

### Flux d'Authentification

1. **Vérification Email** → `POST /api/auth/check-email`
2. **Connexion/Inscription** → `POST /api/auth/login|register`
3. **Vérification 2FA** → `POST /api/auth/verify-2fa`
4. **Génération Tokens** → JWT + Refresh Token
5. **Accès Protégé** → Header Authorization + Cookies

### Types de Tokens

```javascript
// JWT Access Token (15 minutes)
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "USER",
  "verified": true,
  "iat": 1234567890,
  "exp": 1234568790
}

// Refresh Token (7 jours)
{
  "sub": "user_id",
  "type": "refresh",
  "sessionId": "session_uuid",
  "iat": 1234567890,
  "exp": 1234964890
}
```

### Protection des Routes

```javascript
// Middleware de protection
const { protect, requireVerified } = require('./middleware/auth');

// Route protégée simple
router.get('/protected', protect, handler);

// Route nécessitant vérification email
router.post('/sensitive', protect, requireVerified, handler);
```

## 📊 Base de Données

### Modèles Principaux

```prisma
// Utilisateur
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  password    String
  firstName   String
  lastName    String
  role        Role     @default(USER)
  isActive    Boolean  @default(true)
  isVerified  Boolean  @default(false)
  lastLogin   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  sessions    Session[]
  auditLogs   AuditLog[]
  twoFACodes  TwoFACode[]
}

// Session utilisateur
model Session {
  id          String   @id @default(uuid())
  userId      String
  token       String   @unique
  refreshToken String  @unique
  isRevoked   Boolean  @default(false)
  userAgent   String?
  ipAddress   String?
  expiresAt   DateTime
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// Code 2FA
model TwoFACode {
  id          String      @id @default(uuid())
  userId      String
  code        String
  tempToken   String      @unique
  type        TwoFAType
  isUsed      Boolean     @default(false)
  expiresAt   DateTime
  createdAt   DateTime    @default(now())

  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Commandes Prisma Utiles

```bash
# Voir l'état de la base de données
npx prisma db status

# Créer et appliquer une migration
npx prisma migrate dev --name nom_migration

# Réinitialiser la base de données
npx prisma migrate reset

# Interface graphique
npx prisma studio

# Générer le client après modification du schéma
npx prisma generate
```

## 🛡️ Sécurité

### Mesures Implémentées

#### 1. Protection des Headers HTTP
```javascript
// Helmet.js configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

#### 2. Rate Limiting
```javascript
// Configuration rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  message: 'Trop de tentatives de connexion',
  standardHeaders: true,
  legacyHeaders: false,
});
```

#### 3. Validation des Données
```javascript
// Exemple de schéma de validation
const loginSchema = z.object({
  email: z.string()
    .email('Email invalide')
    .max(255, 'Email trop long'),
  password: z.string()
    .min(8, 'Mot de passe trop court')
    .max(128, 'Mot de passe trop long')
});
```

#### 4. Audit Logging
```javascript
// Journal d'audit automatique
await AuditLogger.logAuth('login_success', req, user.id, true, {
  userAgent: req.get('User-Agent'),
  ipAddress: req.ip,
  timestamp: new Date()
});
```

## 📱 API Endpoints

### Authentification

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `POST` | `/api/auth/check-email` | Vérifier si email existe | ❌ |
| `POST` | `/api/auth/login` | Connexion utilisateur | ❌ |
| `POST` | `/api/auth/register` | Inscription utilisateur | ❌ |
| `POST` | `/api/auth/verify-2fa` | Vérifier code 2FA | ❌ |
| `POST` | `/api/auth/resend-2fa` | Renvoyer code 2FA | ❌ |
| `GET` | `/api/auth/me` | Profil utilisateur | ✅ |
| `POST` | `/api/auth/logout` | Déconnexion | ✅ |
| `POST` | `/api/auth/refresh` | Renouveler token | ❌ |
| `GET` | `/api/auth/sessions` | Sessions actives | ✅ |
| `DELETE` | `/api/auth/sessions/:id` | Révoquer session | ✅ |

### Exemples de Requêtes

#### Connexion
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "motdepasse123"
  }'
```

#### Obtenir le profil utilisateur
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --cookie "auth_token=YOUR_AUTH_COOKIE"
```

### Réponses API

#### Succès (200)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  },
  "message": "Opération réussie"
}
```

#### Erreur (400)
```json
{
  "success": false,
  "error": "Données invalides",
  "details": [
    {
      "field": "email",
      "message": "Email requis"
    }
  ]
}
```

## 🧪 Tests

### Types de Tests

```bash
# Tests unitaires
npm test

# Tests d'intégration
npm run test:integration

# Couverture de code
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

### Structure des Tests

```
server/tests/
├── 📁 unit/                 # Tests unitaires
│   ├── controllers/         # Tests des contrôleurs
│   ├── middleware/          # Tests des middlewares
│   └── utils/               # Tests des utilitaires
├── 📁 integration/          # Tests d'intégration
│   ├── auth.test.js         # Tests API authentification
│   └── database.test.js     # Tests base de données
└── 📁 fixtures/             # Données de test
    └── users.json           # Utilisateurs de test
```

### Exemple de Test

```javascript
// tests/integration/auth.test.js
describe('API Authentification', () => {
  test('POST /api/auth/login - Connexion réussie', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.tempToken).toBeDefined();
  });
});
```

## 🐳 Docker

### Dockerfile Production

```dockerfile
FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "index.js"]
```

### Commandes Docker

```bash
# Build de l'image
docker build -t projectmoney-api .

# Lancement du conteneur
docker run -p 3001:3001 projectmoney-api

# Avec docker-compose
docker-compose up backend
```

## 📈 Monitoring

### Logs et Métriques

```javascript
// Configuration des logs
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

### Health Check

```bash
# Vérification de l'état du serveur
curl http://localhost:3001/health

# Réponse
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "2.0.0",
  "database": "connected"
}
```

### Scripts de Maintenance

```bash
# Nettoyer les sessions expirées
npm run cleanup:sessions

# Archiver les logs anciens
npm run archive:logs

# Optimiser la base de données
npm run db:optimize
```

## 🚀 Déploiement

### Production

```bash
# Variables d'environnement de production
NODE_ENV=production
DATABASE_URL=postgresql://prod_user:prod_pass@db:5432/prod_db
JWT_SECRET=super_secret_production_key
CLIENT_URL=https://projectmoney.com

# Build et démarrage
npm run build
npm start
```

### Scripts NPM

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:migrate": "npx prisma migrate dev",
    "db:seed": "npx prisma db seed",
    "db:studio": "npx prisma studio",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

---

<div align="center">

**🔧 Backend API robuste et sécurisée pour ProjectMoney**

[Retour au projet principal](../README.md) • [Frontend](../client/README.md) • [API Docs](./docs/api.md)

</div>