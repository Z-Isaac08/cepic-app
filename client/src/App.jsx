import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router";
import ErrorBoundary from "./components/errorboundary/ErrorBoundary";
import Layout from "./components/layout/Layout";
import { useAuthStore } from "./stores/authStore";

// Pages dynamiques
const HomePage = lazy(() => import("@pages/HomePage"));
const MyBooksPage = lazy(() => import("@pages/MyBooksPage"));
const AdminPage = lazy(() => import("@pages/AdminPage"));

// Pages CEPIC
const TrainingsPage = lazy(() => import("@pages/TrainingsPage"));
const TrainingDetailPage = lazy(() => import("@pages/TrainingDetailPage"));
const AboutPage = lazy(() => import("@pages/AboutPage"));
const GalleryPage = lazy(() => import("@pages/GalleryPage"));
const ContactPage = lazy(() => import("@pages/ContactPage"));
const MyEnrollmentsPage = lazy(() => import("@pages/MyEnrollmentsPage"));
const EnrollPage = lazy(() => import("@pages/EnrollPage"));
const FavoritesPage = lazy(() => import("@pages/FavoritesPage"));

// Auth Pages
const LoginPage = lazy(() => import("@pages/LoginPage"));
const RegisterPage = lazy(() => import("@pages/RegisterPage"));

const AppContent = () => {
  const { checkAuth, loading } = useAuthStore();

  useEffect(() => {
    // Check authentication on app startup
    checkAuth();
  }, [checkAuth]);

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-normal-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <div className="w-8 h-8 border-4 border-normal-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <Routes>
          {/* Routes publiques avec layout */}
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          
          {/* Routes CEPIC - Formations */}
          <Route
            path="/formations"
            element={
              <Layout>
                <TrainingsPage />
              </Layout>
            }
          />
          <Route
            path="/formations/:id"
            element={
              <Layout>
                <TrainingDetailPage />
              </Layout>
            }
          />
          
          {/* Routes CEPIC - Pages */}
          <Route
            path="/a-propos"
            element={
              <Layout>
                <AboutPage />
              </Layout>
            }
          />
          <Route
            path="/galerie"
            element={
              <Layout>
                <GalleryPage />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout>
                <ContactPage />
              </Layout>
            }
          />
          
          {/* Routes Auth (sans layout) */}
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/inscription" element={<RegisterPage />} />
          
          {/* Routes protégées */}
          <Route path="/enroll/:id" element={<EnrollPage />} />
          <Route
            path="/mes-inscriptions"
            element={
              <Layout>
                <MyEnrollmentsPage />
              </Layout>
            }
          />
          <Route
            path="/favoris"
            element={
              <Layout>
                <FavoritesPage />
              </Layout>
            }
          />

          {/* Route admin sans layout */}
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

function App() {
  return <AppContent />;
}

export default App;
