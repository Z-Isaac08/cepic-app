# Admin Store & API Service

## Date: November 1, 2025

## ✅ STORE ADMIN ET SERVICE API CRÉÉS

---

## 📁 Fichiers Créés/Modifiés

### 1. Service API Admin
**Fichier:** `client/src/services/api/admin.js`

**Fonctions disponibles:**

#### Dashboard & Stats
- `getDashboardStats()` - Statistiques globales du dashboard

#### Gestion des Utilisateurs
- `getAllUsers(params)` - Liste des utilisateurs avec filtres
- `getUserById(id)` - Détails d'un utilisateur
- `updateUser(id, data)` - Mettre à jour un utilisateur
- `deleteUser(id)` - Supprimer un utilisateur
- `toggleUserStatus(id)` - Activer/Désactiver un utilisateur

#### Gestion des Formations
- `getAllTrainingsAdmin(params)` - Liste des formations (admin)
- `createTraining(data)` - Créer une formation
- `updateTraining(id, data)` - Mettre à jour une formation
- `deleteTraining(id)` - Supprimer une formation
- `toggleTrainingPublish(id)` - Publier/Dépublier une formation

#### Gestion des Catégories
- `createCategory(data)` - Créer une catégorie
- `updateCategory(id, data)` - Mettre à jour une catégorie
- `deleteCategory(id)` - Supprimer une catégorie

#### Gestion des Inscriptions
- `getAllEnrollments(params)` - Liste des inscriptions
- `updateEnrollmentStatus(id, status)` - Mettre à jour le statut

#### Gestion de la Galerie
- `uploadGalleryPhoto(formData)` - Upload une photo
- `updateGalleryPhoto(id, data)` - Mettre à jour une photo
- `deleteGalleryPhoto(id)` - Supprimer une photo

#### Gestion des Messages
- `getAllMessages(params)` - Liste des messages
- `markMessageAsRead(id)` - Marquer comme lu
- `deleteMessage(id)` - Supprimer un message

---

### 2. Store Admin
**Fichier:** `client/src/stores/adminStore.js`

**État:**
```javascript
{
  dashboardData: null,
  users: [],
  loading: false,
  error: null
}
```

**Actions principales:**
- `fetchDashboardData()` - Charger les stats du dashboard
- `fetchUsers(filters)` - Charger les utilisateurs
- `updateUserStatus(userId, status)` - Mettre à jour un utilisateur
- `deleteUser(userId)` - Supprimer un utilisateur
- `fetchUserStats()` - Stats utilisateurs
- `fetchSystemHealth()` - Santé du système
- `fetchSecurityLogs(filters)` - Logs de sécurité
- `fetchAnalytics(timeRange, metric)` - Analytics
- `refreshAllData()` - Rafraîchir toutes les données
- `reset()` - Réinitialiser l'état
- `clearError()` - Nettoyer les erreurs

---

## 🔧 Utilisation dans AdminPage

### Import du Store
```javascript
import { useAdminStore } from '../stores/adminStore';
import { useAuthStore } from '../stores/authStore';
```

### Utilisation
```javascript
const AdminPage = () => {
  const { user, logout } = useAuthStore();
  const { 
    dashboardData, 
    users, 
    loading, 
    error,
    fetchDashboardData,
    fetchUsers 
  } = useAdminStore();

  useEffect(() => {
    // Charger les données au montage
    fetchDashboardData();
    fetchUsers();
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    // ... JSX
  );
};
```

---

## 🎯 Bouton de Déconnexion

### Code Actuel (AdminPage.jsx)
```javascript
// Ligne 73-76
const handleLogout = async () => {
  await logout();
  window.location.href = '/';
};

// Ligne 137-143
<button
  onClick={handleLogout}
  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
>
  <LogOut className="w-4 h-4" />
  <span className="text-sm font-medium">Déconnexion</span>
</button>
```

**Status:** ✅ Fonctionne correctement!

---

## 📊 Structure des Modules Admin

### Dashboard Overview
```javascript
import { useAdminStore } from '../../stores/adminStore';

const DashboardOverview = () => {
  const { dashboardData, loading } = useAdminStore();
  
  return (
    // Afficher les stats
  );
};
```

### Users Management
```javascript
import { useAdminStore } from '../../stores/adminStore';

const UsersManagement = () => {
  const { 
    users, 
    loading, 
    fetchUsers, 
    updateUserStatus, 
    deleteUser 
  } = useAdminStore();
  
  return (
    // Gérer les utilisateurs
  );
};
```

### Trainings Management
```javascript
import * as adminAPI from '../../services/api/admin';

const TrainingsManagement = () => {
  const [trainings, setTrainings] = useState([]);
  
  const loadTrainings = async () => {
    const response = await adminAPI.getAllTrainingsAdmin();
    setTrainings(response.data);
  };
  
  const handleCreate = async (data) => {
    await adminAPI.createTraining(data);
    loadTrainings();
  };
  
  return (
    // Gérer les formations
  );
};
```

---

## 🔐 Protection des Routes Admin

### Vérification du Rôle
```javascript
// AdminPage.jsx
useEffect(() => {
  if (!user || user.role !== 'ADMIN') {
    navigate('/');
  }
}, [user, navigate]);
```

### Middleware Backend
```javascript
// middleware/auth.js
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Accès refusé - Admin uniquement'
    });
  }
  next();
};
```

---

## 📝 Exemple Complet: Gestion des Utilisateurs

```javascript
import { useEffect, useState } from 'react';
import { useAdminStore } from '../../stores/adminStore';

const UsersManagement = () => {
  const { 
    users, 
    loading, 
    error,
    fetchUsers, 
    updateUserStatus, 
    deleteUser 
  } = useAdminStore();
  
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all'
  });

  useEffect(() => {
    fetchUsers(filters);
  }, [filters]);

  const handleToggleStatus = async (userId) => {
    try {
      await updateUserStatus(userId, { isActive: !user.isActive });
      // Le store met à jour automatiquement la liste
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      try {
        await deleteUser(userId);
        // Le store met à jour automatiquement la liste
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <h2>Gestion des Utilisateurs</h2>
      
      {/* Filtres */}
      <div className="filters">
        <input
          type="text"
          placeholder="Rechercher..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Liste des utilisateurs */}
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isActive ? 'Actif' : 'Inactif'}</td>
              <td>
                <button onClick={() => handleToggleStatus(user.id)}>
                  {user.isActive ? 'Désactiver' : 'Activer'}
                </button>
                <button onClick={() => handleDelete(user.id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersManagement;
```

---

## ✅ Résumé

### Créé:
- ✅ `services/api/admin.js` - Service API admin complet
- ✅ `stores/adminStore.js` - Store Zustand pour l'admin (mis à jour)

### Fonctionnalités:
- ✅ Gestion des utilisateurs
- ✅ Gestion des formations
- ✅ Gestion des catégories
- ✅ Gestion des inscriptions
- ✅ Gestion de la galerie
- ✅ Gestion des messages
- ✅ Dashboard avec stats
- ✅ Analytics
- ✅ Logs de sécurité

### Bouton Déconnexion:
- ✅ Fonctionne correctement dans AdminPage
- ✅ Utilise `useAuthStore().logout()`
- ✅ Redirige vers la page d'accueil

---

**STORE ADMIN ET API PRÊTS POUR TOUS LES MODULES!** ✅

*AdminPage peut maintenant consommer toutes les données via le store!*
