# 📚 ProjectMoney - Plateforme Client (CEPIC)

Note de confidentialité: Ce dépôt est privé et fourni dans le cadre d’une prestation pour le client CEPIC. Toute diffusion est interdite sans accord écrit de CEPIC.

ProjectMoney est une plateforme de bibliothèque numérique complète permettant aux utilisateurs d'acheter, télécharger et gérer des livres numériques. La plateforme inclut un système d'authentification sécurisé avec 2FA, une gestion des commandes, et une interface d'administration.

Informations client (CEPIC):

- Raison sociale: Cabinet d’études, de prestations et d’intermédiation commerciale (CEPIC)
- Sigle: CEPIC — SARL (création: Juin 2023)
- Adresse: Cocody M’Badon village – 18 BP 822 ABIDJAN 18 (Abidjan – Côte d’Ivoire)
- Contacts: +225 27 22 28 20 66 / +225 05 46 66 33 63
- Email: info@cepic.ci
- Site: www.cepic.ci

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité

- **Authentification à deux facteurs (2FA)** par email
- **Sessions sécurisées** avec JWT et refresh tokens
- **Cookies HTTP-only** pour la sécurité
- **Protection CSRF, XSS** et limitation de taux
- **Hashage sécurisé** des mots de passe avec bcrypt
- **Vérification email** obligatoire

### 📖 Bibliothèque Numérique

- **Catalogue de livres** avec catégories, tags et recherche
- **Support multi-formats** : PDF, EPUB, MOBI, DOC, etc.
- **Système de notation** et avis clients
- **Favoris** et historique de téléchargements
- **Livres gratuits** et payants
- **Images de couverture** automatiques via Unsplash

### 💰 Commerce Électronique

- **Système de commandes** complet
- **Panier d'achat** avec gestion des quantités
- **Prix en FCFA** (Franc CFA d'Afrique de l'Ouest)
- **Réductions** et prix promotionnels
- **Statuts de commande** : PENDING, PAID, COMPLETED, etc.
- **Intégration paiement** prête (Mobile Money, Cartes, Virements)

### 👑 Administration

- **Panel d'administration** pour les ADMIN/MODERATOR
- **Gestion des utilisateurs** et rôles
- **Gestion des livres** et catégories
- **Analytics** et statistiques de vente
- **Logs d'audit** pour traçabilité

## 🏗️ Architecture Technique

### Backend (Node.js + Express)

```
server/
├── controllers/        # Logique métier
├── middleware/         # Validations, auth, erreurs
├── routers/           # Routes API
├── utils/             # JWT, email, helpers
├── prisma/            # Schema DB et seeds
└── lib/               # Configuration Prisma
```

### Frontend (React + Vite)

```
client/
├── src/
│   ├── components/    # Composants React
│   ├── pages/         # Pages de l'application
│   ├── stores/        # État global (Zustand)
│   ├── utils/         # Utilitaires
│   └── styles/        # Styles Tailwind CSS
```

### Base de Données (PostgreSQL)

- **Users** : Utilisateurs avec rôles et authentification
- **Sessions** : Gestion des sessions sécurisées
- **TwoFACodes** : Codes 2FA temporaires
- **LibraryCategories** : Catégories de livres
- **LibraryBooks** : Catalogue des livres
- **LibraryBookmarks** : Favoris utilisateurs
- **LibraryReviews** : Avis et notes
- **LibraryDownloads** : Historique téléchargements
- **Orders** : Commandes et paiements
- **OrderItems** : Articles dans les commandes

## 🚀 Installation & Démarrage

### Prérequis

- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (optionnel)

### 🐳 Démarrage avec Docker (Recommandé)

1. **Cloner le projet**

```bash
git clone <repository-url>
cd ProjectMoney
```

2. **Lancer avec Docker Compose**

```bash
docker-compose up
```

3. **Accès à l'application**

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3001](http://localhost:3001)
- Base de données: localhost:5432

### 💻 Installation locale

#### Backend

```bash
cd server
npm install
cp .env.example .env  # Configurer les variables
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

#### Frontend

```bash
cd client
npm install
npm run dev
```

## 🌱 Données de Test (Seeds)

Le système inclut des données de test automatiquement créées :

### 👥 Comptes Utilisateurs

```
Admin:     admin@test.com       / secret123
User:      user@test.com        / secret123
Non-vérifié: unverified@test.com / secret123
```

### 📚 Catalogue

- **6 catégories** : Fantasy, Thriller, Science-Fiction, Romance, Développement Personnel, Histoire
- **14 livres** avec couvertures, descriptions et prix
- **2 livres gratuits** pour tester le téléchargement
- **Prix réalistes** en FCFA (11,000 - 17,500 FCFA)

### 🏷️ Exemples de Livres

- **Le Royaume Perdu** (Fantasy) - 15,000 FCFA
- **Ombres et Secrets** (Thriller) - 12,000 FCFA
- **Code Quantum** (Sci-Fi) - 17,500 FCFA
- **Guide JavaScript** (Gratuit)
- **Recettes Africaines** (Gratuit)

## 🔧 Configuration

### Variables d'Environnement (Backend)

```env
# Serveur
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# JWT Security
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Base de données
DATABASE_URL=postgresql://user:password@localhost:5432/projectmoney

# Email (2FA)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Sécurité
CSRF_SECRET=your_csrf_secret_key
COOKIE_SECRET=your_cookie_secret_key
```

### Variables d'Environnement (Frontend)

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## 📡 API Endpoints

### 🔐 Authentication

```
POST /api/auth/check-email        # Vérifier si email existe
POST /api/auth/login             # Connexion utilisateur
POST /api/auth/register          # Inscription
POST /api/auth/verify-2fa        # Vérification code 2FA
POST /api/auth/logout            # Déconnexion
POST /api/auth/refresh           # Renouveler token
POST /api/auth/forgot-password   # Mot de passe oublié
POST /api/auth/reset-password    # Réinitialiser mot de passe
```

### 🛡️ Sécurité & Monitoring

```
GET /api/csrf-token              # Obtenir token CSRF (v2.0)
GET /health                      # Status serveur
GET /health/live                 # Liveness probe (v2.0)
GET /health/ready                # Readiness probe avec DB check (v2.0)
```

### 📚 Library

```
GET  /api/library/books          # Liste des livres
GET  /api/library/books/:id      # Détail d'un livre
GET  /api/library/categories     # Liste des catégories
POST /api/library/books/:id/bookmark  # Ajouter aux favoris
GET  /api/library/bookmarks      # Mes favoris
POST /api/library/books/:id/review    # Ajouter un avis
GET  /api/library/books/:id/download  # Télécharger livre
```

### 🛒 Orders

```
POST /api/orders                 # Créer commande
GET  /api/orders                 # Mes commandes
GET  /api/orders/:id             # Détail commande
PUT  /api/orders/:id/pay         # Confirmer paiement
```

### 👑 Admin

```
GET  /api/admin/users            # Gestion utilisateurs
GET  /api/admin/books            # Gestion livres
GET  /api/admin/orders           # Gestion commandes
GET  /api/admin/analytics        # Statistiques
```

## 🛠️ Stack Technologique

### Backend

- **Node.js 18+** - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma ORM** - Base de données
- **PostgreSQL** - Base de données
- **JWT** - Authentification
- **Bcrypt** - Hashage mots de passe
- **Nodemailer** - Envoi d'emails
- **Helmet** - Sécurité HTTP
- **Express-Rate-Limit** - Limitation de taux

### Frontend

- **React 19** - Interface utilisateur
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Styling
- **Zustand** - Gestion d'état
- **Axios** - Requêtes HTTP
- **Framer Motion** - Animations
- **Lucide React** - Icônes

### DevOps

- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration
- **PostgreSQL 15** - Base de données

## 🚦 Processus d'Authentification

1. **Vérification Email** → Vérifier si compte existe
2. **Connexion/Inscription** → Saisir email/mot de passe
3. **Code 2FA** → Recevoir code par email
4. **Vérification** → Saisir code 2FA
5. **Session** → JWT + Refresh token en cookies sécurisés

## 💳 Système de Paiement

Le système est prêt pour l'intégration avec :

- **Mobile Money** (Orange Money, MTN Money)
- **Cartes bancaires** (Visa, Mastercard)
- **Virements bancaires**
- **Crypto-monnaies** (extensible)

## 🔒 Sécurité

### Améliorations Récentes (v2.0 - Nov 2025)

- **Protection CSRF renforcée** avec tokens cryptographiques
- **Traçage des requêtes** via Request ID unique
- **Validation stricte des fichiers** uploadés (whitelist + limites taille)
- **Masquage des données sensibles** dans les logs
- **En-têtes de sécurité avancés** (X-Frame-Options, Permissions-Policy, etc.)
- **Health checks améliorés** (`/health/live`, `/health/ready`)

### Mesures de Sécurité

- **HTTPS uniquement** en production
- **Cookies HTTP-only** et Secure
- **Protection CSRF** avec tokens (endpoint `/api/csrf-token`)
- **Sanitisation XSS** automatique via DOMPurify
- **Limitation de taux** multi-niveaux (global, auth, strict)
- **Hashage bcrypt** (12 rounds)
- **Validation Zod** côté serveur
- **Headers sécurisés** avec Helmet
- **Request ID** pour traçage distribué
- **Logs masqués** (mots de passe, tokens, emails)

> 📖 Voir [docs/SECURITE_NOUVELLES_FONCTIONNALITES.md](./docs/SECURITE_NOUVELLES_FONCTIONNALITES.md) pour les détails techniques
>
> 👥 Guide admin non-technique: [docs/GUIDE_ADMINISTRATEUR.md](./docs/GUIDE_ADMINISTRATEUR.md)

## 📊 Monitoring & Logs

- **Logs d'audit** pour toutes les actions
- **Tracking des téléchargements**
- **Sessions utilisateurs** avec détails (IP, User-Agent)
- **Statistiques de vente** en temps réel

## 🚀 Déploiement Production

### Images Docker (privé)

Ce dépôt étant privé, les images ne sont pas publiées publiquement. Construisez les images localement ou via un registre privé CEPIC:

```bash
# Frontend
cd client && docker build -t cepic/projectmoney-frontend:latest .
# Backend
cd server && docker build -t cepic/projectmoney-backend:latest .
```

### Variables Production

Assurez-vous de configurer :

- `NODE_ENV=production`
- JWT secrets forts
- Base de données PostgreSQL sécurisée
- Service email configuré
- HTTPS avec certificats SSL
- CORS strict pointant vers le(s) domaine(s) CEPIC

## 📚 Documentation Complète

Documents principaux (adaptés dépôt privé CEPIC):

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** — Guide technique: architecture, API, stores, conventions.
- **[GUIDE_DEPLOIEMENT.md](./GUIDE_DEPLOIEMENT.md)** — Déploiement production (Docker, VPS, variables, HTTPS) — usage interne CEPIC.
- **[ENVIRONNEMENT.md](./ENVIRONNEMENT.md)** — Variables d’environnement (dev/prod) et gestion des secrets.

## 📝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
