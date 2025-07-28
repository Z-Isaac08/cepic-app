import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import AnalyticsCharts from "../components/admin/AnalyticsCharts";
import SecurityAudit from "../components/admin/SecurityAudit";
import StatsOverview from "../components/admin/StatsOverview";
import SystemHealth from "../components/admin/SystemHealth";
import UserManagement from "../components/admin/UserManagement";
import Loading from "../components/ui/Loading";
import { useAdminStore } from "../stores/adminStore";
import { useAuthStore } from "../stores/authStore";

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const {
    dashboardData,
    loading,
    error,
    fetchDashboardData,
    fetchUserStats,
    fetchSystemHealth,
    fetchSecurityLogs,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    // Charger toutes les données au démarrage
    const loadData = async () => {
      await Promise.all([
        fetchDashboardData(),
        fetchUserStats(),
        fetchSystemHealth(),
        fetchSecurityLogs(),
      ]);
    };

    loadData();

    // Actualisation automatique toutes les 30 secondes
    const interval = setInterval(loadData, 30000);
    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    fetchDashboardData,
    fetchUserStats,
    fetchSystemHealth,
    fetchSecurityLogs,
  ]);
  // Vérifier si l'utilisateur est admin
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  const tabs = [
    { id: "overview", label: "Vue d'ensemble" },
    { id: "users", label: "Utilisateurs" },
    { id: "analytics", label: "Analytics" },
    { id: "security", label: "Sécurité" },
    { id: "system", label: "Système" },
  ];

  const handleRefresh = async () => {
    await Promise.all([
      fetchDashboardData(),
      fetchUserStats(),
      fetchSystemHealth(),
      fetchSecurityLogs(),
    ]);
  };

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Chargement du tableau de bord..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tableau de Bord Admin
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestion et statistiques globales de ProjectMoney
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Indicateur de statut */}
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    dashboardData?.systemHealth?.status === "healthy"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  {dashboardData?.systemHealth?.status === "healthy"
                    ? "Système en ligne"
                    : "Problème détecté"}
                </span>
              </div>

              {/* Bouton actualiser */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw
                  className={`-ml-1 mr-2 h-4 w-4 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                Actualiser
              </button>
            </div>
          </div>

          {/* Navigation par onglets */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erreur de chargement
                </h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Contenu des onglets */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <StatsOverview data={dashboardData} loading={loading} />
          )}

          {activeTab === "users" && (
            <UserManagement
              userStats={dashboardData?.userStats}
              loading={loading}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsCharts
              analytics={dashboardData?.analytics}
              loading={loading}
            />
          )}

          {activeTab === "security" && (
            <SecurityAudit
              securityLogs={dashboardData?.securityLogs}
              loading={loading}
            />
          )}

          {activeTab === "system" && (
            <SystemHealth
              systemHealth={dashboardData?.systemHealth}
              loading={loading}
            />
          )}
        </div>
      </div>

      {/* Footer avec informations de dernière mise à jour */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-gray-500">
          <span>
            Dernière mise à jour:{" "}
            {dashboardData?.lastUpdated
              ? new Date(dashboardData.lastUpdated).toLocaleString("fr-FR")
              : "Jamais"}
          </span>
          <span>Utilisateurs en ligne: {dashboardData?.onlineUsers || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
