# Auth Pages Connected to Simplified Store

## Date: November 1, 2025

## ✅ LOGIN & REGISTER PAGES CONNECTED

---

## 🔌 Pages Mises à Jour

### 1. LoginPage.jsx ✅

**Changements:**
```javascript
// Import awaitingTwoFA
const { login, loading, error, awaitingTwoFA } = useAuthStore();

// Handle submit avec 2FA flow
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const result = await login(formData.email, formData.password);
    
    if (result.requiresTwoFA) {
      // TODO: Navigate to 2FA verification page
      console.log('2FA required');
      // navigate('/verify-2fa');
    } else if (result.success) {
      // Direct login success
      navigate('/');
    }
  } catch (err) {
    console.error('Login error:', err);
    // Error is already in store
  }
};
```

**Flow:**
1. User entre email/password
2. Clique "Se connecter"
3. `login()` est appelé
4. Si `requiresTwoFA: true` → Rediriger vers page 2FA
5. Si `success: true` → Rediriger vers homepage
6. Si erreur → Afficher dans le formulaire

---

### 2. RegisterPage.jsx ✅

**Changements:**
```javascript
// Import awaitingTwoFA
const { register, loading, error, awaitingTwoFA } = useAuthStore();

// Handle submit avec 2FA flow
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  try {
    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    });
    
    if (result.requiresTwoFA) {
      // TODO: Navigate to 2FA verification page
      console.log('2FA required');
      // navigate('/verify-2fa');
    } else if (result.success) {
      // Direct registration success
      navigate('/');
    }
  } catch (err) {
    console.error('Register error:', err);
    // Error is already in store
  }
};
```

**Flow:**
1. User remplit le formulaire
2. Validation locale (password length, match)
3. Clique "Créer mon compte"
4. `register()` est appelé
5. Si `requiresTwoFA: true` → Rediriger vers page 2FA
6. Si `success: true` → Rediriger vers homepage
7. Si erreur → Afficher dans le formulaire

---

## 🔄 Flux Complet

### Scénario 1: Login Direct (sans 2FA)

```
1. LoginPage
   ↓
2. User entre credentials
   ↓
3. handleSubmit() → login(email, password)
   ↓
4. authStore.login()
   ↓
5. authAPI.loginExistingUser()
   ↓
6. Backend: No 2FA required
   ↓
7. Return: { success: true, user: {...} }
   ↓
8. authStore: set({ user: {...} })
   ↓
9. LoginPage: navigate('/')
   ↓
10. HomePage with user logged in
```

### Scénario 2: Login avec 2FA

```
1. LoginPage
   ↓
2. User entre credentials
   ↓
3. handleSubmit() → login(email, password)
   ↓
4. authStore.login()
   ↓
5. authAPI.loginExistingUser()
   ↓
6. Backend: 2FA required, send code
   ↓
7. Return: { requiresTwoFA: true, tempToken: '...' }
   ↓
8. authStore: set({ awaitingTwoFA: true, tempToken: '...' })
   ↓
9. LoginPage: navigate('/verify-2fa') [TODO]
   ↓
10. TwoFAPage: User enters code
    ↓
11. verifyTwoFA(code)
    ↓
12. Backend: Verify code
    ↓
13. Return: { success: true, user: {...} }
    ↓
14. authStore: set({ user: {...}, awaitingTwoFA: false })
    ↓
15. Navigate to homepage
```

---

## 📋 État du Store Pendant le Flow

### Initial State:
```javascript
{
  user: null,
  loading: false,
  error: null,
  tempToken: '',
  awaitingTwoFA: false
}
```

### Après login() avec 2FA:
```javascript
{
  user: null,
  loading: false,
  error: null,
  tempToken: 'abc123...',
  awaitingTwoFA: true  // ← User doit vérifier code
}
```

### Après verifyTwoFA():
```javascript
{
  user: { id, email, firstName, ... },  // ← Logged in!
  loading: false,
  error: null,
  tempToken: '',
  awaitingTwoFA: false
}
```

---

## 🎨 UI States

### LoginPage States:

```javascript
// Loading state
{loading && <Spinner />}

// Error state
{error && <Alert variant="error">{error}</Alert>}

// Awaiting 2FA (should redirect)
{awaitingTwoFA && navigate('/verify-2fa')}

// Success (should redirect)
{user && navigate('/')}
```

### RegisterPage States:

```javascript
// Loading state
{loading && <Spinner />}

// Error state
{error && <Alert variant="error">{error}</Alert>}

// Form validation errors
{formErrors.password && <span>{formErrors.password}</span>}

// Awaiting 2FA (should redirect)
{awaitingTwoFA && navigate('/verify-2fa')}

// Success (should redirect)
{user && navigate('/')}
```

---

## 🔜 TODO: Page 2FA

### Créer TwoFAPage.jsx:

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../stores/authStore';

const TwoFAPage = () => {
  const navigate = useNavigate();
  const { 
    verifyTwoFA, 
    resendTwoFA, 
    cancelTwoFA,
    loading, 
    error,
    awaitingTwoFA 
  } = useAuthStore();
  
  const [code, setCode] = useState('');

  // Redirect if not awaiting 2FA
  if (!awaitingTwoFA) {
    navigate('/connexion');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyTwoFA(code);
      navigate('/');
    } catch (err) {
      console.error('2FA verification failed:', err);
    }
  };

  const handleResend = async () => {
    try {
      await resendTwoFA();
      alert('Code renvoyé!');
    } catch (err) {
      console.error('Resend failed:', err);
    }
  };

  const handleCancel = () => {
    cancelTwoFA();
    navigate('/connexion');
  };

  return (
    <div>
      <h1>Vérification 2FA</h1>
      {error && <div>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Entrez le code"
          maxLength={6}
        />
        <button type="submit" disabled={loading}>
          Vérifier
        </button>
      </form>
      
      <button onClick={handleResend} disabled={loading}>
        Renvoyer le code
      </button>
      
      <button onClick={handleCancel}>
        Annuler
      </button>
    </div>
  );
};
```

### Ajouter la route dans App.jsx:

```javascript
<Route path="/verify-2fa" element={<TwoFAPage />} />
```

---

## ✅ Résumé

### Pages Connectées:
- ✅ LoginPage.jsx → authStore
- ✅ RegisterPage.jsx → authStore
- ✅ App.jsx → checkAuth() au démarrage

### Fonctionnalités:
- ✅ Login avec email/password
- ✅ Register avec validation
- ✅ Support 2FA (flow préparé)
- ✅ Gestion d'erreurs
- ✅ Loading states
- ✅ Redirections

### À Faire:
- ⏳ Créer TwoFAPage.jsx
- ⏳ Ajouter route /verify-2fa
- ⏳ Tester le flow complet

---

**LOGIN & REGISTER PAGES CONNECTÉS AU STORE SIMPLIFIÉ!** ✅

*Prêt pour l'authentification avec support 2FA!*
