# 📁 STRUCTURE DU PROJET - CEPIC

## Date: November 2, 2025

---

## 🏗️ ARCHITECTURE GLOBALE

```
ProjectMoney/
├── client/                 # Frontend React + Vite
├── server/                 # Backend Node.js + Express
├── docs/                   # Documentation (46 fichiers)
├── docker-compose.yml      # Configuration Docker
├── .prettierrc            # Configuration Prettier
├── .prettierignore        # Fichiers ignorés Prettier
└── README.md              # Documentation principale
```

---

## 📂 STRUCTURE BACKEND (server/)

```
server/
├── controllers/           # Logique métier (8 fichiers)
│   ├── adminController.js
│   ├── authController.js
│   ├── categoryController.js
│   ├── contactController.js
│   ├── enrollmentController.js
│   ├── galleryController.js
│   ├── paymentController.js      # ⚠️ Vide
│   └── trainingController.js
│
├── middleware/            # Middlewares (5 fichiers)
│   ├── auth.js           # Authentification JWT
│   ├── errorHandler.js   # Gestion erreurs
│   ├── logger.js         # ✅ Logging HTTP
│   ├── security.js       # Sécurité (Helmet, CORS, etc.)
│   └── validation.js     # Validation données
│
├── routers/              # Routes API (7 fichiers)
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── contactRoutes.js
│   ├── enrollmentRoutes.js
│   ├── galleryRoutes.js
│   ├── paymentRoutes.js   # ⚠️ Routes vides
│   └── trainingRoutes.js
│
├── prisma/               # Base de données (3 fichiers)
│   ├── schema.prisma     # Schéma DB complet
│   ├── seed-cepic.js     # Données de test
│   └── migrations/       # Migrations
│
├── utils/                # Utilitaires (3 fichiers)
│   ├── email.js          # ✅ Service email (Nodemailer)
│   ├── jwt.js            # Gestion JWT
│   ├── logger.js         # ✅ Logger Winston
│   └── validateEnv.js    # ✅ Validation env (Zod)
│
├── lib/                  # Configuration (1 fichier)
│   └── prisma.js         # Client Prisma
│
├── schemas/              # Validation Zod (1 fichier)
│   └── auth.js           # Schémas auth
│
├── .env                  # Variables d'environnement
├── .env.example          # Template env
├── package.json          # Dépendances backend
└── index.js              # ✅ Point d'entrée (avec logger)
```

### Dépendances Backend

**Production:**
```json
{
  "@prisma/client": "^6.11.1",
  "axios": "^1.13.1",
  "bcryptjs": "^3.0.2",
  "compression": "^1.8.1",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^17.2.1",
  "express": "^4.21.2",
  "express-rate-limit": "^8.0.1",
  "express-validator": "^7.2.1",
  "helmet": "^8.1.0",
  "jsonwebtoken": "^9.0.2",
  "nodemailer": "^7.0.5",
  "winston": "^3.x.x",  // ✅ Ajouté
  "zod": "^4.0.10"
}
```

**Dev:**
```json
{
  "prisma": "^6.11.1"
}
```

---

## 📂 STRUCTURE FRONTEND (client/)

```
client/
├── src/
│   ├── components/       # Composants React
│   │   ├── admin/        # 8 composants admin
│   │   │   ├── AnalyticsPanel.jsx       # ⚠️ Données mockées
│   │   │   ├── CategoriesManagement.jsx # ⚠️ Pas de CRUD
│   │   │   ├── DashboardOverview.jsx    # ⚠️ Données mockées
│   │   │   ├── GalleryManagement.jsx    # ⚠️ Pas connecté
│   │   │   ├── MessagesManagement.jsx   # ⚠️ Pas connecté
│   │   │   ├── SettingsPanel.jsx        # ⚠️ Pas de save
│   │   │   ├── TrainingsManagement.jsx  # ⚠️ Pas de CRUD
│   │   │   └── UsersManagement.jsx      # ⚠️ Pas de CRUD
│   │   │
│   │   ├── layout/       # 3 composants layout
│   │   │   ├── Footer.jsx
│   │   │   ├── NavBar.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── trainings/    # 9 composants formations
│   │   │   ├── CategoryCard.jsx
│   │   │   ├── TrainingCard.jsx
│   │   │   └── detail/
│   │   │       ├── InstructorCard.jsx
│   │   │       ├── PricingCard.jsx
│   │   │       ├── ProgramAccordion.jsx
│   │   │       ├── ReviewSection.jsx    # ✅ Connecté
│   │   │       └── TrainingHero.jsx
│   │   │
│   │   ├── ui/           # 6 composants UI
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── PageHeader.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── library/      # ❌ OBSOLÈTE (ancien système livres)
│   │   │   ├── BookCard.jsx
│   │   │   ├── CartSidebar.jsx
│   │   │   └── PaymentModal.jsx
│   │   │
│   │   └── features/     # ❌ OBSOLÈTE (ancien système)
│   │       ├── EventHero.jsx
│   │       └── RegistrationSteps.jsx
│   │
│   ├── pages/            # 14 pages
│   │   ├── HomePage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── GalleryPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx          # ⚠️ alert() ligne 111
│   │   ├── TrainingsPage.jsx
│   │   ├── TrainingDetailPage.jsx
│   │   ├── EnrollPage.jsx            # ❌ Paiement TODO
│   │   ├── FavoritesPage.jsx
│   │   ├── MyEnrollmentsPage.jsx
│   │   ├── AdminPage.jsx
│   │   └── AdminDashboard.jsx        # ❌ DOUBLON
│   │
│   ├── stores/           # 11 stores Zustand
│   │   ├── authStore.js              # ✅ Simplifié
│   │   ├── trainingStore.js          # ✅ Connecté
│   │   ├── adminStore.js             # ✅ Connecté
│   │   ├── categoryStore.js
│   │   ├── contactStore.js
│   │   ├── enrollmentStore.js
│   │   ├── galleryStore.js
│   │   ├── bookStore.js              # ❌ OBSOLÈTE
│   │   ├── eventStore.js             # ❌ OBSOLÈTE
│   │   ├── registrationStore.js      # ❌ OBSOLÈTE
│   │   └── index.js
│   │
│   ├── services/         # Services API
│   │   └── api/          # 10 fichiers API
│   │       ├── index.js
│   │       ├── admin.js              # ✅ Complet
│   │       ├── auth.js               # ✅ Complet
│   │       ├── categories.js
│   │       ├── contact.js
│   │       ├── gallery.js
│   │       ├── trainings.js          # ✅ Complet
│   │       ├── payments.js           # ⚠️ Basique
│   │       └── api.js                # ❌ DOUBLON
│   │
│   ├── config/           # Configuration
│   │   └── api.js        # Config axios
│   │
│   ├── assets/           # Assets statiques
│   ├── App.jsx           # ✅ Routes configurées
│   ├── main.jsx          # Point d'entrée
│   └── index.css         # Styles Tailwind
│
├── public/               # Fichiers publics
├── package.json          # Dépendances frontend
└── vite.config.js        # Configuration Vite
```

### Dépendances Frontend

**Production:**
```json
{
  "@tailwindcss/vite": "^4.1.11",
  "axios": "^1.10.0",
  "framer-motion": "^12.23.3",
  "lucide-react": "^0.525.0",
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-router": "^7.6.3",
  "tailwindcss": "^4.1.11",
  "zustand": "^5.0.6"
}
```

**Dev:**
```json
{
  "@vitejs/plugin-react": "^4.6.0",
  "eslint": "^9.30.1",
  "vite": "^7.0.4"
}
```

---

## 📊 STATISTIQUES DU PROJET

### Backend
- **Controllers:** 8 fichiers (1 vide)
- **Routes:** 7 fichiers (1 vide)
- **Middleware:** 5 fichiers
- **Utils:** 4 fichiers
- **Models:** 1 schema Prisma (15 models)
- **Total lignes:** ~5000 lignes

### Frontend
- **Pages:** 14 fichiers (1 doublon)
- **Composants:** ~47 fichiers
- **Stores:** 11 fichiers (3 obsolètes)
- **Services:** 10 fichiers (1 doublon)
- **Total lignes:** ~8000 lignes

### Documentation
- **Fichiers .md:** 47 fichiers
- **Total:** ~50,000 mots

---

## ✅ POINTS FORTS

### Architecture
- ✅ Séparation claire frontend/backend
- ✅ Structure modulaire et scalable
- ✅ Utilisation de patterns modernes (Zustand, React Router 7)
- ✅ Configuration Docker prête

### Backend
- ✅ Authentification 2FA complète
- ✅ Sécurité renforcée (Helmet, CORS, Rate limiting)
- ✅ Logger Winston centralisé
- ✅ Validation Zod des variables d'environnement
- ✅ Email service configuré
- ✅ Prisma ORM avec schema complet

### Frontend
- ✅ React 19 + Vite 7 (dernières versions)
- ✅ Tailwind CSS 4 pour styling
- ✅ Zustand pour state management
- ✅ Composants UI réutilisables
- ✅ Responsive design

---

## ❌ PROBLÈMES IDENTIFIÉS

### Fichiers Obsolètes (À SUPPRIMER)

#### Frontend
```
client/src/components/library/     # Ancien système livres
client/src/components/features/    # Ancien système événements
client/src/stores/bookStore.js
client/src/stores/eventStore.js
client/src/stores/registrationStore.js
client/src/services/api.js         # Doublon
client/src/pages/AdminDashboard.jsx # Doublon
```

#### Backend
```
server/routers/paymentRoutes.js    # Routes vides (à compléter)
server/controllers/paymentController.js # Vide (à compléter)
```

### Fonctionnalités Incomplètes

#### Backend
- ❌ **Paiement:** Routes et controllers vides
- ⚠️ **Tests:** Aucun test

#### Frontend
- ❌ **Paiement:** TODO non implémenté
- ❌ **Admin CRUD:** Composants non connectés
- ❌ **Toast:** Utilisation de alert()
- ⚠️ **Tests:** Aucun test

### Dépendances Manquantes

#### Backend
```bash
# À installer:
npm install redis          # Cache
npm install @sentry/node   # Monitoring
```

#### Frontend
```bash
# À installer:
npm install sonner                    # Toast notifications
npm install @stripe/stripe-js         # Paiement (plus tard)
npm install @stripe/react-stripe-js   # Paiement (plus tard)
npm install @sentry/react             # Monitoring
```

---

## 🎯 ORGANISATION RECOMMANDÉE

### Pas de changement majeur nécessaire

L'architecture actuelle est **bonne et cohérente**.

**Recommandations mineures:**
1. Supprimer les fichiers obsolètes
2. Compléter les fonctionnalités manquantes
3. Ajouter les tests
4. Ajouter le monitoring

---

## 📝 NOTES IMPORTANTES

### Variables d'Environnement

**Backend (.env):**
```env
# Serveur
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=...
JWT_EXPIRES_IN=7d

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=...
EMAIL_PASS=...

# Sécurité
CORS_ORIGIN=http://localhost:5173

# À ajouter pour paiement:
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:3001/api

# À ajouter pour paiement:
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

---

## 🚀 PROCHAINES ÉTAPES

1. **Supprimer fichiers obsolètes** (1h)
2. **Installer dépendances manquantes** (30min)
3. **Implémenter toast notifications** (2 jours)
4. **Compléter système de paiement** (1 semaine)
5. **Connecter admin CRUD** (1 semaine)
6. **Ajouter tests** (1 semaine)
7. **Monitoring & optimisations** (3 jours)

---

**STRUCTURE ANALYSÉE ET DOCUMENTÉE** ✅

*Prochaine étape: Créer FILES_TO_DELETE.md*
