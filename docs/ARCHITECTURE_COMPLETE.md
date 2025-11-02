# Architecture Complète - CEPIC Platform

## Date: November 1, 2025

## Architecture en 3 Couches

```
COMPOSANTS REACT
    ↓ (consomment)
STORES ZUSTAND
    ↓ (appellent)
SERVICES API
    ↓ (appellent)
BACKEND
```

## Structure Complète

### Services API + Stores

| API | Store | Responsabilité |
|-----|-------|----------------|
| auth.js | authStore.js | Authentification |
| trainings.js | trainingStore.js | Formations |
| categories.js | categoryStore.js | Catégories |
| enrollments.js | enrollmentStore.js | Inscriptions |
| payments.js | enrollmentStore.js | Paiements |
| gallery.js | galleryStore.js | Galerie |
| contact.js | contactStore.js | Contact |

## Stores Créés

1. authStore.js - EXISTANT
2. trainingStore.js - EXISTANT
3. categoryStore.js - NOUVEAU
4. enrollmentStore.js - EXISTANT
5. galleryStore.js - NOUVEAU
6. contactStore.js - NOUVEAU
7. adminStore.js - EXISTANT

## Utilisation

### Dans les composants:

```javascript
import { useTrainingStore } from '../stores';

const { trainings, loading, fetchTrainings } = useTrainingStore();
```

### Les stores appellent les APIs:

```javascript
import * as trainingsAPI from '../services/api/trainings';

fetchTrainings: async () => {
  const response = await trainingsAPI.getAllTrainings();
  set({ trainings: response.data });
}
```

## Résumé

- 7 modules API
- 7 stores Zustand
- Architecture propre et modulaire
- Séparation des responsabilités
- Facile à maintenir et tester

