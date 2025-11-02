# Guide - Saisie des Prix

## Date: November 1, 2025

## 💰 COMMENT ENTRER LES PRIX

---

## 🎯 Règle Simple

**L'admin entre le prix NORMAL en FCFA**

Exemple:
- Formation à 150,000 FCFA → Admin entre: `150000`
- Formation à 200,000 FCFA → Admin entre: `200000`

**Le backend convertit automatiquement en centimes**

---

## 🔄 Flow Complet

### 1. Admin entre le prix (Frontend)

```javascript
// AdminPage - Formulaire de création
<input
  type="number"
  name="cost"
  placeholder="150000"
  min="0"
  step="1000"
/>

// Valeur: 150000 (FCFA)
```

### 2. Backend reçoit et convertit

```javascript
// trainingController.js - createTraining
const createTraining = async (req, res) => {
  const { cost, ...otherData } = req.body;
  
  // Convertir FCFA en centimes
  const costInCents = cost * 100;  // 150000 × 100 = 15000000
  
  const training = await prisma.training.create({
    data: {
      ...otherData,
      cost: costInCents  // Stocké: 15000000
    }
  });
  
  res.json({ success: true, data: training });
};
```

### 3. Frontend affiche

```javascript
// TrainingCard.jsx
const formatPrice = (priceInCents) => {
  const priceInFCFA = priceInCents / 100;  // 15000000 / 100 = 150000
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(priceInFCFA);  // "150 000 FCFA"
};
```

---

## 📝 Exemple Complet

### Seed (Développement)

```javascript
// seed-cepic.js
const trainings = [
  {
    title: 'Formation Agile',
    cost: 15000000,  // 150,000 FCFA en centimes
    // ...
  }
];
```

**Note:** Dans le seed, on entre directement en centimes car c'est du code.

### Admin Dashboard (Production)

```javascript
// Admin entre dans le formulaire
Prix: 150000 FCFA

// Backend reçoit
req.body.cost = 150000

// Backend convertit et stocke
cost: 150000 × 100 = 15000000 (centimes)
```

---

## 🛠️ Implémentation Backend

### Créer un Helper

```javascript
// utils/priceHelper.js
class PriceHelper {
  // Convertir FCFA en centimes
  static toCents(priceInFCFA) {
    return Math.round(priceInFCFA * 100);
  }
  
  // Convertir centimes en FCFA
  static toFCFA(priceInCents) {
    return Math.round(priceInCents / 100);
  }
  
  // Formater pour affichage
  static format(priceInCents) {
    const priceInFCFA = this.toFCFA(priceInCents);
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(priceInFCFA);
  }
}

module.exports = PriceHelper;
```

### Utiliser dans le Controller

```javascript
// trainingController.js
const PriceHelper = require('../utils/priceHelper');

const createTraining = async (req, res) => {
  const trainingData = {
    ...req.body,
    cost: PriceHelper.toCents(req.body.cost),  // Conversion automatique
    originalCost: req.body.originalCost 
      ? PriceHelper.toCents(req.body.originalCost) 
      : null
  };
  
  const training = await prisma.training.create({ data: trainingData });
  res.json({ success: true, data: training });
};

const updateTraining = async (req, res) => {
  const updateData = { ...req.body };
  
  // Convertir les prix si présents
  if (updateData.cost) {
    updateData.cost = PriceHelper.toCents(updateData.cost);
  }
  if (updateData.originalCost) {
    updateData.originalCost = PriceHelper.toCents(updateData.originalCost);
  }
  
  const training = await prisma.training.update({
    where: { id: req.params.id },
    data: updateData
  });
  
  res.json({ success: true, data: training });
};
```

---

## 🎨 Interface Admin (Recommandations)

### Formulaire de Prix

```jsx
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Prix de la formation (FCFA)
    </label>
    <input
      type="number"
      name="cost"
      value={formData.cost}
      onChange={handleChange}
      placeholder="150000"
      min="0"
      step="1000"
      className="w-full px-4 py-2 border rounded-lg"
    />
    <p className="text-sm text-gray-500 mt-1">
      Entrez le prix en FCFA (ex: 150000 pour 150,000 FCFA)
    </p>
  </div>
  
  {/* Aperçu du prix formaté */}
  {formData.cost && (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <p className="text-sm text-blue-800">
        Aperçu: <strong>{formatPrice(formData.cost)}</strong>
      </p>
    </div>
  )}
</div>
```

---

## ✅ Résumé

### Admin Dashboard:
- ✅ Admin entre: `150000` (FCFA)
- ✅ Backend convertit: `15000000` (centimes)
- ✅ DB stocke: `15000000`

### Affichage:
- ✅ Frontend lit: `15000000` (centimes)
- ✅ Frontend convertit: `150000` (FCFA)
- ✅ Frontend affiche: `150 000 FCFA`

### Avantages:
- ✅ Simple pour l'admin
- ✅ Précision maximale (pas de décimales)
- ✅ Conversion automatique
- ✅ Cohérence partout

---

## 🔢 Exemples de Prix

| Admin Entre | Backend Stocke | Frontend Affiche |
|-------------|----------------|------------------|
| 50000 | 5000000 | 50 000 FCFA |
| 150000 | 15000000 | 150 000 FCFA |
| 200000 | 20000000 | 200 000 FCFA |
| 500000 | 50000000 | 500 000 FCFA |

---

**L'ADMIN ENTRE LE PRIX NORMAL, LE BACKEND GÈRE LA CONVERSION!** ✅

*Simple, clair, et sans erreur!*
