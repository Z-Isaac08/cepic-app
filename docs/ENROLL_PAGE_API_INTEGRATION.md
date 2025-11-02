# EnrollPage - API Integration

## Date: November 1, 2025

## ✅ INTÉGRATION API RÉELLE

---

## Modifications Appliquées

### Import Ajouté:
```javascript
import { getTrainingById } from '../services/api/trainings';
```

### Code Avant (Mock):
```javascript
// TODO: Remplacer par un vrai appel API
const fetchTraining = async () => {
  try {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Données mockées pour l'instant
    setTraining({
      id,
      title: 'Formation Example',
      cost: 150000,
      duration: 24,
      durationUnit: 'hours',
      deliveryMode: 'PRESENTIAL',
      location: 'Cocody M\'Badon village',
      maxParticipants: 20
    });
  } catch (error) {
    console.error('Error loading training:', error);
  } finally {
    setLoading(false);
  }
};
```

### Code Après (API Réelle):
```javascript
// Charger les détails de la formation depuis l'API
const fetchTraining = async () => {
  try {
    const response = await getTrainingById(id);
    setTraining(response.data.training);
  } catch (error) {
    console.error('Error loading training:', error);
    setTraining(null);
  } finally {
    setLoading(false);
  }
};
```

---

## 🔄 Flow Complet

### 1. User clique "S'inscrire" sur une formation
```
TrainingDetailPage → navigate(`/enroll/${training.id}`)
```

### 2. EnrollPage se charge
```javascript
useEffect(() => {
  // Vérifier authentification
  if (!user) {
    navigate('/connexion', { state: { from: `/enroll/${id}` } });
    return;
  }
  
  // Charger formation depuis API
  fetchTraining();
}, [user, id, navigate]);
```

### 3. Appel API
```
GET /api/trainings/:id
  ↓
Response: {
  success: true,
  data: {
    training: {
      id: "...",
      title: "Gestion de projet Agile et Scrum",
      cost: 15000000,  // 150,000 FCFA (en centimes)
      duration: 24,
      durationUnit: "hours",
      deliveryMode: "PRESENTIAL",
      location: "Cocody M'Badon village",
      maxParticipants: 20,
      instructor: "Jean KOUASSI",
      // ... autres champs
    }
  }
}
```

### 4. Affichage de la Page
```
┌─────────────────────────────────────────────────────┐
│  ← Retour à la formation                            │
│                                                     │
│  Inscription à la formation                         │
│  Complétez votre inscription et procédez au paiement│
├─────────────────────────────────────────────────────┤
│                                                     │
│  Informations de paiement          │  Récapitulatif│
│  ─────────────────────────         │  ─────────────│
│  Vos informations                  │  Formation    │
│  - Nom: Jean KOUADIO               │  - Titre      │
│  - Email: user@test.com            │  - Durée      │
│                                    │  - Lieu       │
│  Mode de paiement                  │  - Prix       │
│  ○ Mobile Money                    │               │
│  ○ Virement bancaire               │  Total: 150k  │
│  ○ Paiement sur place              │               │
│                                    │               │
│  [Confirmer l'inscription]         │               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Données Récupérées de l'API

### Champs Utilisés dans EnrollPage:
```javascript
{
  id: string,              // ID de la formation
  title: string,           // Titre affiché
  cost: number,            // Prix en centimes (150000 = 1500 FCFA)
  duration: number,        // Durée (24)
  durationUnit: string,    // Unité ('hours' ou 'days')
  deliveryMode: string,    // Mode ('PRESENTIAL', 'ONLINE', 'HYBRID')
  location: string,        // Lieu
  maxParticipants: number  // Nombre max de participants
}
```

### Affichage du Prix:
```javascript
// Backend stocke en centimes: 15000000
// Frontend affiche: 150,000 FCFA

{(training.cost / 100).toLocaleString()} FCFA
```

---

## 🎯 Gestion des Erreurs

### Formation Non Trouvée:
```javascript
if (!training) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2>Formation non trouvée</h2>
        <Link to="/formations">
          <Button>Retour aux formations</Button>
        </Link>
      </div>
    </div>
  );
}
```

### Erreur API:
```javascript
catch (error) {
  console.error('Error loading training:', error);
  setTraining(null);  // Affiche message "Formation non trouvée"
}
```

---

## ✅ Avantages de l'Intégration API

### Données Réelles:
- ✅ Titre exact de la formation
- ✅ Prix réel depuis la base de données
- ✅ Informations à jour (durée, lieu, etc.)
- ✅ Cohérence avec TrainingDetailPage

### Sécurité:
- ✅ Vérification que la formation existe
- ✅ Gestion des erreurs 404
- ✅ Authentification requise

### Maintenance:
- ✅ Pas de duplication de données
- ✅ Source unique de vérité (API)
- ✅ Facile à mettre à jour

---

## 🔜 Prochaines Étapes

### TODO: Implémenter le Paiement
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Appeler API d'inscription/paiement
  const response = await enrollInTraining(id, {
    paymentMethod,
    userId: user.id
  });
  
  // Rediriger vers confirmation
  navigate('/mes-inscriptions', { 
    state: { 
      message: 'Inscription réussie!' 
    } 
  });
};
```

### API à Créer:
```javascript
// services/api/enrollments.js
export const enrollInTraining = async (trainingId, data) => {
  const response = await api.post(`/enrollments`, {
    trainingId,
    ...data
  });
  return response.data;
};
```

---

**API INTÉGRÉE - DONNÉES RÉELLES!** ✅

*La page charge maintenant les vraies données de formation depuis l'API!*
