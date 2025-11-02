# Seed Accounts - Already Verified

## Date: November 1, 2025

## ✅ COMPTES DE TEST DÉJÀ VÉRIFIÉS

---

## 👥 Comptes dans seed-cepic.js

### 1. Admin Account
```javascript
{
  email: 'admin@cepic.ci',
  password: hashedPassword,  // 'secret123'
  firstName: 'Admin',
  lastName: 'CEPIC',
  role: 'ADMIN',
  isVerified: true  // ✅ Déjà vérifié!
}
```

**Connexion:**
- Email: `admin@cepic.ci`
- Password: `secret123`
- Role: `ADMIN`
- Accès: Dashboard admin + toutes les pages

---

### 2. User Account
```javascript
{
  email: 'user@test.com',
  password: hashedPassword,  // 'secret123'
  firstName: 'Jean',
  lastName: 'KOUADIO',
  role: 'USER',
  isVerified: true  // ✅ Déjà vérifié!
}
```

**Connexion:**
- Email: `user@test.com`
- Password: `secret123`
- Role: `USER`
- Accès: Pages utilisateur normales

---

## 🔐 Flow de Connexion

### Pour les comptes seed (isVerified: true):

```
1. User entre credentials
   ↓
2. POST /api/auth/login
   ↓
3. Backend vérifie password
   ↓
4. createSendToken() - Connexion directe
   ↓
5. Cookies définis
   ↓
6. Response: { user: {...} }
   ↓
7. Frontend: user défini dans store
   ↓
8. NavBar affiche menu utilisateur
```

**Pas de 2FA car déjà vérifiés!** ✅

---

### Pour les nouveaux comptes (isVerified: false):

```
1. User s'inscrit
   ↓
2. POST /api/auth/register
   ↓
3. User créé avec isVerified: false
   ↓
4. Code 2FA envoyé par email
   ↓
5. Response: { tempToken, requires2FA: true }
   ↓
6. Frontend affiche formulaire 2FA
   ↓
7. User entre code
   ↓
8. POST /api/auth/verify-2fa
   ↓
9. Backend: isVerified = true
   ↓
10. Cookies définis
    ↓
11. User connecté
```

---

## 🧪 Test des Comptes Seed

### Test Admin:
```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "admin@cepic.ci",
  "password": "secret123"
}
```

**Résultat Attendu:**
- ✅ Status: 200 OK
- ✅ Cookies: auth_token, refresh_token
- ✅ Response: { user: { role: 'ADMIN', isVerified: true } }
- ✅ Pas de 2FA requis

---

### Test User:
```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "secret123"
}
```

**Résultat Attendu:**
- ✅ Status: 200 OK
- ✅ Cookies: auth_token, refresh_token
- ✅ Response: { user: { role: 'USER', isVerified: true } }
- ✅ Pas de 2FA requis

---

## 📊 Différence entre Seed et Nouveaux Comptes

| Aspect | Comptes Seed | Nouveaux Comptes |
|--------|--------------|------------------|
| **isVerified** | `true` | `false` (jusqu'à 2FA) |
| **2FA à la connexion** | ❌ Non | ❌ Non |
| **2FA à l'inscription** | N/A | ✅ Oui |
| **Connexion directe** | ✅ Oui | ✅ Oui (après vérification) |
| **Usage** | Tests/Dev | Production |

---

## ✅ Pourquoi c'est Correct

### Comptes Seed (isVerified: true):
- ✅ Utilisés pour le développement et les tests
- ✅ Pas besoin de 2FA à chaque test
- ✅ Gain de temps pour les développeurs
- ✅ Peuvent se connecter immédiatement

### Nouveaux Comptes (isVerified: false):
- ✅ Doivent vérifier leur email via 2FA
- ✅ Sécurité renforcée
- ✅ Confirmation que l'email est valide
- ✅ Deviennent `isVerified: true` après 2FA

---

## 🔄 Workflow Complet

### Développement (Seed):
```
npm run seed
  ↓
Comptes créés avec isVerified: true
  ↓
Login direct sans 2FA
  ↓
Tests rapides
```

### Production (Nouveaux utilisateurs):
```
User s'inscrit
  ↓
isVerified: false
  ↓
2FA envoyé
  ↓
User vérifie
  ↓
isVerified: true
  ↓
Login direct (pas de 2FA à chaque fois)
```

---

## 📝 Résumé

### Comptes de Test:
- ✅ `admin@cepic.ci` - ADMIN - Vérifié
- ✅ `user@test.com` - USER - Vérifié
- ✅ Password: `secret123`
- ✅ Connexion directe (pas de 2FA)

### Nouveaux Comptes:
- ✅ 2FA requis à l'inscription
- ✅ Pas de 2FA à la connexion
- ✅ `isVerified: true` après 2FA

---

**LES COMPTES SEED SONT DÉJÀ VÉRIFIÉS - CONNEXION DIRECTE!** ✅

*Parfait pour le développement et les tests!*
