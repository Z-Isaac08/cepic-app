# DOCUMENTATION TECHNIQUE – ProjectMoney (Client: CEPIC)

Note de confidentialité: Document interne, réservé à CEPIC. Ne pas diffuser.

## Vue d’ensemble

ProjectMoney est une plateforme complète (monorepo) composée d’un backend Node/Express et d’un frontend React/Vite. Cette documentation décrit l’architecture, les principaux modules, les points d’API, les stores (Zustand) et les conventions afin de faciliter la maintenance et l’évolution.

## Architecture

- Backend: `server/` (Express, Prisma, PostgreSQL)
- Frontend: `client/` (React 19, Vite, Tailwind, Zustand, Axios, Recharts)
- Communication: JSON over HTTP, cookies httpOnly pour auth

## Backend (server)

- Entrée: `server/index.js`
- Routes principales: `server/routers/*.js`
- Contrôleurs: `server/controllers/*.js`
- Middlewares: `server/middleware/*.js` (auth, sécurité, erreurs)
- Accès DB: `server/lib/prisma.js`, schéma Prisma dans `server/prisma/`
- Sécurité: Helmet, rate limiting, auth JWT, cookies httpOnly, validation

### Routes admin clés

- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `GET /api/admin/trainings`
- `GET /api/admin/enrollments`
- `GET /api/admin/messages`
- `PATCH /api/admin/messages/:id/read`
- `DELETE /api/admin/messages/:id`

## Frontend (client)

- Entrée: `client/src/main.jsx` et `client/src/App.jsx`
- State: stores Zustand dans `client/src/stores/`
- Services HTTP: `client/src/services/api/*.js` (Axios préconfiguré)
- UI: Tailwind, composants `client/src/components/ui/`
- Admin: `client/src/components/admin/` (Dashboard, Users, Messages, Analytics…)

### Stores importants

- `useAdminStore` (`client/src/stores/adminStore.js`)
  - Dashboard/analytics, users, trainings, categories, gallery
  - Messages: `getMessages()`, `markAsRead(id, isRead)`, `deleteMessage(id)`, `getUnreadCount()`
  - Analytics: `fetchAnalytics(period, metric)` alimente `dashboardData.analytics[metric][period]`

### API client admin

`client/src/services/api/admin.js` expose entre autres:

- `getAllMessages(params)`
- `markMessageAsRead(id)`
- `deleteMessage(id)`
- `getAllTrainingsAdmin`, `getCategories`, `getAllEnrollments`, etc.

## Composants clés (Admin)

- `MessagesManagement.jsx`:
  - Liste type boîte mail (tabs Tous/Non lus/Lus, recherche, tri par date)
  - Actions: voir détails (modal), marquer lu/non lu (toggle), supprimer (confirm)
  - Auto-marque en lu à l’ouverture du message
  - Heure relative ("il y a 2h", "hier", …)
- `AnalyticsPanel.jsx`:
  - Sélecteur de période (today/7d/30d/12m)
  - KPIs (total utilisateurs, nouveaux, revenu, croissance)
  - Graphiques Recharts: Line (inscriptions), Bar (populaires), Area (revenus), Pie (catégories)
  - Fallback mock si pas de données analytics

## Conventions & Qualité

- Lint: ESLint config côté `client/` (JS/JSX)
- Style: Tailwind, variables couleurs cohérentes (primary/secondary)
- Nommage: variables explicites, fonctions verbeuses, éviter abréviations
- Erreurs: pas de try/catch inutiles, pas de swallow silencieux
- Accessibilité: boutons/labels explicites, focus styles

## Sécurité & Auth

- JWT en cookies httpOnly, refresh flow côté backend
- Middleware `protect`, `requireAdmin` sur routes admin
- Interceptor Axios redirige 401 vers `/connexion`

## Performances

- Vite build, découpage chunks (vendors, router, store, http)
- Composants lourds memoïzés, lazy loading côté pages
- Recharts dans `ResponsiveContainer` pour layout adaptatif

## Tests (suggestions)

- Unit: stores et services
- UI: composants UI critiques (Button, Forms)
- Integration: flux auth et endpoints clés via supertest côté server

## Roadmap (pistes)

- Endpoint toggle "mark as unread" côté backend
- Graphiques temps réel (websocket) pour l’admin
- Tests e2e (Playwright) pour parcours critiques

---

Pour le déploiement et l’infrastructure, voir `GUIDE_DEPLOIEMENT.md`. Pour les variables, voir `ENVIRONNEMENT.md`.
