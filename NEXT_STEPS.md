# 🚀 PROCHAINES ÉTAPES - GUIDE COMPLET

## Date: November 2, 2025
## Objectif: App Production-Ready (sauf paiement final)

---

## 📊 ÉTAT ACTUEL

**Score:** 62/100  
**Temps estimé:** 4-6 semaines  
**Bloquants:** Paiement, Admin CRUD, Tests, Toast

---

## 🎯 ROADMAP COMPLÈTE

```
Semaine 1: Toast + Paiement Frontend + Backend Stubs
Semaine 2: Admin CRUD Complet
Semaine 3: Tests + Nettoyage
Semaine 4: Performance + Monitoring
Semaine 5: SEO + a11y + CI/CD
Semaine 6: Documentation + Polish Final
```

---

## 📅 SEMAINE 1: FONDATIONS CRITIQUES

### Jour 1-2: Toast Notifications ✅ FACILE

#### Installation
```bash
cd client
npm install sonner
```

#### Fichiers à modifier

**1. `client/src/App.jsx`**
```javascript
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      {/* ... reste du code */}
    </>
  );
}
```

**2. Remplacer alerts:**

`client/src/pages/RegisterPage.jsx` (ligne 111):
```javascript
// Avant:
alert("Code renvoyé avec succès!");

// Après:
import { toast } from 'sonner';
toast.success("Code renvoyé avec succès!");
```

`client/src/components/trainings/detail/ReviewSection.jsx` (lignes 61, 63):
```javascript
// Avant:
alert('Votre avis a été ajouté avec succès!');
alert(error.response?.data?.error || 'Erreur...');

// Après:
toast.success('Votre avis a été ajouté avec succès!');
toast.error(error.response?.data?.error || 'Erreur lors de l\'ajout de l\'avis');
```

`client/src/components/trainings/detail/PricingCard.jsx` (ligne 52):
```javascript
// Avant:
alert('Lien copié dans le presse-papier !');

// Après:
toast.success('Lien copié dans le presse-papier !');
```

**3. Ajouter toast pour favoris:**

`client/src/components/trainings/TrainingCard.jsx`:
```javascript
const handleBookmark = async () => {
  try {
    const response = await toggleBookmark(training.id);
    setIsBookmarked(response.bookmarked);
    
    // Ajouter toast:
    if (response.bookmarked) {
      toast.success('Formation ajoutée aux favoris');
    } else {
      toast.info('Formation retirée des favoris');
    }
  } catch (error) {
    toast.error('Erreur lors de la mise à jour des favoris');
  }
};
```

---

### Jour 3-5: Paiement Frontend 💳

#### Créer dossier
```bash
mkdir -p client/src/components/payment
```

#### Fichiers à créer

**1. `client/src/components/payment/PaymentMethodSelector.jsx`**
```javascript
import { useState } from 'react';
import { CreditCard, Smartphone } from 'lucide-react';

export const PaymentMethodSelector = ({ selected, onSelect }) => {
  const methods = [
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      icon: Smartphone,
      options: ['Orange Money', 'MTN Money', 'Moov Money']
    },
    {
      id: 'credit_card',
      name: 'Carte Bancaire',
      icon: CreditCard,
      options: ['Visa', 'Mastercard']
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Moyen de paiement</h3>
      <div className="grid grid-cols-2 gap-4">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={`p-4 border-2 rounded-lg transition ${
              selected === method.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <method.icon className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">{method.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
```

**2. `client/src/components/payment/MobileMoneyForm.jsx`**
```javascript
import { useState } from 'react';

export const MobileMoneyForm = ({ amount, onSubmit }) => {
  const [operator, setOperator] = useState('orange');
  const [phone, setPhone] = useState('');

  const operators = [
    { id: 'orange', name: 'Orange Money', color: 'orange' },
    { id: 'mtn', name: 'MTN Money', color: 'yellow' },
    { id: 'moov', name: 'Moov Money', color: 'blue' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ operator, phone, amount });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Opérateur</label>
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        >
          {operators.map((op) => (
            <option key={op.id} value={op.id}>{op.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Numéro de téléphone
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="XX XX XX XX XX"
          pattern="[0-9]{10}"
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">Montant à payer</p>
        <p className="text-2xl font-bold text-primary-800">
          {new Intl.NumberFormat('fr-FR').format(amount / 100)} FCFA
        </p>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        Payer avec {operators.find(o => o.id === operator)?.name}
      </button>
    </form>
  );
};
```

**3. `client/src/components/payment/CreditCardForm.jsx`**
```javascript
import { useState } from 'react';

export const CreditCardForm = ({ amount, onSubmit }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || value;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      cardNumber: cardNumber.replace(/\s/g, ''),
      expiry,
      cvv,
      name,
      amount
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Numéro de carte
        </label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Date d'expiration
          </label>
          <input
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            placeholder="MM/YY"
            pattern="[0-9]{2}/[0-9]{2}"
            maxLength="5"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">CVV</label>
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="123"
            pattern="[0-9]{3}"
            maxLength="3"
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Nom sur la carte
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="JOHN DOE"
          required
          className="w-full px-4 py-2 border rounded-lg uppercase"
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">Montant à payer</p>
        <p className="text-2xl font-bold text-primary-800">
          {new Intl.NumberFormat('fr-FR').format(amount / 100)} FCFA
        </p>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        Payer {new Intl.NumberFormat('fr-FR').format(amount / 100)} FCFA
      </button>
    </form>
  );
};
```

**4. Modifier `client/src/pages/EnrollPage.jsx`**
```javascript
import { PaymentMethodSelector } from '../components/payment/PaymentMethodSelector';
import { MobileMoneyForm } from '../components/payment/MobileMoneyForm';
import { CreditCardForm } from '../components/payment/CreditCardForm';
import { toast } from 'sonner';

// Dans le composant:
const [paymentMethod, setPaymentMethod] = useState('mobile_money');
const [showPaymentForm, setShowPaymentForm] = useState(false);

const handlePaymentSubmit = async (paymentData) => {
  try {
    // TODO: Appeler API de paiement
    console.log('Payment data:', paymentData);
    
    toast.success('Paiement en cours de traitement...');
    
    // Simuler délai
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    navigate('/mes-inscriptions', {
      state: {
        message: 'Inscription réussie! Vous recevrez un email de confirmation.'
      }
    });
  } catch (error) {
    toast.error('Erreur lors du paiement');
  }
};

// Dans le JSX, remplacer le TODO par:
<PaymentMethodSelector
  selected={paymentMethod}
  onSelect={setPaymentMethod}
/>

{paymentMethod === 'mobile_money' && (
  <MobileMoneyForm
    amount={training.cost}
    onSubmit={handlePaymentSubmit}
  />
)}

{paymentMethod === 'credit_card' && (
  <CreditCardForm
    amount={training.cost}
    onSubmit={handlePaymentSubmit}
  />
)}
```

---

### Jour 6-7: Paiement Backend 🔧

#### Modifier Prisma Schema

**`server/prisma/schema.prisma`**
```prisma
// Ajouter ces models:

model Payment {
  id              String   @id @default(cuid())
  userId          String
  enrollmentId    String?
  amount          Int      // En centimes
  currency        String   @default("XOF")
  status          PaymentStatus @default(PENDING)
  paymentMethod   PaymentMethod
  transactionId   String?  // ID CinetPay/Stripe
  metadata        Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  enrollment      TrainingEnrollment? @relation(fields: [enrollmentId], references: [id])

  @@index([userId])
  @@index([enrollmentId])
  @@map("payments")
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
}

enum PaymentMethod {
  MOBILE_MONEY_ORANGE
  MOBILE_MONEY_MTN
  MOBILE_MONEY_MOOV
  CREDIT_CARD
}

// Ajouter relation dans TrainingEnrollment:
model TrainingEnrollment {
  // ... champs existants
  payments Payment[]
}

// Ajouter relation dans User:
model User {
  // ... champs existants
  payments Payment[]
}
```

**Migrer:**
```bash
cd server
npx prisma migrate dev --name add_payment_models
npx prisma generate
```

#### Créer Controller

**`server/controllers/paymentController.js`**
```javascript
const prisma = require('../lib/prisma');
const logger = require('../utils/logger');

// POST /api/payments/initiate
exports.initiatePayment = async (req, res, next) => {
  try {
    const { enrollmentId, paymentMethod } = req.body;
    const userId = req.user.id;

    // Vérifier enrollment
    const enrollment = await prisma.trainingEnrollment.findUnique({
      where: { id: enrollmentId },
      include: { training: true }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Inscription non trouvée'
      });
    }

    if (enrollment.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Non autorisé'
      });
    }

    // Créer payment
    const payment = await prisma.payment.create({
      data: {
        userId,
        enrollmentId,
        amount: enrollment.training.cost,
        paymentMethod,
        status: 'PENDING'
      }
    });

    logger.business('Payment initiated', {
      paymentId: payment.id,
      userId,
      amount: payment.amount
    });

    res.status(201).json({
      success: true,
      data: payment,
      message: 'Paiement initié'
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/payments/confirm
exports.confirmPayment = async (req, res, next) => {
  try {
    const { paymentId, transactionId } = req.body;
    const userId = req.user.id;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { enrollment: true }
    });

    if (!payment || payment.userId !== userId) {
      return res.status(404).json({
        success: false,
        error: 'Paiement non trouvé'
      });
    }

    // Mettre à jour payment
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'COMPLETED',
        transactionId
      }
    });

    // Mettre à jour enrollment
    if (payment.enrollmentId) {
      await prisma.trainingEnrollment.update({
        where: { id: payment.enrollmentId },
        data: { status: 'CONFIRMED' }
      });
    }

    logger.business('Payment confirmed', {
      paymentId,
      transactionId
    });

    res.json({
      success: true,
      data: updatedPayment,
      message: 'Paiement confirmé'
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/payments/history
exports.getPaymentHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const payments = await prisma.payment.findMany({
      where: { userId },
      include: {
        enrollment: {
          include: { training: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/payments/webhook (CinetPay)
exports.handleWebhook = async (req, res, next) => {
  try {
    // TODO: Vérifier signature CinetPay
    const { transaction_id, status } = req.body;

    logger.info('Webhook received', { transaction_id, status });

    // TODO: Mettre à jour payment selon webhook

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
```

#### Créer Routes

**`server/routers/paymentRoutes.js`**
```javascript
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

router.post('/initiate', authenticate, paymentController.initiatePayment);
router.post('/confirm', authenticate, paymentController.confirmPayment);
router.get('/history', authenticate, paymentController.getPaymentHistory);
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
```

---

## 📅 SEMAINE 2: ADMIN CRUD

### Jour 8-10: Gestion Formations

**`client/src/components/admin/TrainingsManagement.jsx`**
```javascript
// Ajouter formulaire création:
const [showCreateForm, setShowCreateForm] = useState(false);
const [formData, setFormData] = useState({
  title: '',
  description: '',
  cost: '',
  categoryId: '',
  // ... autres champs
});

const handleCreate = async (e) => {
  e.preventDefault();
  
  try {
    await createTraining({
      ...formData,
      cost: parseInt(formData.cost) * 100 // Convertir en centimes
    });
    
    toast.success('Formation créée avec succès');
    setShowCreateForm(false);
    fetchTrainings();
  } catch (error) {
    toast.error('Erreur lors de la création');
  }
};

// Ajouter modification:
const handleUpdate = async (id, data) => {
  try {
    await updateTraining(id, data);
    toast.success('Formation modifiée');
    fetchTrainings();
  } catch (error) {
    toast.error('Erreur lors de la modification');
  }
};

// Ajouter suppression:
const handleDelete = async (id) => {
  if (!confirm('Supprimer cette formation ?')) return;
  
  try {
    await deleteTraining(id);
    toast.success('Formation supprimée');
    fetchTrainings();
  } catch (error) {
    toast.error('Erreur lors de la suppression');
  }
};
```

---

## 📅 SEMAINE 3: TESTS + NETTOYAGE

### Configuration Jest (Backend)

```bash
cd server
npm install --save-dev jest supertest @types/jest
```

**`server/jest.config.js`**
```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'services/**/*.js',
    'utils/**/*.js'
  ],
  testMatch: ['**/__tests__/**/*.test.js']
};
```

**`server/__tests__/auth.test.js`**
```javascript
const request = require('supertest');
const app = require('../index');

describe('Auth API', () => {
  test('POST /api/auth/register should create user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@test.com',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
```

### Configuration Vitest (Frontend)

```bash
cd client
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

---

## 📅 SEMAINES 4-6: PERFORMANCE, MONITORING, POLISH

Voir `docs/ACTION_PLAN_IMMEDIATE.md` pour les détails complets.

---

## ✅ CHECKLIST FINALE

- [ ] Toast notifications implémenté
- [ ] Paiement frontend (formulaires)
- [ ] Paiement backend (stubs)
- [ ] Admin CRUD formations
- [ ] Admin CRUD users/categories
- [ ] Tests backend (>70%)
- [ ] Tests frontend (>70%)
- [ ] Fichiers obsolètes supprimés
- [ ] Performance optimisée
- [ ] Monitoring configuré
- [ ] Documentation complète

---

**GUIDE COMPLET CRÉÉ** ✅

*Suivre ce guide étape par étape pour finaliser l'application.*
