# 🚀 PLAN D'ACTION IMMÉDIAT - CEPIC

## Date: November 2, 2025
## Objectif: Rendre le projet production-ready en 4 semaines

---

## 📋 SEMAINE 1: FONDATIONS CRITIQUES

### Jour 1-2: Système de Toast ✅ (FACILE)

#### Installation
```bash
cd client
npm install sonner
```

#### Fichiers à créer/modifier:
1. **`client/src/components/ui/Toast.jsx`**
2. **`client/src/App.jsx`** - Ajouter `<Toaster />`
3. **Remplacer tous les `alert()`:**
   - `RegisterPage.jsx` ligne 111
   - `CartSidebar.jsx` lignes 92, 103
   - `ReviewSection.jsx` lignes 61, 63
   - `PricingCard.jsx` ligne 52

#### Code:
```javascript
// client/src/components/ui/Toast.jsx
import { Toaster } from 'sonner';

export { Toaster };
export { toast } from 'sonner';

// Utilisation:
import { toast } from '../components/ui/Toast';

toast.success('Inscription réussie!');
toast.error('Erreur lors de l\'inscription');
toast.info('Code renvoyé');
```

---

### Jour 3-5: Système de Paiement - Frontend 💳

#### Fichiers à créer:

1. **`client/src/components/payment/PaymentMethodSelector.jsx`**
```javascript
// Sélection: Mobile Money, Carte Bancaire
// Options: Orange Money, MTN Money, Moov Money, Visa/Mastercard
```

2. **`client/src/components/payment/MobileMoneyForm.jsx`**
```javascript
// Champs:
// - Opérateur (Orange/MTN/Moov)
// - Numéro de téléphone
// - Montant (readonly)
```

3. **`client/src/components/payment/CreditCardForm.jsx`**
```javascript
// Champs:
// - Numéro de carte (avec masquage)
// - Date d'expiration (MM/YY)
// - CVV (3 chiffres)
// - Nom sur la carte
// Validation Luhn algorithm
```

4. **`client/src/components/payment/PaymentModal.jsx`**
```javascript
// Modal avec:
// - Récapitulatif formation
// - Prix
// - Sélection méthode
// - Formulaire approprié
// - Bouton "Payer"
```

#### Modifier:
5. **`client/src/pages/EnrollPage.jsx`**
```javascript
// Remplacer le TODO par:
// - Ouvrir PaymentModal
// - Gérer la soumission
// - Appeler API de paiement
```

---

### Jour 6-7: Système de Paiement - Backend 🔧

#### Fichiers à créer:

1. **`server/services/payment.js`**
```javascript
// Service de paiement avec:
// - initiateMobileMoneyPayment()
// - initiateCreditCardPayment()
// - verifyPaymentStatus()
// - handlePaymentWebhook()
```

2. **`server/controllers/paymentController.js`**
```javascript
// Controllers:
// - createPaymentIntent
// - confirmPayment
// - getPaymentStatus
// - handleWebhook
```

#### Modifier:
3. **`server/routers/paymentRoutes.js`**
```javascript
// Routes:
// POST /api/payments/initiate
// POST /api/payments/confirm
// GET /api/payments/:id/status
// POST /api/payments/webhook
```

4. **`server/prisma/schema.prisma`**
```prisma
model Payment {
  id String @id @default(cuid())
  enrollmentId String
  amount Int
  method PaymentMethod
  status PaymentStatus
  transactionId String?
  metadata Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  enrollment TrainingEnrollment @relation(...)
}

enum PaymentMethod {
  MOBILE_MONEY_ORANGE
  MOBILE_MONEY_MTN
  MOBILE_MONEY_MOOV
  CREDIT_CARD
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
}
```

---

## 📋 SEMAINE 2: ADMIN CRUD

### Jour 8-10: Gestion des Formations 📚

#### Fichiers à modifier:

1. **`client/src/components/admin/TrainingsManagement.jsx`**
```javascript
// Connecter au store admin:
// - Créer formation (formulaire complet)
// - Modifier formation
// - Supprimer formation
// - Upload image (Cloudinary)
```

2. **`client/src/stores/adminStore.js`**
```javascript
// Ajouter actions:
// - createTraining(data)
// - updateTraining(id, data)
// - deleteTraining(id)
// - uploadImage(file)
```

3. **`server/controllers/adminController.js`**
```javascript
// Implémenter:
// - createTraining
// - updateTraining
// - deleteTraining
```

---

### Jour 11-12: Gestion des Utilisateurs & Catégories 👥

#### 1. Utilisateurs
```javascript
// client/src/components/admin/UsersManagement.jsx
// - Lister utilisateurs
// - Changer rôle
// - Bannir/Débannir
// - Supprimer
```

#### 2. Catégories
```javascript
// client/src/components/admin/CategoriesManagement.jsx
// - Créer catégorie
// - Modifier catégorie
// - Supprimer catégorie
// - Réorganiser
```

---

### Jour 13-14: Dashboard & Analytics 📊

#### Fichiers à modifier:

1. **`client/src/components/admin/DashboardOverview.jsx`**
```javascript
// Connecter aux vraies données:
// - Statistiques formations
// - Statistiques inscriptions
// - Revenus
// - Utilisateurs actifs
```

2. **`server/controllers/adminController.js`**
```javascript
// Ajouter:
// - getDashboardStats()
// - getAnalytics(period)
// - getRevenueStats()
```

---

## 📋 SEMAINE 3: TESTS & QUALITÉ

### Jour 15-17: Tests Backend 🧪

#### Configuration:
```bash
cd server
npm install --save-dev jest supertest
```

#### Fichiers à créer:

1. **`server/__tests__/auth.test.js`**
```javascript
// Tests:
// - POST /api/auth/register
// - POST /api/auth/login
// - POST /api/auth/verify-2fa
// - POST /api/auth/logout
```

2. **`server/__tests__/trainings.test.js`**
```javascript
// Tests:
// - GET /api/trainings
// - GET /api/trainings/:id
// - POST /api/trainings (admin)
// - PUT /api/trainings/:id (admin)
```

3. **`server/__tests__/payments.test.js`**
```javascript
// Tests:
// - POST /api/payments/initiate
// - POST /api/payments/confirm
// - Webhook handling
```

---

### Jour 18-19: Tests Frontend 🧪

#### Configuration:
```bash
cd client
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

#### Fichiers à créer:

1. **`client/src/__tests__/LoginPage.test.jsx`**
2. **`client/src/__tests__/RegisterPage.test.jsx`**
3. **`client/src/__tests__/EnrollPage.test.jsx`**
4. **`client/src/__tests__/stores/authStore.test.js`**

---

### Jour 20-21: Nettoyage & Optimisation 🧹

#### A. Supprimer fichiers obsolètes:
```bash
# Client
rm -rf client/src/components/library/
rm -rf client/src/components/features/
rm client/src/stores/bookStore.js
rm client/src/stores/eventStore.js
rm client/src/stores/registrationStore.js
rm client/src/services/api.js
rm client/src/pages/AdminDashboard.jsx

# Vérifier imports cassés
npm run build
```

#### B. Optimisations:
1. **Lazy loading routes**
```javascript
// client/src/App.jsx
const TrainingsPage = lazy(() => import('./pages/TrainingsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
```

2. **Code splitting**
```javascript
// Séparer bundles admin
```

---

## 📋 SEMAINE 4: MONITORING & DÉPLOIEMENT

### Jour 22-23: Monitoring 📈

#### 1. Sentry
```bash
npm install @sentry/react @sentry/node
```

```javascript
// client/src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

#### 2. Analytics
```bash
npm install @vercel/analytics
```

---

### Jour 24-25: CI/CD 🔄

#### Créer `.github/workflows/ci.yml`:
```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
```

---

### Jour 26-28: Déploiement 🚀

#### 1. Configuration Production
```env
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=...
SENTRY_DSN=...
```

#### 2. Docker Production
```dockerfile
# Optimiser Dockerfile
# Multi-stage build
# Minimiser image size
```

#### 3. Déploiement
- Railway / Render / Vercel
- SSL/HTTPS
- CDN pour assets
- Backup automatique

---

## ✅ CHECKLIST FINALE

### Avant Production:
- [ ] Tous les `alert()` remplacés par toast
- [ ] Paiement fonctionnel (Mobile Money + Carte)
- [ ] Admin CRUD complet
- [ ] Tests (>70% coverage)
- [ ] Fichiers obsolètes supprimés
- [ ] Performance optimisée
- [ ] Monitoring configuré
- [ ] CI/CD actif
- [ ] SSL/HTTPS
- [ ] Backup configuré

---

## 🎯 RÉSUMÉ

| Semaine | Focus | Résultat |
|---------|-------|----------|
| **1** | Toast + Paiement | ✅ UX améliorée + Paiement fonctionnel |
| **2** | Admin CRUD | ✅ Admin opérationnel |
| **3** | Tests + Nettoyage | ✅ Code quality + Stabilité |
| **4** | Monitoring + Deploy | ✅ Production-ready |

**APRÈS 4 SEMAINES: PROJET 100% PRODUCTION-READY** ✅

---

**COMMENCER PAR:** Jour 1-2 (Toast) - C'est le plus facile et rapide!
