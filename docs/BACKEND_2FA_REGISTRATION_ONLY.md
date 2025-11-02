# Backend - 2FA Registration Only

## Date: November 1, 2025

## ✅ BACKEND MODIFIÉ - 2FA UNIQUEMENT POUR L'INSCRIPTION

---

## 🔧 Modifications Appliquées

### File: `server/controllers/authController.js`

---

## 🔓 loginExistingUser - SANS 2FA

### Avant:
```javascript
// Générait code 2FA
const code = generate2FACode();
const tempToken = generateTempToken();

// Stockait le code
await prisma.twoFACode.create({...});

// Envoyait email
await emailService.send2FACode(...);

// Retournait tempToken
res.json({ tempToken, requires2FA: true });
```

### Après:
```javascript
// Vérification password
const isPasswordValid = await bcrypt.compare(password, user.password);

if (!isPasswordValid) {
  return res.status(401).json({
    success: false,
    error: 'Invalid email or password'
  });
}

// Login direct sans 2FA
createSendToken(user, 200, res, 'Login successful');
```

**Changement:** Connexion directe, pas de 2FA!

---

## 🔐 registerNewUser - AVEC 2FA

### Code Complet:
```javascript
const registerNewUser = async (req, res, next) => {
  try {
    const { email, firstName, lastName, password, phone } = req.validatedData;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user (NOT verified yet)
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        role: 'USER',
        isVerified: false  // ← Will be verified after 2FA
      }
    });

    // Generate 2FA code
    const code = generate2FACode();
    const tempToken = generateTempToken();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Store 2FA code
    await prisma.twoFACode.create({
      data: {
        userId: newUser.id,
        code,
        tempToken,
        type: 'REGISTRATION',  // ← Type REGISTRATION
        expiresAt
      }
    });

    // Send 2FA code via email
    if (process.env.NODE_ENV === 'production') {
      await emailService.send2FACode(email, code, `${firstName} ${lastName}`);
    } else {
      console.log(`Verification Code for ${email}: ${code}`);
    }

    // Return tempToken for 2FA verification
    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please verify your email.',
      data: {
        tempToken,
        requires2FA: true  // ← Frontend knows to show 2FA form
      }
    });
  } catch (error) {
    next(error);
  }
};
```

**Changement:** Utilisateur créé avec `isVerified: false`, 2FA requis!

---

## ✅ verify2FA - Inchangé

### Fonctionnement:
```javascript
const verify2FA = async (req, res, next) => {
  try {
    const { tempToken, code } = req.validatedData;
    
    // Find 2FA record
    const twoFARecord = await prisma.twoFACode.findUnique({
      where: { tempToken },
      include: { user: true }
    });

    // Validate code
    if (twoFARecord.code !== code) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification code'
      });
    }

    // Mark code as used
    await prisma.twoFACode.update({
      where: { id: twoFARecord.id },
      data: { isUsed: true }
    });

    // Mark user as VERIFIED
    const updatedUser = await prisma.user.update({
      where: { id: twoFARecord.userId },
      data: {
        isVerified: true,  // ← User is now verified!
        lastLogin: new Date()
      }
    });

    // Send welcome email for registrations
    if (twoFARecord.type === 'REGISTRATION') {
      await emailService.sendWelcomeEmail(...);
    }

    // Create session and send token
    createSendToken(updatedUser, 200, res, 'Login successful');
  } catch (error) {
    next(error);
  }
};
```

---

## 🔄 Flow Complet

### Login (Sans 2FA):
```
1. POST /api/auth/login
   { email, password }
   ↓
2. Verify password
   ↓
3. createSendToken()
   ↓
4. Response: { success: true, user: {...} }
   + Cookies: auth_token, refresh_token
```

### Registration (Avec 2FA):
```
1. POST /api/auth/register
   { email, firstName, lastName, password, phone }
   ↓
2. Create user (isVerified: false)
   ↓
3. Generate 2FA code
   ↓
4. Store in twoFACode table
   ↓
5. Send email with code
   ↓
6. Response: { tempToken, requires2FA: true }
   ↓
7. Frontend shows 2FA form
   ↓
8. POST /api/auth/verify-2fa
   { tempToken, code }
   ↓
9. Verify code
   ↓
10. Update user (isVerified: true)
    ↓
11. createSendToken()
    ↓
12. Response: { success: true, user: {...} }
    + Cookies: auth_token, refresh_token
```

---

## 📊 Database Changes

### User Table:
```javascript
{
  id: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone: string | null,
  role: 'USER' | 'ADMIN',
  isVerified: boolean,  // ← false until 2FA verified
  isActive: boolean,
  lastLogin: Date,
  createdAt: Date
}
```

### TwoFACode Table:
```javascript
{
  id: string,
  userId: string,
  code: string,        // 6-digit code
  tempToken: string,   // For frontend
  type: 'REGISTRATION' | 'LOGIN',  // ← Only REGISTRATION used now
  expiresAt: Date,     // 10 minutes
  isUsed: boolean,
  createdAt: Date
}
```

---

## ✅ Résumé des Changements

### loginExistingUser:
- ❌ Removed: 2FA code generation
- ❌ Removed: Email sending
- ❌ Removed: tempToken return
- ✅ Added: Direct login with createSendToken()

### registerNewUser:
- ✅ Kept: 2FA code generation
- ✅ Kept: Email sending
- ✅ Kept: tempToken return
- ✅ Added: `isVerified: false` on user creation
- ✅ Added: `phone` field support
- ✅ Type: 'REGISTRATION' for 2FA code

### verify2FA:
- ✅ Unchanged: Works for both types
- ✅ Sets `isVerified: true` after verification
- ✅ Sends welcome email for registrations

---

## 🧪 Testing

### Test Login (No 2FA):
```bash
POST /api/auth/login
{
  "email": "user@test.com",
  "password": "password123"
}

# Expected Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "user@test.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER"
    }
  }
}

# Cookies set:
- auth_token
- refresh_token
```

### Test Registration (With 2FA):
```bash
# Step 1: Register
POST /api/auth/register
{
  "email": "new@test.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "password": "password123",
  "phone": "+225 07 00 00 00 00"
}

# Expected Response:
{
  "success": true,
  "message": "Account created successfully. Please verify your email.",
  "data": {
    "tempToken": "abc123...",
    "requires2FA": true
  }
}

# Step 2: Verify 2FA
POST /api/auth/verify-2fa
{
  "tempToken": "abc123...",
  "code": "123456"
}

# Expected Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "new@test.com",
      "isVerified": true
    }
  }
}

# Cookies set:
- auth_token
- refresh_token
```

---

## ✅ Avantages

### Performance:
- ✅ Login plus rapide (pas d'email)
- ✅ Moins de requêtes DB pour login
- ✅ Pas de génération de code inutile

### UX:
- ✅ Connexion immédiate
- ✅ 2FA seulement pour nouveaux comptes
- ✅ Vérification email une seule fois

### Sécurité:
- ✅ Email vérifié à l'inscription
- ✅ Utilisateurs vérifiés (`isVerified: true`)
- ✅ Pas de spam d'emails à chaque login

---

**BACKEND MODIFIÉ - 2FA UNIQUEMENT POUR L'INSCRIPTION!** ✅

*Login direct, inscription avec vérification email!*
