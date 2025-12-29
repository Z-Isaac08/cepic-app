# GUIDE DE DÉPLOIEMENT GRATUIT - Application CEPIC

Ce guide vous permettra de déployer l'application CEPIC **gratuitement** pour la tester en ligne.

---

## RÉSUMÉ DES OPTIONS GRATUITES

| Service | Base de données | Backend | Frontend | Lien Public | Recommandé |
|---------|-----------------|---------|----------|-------------|------------|
| **Railway** | PostgreSQL gratuit | Node.js | Static | ✅ Oui | ⭐ MEILLEUR |
| **Render** | PostgreSQL gratuit | Node.js | Static | ✅ Oui | ✅ Facile |
| **Vercel + Supabase** | Supabase | Vercel Functions | Vercel | ✅ Oui | ✅ Frontend |
| **Docker local + ngrok** | Local | Local | Local | ✅ Via tunnel | 🔧 Dev only |

**Recommandation:** Utilisez **Railway** pour un déploiement tout-en-un simple et gratuit.

---

## OPTION 1: RAILWAY (RECOMMANDÉ) ⭐

Railway offre un déploiement gratuit avec base de données PostgreSQL incluse.

### Étapes

#### 1. Créer un compte Railway
1. Allez sur [railway.app](https://railway.app)
2. Connectez-vous avec GitHub

#### 2. Déployer la base de données
1. Cliquez **New Project** > **Deploy PostgreSQL**
2. Railway crée automatiquement une base de données
3. Copiez l'URL `DATABASE_URL` depuis les variables

#### 3. Déployer le Backend
1. **New** > **GitHub Repo** > Sélectionnez votre repo
2. Configurez :
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npx prisma generate && npx prisma db push`
   - **Start Command:** `node index.js`
3. Ajoutez les **Variables d'environnement** :

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://... (copié depuis PostgreSQL)
JWT_SECRET=votre_secret_jwt_64_chars_minimum
JWT_REFRESH_SECRET=votre_refresh_secret_64_chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
CSRF_SECRET=votre_csrf_secret_32_chars
COOKIE_SECRET=votre_cookie_secret_32_chars
CLIENT_URL=https://votre-frontend.up.railway.app
```

4. Déployez et notez l'URL (ex: `https://cepic-backend.up.railway.app`)

#### 4. Déployer le Frontend
1. **New** > **GitHub Repo** > Même repo
2. Configurez :
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npx serve dist -s -l 3000`
3. Ajoutez la variable :

```env
VITE_API_URL=https://votre-backend.up.railway.app/api
```

4. Déployez et vous obtenez votre URL publique !

#### 5. Mettre à jour CLIENT_URL
Retournez dans le backend et mettez à jour `CLIENT_URL` avec l'URL du frontend.

### Limites gratuites Railway
- **500 heures/mois** de CPU
- **1 GB RAM**
- **1 GB PostgreSQL**
- Parfait pour les tests !

---

## OPTION 2: RENDER

### Étapes

#### 1. Base de données PostgreSQL
1. [render.com](https://render.com) > **New** > **PostgreSQL**
2. Plan: **Free**
3. Copiez l'**Internal Database URL**

#### 2. Backend (Web Service)
1. **New** > **Web Service**
2. Connectez votre repo GitHub
3. Configuration :
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npx prisma generate && npx prisma db push`
   - **Start Command:** `node index.js`
   - **Environment:** Node

4. Variables d'environnement (comme Railway)

#### 3. Frontend (Static Site)
1. **New** > **Static Site**
2. Configuration :
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

3. Variable :
```env
VITE_API_URL=https://votre-backend.onrender.com/api
```

### Limites gratuites Render
- Backend: **750 heures/mois**, sleep après 15min d'inactivité
- PostgreSQL: **90 jours** puis supprimé (renouveler)
- Static: **Illimité**

---

## OPTION 3: DOCKER LOCAL + NGROK (Test rapide)

Pour tester rapidement avec un lien public temporaire.

### Étapes

#### 1. Prérequis
- Docker Desktop installé
- Compte ngrok gratuit ([ngrok.com](https://ngrok.com))

#### 2. Lancer avec Docker Compose
```bash
# Dans le dossier du projet
docker-compose -f docker-compose.prod.yml up --build
```

#### 3. Exposer avec ngrok
```bash
# Terminal 1: Exposer le frontend
ngrok http 80

# Terminal 2: Exposer le backend (si nécessaire)
ngrok http 3001
```

#### 4. Obtenir les liens
ngrok vous donnera des URLs publiques comme :
- Frontend: `https://abc123.ngrok-free.app`
- Backend: `https://xyz789.ngrok-free.app`

**Note:** Les liens ngrok changent à chaque redémarrage (version gratuite).

---

## CONFIGURATION EMAIL EN PRODUCTION

### Option A: Mode Console (Développement)
Par défaut, si `EMAIL_USER` n'est pas défini, les emails sont affichés dans la console du serveur. C'est parfait pour les tests !

### Option B: Gmail (Production)

1. **Activer la vérification en 2 étapes** sur votre compte Google
2. **Créer un mot de passe d'application** :
   - [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Sélectionnez "Autre (Nom personnalisé)" > "CEPIC"
   - Copiez le mot de passe généré

3. **Variables d'environnement** :
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  # Le mot de passe d'app
EMAIL_FROM=noreply@cepic.ci
```

### Option C: Autres services email gratuits

| Service | Limite gratuite | Configuration |
|---------|-----------------|---------------|
| **SendGrid** | 100 emails/jour | API Key |
| **Mailgun** | 5000 emails/mois (3 mois) | API Key |
| **Brevo (Sendinblue)** | 300 emails/jour | SMTP |
| **Mailtrap** | Test only | SMTP |

---

## GÉNÉRATION DES SECRETS

### Linux/Mac
```bash
# JWT Secret (64 caractères)
openssl rand -base64 48

# CSRF/Cookie Secret (32 caractères)
openssl rand -base64 24
```

### Windows (PowerShell)
```powershell
# JWT Secret
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])

# CSRF Secret
[Convert]::ToBase64String((1..24 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

### En ligne
- [randomkeygen.com](https://randomkeygen.com)
- [generate-random.org](https://generate-random.org/api-key-generator)

---

## SEED DE LA BASE DE DONNÉES

Après le déploiement, pour ajouter des données de test :

### Via Railway/Render
Ajoutez temporairement cette commande au Start Command :
```bash
npx prisma db push && npm run seed && node index.js
```

Puis retirez `npm run seed` après le premier déploiement.

### Manuellement
```bash
# Se connecter au shell Railway
railway run npx prisma db seed
```

---

## CHECKLIST DE DÉPLOIEMENT

### Avant le déploiement
- [ ] Console.log de debug nettoyés ✅ (déjà fait)
- [ ] Fichier `.env.production.example` créé ✅
- [ ] Dockerfiles production créés ✅

### Variables obligatoires
- [ ] `DATABASE_URL` - URL PostgreSQL
- [ ] `JWT_SECRET` - Minimum 64 caractères
- [ ] `JWT_REFRESH_SECRET` - Minimum 64 caractères
- [ ] `CSRF_SECRET` - Minimum 32 caractères
- [ ] `COOKIE_SECRET` - Minimum 32 caractères
- [ ] `CLIENT_URL` - URL du frontend
- [ ] `VITE_API_URL` - URL de l'API (pour le frontend)

### Variables optionnelles
- [ ] `EMAIL_*` - Configuration email (sinon mode console)
- [ ] `CINETPAY_*` - Configuration paiement (sinon mode sandbox)

### Après le déploiement
- [ ] Tester la page d'accueil
- [ ] Tester l'inscription (vérifier emails en console)
- [ ] Tester la connexion
- [ ] Tester l'admin (`/admin`)
- [ ] Vérifier les formations

---

## URLS DE TEST APRÈS DÉPLOIEMENT

| Test | URL | Résultat attendu |
|------|-----|------------------|
| Frontend | `https://votre-app.railway.app` | Page d'accueil |
| API Health | `https://votre-api.railway.app/health` | `{"status":"OK"}` |
| API Status | `https://votre-api.railway.app/api/status` | JSON avec infos |
| Formations | `https://votre-api.railway.app/api/trainings` | Liste des formations |

---

## DÉPANNAGE

### Erreur "Connection refused" sur la base de données
- Vérifiez que `DATABASE_URL` est correct
- Sur Railway/Render, utilisez l'URL **interne** pas l'URL publique

### Erreur CORS
- Vérifiez que `CLIENT_URL` correspond exactement à l'URL du frontend
- Incluez le protocole (`https://`)

### Emails non envoyés
- Vérifiez les logs du serveur
- En mode dev, les emails sont dans la console
- Pour Gmail, utilisez un **mot de passe d'application**

### Frontend affiche "API Error"
- Vérifiez `VITE_API_URL` dans les variables du frontend
- Assurez-vous que le backend est déployé et accessible

### "Invalid CSRF token"
- Vérifiez que les cookies sont envoyés (credentials: 'include')
- Vérifiez que `CSRF_SECRET` est défini

---

## COÛTS (Gratuit!)

| Service | Coût mensuel |
|---------|--------------|
| Railway (DB + Backend + Frontend) | **$0** (dans les limites) |
| Render (DB + Backend + Frontend) | **$0** (dans les limites) |
| ngrok (tunnel temporaire) | **$0** |
| Gmail (email) | **$0** |
| **TOTAL** | **$0** |

---

## PROCHAINES ÉTAPES

1. **Déployer sur Railway** (5-10 minutes)
2. **Tester les fonctionnalités** clés
3. **Partager le lien** avec le client
4. **Collecter les retours**
5. **Préparer la production** finale si validé

---

## SUPPORT

En cas de problème :
1. Vérifiez les logs sur Railway/Render
2. Testez l'endpoint `/health` de l'API
3. Consultez la documentation [AUDIT_FINAL_PRODUCTION.md](AUDIT_FINAL_PRODUCTION.md)

---

**Bon déploiement !** 🚀
