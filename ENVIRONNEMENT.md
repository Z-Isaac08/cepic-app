# ENVIRONNEMENT – Variables & Secrets

Ce dépôt est privé (client CEPIC). Ne pas commiter de secrets.

## Backend (`server/.env`)

```env
# Serveur
NODE_ENV=development
PORT=3001
CLIENT_URL=http://localhost:5173

# JWT
JWT_SECRET=change_me_strong_secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
COOKIE_SECRET=change_me_cookie_secret

# Base de données
DATABASE_URL=postgresql://user:password@localhost:5432/projectmoney

# Email (2FA / notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Sécurité
CSRF_SECRET=csrf_secret_here
ALLOWED_ORIGINS=http://localhost:5173
```

### Production (exemples)

```env
NODE_ENV=production
PORT=3001
CLIENT_URL=https://app.cepic.ci
ALLOWED_ORIGINS=https://app.cepic.ci
DATABASE_URL=postgresql://user:pass@db:5432/projectmoney
JWT_SECRET=prod_super_secret
COOKIE_SECRET=prod_cookie_secret
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASS=sendgrid_api_key
```

## Frontend (`client/.env`)

```env
# Développement
VITE_API_BASE_URL=http://localhost:3001/api
```

### Production (exemples)

```env
VITE_API_BASE_URL=https://api.cepic.ci/api
VITE_APP_URL=https://app.cepic.ci
VITE_NODE_ENV=production
VITE_DEBUG_MODE=false
```

## Bonnes pratiques

- Ne jamais commiter `.env*`
- Stocker les secrets dans un vault (1Password, Vault, AWS Secrets Manager)
- Utiliser des comptes de service dédiés (DB, email)
- CORS strict (origins CEPIC uniquement en prod)
