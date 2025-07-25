import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import ErrorBoundary from "./components/errorboundary/ErrorBoundary";
import Layout from "./components/layout/Layout";

// Pages dynamiques
const HomePage = lazy(() => import("@pages/HomePage"));
const LibraryPage = lazy(() => import("@pages/LibraryPage"));

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
            <Route path="/librairie" element={<LibraryPage />} />
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
