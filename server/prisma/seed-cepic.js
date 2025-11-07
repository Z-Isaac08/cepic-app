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
      isVerified: true,
    },
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
      isVerified: true,
    },
  });

  console.log('✅ Utilisateurs créés');

  // 2. Créer les 4 catégories CEPIC
  const categories = [
    {
      name: 'Management de projet',
      slug: 'management-projet',
      description: 'Formations en gestion et pilotage de projets',
      icon: 'Briefcase',
      color: '#3B82F6',
      order: 1,
    },
    {
      name: 'Banque et finance',
      slug: 'banque-finance',
      description: 'Formations en analyse financière et gestion bancaire',
      icon: 'DollarSign',
      color: '#10B981',
      order: 2,
    },
    {
      name: 'Méthodologie & Collecte de données',
      slug: 'methodologie-collecte-donnees',
      description: 'Formations en enquêtes et traitement de données',
      icon: 'Database',
      color: '#F59E0B',
      order: 3,
    },
    {
      name: 'Entrepreneuriat',
      slug: 'entrepreneuriat',
      description: "Formations en création et gestion d'entreprise",
      icon: 'Rocket',
      color: '#EF4444',
      order: 4,
    },
  ];

  const createdCategories = {};
  for (const cat of categories) {
    const category = await prisma.trainingCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = category;
  }

  console.log('✅ 4 catégories créées');

  // 3. Créer des formations exemples (VERSION SIMPLIFIÉE)
  const trainings = [
    // Management de projet
    {
      title: 'Gestion de projet Agile et Scrum',
      slug: 'gestion-projet-agile-scrum',
      description:
        'Formation complète sur les méthodologies Agiles et le framework Scrum pour gérer efficacement vos projets.',
      program: `
**Module 1: Introduction à l'Agile**
- Principes et valeurs Agile
- Différence avec les méthodes traditionnelles

**Module 2: Framework Scrum**
- Rôles Scrum (Product Owner, Scrum Master, Équipe)
- Événements Scrum (Sprint, Daily, Retrospective)

**Module 3: Pratique**
- Exercices pratiques et études de cas
- Mise en situation réelle
      `.trim(),
      objectives: [
        'Maîtriser les principes et valeurs Agile',
        'Comprendre et appliquer le framework Scrum',
        'Gérer une équipe Agile efficacement',
        'Utiliser les outils de gestion Agile',
      ],
      prerequisites: ['Notions de base en gestion de projet'],
      targetAudience: 'Chefs de projet, Product Owners, Scrum Masters',
      duration: '24h',
      level: 'INTERMEDIAIRE',
      price: 300000, // 300,000 FCFA
      capacity: 20,
      schedule: "Lun-Ven 9h-17h à Cocody M'Badon village",
      instructor: 'Jean KOUASSI',
      startDate: new Date('2025-02-10'),
      endDate: new Date('2025-02-14'),
      categorySlug: 'management-projet',
      isPublished: true,
      isFeatured: true,
      tags: ['agile', 'scrum', 'management'],
    },
    {
      title: 'MS Project - Planification et suivi de projets',
      slug: 'ms-project-planification',
      description:
        'Maîtrisez Microsoft Project pour planifier, suivre et gérer vos projets professionnels.',
      program:
        'Introduction à MS Project, création de projets, gestion des ressources, suivi et reporting.',
      objectives: [
        'Créer et structurer un projet',
        'Gérer les ressources et les coûts',
        "Suivre l'avancement du projet",
        'Générer des rapports',
      ],
      prerequisites: ['Connaissances de base en bureautique'],
      targetAudience: 'Chefs de projet, Planificateurs',
      duration: '16h',
      level: 'DEBUTANT',
      price: 250000, // 250,000 FCFA
      capacity: 15,
      schedule: "Mar-Jeu 14h-18h à Cocody M'Badon village",
      instructor: 'Marie DIALLO',
      startDate: new Date('2025-02-18'),
      endDate: new Date('2025-02-20'),
      categorySlug: 'management-projet',
      isPublished: true,
      tags: ['ms-project', 'planification', 'microsoft'],
    },
    {
      title: 'Gestion des risques projet',
      slug: 'gestion-risques-projet',
      description: 'Apprenez à identifier, évaluer et gérer les risques dans vos projets.',
      objectives: [
        'Identifier les risques potentiels',
        "Évaluer l'impact des risques",
        'Élaborer des plans de mitigation',
        'Suivre et contrôler les risques',
      ],
      prerequisites: ['Expérience en gestion de projet'],
      targetAudience: 'Chefs de projet, Risk Managers',
      duration: '16h',
      level: 'AVANCE',
      price: 280000, // 280,000 FCFA
      capacity: 20,
      schedule: 'Weekend (Sam-Dim) 9h-17h',
      instructor: 'Amadou TRAORE',
      categorySlug: 'management-projet',
      isPublished: true,
      tags: ['risques', 'gestion', 'projet'],
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
        'Prendre des décisions financières éclairées',
      ],
      prerequisites: ['Notions de comptabilité'],
      targetAudience: 'Comptables, Contrôleurs de gestion, Directeurs financiers',
      duration: '20h',
      level: 'INTERMEDIAIRE',
      price: 350000, // 350,000 FCFA
      capacity: 20,
      schedule: "Lun-Ven 9h-13h à Cocody M'Badon village",
      instructor: 'Fatou KONE',
      startDate: new Date('2025-03-03'),
      endDate: new Date('2025-03-07'),
      categorySlug: 'banque-finance',
      isPublished: true,
      isFeatured: true,
      tags: ['finance', 'analyse', 'budget'],
    },
    {
      title: 'Crédit et gestion des risques bancaires',
      slug: 'credit-gestion-risques-bancaires',
      description:
        "Maîtrisez l'analyse de crédit et la gestion des risques dans le secteur bancaire.",
      objectives: [
        'Analyser la solvabilité des clients',
        'Évaluer les risques de crédit',
        'Gérer un portefeuille de crédits',
        'Appliquer les normes prudentielles',
      ],
      prerequisites: ['Connaissances en finance'],
      targetAudience: 'Analystes crédit, Chargés de clientèle bancaire',
      duration: '24h',
      level: 'AVANCE',
      price: 0, // Gratuit
      capacity: 15,
      schedule: "Lun-Ven 14h-18h à Cocody M'Badon village",
      instructor: 'Ibrahim SANOGO',
      categorySlug: 'banque-finance',
      isPublished: true,
      tags: ['crédit', 'banque', 'risques'],
    },

    // Méthodologie & Collecte de données
    {
      title: 'Enquêtes et collecte de données terrain',
      slug: 'enquetes-collecte-donnees',
      description: "Techniques d'enquête et de collecte de données qualitatives et quantitatives.",
      objectives: [
        'Concevoir un questionnaire efficace',
        'Mener des entretiens',
        'Collecter des données terrain',
        'Traiter et analyser les données',
      ],
      prerequisites: [],
      targetAudience: 'Chercheurs, Étudiants, Consultants',
      duration: '16h',
      level: 'DEBUTANT',
      price: 140000,
      capacity: 25,
      schedule: "Mar-Jeu 9h-17h à Cocody M'Badon village",
      instructor: "Aya N'GUESSAN",
      categorySlug: 'methodologie-collecte-donnees',
      isPublished: true,
      tags: ['enquête', 'données', 'recherche'],
    },
    {
      title: 'SPSS - Analyse statistique de données',
      slug: 'spss-analyse-statistique',
      description: "Maîtrisez SPSS pour analyser vos données d'enquête et de recherche.",
      objectives: [
        'Importer et préparer les données',
        'Réaliser des analyses descriptives',
        'Effectuer des tests statistiques',
        'Interpréter les résultats',
      ],
      prerequisites: ['Notions de statistiques'],
      targetAudience: 'Chercheurs, Analystes de données',
      duration: '20h',
      level: 'INTERMEDIAIRE',
      price: 160000,
      capacity: 20,
      schedule: 'Lun-Mer-Ven 14h-18h (en ligne)',
      instructor: 'Konan YAO',
      categorySlug: 'methodologie-collecte-donnees',
      isPublished: true,
      isFeatured: true,
      tags: ['spss', 'statistiques', 'analyse'],
    },

    // Entrepreneuriat
    {
      title: "Création et gestion d'entreprise",
      slug: 'creation-gestion-entreprise',
      description: 'Formation complète pour créer et gérer votre entreprise avec succès.',
      program: `
**Semaine 1: Création**
- Business model et business plan
- Aspects juridiques et administratifs

**Semaine 2: Gestion**
- Gestion financière
- Marketing et commercial

**Semaine 3: Développement**
- Stratégie de croissance
- Ressources humaines
      `.trim(),
      objectives: [
        'Élaborer un business plan',
        'Comprendre les aspects juridiques',
        "Gérer les finances de l'entreprise",
        'Développer une stratégie marketing',
      ],
      prerequisites: [],
      targetAudience: 'Entrepreneurs, Porteurs de projets',
      duration: '32h',
      level: 'DEBUTANT',
      price: 0, // Gratuit
      capacity: 30,
      schedule: "Lun-Ven 9h-13h (3 semaines) à Cocody M'Badon village",
      instructor: 'Serge DIGBEU',
      startDate: new Date('2025-03-10'),
      endDate: new Date('2025-03-28'),
      categorySlug: 'entrepreneuriat',
      isPublished: true,
      isFeatured: true,
      tags: ['entrepreneuriat', 'création', 'business'],
    },
    {
      title: 'Marketing digital pour entrepreneurs',
      slug: 'marketing-digital-entrepreneurs',
      description: 'Développez votre présence en ligne et attirez plus de clients.',
      objectives: [
        'Créer une stratégie digitale',
        'Utiliser les réseaux sociaux efficacement',
        'Optimiser votre site web',
        'Mesurer vos performances',
      ],
      prerequisites: [],
      targetAudience: 'Entrepreneurs, Responsables marketing',
      duration: '16h',
      level: 'DEBUTANT',
      price: 150000,
      capacity: 25,
      schedule: 'Weekend (Sam-Dim) 9h-17h (hybride)',
      instructor: 'Aïcha TOURE',
      categorySlug: 'entrepreneuriat',
      isPublished: true,
      tags: ['marketing', 'digital', 'réseaux-sociaux'],
    },
  ];

  for (const training of trainings) {
    const category = createdCategories[training.categorySlug];
    const { categorySlug, ...trainingData } = training;

    await prisma.training.create({
      data: {
        ...trainingData,
        categoryId: category.id,
        createdBy: admin.id,
      },
    });
  }

  console.log('✅ 9 formations créées');

  // 4. Créer quelques photos de galerie
  const galleryPhotos = [
    {
      title: 'Session de formation en management',
      description: 'Formation en gestion de projet Agile',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      category: 'Formations',
      order: 1,
      uploadedBy: admin.id,
    },
    {
      title: 'Équipe CEPIC',
      description: 'Notre équipe de formateurs experts',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      category: 'Équipe',
      order: 2,
      uploadedBy: admin.id,
    },
    {
      title: 'Nos locaux',
      description: 'Salle de formation moderne et équipée',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      category: 'Locaux',
      order: 3,
      uploadedBy: admin.id,
    },
    {
      title: 'Atelier pratique',
      description: 'Travaux pratiques en groupe',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
      category: 'Formations',
      order: 4,
      uploadedBy: admin.id,
    },
  ];

  for (const photo of galleryPhotos) {
    await prisma.galleryPhoto.create({
      data: photo,
    });
  }

  console.log('✅ 4 photos de galerie créées');

  // 5. Créer quelques messages de contact pour tester
  const contactMessages = [
    {
      name: 'Kouassi Michel',
      email: 'michel@example.com',
      phone: '+225 07 00 00 00 00',
      subject: "Demande d'information sur la formation Agile",
      message:
        "Bonjour, je souhaite avoir plus d'informations sur la formation Agile et Scrum. Quelles sont les dates disponibles ?",
      status: 'NEW',
    },
    {
      name: 'Adjoua Prisca',
      email: 'prisca@example.com',
      subject: 'Inscription formation SPSS',
      message: "Je souhaite m'inscrire à la prochaine session SPSS. Comment procéder ?",
      status: 'READ',
    },
  ];

  for (const message of contactMessages) {
    await prisma.contactMessage.create({
      data: message,
    });
  }

  console.log('✅ 2 messages de contact créés');

  console.log('\n🎉 Seeding terminé avec succès!');
  console.log('\n📊 Résumé:');
  console.log('  - 2 utilisateurs (admin@cepic.ci / user@test.com)');
  console.log('  - 4 catégories de formations');
  console.log('  - 9 formations exemples (avec nouveaux champs simplifiés)');
  console.log('  - 4 photos de galerie');
  console.log('  - 2 messages de contact');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
