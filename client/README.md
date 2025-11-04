# 🎨 Frontend Client - ProjectMoney (Privé CEPIC)

> Confidentialité: document interne réservé à CEPIC. Pour la vue d’ensemble, les procédures de déploiement et la configuration des environnements, voir les documents centralisés à la racine du dépôt:
>
> - README.md (vue d’ensemble projet, infos CEPIC)
> - DOCUMENTATION.md (architecture, API, stores)
> - GUIDE_DEPLOIEMENT.md (Docker/VPS, Nginx, scripts npm)
> - ENVIRONNEMENT.md (variables dev/prod, secrets)

Interface utilisateur moderne construite avec React 19, Vite et Zustand pour une expérience utilisateur fluide et responsive.

## 📋 Table des Matières

- [🔍 Aperçu](#-aperçu)
- [🛠️ Technologies](#️-technologies)
- [🚀 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [📁 Structure](#-structure)
- [🎯 Fonctionnalités](#-fonctionnalités)
- [🎨 Design System](#-design-system)
- [🔄 Gestion d'État](#-gestion-détat)
- [🌐 API Integration](#-api-integration)
- [📱 Responsive Design](#-responsive-design)
- [🧪 Tests](#-tests)
- [🏗️ Build & Déploiement](#️-build--déploiement)

## 🔍 Aperçu

Le frontend de ProjectMoney est une application React moderne qui offre :

- **Interface intuitive** pour la gestion financière
- **Authentification sécurisée** avec 2FA
- **Design responsive** adapté à tous les appareils
- **Performance optimisée** avec Vite et lazy loading
- **Expérience utilisateur fluide** avec transitions et animations

## 🛠️ Technologies

### Core Framework
- **React 19** - Bibliothèque UI avec Concurrent Features
- **Vite** - Build tool ultra-rapide avec HMR
- **JavaScript ES6+** - Syntaxe moderne et fonctionnelle

### Gestion d'État & Données
- **Zustand** - Gestion d'état simple et performante
- **Axios** - Client HTTP avec interceptors automatiques
- **React Query** - Cache et synchronisation des données (à venir)

### Routing & Navigation
- **React Router v6** - Routing côté client avec suspense
- **Histoire** - Navigation programmée et gestion d'historique

### Styling & UI
- **Tailwind CSS** - Framework CSS utility-first
- **Headless UI** - Composants accessibles non-stylés
- **Lucide React** - Icônes modernes et légères
- **Framer Motion** - Animations et transitions fluides (à venir)

### Outils de Développement
- **ESLint** - Linting et qualité du code
- **Prettier** - Formatage automatique du code
- **Vite DevTools** - Outils de debugging et performance

## 🚀 Installation (npm)

### Prérequis
```bash
# Versions recommandées
Node.js >= 18.0.0
npm >= 8.0.0
```

### 1. Installation des Dépendances
```bash
cd client
npm install
```

### 2. Configuration de l'Environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env.local

# Éditer les variables d'environnement
nano .env.local
```

### 3. Démarrage du Serveur de Développement
```bash
# Mode développement avec hot reload
npm run dev

# Mode développement avec exposition réseau
npm run dev -- --host

# Mode debug
npm run dev:debug
```

### 4. Accès à l'Application
- **Développement**: http://localhost:5173
- **Réseau local**: http://[votre-ip]:5173

## ⚙️ Configuration

### Variables d'Environnement (.env.local)

```bash
# Configuration de l'API
VITE_API_BASE_URL=http://localhost:3001/api
VITE_API_TIMEOUT=10000

# URLs de l'application
VITE_APP_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:3001

# Mode de développement
VITE_NODE_ENV=development
VITE_DEBUG_MODE=true

# Configuration de l'authentification
VITE_AUTH_COOKIE_NAME=auth_token
VITE_REFRESH_COOKIE_NAME=refresh_token

# Services externes (production)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_SENTRY_DSN=https://your-sentry-dsn

# Feature flags
VITE_ENABLE_PWA=true
VITE_ENABLE_OFFLINE_MODE=false
```

### Configuration Vite (vite.config.js)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@stores': resolve(__dirname, './src/stores'),
      '@utils': resolve(__dirname, './src/utils'),
      '@services': resolve(__dirname, './src/services'),
    }
  },
  server: {
    port: 5173,
    open: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          store: ['zustand'],
          http: ['axios']
        }
      }
    }
  }
})
```

## 📁 Structure

```
client/
├── 📁 public/                   # Assets statiques
│   ├── vite.svg                # Favicon et manifestes
│   └── robots.txt              # Configuration SEO
├── 📁 src/                     # Code source principal
│   ├── 📁 components/          # Composants réutilisables
│   │   ├── 📁 auth/            # Authentification
│   │   │   ├── LoginForm.jsx           # Formulaire de connexion
│   │   │   ├── TwoFactorForm.jsx       # Vérification 2FA
│   │   │   ├── NewUserRegistrationForm.jsx # Inscription
│   │   │   └── EmailVerificationForm.jsx   # Vérification email
│   │   ├── 📁 features/        # Fonctionnalités métier
│   │   │   ├── EventHero.jsx           # Hero section événements
│   │   │   ├── EventOverview.jsx       # Vue d'ensemble événements
│   │   │   └── RegistrationSteps.jsx   # Étapes d'inscription
│   │   ├── 📁 layout/          # Composants de mise en page
│   │   │   ├── Layout.jsx              # Layout principal
│   │   │   ├── NavBar.jsx              # Barre de navigation
│   │   │   └── Footer.jsx              # Pied de page
│   │   ├── 📁 library/         # Bibliothèque de livres
│   │   │   ├── BookCard.jsx            # Carte de livre
│   │   │   ├── CartSidebar.jsx         # Panier latéral
│   │   │   ├── FloatingCartButton.jsx  # Bouton panier flottant
│   │   │   └── SearchAndFilters.jsx    # Recherche et filtres
│   │   ├── 📁 ui/              # Composants UI de base
│   │   │   ├── Button.jsx              # Boutons réutilisables
│   │   │   ├── Card.jsx                # Cartes et containers
│   │   │   └── Loading.jsx             # Indicateurs de chargement
│   │   └── 📁 errorboundary/   # Gestion des erreurs
│   │       └── ErrorBoundary.jsx       # Boundary d'erreur global
│   ├── 📁 pages/               # Pages principales
│   │   ├── HomePage.jsx                # Page d'accueil
│   │   └── LibraryPage.jsx             # Page bibliothèque
│   ├── 📁 services/            # Services et API
│   │   └── api.js                      # Configuration Axios et endpoints
│   ├── 📁 stores/              # Gestion d'état Zustand
│   │   ├── authStore.js                # État d'authentification
│   │   ├── bookStore.js                # État de la bibliothèque
│   │   ├── eventStore.js               # État des événements
│   │   └── registrationStore.js        # État des inscriptions
│   ├── 📁 utils/               # Utilitaires et helpers
│   │   ├── constants.js                # Constantes de l'application
│   │   ├── formatters.js               # Formatage des données
│   │   └── validators.js               # Validation côté client
│   ├── 📄 App.jsx              # Composant racine
│   ├── 📄 main.jsx             # Point d'entrée React
│   └── 📄 index.css            # Styles globaux
├── 📄 vite.config.js           # Configuration Vite
├── 📄 package.json             # Dépendances et scripts
├── 📄 eslint.config.js         # Configuration ESLint
├── 📄 .gitignore               # Fichiers ignorés
└── 📄 README.md                # Ce fichier
```

## 🎯 Fonctionnalités

### 🔐 Authentification Avancée
```jsx
// Workflow d'authentification complet
const AuthFlow = () => {
  const { authState, login, verify2FA } = useAuthStore();

  switch (authState) {
    case 'logged_out':
      return <LoginForm onSubmit={login} />;
    case 'awaiting_2fa':
      return <TwoFactorForm onSubmit={verify2FA} />;
    case 'logged_in':
      return <Dashboard />;
    default:
      return <LoadingSpinner />;
  }
};
```

### 📚 Bibliothèque Interactive
```jsx
// Système de recherche et filtrage
const LibraryFeatures = () => {
  const { books, addToCart, filters } = useBookStore();
  
  return (
    <div className="library-container">
      <SearchAndFilters />
      <BookGrid books={books} onAddToCart={addToCart} />
      <CartSidebar />
    </div>
  );
};
```

### 🎉 Gestion d'Événements
```jsx
// Interface d'inscription aux événements
const EventRegistration = () => {
  const { currentEvent, registerUser } = useEventStore();
  
  return (
    <div className="event-registration">
      <EventHero event={currentEvent} />
      <RegistrationSteps onComplete={registerUser} />
    </div>
  );
};
```

## 🎨 Design System

### Palette de Couleurs (Tailwind)
```css
/* Couleurs principales */
:root {
  --primary-50: #f0f9ff;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  
  --secondary-50: #f8fafc;
  --secondary-500: #64748b;
  --secondary-600: #475569;
  
  --success-500: #10b981;
  --warning-500: #f59e0b;
  --error-500: #ef4444;
}
```

### Composants UI Réutilisables
```jsx
// Bouton avec variantes
const Button = ({ variant = 'primary', size = 'md', children, ...props }) => {
  const baseClasses = 'font-medium rounded-lg transition-colors';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Responsive Breakpoints
```css
/* Configuration Tailwind responsive */
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // Mobile large
      'md': '768px',   // Tablette
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large desktop
      '2xl': '1536px'  // Extra large
    }
  }
}
```

## 🔄 Gestion d'État

### Store d'Authentification (Zustand)
```javascript
// stores/authStore.js
export const useAuthStore = create((set, get) => ({
  // État initial
  authState: 'logged_out',
  user: null,
  loading: false,
  error: null,

  // Actions
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.loginExistingUser(email, password);
      set({
        authState: 'awaiting_2fa',
        tempToken: response.data.tempToken,
        loading: false
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  verify2FA: async (code) => {
    const { tempToken } = get();
    try {
      const response = await authAPI.verify2FA(tempToken, code);
      set({
        authState: 'logged_in',
        user: response.data.user,
        tempToken: null
      });
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Vérification du statut d'authentification au démarrage
  checkAuthStatus: async () => {
    try {
      const response = await authAPI.getCurrentUser();
      set({
        authState: 'logged_in',
        user: response.data.user
      });
    } catch {
      set({ authState: 'logged_out' });
    }
  }
}));
```

### Store de la Bibliothèque
```javascript
// stores/bookStore.js
export const useBookStore = create((set, get) => ({
  books: [],
  cart: [],
  filters: {
    search: '',
    category: 'all',
    priceRange: [0, 100]
  },

  // Actions
  setBooks: (books) => set({ books }),
  
  addToCart: (book) => {
    const { cart } = get();
    const existingItem = cart.find(item => item.id === book.id);
    
    if (existingItem) {
      set({
        cart: cart.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      set({ cart: [...cart, { ...book, quantity: 1 }] });
    }
  },

  updateFilters: (newFilters) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    }));
  }
}));
```

## 🌐 API Integration

### Configuration Axios
```javascript
// services/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Important pour les cookies
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur de requête
api.interceptors.request.use(
  (config) => {
    // Ajout automatique du token si disponible
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse avec refresh automatique
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        // Redirection vers login si refresh échoue
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

### Services API
```javascript
// Services d'authentification
export const authAPI = {
  checkEmail: (email) => api.post('/auth/check-email', { email }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  verify2FA: (tempToken, code) => api.post('/auth/verify-2fa', { tempToken, code }),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
};

// Services de la bibliothèque
export const libraryAPI = {
  getBooks: (filters) => api.get('/library/books', { params: filters }),
  getBook: (id) => api.get(`/library/books/${id}`),
  addToCart: (bookId) => api.post('/library/cart', { bookId }),
  getCart: () => api.get('/library/cart')
};
```

## 📱 Responsive Design

### Mobile-First Approach
```jsx
// Composant responsive avec Tailwind
const ResponsiveCard = ({ title, content }) => {
  return (
    <div className="
      w-full                    // Mobile: largeur complète
      sm:w-1/2                  // Tablette: 50% de largeur
      lg:w-1/3                  // Desktop: 33% de largeur
      p-4                       // Padding uniforme
      sm:p-6                    // Plus de padding sur tablette+
      bg-white                  // Fond blanc
      rounded-lg                // Coins arrondis
      shadow-sm                 // Ombre légère
      hover:shadow-md           // Ombre plus forte au hover
      transition-shadow         // Transition fluide
      duration-200              // Durée detransition
    ">
      <h3 className="text-lg sm:text-xl font-semibold mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm sm:text-base">
        {content}
      </p>
    </div>
  );
};
```

### Navigation Adaptive
```jsx
// Navbar responsive
const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img className="h-8 w-auto" src="/logo.svg" alt="ProjectMoney" />
          </div>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/dashboard">Tableau de bord</NavLink>
            <NavLink to="/library">Bibliothèque</NavLink>
            <NavLink to="/events">Événements</NavLink>
          </div>

          {/* Bouton menu mobile */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavLink to="/dashboard">Tableau de bord</MobileNavLink>
              <MobileNavLink to="/library">Bibliothèque</MobileNavLink>
              <MobileNavLink to="/events">Événements</MobileNavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
```

## 🧪 Tests

### Configuration des Tests
```javascript
// vite.config.js - Configuration test
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true
  }
});
```

### Tests de Composants
```javascript
// tests/components/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  test('affiche le texte du bouton', () => {
    render(<Button>Cliquer ici</Button>);
    expect(screen.getByText('Cliquer ici')).toBeInTheDocument();
  });

  test('appelle onClick lors du clic', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Cliquer</Button>);
    
    fireEvent.click(screen.getByText('Cliquer'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applique la variante correcte', () => {
    render(<Button variant="secondary">Bouton</Button>);
    const button = screen.getByText('Bouton');
    expect(button).toHaveClass('bg-gray-200');
  });
});
```

### Tests des Stores
```javascript
// tests/stores/authStore.test.js
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/stores/authStore';

describe('Auth Store', () => {
  beforeEach(() => {
    useAuthStore.getState().reset(); // Reset du store
  });

  test('état initial correct', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.authState).toBe('logged_out');
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  test('login met à jour l\'état', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.authState).toBe('awaiting_2fa');
    expect(result.current.loading).toBe(false);
  });
});
```

## 🏗️ Build & Déploiement

### Scripts NPM
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext js,jsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,json,css,md}\"",
    "analyze": "npx vite-bundle-analyzer"
  }
}
```

### Build de Production
```bash
# Build optimisé pour la production
npm run build

# Prévisualisation du build
npm run preview

# Analyse de la taille du bundle
npm run analyze
```

### Optimisations de Build
```javascript
// vite.config.js - Optimisations
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Séparation des chunks pour un meilleur cache
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          store: ['zustand'],
          ui: ['@headlessui/react', 'lucide-react']
        }
      }
    },
    // Optimisation des assets
    assetsInlineLimit: 4096,
    // Source maps pour le debugging
    sourcemap: true,
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Supprimer les console.log en prod
        drop_debugger: true
      }
    }
  }
});
```

### Déploiement avec Docker
```dockerfile
# Dockerfile optimisé pour le frontend
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Variables d'Environnement de Production
```bash
# .env.production
VITE_API_BASE_URL=https://api.projectmoney.com
VITE_APP_URL=https://app.projectmoney.com
VITE_NODE_ENV=production
VITE_DEBUG_MODE=false
VITE_ENABLE_PWA=true
```

## 🚀 Performance

### Métriques Cibles
- **First Contentful Paint** < 1.5s
- **Largest Contentful Paint** < 2.5s
- **Cumulative Layout Shift** < 0.1
- **Time to Interactive** < 3.5s

### Optimisations Implémentées
```jsx
// Lazy loading des composants
const LibraryPage = lazy(() => import('@/pages/LibraryPage'));
const EventsPage = lazy(() => import('@/pages/EventsPage'));

// Suspense avec fallback
<Suspense fallback={<PageSkeleton />}>
  <Routes>
    <Route path="/library" element={<LibraryPage />} />
    <Route path="/events" element={<EventsPage />} />
  </Routes>
</Suspense>

// Memoization des composants coûteux
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => processItem(item));
  }, [data]);

  return <DataVisualization data={processedData} />;
});
```

---

<div align="center">

**🎨 Interface moderne et performante pour ProjectMoney**

[Retour au projet principal](../README.md) • [Backend](../server/README.md) • [Démo Live](https://projectmoney.com)

</div>