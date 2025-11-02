# Stores Complets - Architecture Finale

## Date: November 1, 2025

## ✅ TOUS LES STORES CRÉÉS ET CONNECTÉS

---

## 📦 Liste Complète des Stores

| # | Store | API | Pages Connectées | Status |
|---|-------|-----|------------------|--------|
| 1 | **authStore.js** | auth.js | LoginPage, RegisterPage, NavBar | ✅ |
| 2 | **trainingStore.js** | trainings.js | HomePage, TrainingsPage, TrainingDetailPage | ✅ |
| 3 | **categoryStore.js** | categories.js | HomePage, TrainingsPage | ✅ |
| 4 | **enrollmentStore.js** | enrollments.js, payments.js | MyEnrollmentsPage | ✅ |
| 5 | **galleryStore.js** | gallery.js | GalleryPage | ✅ |
| 6 | **contactStore.js** | contact.js | ContactPage | ✅ |
| 7 | **adminStore.js** | Multiple | AdminPage, DashboardOverview | ✅ |

---

## 🔐 1. authStore.js

### Méthodes:
- `login(email, password)` - Connexion
- `register(userData)` - Inscription
- `verify2FA(code)` - Vérification 2FA
- `resend2FA()` - Renvoyer code
- `logout()` - Déconnexion
- `checkAuthStatus()` - Vérifier session
- `initAuth()` - Initialiser au démarrage

### État:
```javascript
{
  authState: 'logged_out' | 'awaiting_2fa' | 'logged_in',
  user: null | UserObject,
  userEmail: '',
  tempToken: '',
  loading: false,
  error: null,
  initialized: false
}
```

### Utilisation:
```javascript
// LoginPage.jsx
const { login, loading, error } = useAuthStore();
await login(email, password);

// RegisterPage.jsx
const { register, loading, error } = useAuthStore();
await register({ firstName, lastName, email, password, phone });

// NavBar.jsx
const { user, logout } = useAuthStore();
```

---

## 🎓 2. trainingStore.js

### Méthodes:
- `fetchTrainings(params)` - Liste formations
- `fetchTrainingById(id)` - Détail formation
- `fetchCategories()` - Catégories
- `toggleBookmark(id)` - Favoris
- `addReview(id, data)` - Ajouter avis

### Utilisation:
```javascript
const { trainings, currentTraining, loading, fetchTrainings } = useTrainingStore();
await fetchTrainings({ featured: true });
```

---

## 📚 3. categoryStore.js

### Méthodes:
- `fetchCategories()` - Liste catégories
- `fetchCategoryById(id)` - Détail
- `createCategory(data)` - Créer (ADMIN)
- `updateCategory(id, data)` - Modifier (ADMIN)
- `deleteCategory(id)` - Supprimer (ADMIN)

### Utilisation:
```javascript
const { categories, loading, fetchCategories } = useCategoryStore();
await fetchCategories();
```

---

## 📝 4. enrollmentStore.js

### Méthodes:
- `fetchMyEnrollments()` - Mes inscriptions
- `enrollInTraining(trainingId)` - S'inscrire
- `cancelEnrollment(id)` - Annuler

### Utilisation:
```javascript
const { enrollments, loading, fetchMyEnrollments } = useEnrollmentStore();
await fetchMyEnrollments();
```

---

## 📸 5. galleryStore.js

### Méthodes:
- `fetchPhotos(params)` - Liste photos
- `uploadPhoto(formData)` - Upload (ADMIN)
- `filterByCategory(category)` - Filtrer
- `clearFilters()` - Réinitialiser filtres

### Utilisation:
```javascript
const { photos, loading, fetchPhotos, filterByCategory } = useGalleryStore();
await fetchPhotos();
await filterByCategory('Formations');
```

---

## 📧 6. contactStore.js

### Méthodes:
- `sendMessage(messageData)` - Envoyer message
- `fetchMessages(params)` - Liste messages (ADMIN)
- `updateMessageStatus(id, status)` - Changer statut (ADMIN)
- `resetSuccess()` - Réinitialiser succès

### Utilisation:
```javascript
const { loading, success, error, sendMessage } = useContactStore();
await sendMessage({ name, email, subject, message });
```

---

## 👨‍💼 7. adminStore.js

### Méthodes:
- `fetchDashboardData()` - Stats dashboard
- `fetchUsers(filters)` - Liste utilisateurs
- `updateUserStatus(userId, status)` - Modifier statut
- `refreshAllData()` - Tout rafraîchir

### Utilisation:
```javascript
const { dashboardData, loading, fetchDashboardData } = useAdminStore();
await fetchDashboardData();
```

---

## 🔄 Flux de Données Complet

### Exemple: Connexion Utilisateur

```
1. USER entre email/password
   ↓
2. LoginPage.jsx
   const { login } = useAuthStore();
   await login(email, password);
   ↓
3. authStore.js
   set({ loading: true });
   await authAPI.loginExistingUser(email, password);
   ↓
4. auth.js (API)
   axios.post('/auth/login', { email, password });
   ↓
5. BACKEND
   - Vérifie credentials
   - Génère tempToken
   - Envoie code 2FA
   - Retourne tempToken
   ↓
6. authStore.js
   set({ 
     authState: 'awaiting_2fa',
     tempToken: response.data.tempToken,
     loading: false 
   });
   ↓
7. LoginPage.jsx
   - Redirige vers page 2FA
   - USER entre code
   ↓
8. authStore.js
   await verify2FA(code);
   ↓
9. BACKEND
   - Vérifie code
   - Crée session
   - Set cookies
   - Retourne user
   ↓
10. authStore.js
    set({ 
      authState: 'logged_in',
      user: response.data.user 
    });
    ↓
11. LoginPage.jsx
    - Redirige vers HomePage
    - NavBar affiche user menu
```

---

## 📋 Export Central

### stores/index.js

```javascript
export { useAuthStore } from './authStore';
export { useTrainingStore } from './trainingStore';
export { useCategoryStore } from './categoryStore';
export { useEnrollmentStore } from './enrollmentStore';
export { useGalleryStore } from './galleryStore';
export { useContactStore } from './contactStore';
export { useAdminStore } from './adminStore';
```

### Utilisation:

```javascript
// Import depuis index
import { useAuthStore, useTrainingStore } from '../stores';

// Ou import direct
import { useAuthStore } from '../stores/authStore';
```

---

## ✅ Résumé Final

### Stores Créés: **7/7** ✅
1. ✅ authStore.js - Authentification
2. ✅ trainingStore.js - Formations
3. ✅ categoryStore.js - Catégories
4. ✅ enrollmentStore.js - Inscriptions
5. ✅ galleryStore.js - Galerie
6. ✅ contactStore.js - Contact
7. ✅ adminStore.js - Administration

### Pages Connectées: **9/9** ✅
1. ✅ LoginPage → authStore
2. ✅ RegisterPage → authStore
3. ✅ HomePage → trainingStore
4. ✅ TrainingsPage → trainingStore
5. ✅ TrainingDetailPage → trainingStore
6. ✅ GalleryPage → galleryStore
7. ✅ ContactPage → contactStore
8. ✅ MyEnrollmentsPage → enrollmentStore
9. ✅ AdminPage → adminStore

### APIs Créées: **7/7** ✅
1. ✅ auth.js
2. ✅ trainings.js
3. ✅ categories.js
4. ✅ enrollments.js
5. ✅ payments.js
6. ✅ gallery.js
7. ✅ contact.js

---

## 🎯 Architecture Finale

```
┌─────────────────────────────────────┐
│     COMPOSANTS REACT (9 pages)     │
│  LoginPage, RegisterPage, etc.     │
└──────────────┬──────────────────────┘
               │ useStore()
               ↓
┌─────────────────────────────────────┐
│     STORES ZUSTAND (7 stores)      │
│  authStore, trainingStore, etc.    │
└──────────────┬──────────────────────┘
               │ API calls
               ↓
┌─────────────────────────────────────┐
│     SERVICES API (7 modules)       │
│  auth.js, trainings.js, etc.       │
└──────────────┬──────────────────────┘
               │ axios.post/get
               ↓
┌─────────────────────────────────────┐
│          BACKEND API               │
│  Express + Prisma + PostgreSQL     │
└─────────────────────────────────────┘
```

---

**ARCHITECTURE COMPLÈTE ET FONCTIONNELLE!** 🚀

*Tous les stores sont créés, connectés et prêts à être utilisés!*
