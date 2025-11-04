# GUIDE DE DÉPLOIEMENT – ProjectMoney (Privé CEPIC)

Ce guide couvre les déploiements avec npm (pas pnpm), en Docker ou sur un VPS, pour le frontend (Vite) et le backend (Express).

## 1. Prérequis

- Node.js 18+ (recommandé 20+)
- PostgreSQL 13+ (managé ou auto-hébergé)
- Domaine + certificats TLS (Let’s Encrypt, proxy managé)
- Accès SSH et registre privé si utilisé

## 2. Variables d’environnement

Voir `ENVIRONNEMENT.md` pour le détail. En production, au minimum:

- Backend: `NODE_ENV=production`, `PORT=3001`, `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, `COOKIE_SECRET`
- Frontend: `VITE_API_BASE_URL=https://api.cepic.ci/api`

## 3. Déploiement Docker (recommandé)

### 3.1 Backend (server)

```bash
cd server
# Build image
docker build -t cepic/projectmoney-backend:latest .
# Run container
docker run -d --name projectmoney-backend \
  -p 3001:3001 \
  --env-file .env.production \
  cepic/projectmoney-backend:latest
```

### 3.2 Frontend (client)

```bash
cd client
# Build image multi-étapes (builder + nginx)
docker build -t cepic/projectmoney-frontend:latest .
# Run container (nginx)
docker run -d --name projectmoney-frontend -p 80:80 cepic/projectmoney-frontend:latest
```

### 3.3 Reverse proxy (Nginx)

- `app.cepic.ci` → conteneur frontend (port 80)
- `api.cepic.ci` → conteneur backend (port 3001)
- Activer HTTPS (Let’s Encrypt)

## 4. Déploiement sur VPS (sans Docker)

### 4.1 Backend

```bash
# Sur le serveur
cd /var/www/projectmoney/server
npm ci --only=production
npx prisma generate
npx prisma migrate deploy
# PM2
npm i -g pm2
pm2 start index.js --name projectmoney-api
pm2 save && pm2 startup
```

### 4.2 Frontend

```bash
cd /var/www/projectmoney/client
npm ci
npm run build
# Servir le dossier dist/ via Nginx
sudo rsync -a dist/ /var/www/projectmoney/frontend/
```

### 4.3 Nginx (exemple minimal)

```nginx
server {
  listen 80;
  server_name app.cepic.ci;
  root /var/www/projectmoney/frontend;
  index index.html;
  location / {
    try_files $uri /index.html;
  }
}

server {
  listen 80;
  server_name api.cepic.ci;
  location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## 5. Scripts npm

### Backend (`server/package.json`)

- `start`: démarrer Express
- `dev`: nodemon
- `db:migrate`, `db:seed`, `db:studio` (Prisma)

### Frontend (`client/package.json`)

- `dev`: Vite dev server
- `build`: build production
- `preview`: prévisualisation

## 6. Observabilité & logs

- Logs structurés (winston/pino) côté backend
- Logs access proxy
- Health checks (route `/health` si exposée)

## 7. Sécurité

- Forcer HTTPS
- Cookies `Secure`, `SameSite=Lax|Strict`
- Secrets forts (JWT, COOKIE_SECRET)
- CORS strict (domaines CEPIC)
- Helmet activé

## 8. Checklist go-live

- [ ] `.env.production` backend
- [ ] `.env`/`.env.production` frontend
- [ ] DB migrée (`prisma migrate deploy`)
- [ ] Certificats SSL actifs
- [ ] Reverse proxy prêt
- [ ] Backups DB planifiés

## 9. Rollback

- Taguer les images (N, N-1)
- Conserver build frontend N-1
- PM2/compose: revenir à l’image précédente

---

Document interne CEPIC – ne pas diffuser.
