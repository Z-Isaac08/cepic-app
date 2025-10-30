# 📋 PLAN DE MIGRATION : ProjectMoney → CEPIC Formation Platform

**Date:** 30 Octobre 2025  
**Client:** CEPIC - Cabinet d'Études, de Prestations et d'Intermédiation Commerciale  
**Objectif:** Transformer une plateforme de bibliothèque numérique en plateforme de gestion de formations

---

## 🎯 RÉSUMÉ EXÉCUTIF

### Projet Actuel (ProjectMoney)
- **Type:** Plateforme de bibliothèque numérique (vente de livres)
- **Stack:** React + Node.js/Express + PostgreSQL + Prisma
- **Fonctionnalités:** Authentification 2FA, catalogue de livres, commandes, paiements, admin

### Nouveau Projet (CEPIC)
- **Type:** Plateforme de gestion de formations
- **Client:** Cabinet de formation en Côte d'Ivoire
- **Catalogue:** ~23 formations réparties en 4 catégories
- **Besoins:** Site public + Inscriptions + Dashboard admin

---

## 📊 ANALYSE DU CODE EXISTANT

### ✅ Architecture Technique Actuelle

#### **Backend (Node.js/Express)**
```
server/
├── controllers/          # Logique métier (auth, library, orders, admin)
├── middleware/          # Sécurité (auth, validation, rate-limit, CSRF)
├── routers/            # Routes API (auth, library, admin)
├── utils/              # JWT, email, helpers
├── prisma/             # Schema DB + seeds
└── index.js            # Point d'entrée avec sécurité renforcée
```

**Technologies:**
- Express.js 4.21
- Prisma ORM 6.11
- PostgreSQL 15
- JWT + Bcrypt (authentification sécurisée)
- Nodemailer (emails 2FA)
- Helmet, CSRF, Rate-limiting (sécurité)

#### **Frontend (React/Vite)**
```
client/
├── src/
│   ├── components/
│   │   ├── auth/           # Composants authentification
│   │   ├── library/        # Composants catalogue livres
│   │   ├── admin/          # Dashboard admin
│   │   ├── layout/         # Header, Footer, Layout
│   │   └── ui/             # Composants réutilisables
│   ├── pages/              # Pages principales
│   ├── stores/             # État global (Zustand)
│   └── services/           # API calls
```

**Technologies:**
- React 19 + Vite 7
- Tailwind CSS 4
- Zustand (state management)
- Axios (HTTP)
- Framer Motion (animations)
- Lucide React (icônes)

---

## 🔄 MAPPING DE RÉUTILISATION

### ✅ **CE QUI EST 100% RÉUTILISABLE**

#### 1. **Système d'Authentification Complet**
- ✅ Authentification 2FA par email
- ✅ JWT + Refresh tokens
- ✅ Sessions sécurisées
- ✅ Gestion des rôles (USER, ADMIN, MODERATOR)
- ✅ Vérification email
- ✅ Mot de passe oublié
- ✅ Protection CSRF, XSS, Rate-limiting

**Fichiers réutilisables:**
- `server/controllers/authController.js`
- `server/routers/authRoutes.js`
- `server/middleware/auth.js`
- `server/middleware/security.js`
- `server/utils/jwt.js`
- `server/utils/email.js`
- `client/src/components/auth/*`
- `client/src/stores/authStore.js`

#### 2. **Infrastructure Backend**
- ✅ Configuration Express complète
- ✅ Middleware de sécurité
- ✅ Gestion des erreurs
- ✅ Configuration CORS
- ✅ Rate limiting

**Fichiers réutilisables:**
- `server/index.js`
- `server/middleware/errorHandler.js`
- `server/middleware/security.js`

#### 3. **Configuration Frontend**
- ✅ Setup React + Vite
- ✅ Configuration Tailwind CSS
- ✅ Routing (React Router)
- ✅ State management (Zustand)
- ✅ Axios configuration

**Fichiers réutilisables:**
- `client/vite.config.js`
- `client/src/main.jsx`
- `client/src/App.jsx` (structure)
- `client/src/index.css`

#### 4. **Composants UI Génériques**
- ✅ Layout (Header, Footer)
- ✅ Boutons, Cards, Modals
- ✅ Formulaires
- ✅ Loaders, Spinners

**Fichiers réutilisables:**
- `client/src/components/layout/*`
- `client/src/components/ui/*`

#### 5. **Dashboard Admin (Structure)**
- ✅ Layout admin
- ✅ Navigation
- ✅ Gestion utilisateurs
- ✅ Analytics/Statistiques

**Fichiers réutilisables (à adapter):**
- `client/src/pages/AdminDashboard.jsx`
- `client/src/components/admin/*`
- `server/controllers/adminController.js`

#### 6. **Système de Commandes/Inscriptions (Structure)**
- ✅ Modèle Order (commandes) → Base pour Enrollment
- ✅ Modèle OrderItem (articles) → Non nécessaire (1 formation = 1 inscription)
- ✅ Statuts (PENDING, PAID, COMPLETED, etc.)
- ⚠️ **Gateway de paiement à remplacer** (voir section Paiements)

**Fichiers réutilisables (à adapter):**
- `server/controllers/orderController.js` → Base pour enrollmentController
- Structure des modèles dans Prisma

---

### 🔄 **CE QUI NÉCESSITE UNE ADAPTATION**

#### 1. **Modèle de Données**
**Transformation:**
- `LibraryCategory` → `TrainingCategory` (4 catégories)
- `LibraryBook` → `Training` (23 formations)
- `LibraryBookmark` → `TrainingBookmark`
- `LibraryReview` → `TrainingReview`
- `LibraryDownload` → `TrainingEnrollment`
- `Order` → `Enrollment`

**Nouveaux champs pour Training:**
- `duration` (durée en heures/jours)
- `cost` (coût en FCFA)
- `schedule` (horaires)
- `location` (lieu)
- `maxParticipants`
- `instructor` (formateur)

**Gestion des sessions:**
- Table `TrainingSession` (une formation peut avoir plusieurs dates)
  - `startDate`, `endDate` (dates de la session)
  - `location` (lieu spécifique)
  - `maxParticipants`, `currentEnrollments`
  - `price` (peut varier par session)
  - `status` (SCHEDULED, ONGOING, COMPLETED, CANCELLED)

#### 2. **Pages Frontend**
**À créer:**
- Page d'accueil CEPIC
- Page "À propos"
- Page "Catalogue de formations"
- Page "Détail formation"
- Page "Galerie photos"
- Page "Contact"
- Page "Mes inscriptions"

**À adapter:**
- `LibraryPage.jsx` → `TrainingsPage.jsx`
- `MyBooksPage.jsx` → `MyEnrollmentsPage.jsx`

#### 3. **Système de Paiement (CRITIQUE)**
**Transformation nécessaire:**
- Gateway actuel (ProjectMoney) → **CinetPay** (Côte d'Ivoire)
- Méthodes à supporter:
  - ✅ Orange Money CI
  - ✅ MTN Mobile Money
  - ✅ Moov Money
  - ✅ Wave
  - ✅ Cartes bancaires (Visa/Mastercard)

**Nouveaux modèles:**
- Table `Payment` (transaction_id, payment_method, gateway, status)
- Webhook CinetPay pour confirmation automatique
- Intégration Mobile Money (prioritaire en CI)

**À créer:**
- `paymentController.js`
  - `POST /api/payments/initiate` - Initialiser paiement
  - `POST /api/payments/webhook` - Callback CinetPay
  - `GET /api/payments/verify/:transactionId` - Vérifier statut
- Page "Paiement en cours" avec QR code Mobile Money
- Composants React pour le processus de paiement

**Fichiers à adapter:**
- `server/controllers/orderController.js` → Intégrer CinetPay
- Créer `server/utils/cinetpay.js` (helper CinetPay)

---

## 📋 PLAN DE MIGRATION DÉTAILLÉ

Voir fichier séparé: `MIGRATION_STEPS.md`

---

## 🗄️ NOUVEAU SCHÉMA DE BASE DE DONNÉES

Voir fichier séparé: `DATABASE_SCHEMA.md`

---

## 💳 INTÉGRATION PAIEMENT (Spécifique Côte d'Ivoire)

### Gateway choisi : CinetPay
**Pourquoi CinetPay ?**
- ✅ Leader en Côte d'Ivoire et Afrique de l'Ouest
- ✅ Supporte tous les opérateurs locaux (Orange, MTN, Moov, Wave)
- ✅ Documentation française complète
- ✅ Webhook fiable pour confirmation automatique
- ✅ Dashboard de gestion des transactions
- ✅ Support technique réactif
- ✅ Certification PCI-DSS (sécurité)

### Workflow de paiement
```
1. User s'inscrit à une formation
   ↓
2. System crée Enrollment (status: PENDING, paymentStatus: UNPAID)
   ↓
3. System appelle API CinetPay → Génère lien paiement
   ↓
4. User redirigé vers page paiement CinetPay
   ↓
5. User choisit méthode: Orange Money/MTN/Moov/Wave/Carte
   ↓
6. User valide paiement (code sur téléphone pour Mobile Money)
   ↓
7. CinetPay envoie webhook → Backend CEPIC
   ↓
8. Backend vérifie signature webhook
   ↓
9. Backend met à jour Enrollment.paymentStatus → PAID
   ↓
10. Backend met à jour Enrollment.status → CONFIRMED
    ↓
11. Backend crée Payment record
    ↓
12. Email de confirmation envoyé à l'utilisateur
```

### Configuration CinetPay

**Variables d'environnement:**
```env
# CinetPay Configuration
CINETPAY_API_KEY=your_api_key
CINETPAY_SITE_ID=your_site_id
CINETPAY_SECRET_KEY=your_secret_key
CINETPAY_NOTIFY_URL=https://cepic.ci/api/payments/webhook
CINETPAY_RETURN_URL=https://cepic.ci/inscription/confirmation
CINETPAY_CANCEL_URL=https://cepic.ci/inscription/annulation
CINETPAY_MODE=SANDBOX # ou PRODUCTION
```

**Environnements:**
- **Sandbox** : Tests avec faux paiements (gratuit)
  - URL: https://api-checkout.cinetpay.com/v2/
  - Numéros de test fournis par CinetPay
- **Production** : Paiements réels (après validation CEPIC)
  - URL: https://api-checkout.cinetpay.com/v2/
  - Nécessite compte marchand validé

### Frais de transaction
- **Mobile Money**: ~3-5% par transaction
- **Cartes bancaires**: ~3.5-5.5% par transaction
- **Négociable** selon le volume mensuel
- Pas de frais d'installation
- Pas d'abonnement mensuel

### Méthodes de paiement supportées

| Méthode | Disponibilité | Délai confirmation |
|---------|---------------|--------------------|
| Orange Money CI | ✅ Immédiat | < 1 minute |
| MTN Mobile Money | ✅ Immédiat | < 1 minute |
| Moov Money | ✅ Immédiat | < 1 minute |
| Wave | ✅ Immédiat | < 1 minute |
| Visa/Mastercard | ✅ Immédiat | < 30 secondes |
| Virement bancaire | ⚠️ Manuel | 1-3 jours |

### Sécurité
- ✅ Signature HMAC pour webhooks
- ✅ Vérification de transaction côté serveur
- ✅ Tokens à usage unique
- ✅ Chiffrement SSL/TLS
- ✅ Conformité PCI-DSS

### Modèle Payment (à ajouter)

```prisma
model Payment {
  id              String   @id @default(cuid())
  enrollmentId    String   @unique
  enrollment      TrainingEnrollment @relation(fields: [enrollmentId], references: [id])
  
  // CinetPay
  transactionId   String   @unique // ID CinetPay
  paymentMethod   String   // ORANGE_MONEY, MTN_MONEY, MOOV_MONEY, WAVE, CARD
  gateway         String   @default("CINETPAY")
  
  // Montants
  amount          Int      // Montant en FCFA (centimes)
  currency        String   @default("XOF")
  fees            Int?     // Frais de transaction
  
  // Statut
  status          PaymentStatus @default(PENDING)
  
  // Métadonnées
  paymentData     Json?    // Réponse complète CinetPay
  ipAddress       String?
  userAgent       String?
  
  // Dates
  initiatedAt     DateTime @default(now())
  completedAt     DateTime?
  failedAt        DateTime?
  
  @@map("payments")
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  CANCELLED
  REFUNDED
}
```

---

## 🚀 ESTIMATION DU TEMPS (MISE À JOUR)

| Phase | Durée | Description |
|-------|-------|-------------|
| Phase 1: Préparation | 0.5 jour | Backup, configuration |
| Phase 2: Base de données | 1 jour | Schema, migrations, seeds |
| Phase 3: Backend API | 1.5 jours | Controllers, routes |
| Phase 4: Frontend Structure | 1 jour | Pages, composants |
| Phase 5: Frontend Design | 1.5 jours | UI/UX |
| Phase 6: Dashboard Admin | 1 jour | Interface admin |
| Phase 7: Intégrations | **1.5 jours** | **CinetPay, emails, sessions** |
| Phase 8: Tests | 1 jour | Tests fonctionnels |
| Phase 9: Contenu | 1 jour | Saisie données |
| Phase 10: Déploiement | 0.5 jour | Mise en production |
| **TOTAL** | **11 jours** | Estimation complète |

---

## 📞 INFORMATIONS CEPIC

**Raison sociale:** Cabinet d'Études, de Prestations et d'Intermédiation Commerciale  
**Sigle:** CEPIC  
**Directeur Général:** DIGBEU Serge-Fabrice  
**Adresse:** Cocody M'Badon village – 18 BP 822 ABIDJAN 18  
**Téléphone:** +225 27 22 28 20 66 / +225 05 46 66 33 63  
**Email:** info@cepic.ci  
**Site web:** www.cepic.ci  
**RCCM:** CI-ABJ-03-2023-B12-04797  
**Forme juridique:** SARL  
**Capital social:** 1.000.000 FCFA  

**Catégories de formations:**
1. Management de projet
2. Banque et finance
3. Méthodologie & Collecte de données
4. Entrepreneuriat

---

## 📝 PROCHAINES ÉTAPES

1. **Valider ce plan** avec vous
2. **Créer les fichiers détaillés** (DATABASE_SCHEMA.md, MIGRATION_STEPS.md)
3. **Commencer la migration** phase par phase
4. **Tester à chaque étape**
5. **Déployer progressivement**

---

**Prêt à commencer la migration ?** 🚀
