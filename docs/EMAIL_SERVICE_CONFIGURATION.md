# Service Email CEPIC - Configuration Complète

## Date: November 1, 2025

## ✅ SERVICE EMAIL CONFIGURÉ

---

## 📧 Emails Disponibles

### 1. Code de Vérification 2FA
**Fonction:** `send2FACode(email, code, name)`

**Utilisation:**
```javascript
await emailService.send2FACode(
  'user@example.com',
  '123456',
  'Jean KOUADIO'
);
```

**Contenu:**
- Code à 6 chiffres en grand format
- Expiration: 10 minutes
- Design CEPIC avec gradient bleu

---

### 2. Email de Bienvenue
**Fonction:** `sendWelcomeEmail(email, name)`

**Utilisation:**
```javascript
await emailService.sendWelcomeEmail(
  'user@example.com',
  'Jean KOUADIO'
);
```

**Contenu:**
- Message de bienvenue personnalisé
- Liste des fonctionnalités disponibles
- Bouton CTA vers les formations
- Coordonnées de contact

---

### 3. Confirmation d'Inscription à une Formation
**Fonction:** `sendEnrollmentConfirmation(email, name, trainingData)`

**Utilisation:**
```javascript
await emailService.sendEnrollmentConfirmation(
  'user@example.com',
  'Jean KOUADIO',
  {
    title: 'Gestion de projet Agile et Scrum',
    cost: 15000000, // en centimes
    duration: 24,
    durationUnit: 'hours',
    location: 'Cocody M\'Badon village',
    instructor: 'Jean KOUASSI'
  }
);
```

**Contenu:**
- Détails de la formation
- Prix, durée, lieu, formateur
- Prochaines étapes
- Bouton CTA vers "Mes inscriptions"

---

## 🎨 Design des Emails

### Template HTML Professionnel

**Header:**
- Logo CEPIC
- Gradient bleu (primary → blue)
- Nom complet du centre

**Body:**
- Contenu personnalisé
- Typographie claire
- Boutons CTA stylisés
- Sections colorées pour informations importantes

**Footer:**
- Nom et adresse CEPIC
- Téléphone et email
- Copyright

**Couleurs:**
```javascript
{
  primary: '#1e3a5f',    // Bleu foncé
  secondary: '#f59e0b',  // Orange/Jaune
  success: '#10b981',    // Vert
  danger: '#ef4444'      // Rouge
}
```

---

## ⚙️ Configuration

### Variables d'Environnement (.env)

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=contact@cepic.ci
EMAIL_PASS=votre_mot_de_passe_application

# Environment
NODE_ENV=development  # ou 'production'
```

### Mode Développement

En mode développement, les emails ne sont **pas envoyés** mais **affichés dans la console**:

```
📧 Email Service: Development mode - emails will be logged to console

🔐 2FA CODE EMAIL SIMULATION
==================================================
📧 To: user@test.com
👤 Name: Jean KOUADIO
🔑 2FA Code: 123456
⏰ Expires: 10 minutes
==================================================
```

### Mode Production

En production, les emails sont **réellement envoyés** via Gmail (ou autre service):

```
📧 Email Service: Production mode - emails will be sent
✅ 2FA code sent to user@test.com
```

---

## 🔧 Utilisation dans le Code

### 1. Import du Service

```javascript
const emailService = require('../utils/email');
```

### 2. Envoi de 2FA (Inscription)

```javascript
// authController.js - registerNewUser
const code = generate2FACode();
await emailService.send2FACode(
  email,
  code,
  `${firstName} ${lastName}`
);
```

### 3. Email de Bienvenue (Après 2FA)

```javascript
// authController.js - verify2FA
if (twoFARecord.type === 'REGISTRATION') {
  await emailService.sendWelcomeEmail(
    updatedUser.email,
    `${updatedUser.firstName} ${updatedUser.lastName}`
  );
}
```

### 4. Confirmation d'Inscription (TODO)

```javascript
// enrollmentController.js - createEnrollment
await emailService.sendEnrollmentConfirmation(
  user.email,
  `${user.firstName} ${user.lastName}`,
  {
    title: training.title,
    cost: training.cost,
    duration: training.duration,
    durationUnit: training.durationUnit,
    location: training.location,
    instructor: training.instructor
  }
);
```

---

## 📊 Flow Complet

### Inscription Utilisateur

```
1. User remplit formulaire inscription
   ↓
2. Backend crée compte (isVerified: false)
   ↓
3. Backend génère code 2FA
   ↓
4. 📧 Email: Code de vérification
   ↓
5. User entre code
   ↓
6. Backend vérifie code
   ↓
7. Backend: isVerified = true
   ↓
8. 📧 Email: Bienvenue au CEPIC
   ↓
9. User connecté
```

### Inscription à une Formation

```
1. User clique "S'inscrire"
   ↓
2. User remplit formulaire paiement
   ↓
3. Backend crée enrollment
   ↓
4. 📧 Email: Confirmation d'inscription
   ↓
5. User reçoit détails formation
```

---

## 🔐 Sécurité Gmail

### Créer un Mot de Passe d'Application

1. Aller sur https://myaccount.google.com/security
2. Activer la validation en 2 étapes
3. Aller dans "Mots de passe des applications"
4. Créer un nouveau mot de passe pour "Mail"
5. Copier le mot de passe généré
6. Utiliser dans `EMAIL_PASS`

---

## 🧪 Test des Emails

### Test en Développement

```bash
# Les emails s'affichent dans la console
npm run dev

# Tester inscription
POST /api/auth/register
{
  "email": "test@example.com",
  "firstName": "Test",
  "lastName": "User",
  "password": "password123"
}

# Console affichera:
# 🔐 2FA CODE EMAIL SIMULATION
# 🔑 2FA Code: 123456
```

### Test en Production

```bash
# Configurer .env
EMAIL_SERVICE=gmail
EMAIL_USER=contact@cepic.ci
EMAIL_PASS=xxxx xxxx xxxx xxxx
NODE_ENV=production

# Redémarrer serveur
npm run dev

# Tester inscription
# Email sera réellement envoyé!
```

---

## 📝 Informations CEPIC

```javascript
{
  name: 'CEPIC',
  fullName: 'Centre d\'Expertise et de Perfectionnement Ivoire Compétences',
  email: 'contact@cepic.ci',
  phone: '+225 07 00 00 00 00',
  address: 'Cocody M\'Badon village, Abidjan, Côte d\'Ivoire',
  website: 'https://cepic.ci'
}
```

---

## ✅ Résumé

### Emails Configurés:
- ✅ Code de vérification 2FA (français)
- ✅ Email de bienvenue (français)
- ✅ Confirmation d'inscription formation (français)

### Fonctionnalités:
- ✅ Template HTML professionnel
- ✅ Design CEPIC (couleurs, logo)
- ✅ Mode dev (console) / prod (envoi réel)
- ✅ Gestion d'erreurs
- ✅ Logs détaillés

### Prochaines Étapes:
- [ ] Configurer compte Gmail production
- [ ] Tester envoi réel en production
- [ ] Ajouter email de rappel session
- [ ] Ajouter email de certificat

---

**SERVICE EMAIL COMPLET ET PRÊT!** 📧✅

*Emails professionnels avec branding CEPIC!*
