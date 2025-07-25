import { create } from "zustand";

// Données des livres enrichies
const books = [
  {
    id: 1,
    title: "Le Royaume Perdu",
    author: "Alexandra Martin",
    category: "Fantasy",
    price: 15000,
    originalPrice: 18000,
    rating: 4.8,
    reviews: 234,
    pages: 387,
    language: "Français",
    publishYear: 2023,
    description:
      "Une épopée fantastique dans un monde où la magie et la technologie se mélangent pour créer des aventures extraordinaires.",
    tags: ["Fantasy", "Aventure", "Magie"],
    bestseller: true,
    newRelease: false,
    cover:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?fit=crop&w=400&h=600",
  },
  {
    id: 2,
    title: "Ombres et Secrets",
    author: "Jean-Pierre Dubois",
    category: "Thriller",
    price: 12000,
    originalPrice: 12000,
    rating: 4.5,
    reviews: 156,
    pages: 298,
    language: "Français",
    publishYear: 2024,
    description:
      "Un thriller psychologique haletant qui vous tiendra en haleine jusqu'à la dernière page.",
    tags: ["Thriller", "Mystère", "Suspense"],
    bestseller: false,
    newRelease: true,
    cover:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?fit=crop&w=400&h=600",
  },
  {
    id: 3,
    title: "Les Chroniques du Feu",
    author: "Marie Lecomte",
    category: "Science-Fiction",
    price: 16500,
    originalPrice: 20000,
    rating: 4.9,
    reviews: 445,
    pages: 512,
    language: "Français",
    publishYear: 2023,
    description:
      "Dans un futur dystopique, une héroïne lutte pour sauver l'humanité des flammes de la destruction.",
    tags: ["Sci-Fi", "Dystopie", "Action"],
    bestseller: true,
    newRelease: false,
    cover:
      "https://images.unsplash.com/photo-1553729784-e91953dec042?fit=crop&w=400&h=600",
  },
  {
    id: 4,
    title: "Mystère à Ravenhill",
    author: "Thomas Anderson",
    category: "Policier",
    price: 13500,
    originalPrice: 13500,
    rating: 4.3,
    reviews: 89,
    pages: 276,
    language: "Français",
    publishYear: 2024,
    description:
      "Une enquête palpitante dans une petite ville où les secrets du passé refont surface.",
    tags: ["Policier", "Enquête", "Mystère"],
    bestseller: false,
    newRelease: true,
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?fit=crop&w=400&h=600",
  },
  {
    id: 5,
    title: "L'Énigme de Minuit",
    author: "Sophie Moreau",
    category: "Romance",
    price: 11000,
    originalPrice: 14000,
    rating: 4.6,
    reviews: 178,
    pages: 324,
    language: "Français",
    publishYear: 2023,
    description:
      "Une romance mystérieuse qui se déroule dans les rues nocturnes de Paris.",
    tags: ["Romance", "Mystère", "Paris"],
    bestseller: false,
    newRelease: false,
    cover:
      "https://images.unsplash.com/photo-1544938678-92d2e31d5dc0?fit=crop&w=400&h=600",
  },
  {
    id: 6,
    title: "L'Héritage Interdit",
    author: "Pierre Vasseur",
    category: "Historique",
    price: 17000,
    originalPrice: 17000,
    rating: 4.7,
    reviews: 267,
    pages: 456,
    language: "Français",
    publishYear: 2022,
    description:
      "Un récit historique captivant sur les secrets cachés d'une famille noble française.",
    tags: ["Historique", "Famille", "Secrets"],
    bestseller: true,
    newRelease: false,
    cover:
      "https://images.unsplash.com/photo-1524578271613-ebd02d8fdb9d?fit=crop&w=400&h=600",
  },
  {
    id: 7,
    title: "Voyage Astral",
    author: "Luna Rivers",
    category: "Spiritualité",
    price: 14000,
    originalPrice: 16000,
    rating: 4.4,
    reviews: 123,
    pages: 298,
    language: "Français",
    publishYear: 2024,
    description:
      "Un guide spirituel pour explorer les dimensions cachées de la conscience humaine.",
    tags: ["Spiritualité", "Méditation", "Conscience"],
    bestseller: false,
    newRelease: true,
    cover:
      "https://images.unsplash.com/photo-1576107232686-4f99e37b5f31?fit=crop&w=400&h=600",
  },
  {
    id: 8,
    title: "La Bibliothèque Oubliée",
    author: "Gabriel Stone",
    category: "Fantasy",
    price: 15500,
    originalPrice: 18500,
    rating: 4.8,
    reviews: 334,
    pages: 423,
    language: "Français",
    publishYear: 2023,
    description:
      "Dans une bibliothèque magique, chaque livre contient un monde différent à explorer.",
    tags: ["Fantasy", "Magie", "Livres"],
    bestseller: true,
    newRelease: false,
    cover:
      "https://images.unsplash.com/photo-1534081333815-ae5019106621?fit=crop&w=400&h=600",
  },
  {
    id: 9,
    title: "Récits de l'Aube",
    author: "Emma Laurent",
    category: "Poésie",
    price: 9000,
    originalPrice: 11000,
    rating: 4.2,
    reviews: 67,
    pages: 156,
    language: "Français",
    publishYear: 2024,
    description:
      "Un recueil de poèmes qui capture la beauté et la mélancolie des premiers rayons du soleil.",
    tags: ["Poésie", "Nature", "Contemplation"],
    bestseller: false,
    newRelease: true,
    cover:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?fit=crop&w=400&h=600",
  },
  {
    id: 10,
    title: "Au Cœur des Ténèbres",
    author: "Victor Blackwood",
    category: "Horreur",
    price: 13000,
    originalPrice: 15000,
    rating: 4.5,
    reviews: 198,
    pages: 367,
    language: "Français",
    publishYear: 2023,
    description:
      "Un récit d'horreur psychologique qui explore les recoins les plus sombres de l'âme humaine.",
    tags: ["Horreur", "Psychologique", "Suspense"],
    bestseller: false,
    newRelease: false,
    cover:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?fit=crop&w=400&h=600",
  },
  {
    id: 11,
    title: "L'Oracle de Verre",
    author: "Crysta Webb",
    category: "Fantasy",
    price: 16000,
    originalPrice: 19000,
    rating: 4.9,
    reviews: 412,
    pages: 489,
    language: "Français",
    publishYear: 2022,
    description:
      "Une prophétie ancienne et un oracle mystérieux bouleversent le destin d'un royaume.",
    tags: ["Fantasy", "Prophétie", "Royaume"],
    bestseller: true,
    newRelease: false,
    cover:
      "https://images.unsplash.com/photo-1551022372-0bdac482b9d9?fit=crop&w=400&h=600",
  },
  {
    id: 12,
    title: "Renaissance",
    author: "André Moreau",
    category: "Développement Personnel",
    price: 12500,
    originalPrice: 14500,
    rating: 4.6,
    reviews: 156,
    pages: 298,
    language: "Français",
    publishYear: 2024,
    description:
      "Un guide pratique pour transformer sa vie et redécouvrir son potentiel intérieur.",
    tags: ["Développement", "Transformation", "Potentiel"],
    bestseller: false,
    newRelease: true,
    cover:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?fit=crop&w=400&h=600",
  },
];

export const useBookStore = create((set, get) => ({
  // État
  books: books,
  selectedBooks: [],
  searchQuery: "",
  selectedCategory: "all",
  sortBy: "title",
  showCart: false,
  viewMode: "grid", // 'grid' | 'list'
  priceRange: [0, 25000],
  showFilters: false,

  // Actions de sélection
  addBook: (book) => {
    const state = get();
    if (!state.selectedBooks.some((b) => b.id === book.id)) {
      set((state) => ({
        selectedBooks: [...state.selectedBooks, book],
      }));
    }
  },

  removeBook: (bookId) => {
    set((state) => ({
      selectedBooks: state.selectedBooks.filter((b) => b.id !== bookId),
    }));
  },

  clearSelection: () => set({ selectedBooks: [] }),

  // Actions de recherche et filtrage
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSortBy: (sortBy) => set({ sortBy }),
  setPriceRange: (range) => set({ priceRange: range }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setShowFilters: (show) => set({ showFilters: show }),

  // Actions du panier
  toggleCart: () => set((state) => ({ showCart: !state.showCart })),
  setShowCart: (show) => set({ showCart: show }),

  // Getters calculés
  getFilteredBooks: () => {
    const state = get();
    let filtered = [...state.books];

    // Filtre par recherche
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filtre par catégorie
    if (state.selectedCategory !== "all") {
      filtered = filtered.filter(
        (book) => book.category === state.selectedCategory
      );
    }

    // Filtre par prix
    filtered = filtered.filter(
      (book) =>
        book.price >= state.priceRange[0] && book.price <= state.priceRange[1]
    );

    // Tri
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return b.publishYear - a.publishYear;
        default:
          return 0;
      }
    });

    return filtered;
  },

  getCategories: () => {
    const state = get();
    const categories = [...new Set(state.books.map((book) => book.category))];
    return categories.sort();
  },

  getTotalPrice: () => {
    const state = get();
    return state.selectedBooks.reduce((total, book) => total + book.price, 0);
  },

  getBookById: (id) => {
    const state = get();
    return state.books.find((book) => book.id === id);
  },
}));
