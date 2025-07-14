import ErrorBoundary from "@components/ErrorBoundary/ErrorBoundary";
import Layout from "@components/Layout/Layout";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";

// Pages dynamiques
const HomePage = lazy(() => import("@pages/HomePage"));
// const DataPage = lazy(() => import("@pages/Data/DataPage"));
// const EntreprisePage = lazy(() => import("@pages/Entreprise/EntreprisePage"));
// const QuadrantsPage = lazy(() => import("@pages/Quadrants/QuadrantsPage"));
// const AlertePage = lazy(() => import("@pages/Alertes/AlertePage"));
// const SignUpPage = lazy(() => import("@pages/Auth/SignUpPage"));
// const LoginPage = lazy(() => import("@pages/Auth/LoginPage"));
// const SettingsPage = lazy(() => import("@pages/Settings/SettingsPage"));

const AppContent = () => {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <div className="w-8 h-8 border-4 border-normal-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/donnees" element={<DataPage />} />
            <Route path="/entreprises" element={<EntreprisePage />} />
            <Route
              path="/entreprises/:slug"
              element={<EnterpriseDetailPage />}
            />
            <Route path="/quadrants" element={<QuadrantsPage />} />
            <Route path="/alertes" element={<AlertePage />} />
            <Route path="/parametres" element={<SettingsPage />} /> */}
          </Routes>
        </Layout>
      </Suspense>
    </ErrorBoundary>
  );
};

function App() {
  return <AppContent />;
}

export default App;
