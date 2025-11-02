# Système de Reviews et Favoris

## Date: November 1, 2025

## ✅ SYSTÈME COMPLET CONNECTÉ AU BACKEND

---

## 📊 Architecture

### Frontend → Store → API → Backend → Database

```
Component (TrainingCard, PricingCard, ReviewSection)
    ↓
Store (trainingStore.js)
    ↓
API Service (trainings.js)
    ↓
Backend Controller (trainingController.js)
    ↓
Database (Prisma)
```

---

## 🔖 SYSTÈME DE FAVORIS (Bookmarks)

### Frontend

#### Composants Utilisant les Favoris:
1. **TrainingCard.jsx**
2. **PricingCard.jsx**

#### Code:
```javascript
import { useTrainingStore } from '../../stores/trainingStore';
import { useAuthStore } from '../../stores/authStore';

const { user } = useAuthStore();
const { toggleBookmark } = useTrainingStore();
const [isBookmarked, setIsBookmarked] = useState(training.isBookmarked || false);

const handleBookmark = async () => {
  if (!user) {
    window.location.href = '/connexion';
    return;
  }

  setIsLoading(true);
  try {
    const response = await toggleBookmark(training.id);
    setIsBookmarked(response.bookmarked);
  } catch (error) {
    console.error('Erreur bookmark:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### Store (trainingStore.js)

```javascript
toggleBookmark: async (id) => {
  try {
    const response = await trainingsAPI.toggleBookmark(id);
    
    // Mettre à jour la liste des favoris
    if (response.bookmarked) {
      set((state) => ({
        bookmarks: [...state.bookmarks, { trainingId: id }]
      }));
    } else {
      set((state) => ({
        bookmarks: state.bookmarks.filter(b => b.trainingId !== id)
      }));
    }
    
    return response;
  } catch (error) {
    throw error;
  }
},

fetchBookmarks: async () => {
  set({ loading: true, error: null });
  try {
    const response = await trainingsAPI.getMyBookmarks();
    set({ bookmarks: response.data, loading: false });
  } catch (error) {
    set({ 
      error: error.response?.data?.error || 'Erreur lors du chargement des favoris',
      loading: false 
    });
  }
}
```

### API Service (trainings.js)

```javascript
export const toggleBookmark = async (id) => {
  const response = await api.post(`/trainings/${id}/bookmark`);
  return response.data;
};

export const getMyBookmarks = async () => {
  const response = await api.get('/trainings/bookmarks/me');
  return response.data;
};
```

### Backend (trainingController.js)

```javascript
// POST /api/trainings/:id/bookmark
exports.toggleBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Vérifier si déjà en favoris
    const existing = await prisma.trainingBookmark.findUnique({
      where: {
        userId_trainingId: { userId, trainingId: id }
      }
    });

    if (existing) {
      // Retirer des favoris
      await prisma.trainingBookmark.delete({
        where: { id: existing.id }
      });
      return res.json({
        success: true,
        message: 'Retiré des favoris',
        bookmarked: false
      });
    }

    // Ajouter aux favoris
    await prisma.trainingBookmark.create({
      data: { userId, trainingId: id }
    });

    res.json({
      success: true,
      message: 'Ajouté aux favoris',
      bookmarked: true
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/trainings/bookmarks/me
exports.getMyBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const bookmarks = await prisma.trainingBookmark.findMany({
      where: { userId },
      include: {
        training: {
          include: { category: true }
        }
      }
    });

    res.json({
      success: true,
      data: bookmarks
    });
  } catch (error) {
    next(error);
  }
};
```

### Database (Prisma Schema)

```prisma
model TrainingBookmark {
  id         String   @id @default(cuid())
  userId     String
  trainingId String
  createdAt  DateTime @default(now())

  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  training Training @relation(fields: [trainingId], references: [id], onDelete: Cascade)

  @@unique([userId, trainingId])
  @@index([userId])
  @@map("training_bookmarks")
}
```

---

## ⭐ SYSTÈME DE REVIEWS (Avis)

### Frontend

#### Composant: ReviewSection.jsx

**Fonctionnalités:**
- ✅ Affichage des avis existants
- ✅ Filtrage par note (1-5 étoiles)
- ✅ Formulaire d'ajout d'avis
- ✅ Étoiles interactives
- ✅ Validation (connexion requise)

#### Code:
```javascript
import { useAuthStore } from '../../../stores/authStore';
import { useTrainingStore } from '../../../stores/trainingStore';

const { user } = useAuthStore();
const { addReview } = useTrainingStore();
const [showReviewForm, setShowReviewForm] = useState(false);
const [reviewForm, setReviewForm] = useState({
  rating: 5,
  comment: ''
});

const handleSubmitReview = async (e) => {
  e.preventDefault();
  
  if (!user) {
    window.location.href = '/connexion';
    return;
  }

  setSubmitting(true);
  try {
    await addReview(training.id, reviewForm);
    setReviewForm({ rating: 5, comment: '' });
    setShowReviewForm(false);
    alert('Votre avis a été ajouté avec succès!');
  } catch (error) {
    alert(error.response?.data?.error || 'Erreur lors de l\'ajout de l\'avis');
  } finally {
    setSubmitting(false);
  }
};
```

### Store (trainingStore.js)

```javascript
addReview: async (id, reviewData) => {
  try {
    const response = await trainingsAPI.addReview(id, reviewData);
    
    // Mettre à jour la formation actuelle avec le nouvel avis
    if (get().currentTraining?.id === id) {
      set((state) => ({
        currentTraining: {
          ...state.currentTraining,
          reviews: [...(state.currentTraining.reviews || []), response.data]
        }
      }));
    }
    
    return response;
  } catch (error) {
    throw error;
  }
}
```

### API Service (trainings.js)

```javascript
export const addReview = async (id, reviewData) => {
  const response = await api.post(`/trainings/${id}/review`, reviewData);
  return response.data;
};
```

### Backend (trainingController.js)

```javascript
// POST /api/trainings/:id/review
exports.addReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Vérifier que l'utilisateur a suivi la formation
    const enrollment = await prisma.trainingEnrollment.findUnique({
      where: {
        userId_trainingId: { userId, trainingId: id }
      }
    });

    if (!enrollment || enrollment.status !== 'COMPLETED') {
      return res.status(403).json({
        success: false,
        error: 'Vous devez avoir terminé la formation pour laisser un avis'
      });
    }

    // Créer ou mettre à jour l'avis
    const review = await prisma.trainingReview.upsert({
      where: {
        userId_trainingId: { userId, trainingId: id }
      },
      update: { rating, comment },
      create: {
        userId,
        trainingId: id,
        rating,
        comment
      }
    });

    // Mettre à jour la note moyenne
    const avgRating = await prisma.trainingReview.aggregate({
      where: { trainingId: id },
      _avg: { rating: true }
    });

    await prisma.training.update({
      where: { id },
      data: { rating: avgRating._avg.rating }
    });

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};
```

### Database (Prisma Schema)

```prisma
model TrainingReview {
  id         String   @id @default(cuid())
  userId     String
  trainingId String
  rating     Float
  comment    String?  @db.Text
  isPublic   Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  training Training @relation(fields: [trainingId], references: [id], onDelete: Cascade)

  @@unique([userId, trainingId])
  @@index([trainingId])
  @@map("training_reviews")
}
```

---

## 🔄 Flow Complet

### Ajouter aux Favoris

```
1. User clique sur icône bookmark
   ↓
2. Vérification: user connecté?
   ↓
3. toggleBookmark(trainingId)
   ↓
4. POST /api/trainings/:id/bookmark
   ↓
5. Backend vérifie si existe
   ↓
6. Si existe: DELETE, sinon: CREATE
   ↓
7. Response: { bookmarked: true/false }
   ↓
8. Store met à jour bookmarks[]
   ↓
9. UI met à jour l'icône
```

### Ajouter un Avis

```
1. User clique "Laisser un avis"
   ↓
2. Formulaire s'affiche
   ↓
3. User sélectionne note (1-5 étoiles)
   ↓
4. User écrit commentaire
   ↓
5. Submit → addReview(trainingId, { rating, comment })
   ↓
6. POST /api/trainings/:id/review
   ↓
7. Backend vérifie: formation terminée?
   ↓
8. Si oui: CREATE/UPDATE review
   ↓
9. Calcul note moyenne
   ↓
10. UPDATE training.rating
    ↓
11. Response: { data: review }
    ↓
12. Store met à jour currentTraining.reviews[]
    ↓
13. UI affiche nouvel avis
```

---

## ✅ Résumé

### Favoris (Bookmarks):
- ✅ **Frontend:** TrainingCard, PricingCard
- ✅ **Store:** toggleBookmark(), fetchBookmarks()
- ✅ **API:** toggleBookmark(), getMyBookmarks()
- ✅ **Backend:** POST /bookmark, GET /bookmarks/me
- ✅ **DB:** TrainingBookmark model

### Avis (Reviews):
- ✅ **Frontend:** ReviewSection avec formulaire
- ✅ **Store:** addReview()
- ✅ **API:** addReview()
- ✅ **Backend:** POST /review avec validation
- ✅ **DB:** TrainingReview model
- ✅ **Features:** Note moyenne auto-calculée

### Sécurité:
- ✅ Authentification requise
- ✅ Validation côté backend
- ✅ Reviews: formation terminée requise
- ✅ Unique constraint (1 avis par user/formation)

---

**SYSTÈME COMPLET ET FONCTIONNEL!** ✅

*Favoris et Reviews connectés au backend avec validation!*
