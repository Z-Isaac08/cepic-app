const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash passwords
  const hashedPassword = await bcrypt.hash('secret123', 12);

  // Create test admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true,
      isActive: true
    }
  });

  // Create test regular user
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      isVerified: true,
      isActive: true
    }
  });

  // Create test unverified user
  const unverifiedUser = await prisma.user.upsert({
    where: { email: 'unverified@test.com' },
    update: {},
    create: {
      email: 'unverified@test.com',
      password: hashedPassword,
      firstName: 'Unverified',
      lastName: 'User',
      role: 'USER',
      isVerified: false,
      isActive: true
    }
  });

  // Create library categories
  const categories = await Promise.all([
    prisma.libraryCategory.upsert({
      where: { name: 'Fantasy' },
      update: {},
      create: {
        name: 'Fantasy',
        description: 'Livres de fantasy et de magie',
        color: '#8B5CF6'
      }
    }),
    prisma.libraryCategory.upsert({
      where: { name: 'Thriller' },
      update: {},
      create: {
        name: 'Thriller',
        description: 'Romans à suspense et thrillers',
        color: '#EF4444'
      }
    }),
    prisma.libraryCategory.upsert({
      where: { name: 'Science-Fiction' },
      update: {},
      create: {
        name: 'Science-Fiction',
        description: 'Science-fiction et futurisme',
        color: '#06B6D4'
      }
    }),
    prisma.libraryCategory.upsert({
      where: { name: 'Romance' },
      update: {},
      create: {
        name: 'Romance',
        description: 'Romans d\'amour et romance',
        color: '#F59E0B'
      }
    }),
    prisma.libraryCategory.upsert({
      where: { name: 'Développement Personnel' },
      update: {},
      create: {
        name: 'Développement Personnel',
        description: 'Livres de développement personnel et motivation',
        color: '#10B981'
      }
    }),
    prisma.libraryCategory.upsert({
      where: { name: 'Histoire' },
      update: {},
      create: {
        name: 'Histoire',
        description: 'Livres d\'histoire et biographies',
        color: '#92400E'
      }
    })
  ]);

  console.log('📚 Categories created:', categories.length);

  // Mock books data with Unsplash covers
  const booksData = [
    {
      title: "Le Royaume Perdu",
      author: "Alexandra Martin",
      isbn: "978-2-123456-01-0",
      description: "Une épopée fantastique dans un monde où la magie et la technologie se mélangent pour créer des aventures extraordinaires.",
      coverImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=600&fit=crop",
      fileType: "PDF",
      pages: 387,
      language: "fr",
      price: 1500000, // 15,000 FCFA in cents
      originalPrice: 1800000, // 18,000 FCFA
      tags: ["Fantasy", "Aventure", "Magie"],
      category: "Fantasy"
    },
    {
      title: "Ombres et Secrets",
      author: "Jean-Pierre Dubois",
      isbn: "978-2-123456-02-7",
      description: "Un thriller psychologique haletant qui vous tiendra en haleine jusqu'à la dernière page.",
      coverImage: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400&h=600&fit=crop",
      fileType: "EPUB",
      pages: 298,
      language: "fr",
      price: 1200000, // 12,000 FCFA
      tags: ["Thriller", "Mystère", "Suspense"],
      category: "Thriller"
    },
    {
      title: "Les Chroniques du Feu",
      author: "Marie Lecomte",
      isbn: "978-2-123456-03-4",
      description: "Dans un futur dystopique, une héroïne lutte pour sauver l'humanité des flammes de la destruction.",
      coverImage: "https://images.unsplash.com/photo-1553729784-e91953dec042?w=400&h=600&fit=crop",
      fileType: "PDF",
      pages: 512,
      language: "fr",
      price: 1650000, // 16,500 FCFA
      originalPrice: 2000000, // 20,000 FCFA
      tags: ["Sci-Fi", "Dystopie", "Action"],
      category: "Science-Fiction"
    },
    {
      title: "L'Énigme de Minuit",
      author: "Sophie Moreau",
      isbn: "978-2-123456-04-1",
      description: "Une romance mystérieuse qui se déroule dans les rues nocturnes de Paris.",
      coverImage: "https://images.unsplash.com/photo-1544938678-92d2e31d5dc0?w=400&h=600&fit=crop",
      fileType: "EPUB",
      pages: 324,
      language: "fr",
      price: 1100000, // 11,000 FCFA
      originalPrice: 1400000, // 14,000 FCFA
      tags: ["Romance", "Mystère", "Paris"],
      category: "Romance"
    },
    {
      title: "Renaissance",
      author: "André Moreau",
      isbn: "978-2-123456-05-8",
      description: "Un guide pratique pour transformer sa vie et redécouvrir son potentiel intérieur.",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
      fileType: "PDF",
      pages: 298,
      language: "fr",
      price: 1250000, // 12,500 FCFA
      originalPrice: 1450000, // 14,500 FCFA
      tags: ["Développement", "Transformation", "Potentiel"],
      category: "Développement Personnel"
    },
    {
      title: "L'Héritage Interdit",
      author: "Pierre Vasseur",
      isbn: "978-2-123456-06-5",
      description: "Un récit historique captivant sur les secrets cachés d'une famille noble française.",
      coverImage: "https://images.unsplash.com/photo-1524578271613-ebd02d8fdb9d?w=400&h=600&fit=crop",
      fileType: "PDF",
      pages: 456,
      language: "fr",
      price: 1700000, // 17,000 FCFA
      tags: ["Historique", "Famille", "Secrets"],
      category: "Histoire"
    },
    {
      title: "La Bibliothèque Oubliée",
      author: "Gabriel Stone",
      isbn: "978-2-123456-07-2",
      description: "Dans une bibliothèque magique, chaque livre contient un monde différent à explorer.",
      coverImage: "https://images.unsplash.com/photo-1534081333815-ae5019106621?w=400&h=600&fit=crop",
      fileType: "EPUB",
      pages: 423,
      language: "fr",
      price: 1550000, // 15,500 FCFA
      originalPrice: 1850000, // 18,500 FCFA
      tags: ["Fantasy", "Magie", "Livres"],
      category: "Fantasy"
    },
    {
      title: "Au Cœur des Ténèbres",
      author: "Victor Blackwood",
      isbn: "978-2-123456-08-9",
      description: "Un récit d'horreur psychologique qui explore les recoins les plus sombres de l'âme humaine.",
      coverImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=600&fit=crop",
      fileType: "PDF",
      pages: 367,
      language: "fr",
      price: 1300000, // 13,000 FCFA
      originalPrice: 1500000, // 15,000 FCFA
      tags: ["Horreur", "Psychologique", "Suspense"],
      category: "Thriller"
    },
    {
      title: "L'Oracle de Verre",
      author: "Crysta Webb",
      isbn: "978-2-123456-09-6",
      description: "Une prophétie ancienne et un oracle mystérieux bouleversent le destin d'un royaume.",
      coverImage: "https://images.unsplash.com/photo-1551022372-0bdac482b9d9?w=400&h=600&fit=crop",
      fileType: "PDF",
      pages: 489,
      language: "fr",
      price: 1600000, // 16,000 FCFA
      originalPrice: 1900000, // 19,000 FCFA
      tags: ["Fantasy", "Prophétie", "Royaume"],
      category: "Fantasy"
    },
    {
      title: "Voyage Astral",
      author: "Luna Rivers",
      isbn: "978-2-123456-10-2",
      description: "Un guide spirituel pour explorer les dimensions cachées de la conscience humaine.",
      coverImage: "https://images.unsplash.com/photo-1576107232686-4f99e37b5f31?w=400&h=600&fit=crop",
      fileType: "EPUB",
      pages: 298,
      language: "fr",
      price: 1400000, // 14,000 FCFA
      originalPrice: 1600000, // 16,000 FCFA
      tags: ["Spiritualité", "Méditation", "Conscience"],
      category: "Développement Personnel"
    },
    {
      title: "Code Quantum",
      author: "Dr. Elena Vasquez",
      isbn: "978-2-123456-11-9",
      description: "L'humanité découvre un code caché dans l'univers qui pourrait tout changer.",
      coverImage: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=600&fit=crop",
      fileType: "PDF",
      pages: 445,
      language: "fr",
      price: 1750000, // 17,500 FCFA
      tags: ["Science-Fiction", "Technologie", "Mystère"],
      category: "Science-Fiction"
    },
    {
      title: "Les Murmures du Passé",
      author: "Isabelle Durand",
      isbn: "978-2-123456-12-6",
      description: "Une archéologue découvre des artefacts qui révèlent des secrets sur notre civilisation.",
      coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      fileType: "EPUB",
      pages: 378,
      language: "fr",
      price: 1350000, // 13,500 FCFA
      tags: ["Histoire", "Archéologie", "Mystère"],
      category: "Histoire"
    }
  ];

  console.log('📖 Creating books...');

  // Create books
  const books = [];
  for (const bookData of booksData) {
    const category = categories.find(cat => cat.name === bookData.category);
    
    const book = await prisma.libraryBook.create({
      data: {
        title: bookData.title,
        author: bookData.author,
        isbn: bookData.isbn,
        description: bookData.description,
        coverImage: bookData.coverImage,
        fileType: bookData.fileType,
        pages: bookData.pages,
        language: bookData.language,
        price: bookData.price,
        originalPrice: bookData.originalPrice,
        tags: bookData.tags,
        rating: Math.random() * 2 + 3, // Random rating between 3 and 5
        views: Math.floor(Math.random() * 1000) + 50,
        downloads: Math.floor(Math.random() * 500) + 10,
        isPublic: true,
        isAvailable: true,
        isFree: false,
        publishedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date in last year
        categoryId: category.id,
        uploadedBy: adminUser.id,
        fileUrl: `https://example.com/files/${bookData.isbn}.pdf` // Mock file URL
      }
    });

    books.push(book);
  }

  // Add some free books
  const freeBooks = [
    {
      title: "Guide d'Introduction à JavaScript",
      author: "ProjectMoney Team",
      description: "Un guide gratuit pour apprendre les bases de JavaScript.",
      coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=600&fit=crop",
      fileType: "PDF",
      pages: 150,
      category: "Développement Personnel",
      isFree: true
    },
    {
      title: "10 Recettes de Cuisine Africaine",
      author: "Chef Mama Africa",
      description: "Découvrez 10 recettes traditionnelles africaines gratuitement.",
      coverImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop",
      fileType: "PDF",
      pages: 80,
      category: "Histoire",
      isFree: true
    }
  ];

  for (const freeBookData of freeBooks) {
    const category = categories.find(cat => cat.name === freeBookData.category);
    
    await prisma.libraryBook.create({
      data: {
        title: freeBookData.title,
        author: freeBookData.author,
        description: freeBookData.description,
        coverImage: freeBookData.coverImage,
        fileType: freeBookData.fileType,
        pages: freeBookData.pages,
        language: "fr",
        price: 0,
        tags: ["Gratuit", "Guide"],
        rating: Math.random() * 1 + 4, // High rating for free content
        views: Math.floor(Math.random() * 2000) + 100,
        downloads: Math.floor(Math.random() * 1000) + 50,
        isPublic: true,
        isAvailable: true,
        isFree: true,
        publishedAt: new Date(),
        categoryId: category.id,
        uploadedBy: adminUser.id,
        fileUrl: `https://example.com/files/free-${freeBookData.title.toLowerCase().replace(/\s+/g, '-')}.pdf`
      }
    });
  }

  console.log('✅ Seed data created:');
  console.log('📧 Admin User:', adminUser.email);
  console.log('📧 Regular User:', regularUser.email);
  console.log('📧 Unverified User:', unverifiedUser.email);
  console.log('🔑 Password for all test users: secret123');
  console.log('📚 Categories:', categories.length);
  console.log('📖 Books:', books.length + freeBooks.length);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });