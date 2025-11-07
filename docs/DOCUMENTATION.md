# Documentation Technique de ProjectMoney

## 📚 Table des matières

1. [Architecture Globale](#-architecture-globale)
2. [Structure du Projet](#-structure-du-projet)
3. [API Endpoints](#-api-endpoints)
4. [Modèle de Données](#-modèle-de-données)
5. [Sécurité](#-sécurité)
6. [Workflows Principaux](#-workflows-principaux)
7. [Dépannage](#-dépannage)

## 🌐 Architecture Globale

ProjectMoney suit une architecture client-serveur moderne :

- **Frontend** : Application React (Vite) avec gestion d'état via des stores
- **Backend** : API RESTful Node.js/Express
- **Base de données** : PostgreSQL avec Prisma ORM
- **Authentification** : JWT avec refresh tokens
- **Stockage** : Système de fichiers local pour les uploads

## 📁 Structure du Projet

### Frontend (`/client`)

```
src/
├── assets/          # Images, polices, etc.
├── components/      # Composants réutilisables
│   ├── common/      # Composants UI de base
│   ├── layout/      # Mise en page
│   └── shared/      # Composants partagés
├── pages/           # Pages de l'application
├── services/        # Appels API
├── stores/          # Gestion d'état (Zustand)
└── utils/           # Utilitaires et helpers
```

### Backend (`/server`)

```
server/
├── controllers/     # Logique métier
│   ├── auth.js     # Authentification
│   ├── books.js    # Gestion des livres
│   ├── orders.js   # Commandes
│   └── users.js    # Utilisateurs
├── middleware/      # Middlewares
│   ├── auth.js     # Vérification JWT
│   ├── error.js    # Gestion des erreurs
│   └── upload.js   # Gestion des uploads
├── prisma/         # Schéma et migrations
├── routes/         # Définition des routes
└── utils/          # Utilitaires
```

## 🔄 API Endpoints

### Authentification

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/refresh` - Rafraîchir le token
- `POST /api/auth/verify-2fa` - Vérification 2FA

### Livres

- `GET /api/books` - Lister les livres
- `GET /api/books/:id` - Détails d'un livre
- `POST /api/books` - Créer un livre (admin)
- `PUT /api/books/:id` - Mettre à jour un livre (admin)
- `DELETE /api/books/:id` - Supprimer un livre (admin)

### Commandes

- `GET /api/orders` - Historique des commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders/:id` - Détails d'une commande
- `PUT /api/orders/:id/status` - Mettre à jour le statut (admin)

## 🗃️ Modèle de Données

### User

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  role      Role     @default(USER)
  isVerified Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]
  reviews   Review[]
}
```

### Book

```prisma
model Book {
  id          String   @id @default(uuid())
  title       String
  author      String
  price       Float
  description String
  coverImage  String?
  fileUrl     String
  category    Category @relation(fields: [categoryId], references: [id])
  categoryId  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🔒 Sécurité

### Authentification

- JWT avec expiration courte (15 min)
- Refresh tokens avec expiration plus longue (7 jours)
- Cookies HTTP-only pour le stockage sécurisé
- Protection CSRF

### Validation

- Validation des entrées avec Joi
- Sanitization des données
- Protection contre les injections SQL avec Prisma

## 🔄 Workflows Principaux

### Achat d'un Livre

1. L'utilisateur consulte le catalogue
2. Sélectionne un livre et l'ajoute au panier
3. Passe à la caisse et saisit ses informations de paiement
4. Le système valide le paiement
5. Le livre est ajouté à la bibliothèque de l'utilisateur
6. Un email de confirmation est envoyé

### Gestion des Livres (Admin)

1. L'admin se connecte au panneau d'administration
2. Accède à la section de gestion des livres
3. Peut ajouter/modifier/supprimer des livres
4. Les changements sont immédiatement visibles dans le catalogue

## 🛠 Dépannage

### Problèmes Courants

#### Erreurs de base de données

- Vérifiez que PostgreSQL est en cours d'exécution
- Vérifiez les informations de connexion dans `.env`
- Exécutez `npx prisma migrate dev` pour appliquer les migrations

#### Problèmes d'authentification

- Vérifiez que les tokens JWT sont correctement configurés
- Assurez-vous que le secret JWT est défini dans les variables d'environnement
- Vérifiez les dates d'expiration des tokens

#### Problèmes de téléchargement

- Vérifiez les permissions du dossier d'upload
- Assurez-vous que le chemin de stockage est correctement configuré
- Vérifiez les logs du serveur pour les erreurs potentielles

## 📝 Notes pour les Développeurs

- Toujours utiliser les variables d'environnement pour les données sensibles
- Suivre les conventions de commit (Conventional Commits)
- Écrire des tests pour les nouvelles fonctionnalités
- Documenter les nouvelles routes et fonctionnalités
- Vérifier les vulnérabilités avec `npm audit` régulièrement