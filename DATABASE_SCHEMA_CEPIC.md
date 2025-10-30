# 🗄️ SCHÉMA DE BASE DE DONNÉES CEPIC

## Vue d'ensemble

Cette base de données est conçue pour gérer une plateforme de formations professionnelles avec :
- Catalogue de formations (~23 formations)
- 4 catégories de formations
- Système d'inscription et de paiement
- Galerie photos
- Messages de contact
- Dashboard administrateur

---

## 📊 Diagramme Entité-Relation

```
User (existant)
  ├── Training (créateur)
  ├── TrainingEnrollment
  ├── TrainingBookmark
  ├── TrainingReview
  └── GalleryPhoto

TrainingCategory
  └── Training

Training
  ├── TrainingSession
  ├── TrainingEnrollment
  ├── TrainingBookmark
  └── TrainingReview

TrainingSession
  └── Training

TrainingEnrollment
  └── Payment (1:1)

Payment
  └── TrainingEnrollment

ContactMessage (indépendant)
```

---

## 📋 SCHÉMA PRISMA COMPLET

```prisma
// ============================================
// MODÈLES EXISTANTS (À CONSERVER)
// ============================================

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  password    String
  firstName   String
  lastName    String
  role        Role     @default(USER)
  isVerified  Boolean  @default(false)
  isActive    Boolean  @default(true)
  lastLogin   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations existantes
  sessions    Session[]
  twoFACodes  TwoFACode[]
  
  // Nouvelles relations CEPIC
  trainings           Training[]
  trainingBookmarks   TrainingBookmark[]
  trainingReviews     TrainingReview[]
  trainingEnrollments TrainingEnrollment[]
  galleryPhotos       GalleryPhoto[]

  @@map("users")
}

model Session {
  id          String   @id @default(cuid())
  userId      String
  token       String   @unique
  refreshToken String? @unique
  expiresAt   DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  isRevoked   Boolean  @default(false)
  userAgent   String?
  ipAddress   String?
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model TwoFACode {
  id          String   @id @default(cuid())
  userId      String
  code        String
  tempToken   String   @unique
  type        TwoFAType @default(LOGIN)
  expiresAt   DateTime
  isUsed      Boolean  @default(false)
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("two_fa_codes")
}

// ============================================
// NOUVEAUX MODÈLES CEPIC
// ============================================

// 1. CATÉGORIES DE FORMATIONS
model TrainingCategory {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  icon        String?  // Nom de l'icône Lucide React
  color       String?  @default("#3B82F6")
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  trainings   Training[]

  @@map("training_categories")
}

// 2. FORMATIONS
model Training {
  id              String   @id @default(cuid())
  title           String
  slug            String   @unique
  description     String?  @db.Text
  objectives      String[] // Objectifs pédagogiques
  prerequisites   String[] // Prérequis
  targetAudience  String?  // Public cible
  program         String?  @db.Text // Programme détaillé
  coverImage      String?
  
  // Détails pratiques
  duration        Int      // Durée en heures
  durationUnit    String   @default("hours") // hours, days, weeks
  cost            Int      // Coût en FCFA (centimes)
  originalCost    Int?     // Prix original (pour réductions)
  isFree          Boolean  @default(false)
  
  // Modalités
  deliveryMode    DeliveryMode @default(PRESENTIAL)
  location        String?  // Lieu (si présentiel)
  maxParticipants Int?     // Nombre max de participants
  minParticipants Int?     // Nombre min pour ouvrir
  
  // Dates et horaires
  schedule        String?  // Ex: "Lun-Ven 9h-17h"
  startDate       DateTime?
  endDate         DateTime?
  
  // Formateur
  instructor      String?
  instructorBio   String?  @db.Text
  instructorPhoto String?
  
  // Métadonnées
  isPublished     Boolean  @default(false)
  isActive        Boolean  @default(true)
  isFeatured      Boolean  @default(false) // Formation à la une
  views           Int      @default(0)
  enrollments     Int      @default(0)
  rating          Float?   @default(0)
  tags            String[] @default([])
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  categoryId      String
  category        TrainingCategory @relation(fields: [categoryId], references: [id])
  createdBy       String
  creator         User            @relation(fields: [createdBy], references: [id])
  
  bookmarks       TrainingBookmark[]
  reviews         TrainingReview[]
  enrollments_rel TrainingEnrollment[]
  sessions        TrainingSession[]

  @@index([categoryId])
  @@index([slug])
  @@index([isPublished, isActive])
  @@map("trainings")
}

// 3. SESSIONS DE FORMATION
model TrainingSession {
  id              String   @id @default(cuid())
  trainingId      String
  training        Training @relation(fields: [trainingId], references: [id], onDelete: Cascade)
  
  name            String?  // Ex: "Session Janvier 2025"
  startDate       DateTime
  endDate         DateTime
  location        String?
  maxParticipants Int?
  currentEnrollments Int @default(0)
  status          SessionStatus @default(SCHEDULED)
  notes           String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([trainingId])
  @@index([startDate])
  @@map("training_sessions")
}

// 4. INSCRIPTIONS AUX FORMATIONS
model TrainingEnrollment {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  trainingId      String
  training        Training @relation(fields: [trainingId], references: [id])
  
  // Informations inscription
  status          EnrollmentStatus @default(PENDING)
  paymentStatus   PaymentStatus @default(UNPAID)
  amount          Int      // Montant payé en FCFA (centimes)
  
  // Dates
  enrolledAt      DateTime @default(now())
  paidAt          DateTime?
  completedAt     DateTime?
  cancelledAt     DateTime?
  
  // Certificat
  certificateUrl  String?
  certificateIssuedAt DateTime?
  
  // Notes
  notes           String?
  adminNotes      String?
  
  // Relation paiement (1:1)
  payment         Payment?
  
  @@unique([userId, trainingId])
  @@index([userId])
  @@index([trainingId])
  @@index([status])
  @@map("training_enrollments")
}

// 5. FAVORIS FORMATIONS
model TrainingBookmark {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  trainingId String
  training  Training @relation(fields: [trainingId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, trainingId])
  @@index([userId])
  @@map("training_bookmarks")
}

// 6. AVIS SUR FORMATIONS
model TrainingReview {
  id        String   @id @default(cuid())
  rating    Int      // 1-5 étoiles
  comment   String?  @db.Text
  isPublic  Boolean  @default(true)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  trainingId String
  training  Training @relation(fields: [trainingId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, trainingId])
  @@index([trainingId])
  @@map("training_reviews")
}

// 7. GALERIE PHOTOS
model GalleryPhoto {
  id          String   @id @default(cuid())
  title       String?
  description String?
  imageUrl    String
  category    String?  // "Formations", "Événements", "Équipe", "Locaux"
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  uploadedBy  String
  uploader    User     @relation(fields: [uploadedBy], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([category])
  @@index([order])
  @@map("gallery_photos")
}

// 8. MESSAGES DE CONTACT
model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  subject   String
  message   String   @db.Text
  status    MessageStatus @default(NEW)
  repliedAt DateTime?
  repliedBy String?
  reply     String?  @db.Text
  createdAt DateTime @default(now())

  @@index([status])
  @@index([createdAt])
  @@map("contact_messages")
}

// 9. PAIEMENTS (CinetPay)
model Payment {
  id              String   @id @default(cuid())
  enrollmentId    String   @unique
  enrollment      TrainingEnrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  
  // CinetPay
  transactionId   String   @unique // ID transaction CinetPay
  paymentMethod   String   // ORANGE_MONEY, MTN_MONEY, MOOV_MONEY, WAVE, CARD
  gateway         String   @default("CINETPAY")
  
  // Montants
  amount          Int      // Montant en FCFA (centimes)
  currency        String   @default("XOF") // Franc CFA
  fees            Int?     // Frais de transaction
  netAmount       Int?     // Montant net (amount - fees)
  
  // Statut
  status          PaymentStatus @default(PENDING)
  
  // Métadonnées CinetPay
  paymentData     Json?    // Réponse complète CinetPay
  paymentUrl      String?  // URL de paiement CinetPay
  operatorId      String?  // ID opérateur (Orange, MTN, etc.)
  
  // Sécurité
  ipAddress       String?
  userAgent       String?
  
  // Dates
  initiatedAt     DateTime @default(now())
  completedAt     DateTime?
  failedAt        DateTime?
  refundedAt      DateTime?
  
  @@index([transactionId])
  @@index([status])
  @@index([enrollmentId])
  @@map("payments")
}

// ============================================
// ENUMS
// ============================================

enum Role {
  USER
  ADMIN
  MODERATOR
}

enum TwoFAType {
  LOGIN
  REGISTRATION
  PASSWORD_RESET
}

enum DeliveryMode {
  PRESENTIAL  // Présentiel
  REMOTE      // Distanciel
  HYBRID      // Hybride
}

enum SessionStatus {
  SCHEDULED   // Programmée
  ONGOING     // En cours
  COMPLETED   // Terminée
  CANCELLED   // Annulée
}

enum EnrollmentStatus {
  PENDING     // En attente
  CONFIRMED   // Confirmée
  COMPLETED   // Complétée
  CANCELLED   // Annulée
}

enum PaymentStatus {
  UNPAID      // Non payé
  PARTIAL     // Partiellement payé
  PAID        // Payé
  REFUNDED    // Remboursé
}

enum MessageStatus {
  NEW         // Nouveau
  READ        // Lu
  REPLIED     // Répondu
  ARCHIVED    // Archivé
}
```

---

## 📝 DESCRIPTION DES TABLES

### **TrainingCategory** (Catégories de formations)
Stocke les 4 catégories principales de CEPIC.

**Champs clés:**
- `name`: Nom de la catégorie
- `slug`: URL-friendly identifier
- `icon`: Nom d'icône Lucide React (ex: "Briefcase", "DollarSign")
- `color`: Couleur hex pour l'affichage
- `order`: Ordre d'affichage

**Exemple de données:**
```javascript
{
  name: "Management de projet",
  slug: "management-projet",
  icon: "Briefcase",
  color: "#3B82F6",
  order: 1
}
```

### **Training** (Formations)
Table principale contenant les ~23 formations.

**Champs clés:**
- `title`: Titre de la formation
- `slug`: URL-friendly (ex: "gestion-projet-agile")
- `description`: Description complète
- `objectives`: Array d'objectifs pédagogiques
- `prerequisites`: Array de prérequis
- `duration`: Durée (nombre)
- `durationUnit`: Unité (hours, days, weeks)
- `cost`: Prix en centimes FCFA (15000 FCFA = 1500000)
- `deliveryMode`: PRESENTIAL, REMOTE, HYBRID
- `instructor`: Nom du formateur
- `isFeatured`: Formation mise en avant sur la page d'accueil

**Exemple de données:**
```javascript
{
  title: "Gestion de projet Agile et Scrum",
  slug: "gestion-projet-agile-scrum",
  description: "Formation complète sur les méthodologies Agile...",
  objectives: [
    "Maîtriser les principes Agile",
    "Utiliser le framework Scrum",
    "Gérer une équipe Agile"
  ],
  prerequisites: ["Notions de gestion de projet"],
  duration: 24,
  durationUnit: "hours",
  cost: 15000000, // 150,000 FCFA
  deliveryMode: "PRESENTIAL",
  location: "Cocody M'Badon village",
  maxParticipants: 20,
  instructor: "Jean KOUASSI"
}
```

### **TrainingSession** (Sessions de formation)
Permet de gérer plusieurs sessions d'une même formation.

**Exemple:**
Une formation "Excel Avancé" peut avoir :
- Session Janvier 2025
- Session Mars 2025
- Session Juin 2025

### **TrainingEnrollment** (Inscriptions)
Remplace le système de commandes pour gérer les inscriptions.

**Workflow:**
1. Utilisateur s'inscrit → `status: PENDING`, `paymentStatus: UNPAID`
2. Paiement confirmé → `paymentStatus: PAID`, `status: CONFIRMED`
3. Formation terminée → `status: COMPLETED`
4. Certificat généré → `certificateUrl` rempli

### **GalleryPhoto** (Galerie)
Photos organisées par catégories.

**Catégories suggérées:**
- "Formations" (photos de sessions)
- "Événements" (séminaires, conférences)
- "Équipe" (équipe CEPIC)
- "Locaux" (bureaux, salles de formation)

### **ContactMessage** (Messages de contact)
Messages envoyés via le formulaire de contact.

**Workflow:**
1. Message reçu → `status: NEW`
2. Admin lit → `status: READ`
3. Admin répond → `status: REPLIED`, `repliedAt`, `reply`
4. Archivé → `status: ARCHIVED`

---

## 🔄 MIGRATIONS À EFFECTUER

### Étape 1: Supprimer les anciennes tables
```bash
# Les tables Library* ne sont plus nécessaires
# Elles seront remplacées par Training*
```

### Étape 2: Créer le nouveau schema
```bash
cd server
# Remplacer le contenu de prisma/schema.prisma
npx prisma format
npx prisma generate
```

### Étape 3: Appliquer les migrations
```bash
npx prisma db push
# ou
npx prisma migrate dev --name cepic_migration
```

### Étape 4: Seed les données
```bash
npx prisma db seed
```

---

## 📊 DONNÉES DE SEED (Exemple)

### 4 Catégories
```javascript
const categories = [
  {
    name: "Management de projet",
    slug: "management-projet",
    icon: "Briefcase",
    color: "#3B82F6",
    order: 1
  },
  {
    name: "Banque et finance",
    slug: "banque-finance",
    icon: "DollarSign",
    color: "#10B981",
    order: 2
  },
  {
    name: "Méthodologie & Collecte de données",
    slug: "methodologie-collecte-donnees",
    icon: "Database",
    color: "#F59E0B",
    order: 3
  },
  {
    name: "Entrepreneuriat",
    slug: "entrepreneuriat",
    icon: "Rocket",
    color: "#EF4444",
    order: 4
  }
];
```

### Exemples de Formations
```javascript
const trainings = [
  // Management de projet
  {
    title: "Gestion de projet Agile et Scrum",
    slug: "gestion-projet-agile-scrum",
    categoryId: "management-projet",
    duration: 24,
    cost: 15000000, // 150,000 FCFA
    deliveryMode: "PRESENTIAL"
  },
  {
    title: "MS Project - Planification et suivi de projets",
    slug: "ms-project-planification",
    categoryId: "management-projet",
    duration: 16,
    cost: 12000000
  },
  
  // Banque et finance
  {
    title: "Analyse financière et gestion budgétaire",
    slug: "analyse-financiere-gestion-budgetaire",
    categoryId: "banque-finance",
    duration: 20,
    cost: 18000000
  },
  
  // Méthodologie
  {
    title: "Enquêtes et collecte de données terrain",
    slug: "enquetes-collecte-donnees",
    categoryId: "methodologie-collecte-donnees",
    duration: 16,
    cost: 14000000
  },
  
  // Entrepreneuriat
  {
    title: "Création et gestion d'entreprise",
    slug: "creation-gestion-entreprise",
    categoryId: "entrepreneuriat",
    duration: 32,
    cost: 20000000
  }
];
```

---

## 🔍 REQUÊTES UTILES

### Récupérer toutes les formations d'une catégorie
```javascript
const trainings = await prisma.training.findMany({
  where: {
    categoryId: categoryId,
    isPublished: true,
    isActive: true
  },
  include: {
    category: true,
    creator: {
      select: { firstName: true, lastName: true }
    }
  },
  orderBy: { createdAt: 'desc' }
});
```

### Récupérer les inscriptions d'un utilisateur
```javascript
const enrollments = await prisma.trainingEnrollment.findMany({
  where: { userId: userId },
  include: {
    training: {
      include: { category: true }
    }
  },
  orderBy: { enrolledAt: 'desc' }
});
```

### Statistiques admin
```javascript
const stats = {
  totalTrainings: await prisma.training.count(),
  activeEnrollments: await prisma.trainingEnrollment.count({
    where: { status: 'CONFIRMED' }
  }),
  totalRevenue: await prisma.trainingEnrollment.aggregate({
    where: { paymentStatus: 'PAID' },
    _sum: { amount: true }
  }),
  newMessages: await prisma.contactMessage.count({
    where: { status: 'NEW' }
  })
};
```

---

## ✅ CHECKLIST DE MIGRATION

- [ ] Backup base de données actuelle
- [ ] Créer nouveau schema.prisma
- [ ] Tester schema localement
- [ ] Créer fichier seed avec données CEPIC
- [ ] Appliquer migrations
- [ ] Vérifier toutes les relations
- [ ] Tester requêtes principales
- [ ] Documenter changements

---

**Prêt pour la migration de la base de données !** 🚀
