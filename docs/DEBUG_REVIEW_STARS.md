# Debug - Étoiles de Review

## Problème: Clic sur étoiles ne fonctionne pas

---

## ✅ Corrections Appliquées

### 1. Ajout de console.log pour debug
```javascript
onClick={() => {
  console.log('Star clicked:', star);  // ← Debug
  setReviewForm({ ...reviewForm, rating: star });
}}
```

### 2. Ajout du cursor-pointer
```javascript
className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
```

### 3. Affichage de la note sélectionnée
```javascript
<span className="ml-3 text-sm text-gray-600">
  {reviewForm.rating} étoile{reviewForm.rating > 1 ? 's' : ''}
</span>
```

### 4. Message pour utilisateurs non connectés
```javascript
{!user && (
  <div className="mt-6 text-sm text-gray-600">
    Connectez-vous pour laisser un avis
  </div>
)}
```

---

## 🧪 Tests à Faire

### 1. Ouvrir la Console du Navigateur
- F12 → Onglet Console

### 2. Aller sur une Page de Formation
- Exemple: `/formations/[id]`

### 3. Vérifier si Connecté
- Si message "Connectez-vous pour laisser un avis" → Se connecter d'abord

### 4. Cliquer sur "Laisser un avis"
- Console devrait afficher: `Opening review form`
- Formulaire devrait s'afficher

### 5. Cliquer sur les Étoiles
- Console devrait afficher: `Star clicked: 1`, `Star clicked: 2`, etc.
- Étoiles devraient se remplir en jaune
- Texte devrait afficher: "X étoile(s)"

---

## 🔍 Causes Possibles

### Si le bouton "Laisser un avis" n'apparaît pas:
- ❌ User pas connecté
- ❌ showReviewForm déjà à true

### Si les étoiles ne réagissent pas:
- ❌ Formulaire pas affiché (showReviewForm = false)
- ❌ Event propagation bloqué
- ❌ CSS z-index problem

### Si le clic fonctionne mais étoiles ne changent pas:
- ❌ State pas mis à jour
- ❌ Re-render pas déclenché

---

## ✅ Vérifications

### Console Logs Attendus:
```
Opening review form
Star clicked: 1
Star clicked: 2
Star clicked: 3
Star clicked: 4
Star clicked: 5
```

### UI Attendue:
```
[Bouton: Laisser un avis]
  ↓ (clic)
[Formulaire affiché]
  ↓
[★★★★★] 5 étoiles
  ↓ (clic sur 3)
[★★★☆☆] 3 étoiles
```

---

## 🛠️ Solution Temporaire

Si ça ne fonctionne toujours pas, essayer:

### 1. Recharger la page (Ctrl+R)

### 2. Vider le cache (Ctrl+Shift+R)

### 3. Vérifier dans la console:
```javascript
// Dans la console du navigateur
console.log(document.querySelector('.cursor-pointer'));
```

---

**LOGS AJOUTÉS POUR DEBUG!** 🔍

*Ouvrez la console pour voir ce qui se passe!*
