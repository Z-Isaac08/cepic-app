# Debug - Login Issue

## Problème: NavBar ne change pas après login

---

## 🔍 Diagnostic

### 1. Backend Response Structure

**createSendToken() retourne:**
```javascript
res.status(200).json({
  success: true,
  message: 'Login successful',
  data: {
    user: userWithoutPassword  // ← User data ici
  }
});
```

### 2. Frontend authStore

**login() attend:**
```javascript
const response = await authAPI.loginExistingUser(email, password);

// Check for 2FA
if (response.data.tempToken) {
  // 2FA flow
}

// Direct login
set({
  user: response.data.user,  // ← Devrait recevoir user ici
  loading: false
});
```

### 3. API Service

**Vérifier services/api/auth.js:**
```javascript
export const loginExistingUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;  // ← Retourne { success, message, data: { user } }
};
```

---

## ✅ Corrections Appliquées

### Backend - authController.js:
```javascript
// AVANT (INCORRECT):
createSendToken(user, 200, res, 'Login successful');
// ❌ Manque le paramètre 'req'

// APRÈS (CORRECT):
await createSendToken(user, 200, res, req, 'Login successful');
// ✅ Tous les paramètres présents
```

---

## 🧪 Test Manuel

### 1. Tester le Login:
```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "password123"
}
```

**Réponse Attendue:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "user@test.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "isVerified": true,
      "isActive": true,
      "createdAt": "..."
    }
  }
}
```

**Cookies Définis:**
- `auth_token` (HttpOnly, 7 jours)
- `refresh_token` (HttpOnly, 30 jours)

---

## 🔧 Vérifications Frontend

### 1. Console Browser:
```javascript
// Après login, vérifier:
console.log('Response:', response);
console.log('User:', response.data.user);
```

### 2. Zustand DevTools:
```javascript
// Vérifier l'état du store:
{
  user: { ... },  // ← Devrait être défini
  loading: false,
  error: null,
  awaitingTwoFA: false
}
```

### 3. Cookies:
```javascript
// Dans DevTools > Application > Cookies
// Vérifier présence de:
- auth_token
- refresh_token
```

---

## 🐛 Problèmes Possibles

### Problème 1: Cookies pas envoyés
**Cause:** `withCredentials` pas activé

**Solution:**
```javascript
// services/api/auth.js
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,  // ← IMPORTANT!
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### Problème 2: CORS
**Cause:** Backend refuse les cookies cross-origin

**Solution (server/index.js):**
```javascript
app.use(cors({
  origin: 'http://localhost:5173',  // Frontend URL
  credentials: true  // ← IMPORTANT!
}));
```

### Problème 3: Structure Response
**Cause:** Frontend attend `response.data.user` mais backend envoie différemment

**Vérifier:**
```javascript
// authStore.js - login()
console.log('Full response:', response);
console.log('Response data:', response.data);
console.log('User:', response.data.user);
```

### Problème 4: checkAuth() pas appelé
**Cause:** App.jsx n'appelle pas checkAuth() au démarrage

**Vérifier App.jsx:**
```javascript
useEffect(() => {
  checkAuth();  // ← Doit être appelé
}, [checkAuth]);
```

---

## ✅ Checklist de Vérification

### Backend:
- [ ] `createSendToken()` reçoit tous les paramètres (user, statusCode, res, req, message)
- [ ] Response structure correcte: `{ success, message, data: { user } }`
- [ ] Cookies définis avec bonnes options
- [ ] CORS configuré avec `credentials: true`

### Frontend:
- [ ] `withCredentials: true` dans axios config
- [ ] `login()` met à jour `user` dans le store
- [ ] `checkAuth()` appelé au démarrage de l'app
- [ ] NavBar utilise `user` du store

### Test:
- [ ] Login réussit (200 OK)
- [ ] Cookies présents dans browser
- [ ] `user` défini dans Zustand store
- [ ] NavBar affiche avatar + nom
- [ ] Dropdown menu fonctionne

---

## 🔄 Flow Complet

```
1. User entre credentials
   ↓
2. LoginPage → login(email, password)
   ↓
3. authAPI.loginExistingUser()
   ↓
4. POST /api/auth/login
   ↓
5. Backend: createSendToken()
   - Set cookies
   - Return { data: { user } }
   ↓
6. authStore: set({ user: response.data.user })
   ↓
7. NavBar: const { user } = useAuthStore()
   ↓
8. NavBar affiche user menu
```

---

## 💡 Solution Rapide

### Ajouter des console.log pour debug:

**authStore.js - login():**
```javascript
login: async (email, password) => {
  set({ loading: true, error: null });
  try {
    const response = await authAPI.loginExistingUser(email, password);
    
    console.log('=== LOGIN RESPONSE ===');
    console.log('Full response:', response);
    console.log('Response data:', response.data);
    console.log('User:', response.data?.user);
    console.log('=====================');
    
    if (response.data.tempToken) {
      set({
        tempToken: response.data.tempToken,
        awaitingTwoFA: true,
        loading: false,
      });
      return { requiresTwoFA: true };
    }
    
    set({
      user: response.data.user,
      loading: false,
    });
    
    console.log('User set in store:', response.data.user);
    
    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error.response?.data?.error || "Login failed";
    set({ error: errorMessage, loading: false });
    throw new Error(errorMessage);
  }
},
```

---

**VÉRIFIER CES POINTS POUR RÉSOUDRE LE PROBLÈME!** 🔍
