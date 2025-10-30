# 🚀 ÉTAPES DÉTAILLÉES DE MIGRATION CEPIC

## Guide pas-à-pas pour transformer ProjectMoney en plateforme CEPIC

---

## 📋 PHASE 1: PRÉPARATION (30 minutes)

### ✅ Étape 1.1: Backup et Git

```bash
# Créer une branche de migration
git checkout -b feature/cepic-migration

# Backup de la base de données (si données importantes)
pg_dump -U postgres projectmoney > backup_projectmoney.sql

# Commit l'état actuel
git add .
git commit -m "Backup avant migration CEPIC"
```

### ✅ Étape 1.2: Préparer les assets CEPIC

Créer dossier pour les assets:
```bash
mkdir -p client/public/assets/cepic
mkdir -p client/public/assets/cepic/logos
mkdir -p client/public/assets/cepic/formations
mkdir -p client/public/assets/cepic/gallery
```

Assets nécessaires:
- [ ] Logo CEPIC (PNG, SVG)
- [ ] Favicon
- [ ] Images de couverture pour formations
- [ ] Photos pour la galerie
- [ ] Photo équipe/formateurs

---

## 📊 PHASE 2: BASE DE DONNÉES (2-3 heures)

### ✅ Étape 2.1: Nouveau Schema Prisma

1. **Sauvegarder l'ancien schema**
```bash
cd server
cp prisma/schema.prisma prisma/schema-old.prisma
```

2. **Remplacer le schema**
Copier le contenu de `DATABASE_SCHEMA_CEPIC.md` dans `server/prisma/schema.prisma`

3. **Formater et générer**
```bash
npx prisma format
npx prisma generate
```

### ✅ Étape 2.2: Créer le fichier de seed

Créer `server/prisma/seeds/cepic-seed.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CEPIC database...');

  // 1. Créer utilisateurs de test
  const hashedPassword = await bcrypt.hash('secret123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cepic.ci' },
    update: {},
    create: {
      email: 'admin@cepic.ci',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'CEPIC',
      role: 'ADMIN',
      isVerified: true
    }
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      password: hashedPassword,
      firstName: 'Jean',
      lastName: 'KOUADIO',
      role: 'USER',
      isVerified: true
    }
  });

  console.log('✅ Utilisateurs créés');

  // 2. Créer les 4 catégories
  const categories = [
    {
      name: 'Management de projet',
      slug: 'management-projet',
      description: 'Formations en gestion et pilotage de projets',
      icon: 'Briefcase',
      color: '#3B82F6',
      order: 1
    },
    {
      name: 'Banque et finance',
      slug: 'banque-finance',
      description: 'Formations en analyse financière et gestion bancaire',
      icon: 'DollarSign',
      color: '#10B981',
      order: 2
    },
    {
      name: 'Méthodologie & Collecte de données',
      slug: 'methodologie-collecte-donnees',
      description: 'Formations en enquêtes et traitement de données',
      icon: 'Database',
      color: '#F59E0B',
      order: 3
    },
    {
      name: 'Entrepreneuriat',
      slug: 'entrepreneuriat',
      description: 'Formations en création et gestion d\'entreprise',
      icon: 'Rocket',
      color: '#EF4444',
      order: 4
    }
  ];

  for (const cat of categories) {
    await prisma.trainingCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
  }

  console.log('✅ Catégories créées');

  // 3. Créer des formations exemples
  const trainings = [
    // Management de projet
    {
      title: 'Gestion de projet Agile et Scrum',
      slug: 'gestion-projet-agile-scrum',
      description: 'Formation complète sur les méthodologies Agiles et le framework Scrum pour gérer efficacement vos projets.',
      objectives: [
        'Maîtriser les principes et valeurs Agile',
        'Comprendre et appliquer le framework Scrum',
        'Gérer une équipe Agile efficacement',
        'Utiliser les outils de gestion Agile'
      ],
      prerequisites: ['Notions de base en gestion de projet'],
      targetAudience: 'Chefs de projet, Product Owners, Scrum Masters',
      duration: 24,
      durationUnit: 'hours',
      cost: 15000000, // 150,000 FCFA
      deliveryMode: 'PRESENTIAL',
      location: 'Cocody M\'Badon village',
      maxParticipants: 20,
      schedule: 'Lun-Ven 9h-17h',
      instructor: 'Jean KOUASSI',
      categorySlug: 'management-projet',
      isPublished: true,
      isFeatured: true
    },
    {
      title: 'MS Project - Planification et suivi de projets',
      slug: 'ms-project-planification',
      description: 'Maîtrisez Microsoft Project pour planifier, suivre et gérer vos projets professionnels.',
      objectives: [
        'Créer et structurer un projet',
        'Gérer les ressources et les coûts',
        'Suivre l\'avancement du projet',
        'Générer des rapports'
      ],
      prerequisites: ['Connaissances de base en bureautique'],
      targetAudience: 'Chefs de projet, Planificateurs',
      duration: 16,
      durationUnit: 'hours',
      cost: 12000000,
      deliveryMode: 'PRESENTIAL',
      location: 'Cocody M\'Badon village',
      maxParticipants: 15,
      instructor: 'Marie DIALLO',
      categorySlug: 'management-projet',
      isPublished: true
    },
    // Banque et finance
    {
      title: 'Analyse financière et gestion budgétaire',
      slug: 'analyse-financiere-gestion-budgetaire',
      description: 'Formation approfondie en analyse financière et élaboration de budgets.',
      objectives: [
        'Analyser les états financiers',
        'Élaborer et suivre un budget',
        'Calculer les ratios financiers',
        'Prendre des décisions financières éclairées'
      ],
      prerequisites: ['Notions de comptabilité'],
      targetAudience: 'Comptables, Contrôleurs de gestion, Directeurs financiers',
      duration: 20,
      durationUnit: 'hours',
      cost: 18000000,
      deliveryMode: 'HYBRID',
      location: 'Cocody M\'Badon village',
      maxParticipants: 20,
      instructor: 'Amadou TRAORE',
      categorySlug: 'banque-finance',
      isPublished: true,
      isFeatured: true
    },
    // Méthodologie
    {
      title: 'Enquêtes et collecte de données terrain',
      slug: 'enquetes-collecte-donnees',
      description: 'Techniques d\'enquête et de collecte de données qualitatives et quantitatives.',
      objectives: [
        'Concevoir un questionnaire efficace',
        'Mener des entretiens',
        'Collecter des données terrain',
        'Traiter et analyser les données'
      ],
      prerequisites: [],
      targetAudience: 'Chercheurs, Étudiants, Consultants',
      duration: 16,
      durationUnit: 'hours',
      cost: 14000000,
      deliveryMode: 'PRESENTIAL',
      location: 'Cocody M\'Badon village',
      maxParticipants: 25,
      instructor: 'Fatou KONE',
      categorySlug: 'methodologie-collecte-donnees',
      isPublished: true
    },
    // Entrepreneuriat
    {
      title: 'Création et gestion d\'entreprise',
      slug: 'creation-gestion-entreprise',
      description: 'Formation complète pour créer et gérer votre entreprise avec succès.',
      objectives: [
        'Élaborer un business plan',
        'Comprendre les aspects juridiques',
        'Gérer les finances de l\'entreprise',
        'Développer une stratégie marketing'
      ],
      prerequisites: [],
      targetAudience: 'Entrepreneurs, Porteurs de projets',
      duration: 32,
      durationUnit: 'hours',
      cost: 20000000,
      deliveryMode: 'PRESENTIAL',
      location: 'Cocody M\'Badon village',
      maxParticipants: 30,
      instructor: 'Ibrahim SANOGO',
      categorySlug: 'entrepreneuriat',
      isPublished: true,
      isFeatured: true
    }
  ];

  for (const training of trainings) {
    const category = await prisma.trainingCategory.findUnique({
      where: { slug: training.categorySlug }
    });

    const { categorySlug, ...trainingData } = training;

    await prisma.training.create({
      data: {
        ...trainingData,
        categoryId: category.id,
        createdBy: admin.id
      }
    });
  }

  console.log('✅ Formations créées');
  console.log('🎉 Seeding terminé!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

3. **Mettre à jour package.json**
```json
{
  "prisma": {
    "seed": "node prisma/seeds/cepic-seed.js"
  }
}
```

4. **Appliquer les migrations**
```bash
# Option 1: Push (développement)
npx prisma db push

# Option 2: Migrate (production)
npx prisma migrate dev --name cepic_initial

# Seed les données
npx prisma db seed
```

---

## 🔧 PHASE 3: BACKEND API (3-4 heures)

### ✅ Étape 3.1: Créer trainingController.js

Créer `server/controllers/trainingController.js`:

```javascript
const prisma = require('../lib/prisma');

// GET /api/trainings - Liste des formations
exports.getAllTrainings = async (req, res, next) => {
  try {
    const { category, search, featured } = req.query;
    
    const where = {
      isPublished: true,
      isActive: true
    };

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const trainings = await prisma.training.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: { enrollments_rel: true, reviews: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: trainings
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/trainings/:id - Détail formation
exports.getTrainingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const training = await prisma.training.findUnique({
      where: { id },
      include: {
        category: true,
        creator: {
          select: { firstName: true, lastName: true }
        },
        reviews: {
          where: { isPublic: true },
          include: {
            user: {
              select: { firstName: true, lastName: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        sessions: {
          where: {
            status: 'SCHEDULED',
            startDate: { gte: new Date() }
          },
          orderBy: { startDate: 'asc' }
        }
      }
    });

    if (!training) {
      return res.status(404).json({
        success: false,
        error: 'Formation non trouvée'
      });
    }

    // Incrémenter les vues
    await prisma.training.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    res.json({
      success: true,
      data: training
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/trainings/categories - Liste des catégories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.trainingCategory.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { trainings: true }
        }
      },
      orderBy: { order: 'asc' }
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/trainings/:id/bookmark - Ajouter aux favoris
exports.toggleBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await prisma.trainingBookmark.findUnique({
      where: {
        userId_trainingId: { userId, trainingId: id }
      }
    });

    if (existing) {
      await prisma.trainingBookmark.delete({
        where: { id: existing.id }
      });
      return res.json({
        success: true,
        message: 'Retiré des favoris'
      });
    }

    await prisma.trainingBookmark.create({
      data: { userId, trainingId: id }
    });

    res.json({
      success: true,
      message: 'Ajouté aux favoris'
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/trainings/:id/review - Ajouter un avis
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

module.exports = exports;
```

### ✅ Étape 3.2: Créer enrollmentController.js

Créer `server/controllers/enrollmentController.js`:

```javascript
const prisma = require('../lib/prisma');

// POST /api/enrollments - Créer une inscription
exports.createEnrollment = async (req, res, next) => {
  try {
    const { trainingId, sessionId, notes } = req.body;
    const userId = req.user.id;

    // Vérifier que la formation existe
    const training = await prisma.training.findUnique({
      where: { id: trainingId }
    });

    if (!training) {
      return res.status(404).json({
        success: false,
        error: 'Formation non trouvée'
      });
    }

    // Vérifier si déjà inscrit
    const existing = await prisma.trainingEnrollment.findUnique({
      where: {
        userId_trainingId: { userId, trainingId }
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Vous êtes déjà inscrit à cette formation'
      });
    }

    // Créer l'inscription
    const enrollment = await prisma.trainingEnrollment.create({
      data: {
        userId,
        trainingId,
        amount: training.cost,
        status: training.isFree ? 'CONFIRMED' : 'PENDING',
        paymentStatus: training.isFree ? 'PAID' : 'UNPAID',
        notes
      },
      include: {
        training: {
          include: { category: true }
        }
      }
    });

    // Incrémenter le compteur d'inscriptions
    await prisma.training.update({
      where: { id: trainingId },
      data: { enrollments: { increment: 1 } }
    });

    res.status(201).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/enrollments - Mes inscriptions
exports.getMyEnrollments = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const enrollments = await prisma.trainingEnrollment.findMany({
      where: { userId },
      include: {
        training: {
          include: { category: true }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    res.json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/enrollments/:id/pay - Confirmer paiement
exports.confirmPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentMethod, paymentId } = req.body;

    const enrollment = await prisma.trainingEnrollment.update({
      where: { id },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
        paymentMethod,
        paymentId,
        paidAt: new Date()
      }
    });

    res.json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
```

### ✅ Étape 3.3: Créer les routes

Créer `server/routers/trainingRoutes.js`:

```javascript
const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');
const { authenticate } = require('../middleware/auth');

// Routes publiques
router.get('/', trainingController.getAllTrainings);
router.get('/categories', trainingController.getCategories);
router.get('/:id', trainingController.getTrainingById);

// Routes protégées
router.post('/:id/bookmark', authenticate, trainingController.toggleBookmark);
router.post('/:id/review', authenticate, trainingController.addReview);

module.exports = router;
```

Créer `server/routers/enrollmentRoutes.js`:

```javascript
const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { authenticate } = require('../middleware/auth');

// Toutes les routes nécessitent l'authentification
router.use(authenticate);

router.post('/', enrollmentController.createEnrollment);
router.get('/', enrollmentController.getMyEnrollments);
router.put('/:id/pay', enrollmentController.confirmPayment);

module.exports = router;
```

### ✅ Étape 3.4: Mettre à jour server/index.js

```javascript
// Ajouter les nouvelles routes
app.use('/api/trainings', require('./routers/trainingRoutes'));
app.use('/api/enrollments', require('./routers/enrollmentRoutes'));
```

---

## 🎨 PHASE 4: FRONTEND (Suite dans le prochain message)

**Durée estimée des phases 1-3:** 5-6 heures

---

**Voulez-vous que je continue avec les phases Frontend (4-6) ?** 🚀
