# 🎨 FRONTEND CEPIC - Prochaines Étapes

## ✅ CE QUI A ÉTÉ FAIT (Session 30 Oct)

### Services API (4 fichiers)
- ✅ `services/api/trainings.js` - 9 fonctions
- ✅ `services/api/enrollments.js` - 5 fonctions
- ✅ `services/api/payments.js` - 2 fonctions
- ✅ `services/api/index.js` - Export centralisé

### Stores Zustand (1 fichier)
- ✅ `stores/trainingStore.js` - Store complet avec actions

### Configuration
- ✅ `config/cepic.js` - Infos entreprise
- ✅ `index.css` - Couleurs CEPIC (#2C2E83 / #ECB519)

---

## 📋 À FAIRE - PROCHAINE SESSION

### 1. STORES ZUSTAND (2 fichiers à créer)

#### `stores/enrollmentStore.js`
```javascript
- État: enrollments, currentEnrollment, loading, error
- Actions:
  - createEnrollment(trainingId)
  - fetchMyEnrollments()
  - fetchEnrollmentById(id)
  - cancelEnrollment(id)
  - initiatePayment(enrollmentId)
```

#### `stores/paymentStore.js`
```javascript
- État: currentPayment, loading, error
- Actions:
  - initiatePayment(enrollmentId)
  - verifyPayment(transactionId)
  - handlePaymentRedirect()
```

---

### 2. ADAPTER LAYOUT (2 fichiers)

#### `components/layout/Header.jsx`
**Modifications:**
- Logo CEPIC (au lieu de ProjectMoney)
- Menu navigation:
  - Accueil
  - Formations (au lieu de Bibliothèque)
  - À propos
  - Galerie
  - Contact
- Couleurs CEPIC (primary-800 au lieu de yellow)

#### `components/layout/Footer.jsx`
**Modifications:**
- Informations CEPIC (adresse, téléphone, email)
- Liens réseaux sociaux
- Mentions légales (RCCM, etc.)
- Couleurs CEPIC

---

### 3. CRÉER HOMEPAGE CEPIC

#### `pages/HomePage.jsx`
**Sections:**
1. **Hero Section**
   - Titre: "CEPIC - Excellence en Formation Professionnelle"
   - Sous-titre: "Cabinet d'Études, de Prestations et d'Intermédiation Commerciale"
   - CTA: "Découvrir nos formations"
   - Image de fond ou illustration
   - Couleurs: Bleu #2C2E83 + Or #ECB519

2. **Formations à la une**
   - Afficher 3-4 formations featured
   - Cards avec image, titre, prix, durée
   - Bouton "Voir toutes les formations"

3. **Catégories**
   - 4 cards pour les catégories
   - Icônes + couleurs CEPIC
   - Lien vers formations par catégorie

4. **Chiffres clés**
   - Nombre de formations
   - Années d'expérience
   - Participants formés
   - Taux de satisfaction

5. **Pourquoi CEPIC ?**
   - 4 valeurs (Excellence, Professionnalisme, Innovation, Accompagnement)
   - Icons + descriptions

6. **Témoignages** (optionnel)
   - 2-3 avis clients

7. **CTA Final**
   - "Prêt à vous former ?"
   - Bouton vers catalogue

---

### 4. PAGE FORMATIONS

#### `pages/TrainingsPage.jsx`
**Fonctionnalités:**
- Liste des formations (grid)
- Filtres:
  - Par catégorie (dropdown)
  - Recherche (input)
  - Formations à la une (toggle)
- Tri (prix, date, popularité)
- Pagination ou infinite scroll
- Nombre de résultats

**Composants nécessaires:**
- `TrainingCard.jsx` - Card formation
- `TrainingFilters.jsx` - Barre de filtres
- `TrainingGrid.jsx` - Grille de formations

---

### 5. PAGE DÉTAIL FORMATION

#### `pages/TrainingDetailPage.jsx`
**Sections:**
1. **Header**
   - Image couverture
   - Titre formation
   - Catégorie (badge)
   - Note moyenne + nombre d'avis
   - Prix (avec prix barré si réduction)
   - Bouton "S'inscrire"

2. **Informations principales**
   - Durée
   - Modalité (Présentiel/Distanciel/Hybride)
   - Lieu
   - Dates (si disponibles)
   - Formateur
   - Places disponibles

3. **Description**
   - Description complète
   - Objectifs pédagogiques (liste)
   - Prérequis
   - Public cible

4. **Programme détaillé**
   - Contenu de la formation
   - Modules/Chapitres

5. **Formateur**
   - Photo
   - Nom
   - Bio

6. **Avis**
   - Liste des avis
   - Formulaire d'ajout (si inscrit et complété)

7. **Formations similaires**
   - 3-4 formations de la même catégorie

**Composants nécessaires:**
- `TrainingHeader.jsx`
- `TrainingInfo.jsx`
- `TrainingProgram.jsx`
- `InstructorCard.jsx`
- `ReviewList.jsx`
- `ReviewForm.jsx`

---

### 6. FLOW D'INSCRIPTION

#### `pages/EnrollmentPage.jsx`
**Étapes:**
1. Récapitulatif formation
2. Informations utilisateur (pré-remplies)
3. Confirmation
4. Redirection vers paiement

#### `pages/PaymentPage.jsx`
- Afficher montant
- Bouton "Payer avec CinetPay"
- Méthodes disponibles (Orange Money, MTN, etc.)
- Redirection vers CinetPay

#### `pages/PaymentConfirmationPage.jsx`
- Message de succès/échec
- Détails de l'inscription
- Bouton "Voir mes inscriptions"

---

### 7. MES INSCRIPTIONS

#### `pages/MyEnrollmentsPage.jsx`
**Fonctionnalités:**
- Liste des inscriptions
- Filtres par statut (En attente, Confirmée, Complétée)
- Détails de chaque inscription:
  - Formation
  - Statut paiement
  - Dates
  - Actions (Annuler si non payé, Télécharger certificat si complété)

---

### 8. AUTRES PAGES

#### `pages/AboutPage.jsx`
- Présentation CEPIC
- Mission & Vision
- Équipe
- Réalisations principales
- Partenaires

#### `pages/GalleryPage.jsx`
- Photos par catégorie
- Lightbox pour agrandir
- Filtres par catégorie

#### `pages/ContactPage.jsx`
- Formulaire de contact
- Informations (adresse, téléphone, email)
- Carte Google Maps
- Horaires d'ouverture

---

## 🎨 COMPOSANTS UI À CRÉER

### Formations
- `TrainingCard.jsx` - Card formation
- `TrainingFilters.jsx` - Filtres
- `TrainingGrid.jsx` - Grille
- `CategoryBadge.jsx` - Badge catégorie
- `PriceTag.jsx` - Affichage prix
- `RatingStars.jsx` - Étoiles notation

### Inscriptions
- `EnrollmentCard.jsx` - Card inscription
- `EnrollmentStatus.jsx` - Badge statut
- `PaymentStatus.jsx` - Badge paiement

### Paiement
- `PaymentMethodSelector.jsx` - Choix méthode
- `PaymentSummary.jsx` - Récapitulatif

### Général
- `PageHeader.jsx` - Header de page
- `SectionTitle.jsx` - Titre de section
- `LoadingSpinner.jsx` - Loader
- `EmptyState.jsx` - État vide
- `ErrorMessage.jsx` - Message d'erreur

---

## 🎯 ORDRE DE DÉVELOPPEMENT RECOMMANDÉ

### Session 1 (6-8h)
1. ✅ Terminer stores (enrollment, payment)
2. ✅ Adapter Header/Footer
3. ✅ Créer composants UI de base
4. ✅ HomePage CEPIC

### Session 2 (6-8h)
5. ✅ TrainingsPage + filtres
6. ✅ TrainingDetailPage
7. ✅ Composants formations

### Session 3 (4-6h)
8. ✅ Flow d'inscription complet
9. ✅ MyEnrollmentsPage
10. ✅ Tests du flow

### Session 4 (3-4h)
11. ✅ AboutPage
12. ✅ GalleryPage
13. ✅ ContactPage

### Session 5 (2-3h)
14. ✅ Tests finaux
15. ✅ Responsive
16. ✅ Optimisations

---

## 📦 DÉPENDANCES À VÉRIFIER

```bash
# Vérifier si installées
- axios ✅
- zustand ✅
- react-router ✅
- lucide-react ✅ (pour les icônes)
- framer-motion ✅ (pour animations)
```

---

## 🎨 DESIGN SYSTEM CEPIC

### Couleurs
```css
Primary (Bleu): #2C2E83
Secondary (Or): #ECB519
Dark: #1a1b4a
Light: #f0f1fb
```

### Typographie
```css
Titres: font-bold
Corps: font-normal
Tailles: text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl
```

### Espacements
```css
Sections: py-12 md:py-20
Cards: p-6
Gaps: gap-4, gap-6, gap-8
```

### Composants
```css
Boutons primaires: bg-primary-800 hover:bg-primary-900
Boutons secondaires: bg-secondary-500 hover:bg-secondary-600
Cards: bg-white shadow-lg rounded-lg
Badges: rounded-full px-3 py-1 text-sm
```

---

## 💡 NOTES IMPORTANTES

1. **Réutiliser les composants existants** quand possible
2. **Tester au fur et à mesure** avec le backend
3. **Responsive first** (mobile d'abord)
4. **Accessibilité** (aria-labels, alt text)
5. **Performance** (lazy loading images, code splitting)
6. **SEO** (meta tags, titles)

---

## 🔗 LIENS UTILES

- Backend API: http://localhost:3001/api
- Frontend Dev: http://localhost:5173
- Documentation API: `server/test-api.http`
- Couleurs CEPIC: `client/src/index.css`
- Config CEPIC: `client/src/config/cepic.js`

---

**Prochaine session: Continuer avec les stores et la HomePage !** 🚀

*Dernière mise à jour: 30 Octobre 2025 - 01:05*
