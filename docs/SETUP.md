# Guide d'Installation et de Configuration

Ce guide vous explique comment configurer et lancer l'application ProjectMoney en environnement de développement et de production.

## Prérequis

- Node.js (v18 ou supérieur)
- npm (v9 ou supérieur) ou yarn
- PostgreSQL (v14 ou supérieur)
- Git

## Configuration de l'environnement

### 1. Cloner le dépôt

```bash
git clone [URL_DU_REPO]
cd ProjectMoney
```

### 2. Configuration du Backend

1. Accédez au dossier du serveur :
   ```bash
   cd server
   ```

2. Installez les dépendances :
   ```bash
   npm install
   # ou
   yarn
   ```

3. Configurez les variables d'environnement :
   - Copiez le fichier `.env.example` vers `.env`
   - Modifiez les valeurs selon votre configuration

4. Configuration de la base de données :
   ```bash
   # Appliquer les migrations
   npx prisma migrate dev --name init
   
   # Lancer les seeds (données initiales)
   npx prisma db seed
   ```

5. Démarrer le serveur en mode développement :
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

### 3. Configuration du Frontend

1. Dans un nouveau terminal, accédez au dossier du client :
   ```bash
   cd ../client
   ```

2. Installez les dépendances :
   ```bash
   npm install
   # ou
   yarn
   ```

3. Configurez les variables d'environnement :
   - Créez un fichier `.env` basé sur `.env.example`
   - Assurez-vous que `VITE_API_BASE_URL` pointe vers votre backend

4. Démarrer l'application en mode développement :
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

## Déploiement en Production

### Avec Docker (recommandé)

1. Construisez les images :
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. Lancez les conteneurs :
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Déploiement manuel

1. Build du frontend :
   ```bash
   cd client
   npm run build
   ```

2. Configuration du serveur de production :
   - Configurez un serveur web (Nginx, Apache) pour servir les fichiers statiques du frontend
   - Configurez un reverse proxy pour l'API

## Tests

### Tests unitaires
```bash
# Dans le dossier du serveur
npm test

# Dans le dossier du client
cd ../client
npm test
```

### Tests d'intégration
```bash
# Dans le dossier du serveur
npm run test:integration
```

## Dépannage

- **Erreurs de connexion à la base de données** : Vérifiez les identifiants dans `.env`
- **Erreurs CORS** : Assurez-vous que `CORS_ORIGIN` est correctement configuré
- **Problèmes de build** : Supprimez `node_modules` et `package-lock.json` puis réinstallez les dépendances
