import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  GraduationCap,
  TrendingUp,
  DollarSign,
  Eye,
  UserCheck,
  BookOpen,
  MessageSquare,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useAdminStore } from '../../stores/adminStore';

const DashboardOverview = () => {
  const {
    dashboardData,
    loading,
    trainings,
    enrollments,
    fetchDashboardData,
    fetchTrainings,
    fetchEnrollments,
  } = useAdminStore();

  useEffect(() => {
    fetchDashboardData();
    fetchTrainings();
    // Ne charger que les 5 dernières inscriptions pour l'affichage
    fetchEnrollments({ limit: 5, page: 1 });
  }, [fetchDashboardData, fetchTrainings, fetchEnrollments]);

  // Les inscriptions récentes viennent directement du store (déjà limitées à 5)
  const recentEnrollments = enrollments;

  // Formations populaires (triées par nombre d'inscriptions)
  const popularTrainings = useMemo(() => {
    return [...trainings]
      .sort((a, b) => (b._count?.enrollments_rel || 0) - (a._count?.enrollments_rel || 0))
      .slice(0, 5);
  }, [trainings]);

  const loadingExtra = loading && !trainings.length;

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  const stats = dashboardData || {};

  const userStats = stats.userStats || {};
  const systemHealth = stats.systemHealth || {};
  const recent = stats.recent || {};

  const statCards = [
    {
      title: 'Utilisateurs',
      value: userStats.totalUsers || 0,
      change: userStats.userGrowth ? `+${userStats.userGrowth.toFixed(1)}%` : '+0%',
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-500'
    },
    {
      title: 'Formations',
      value: recent.totalTrainings || 0,
      change: '+3',
      icon: GraduationCap,
      color: 'purple',
      bgColor: 'bg-purple-500'
    },
    {
      title: 'Inscriptions',
      value: recent.eventRegistrations || 0,
      change: '+18%',
      icon: UserCheck,
      color: 'green',
      bgColor: 'bg-green-500'
    },
    {
      title: 'Revenus',
      value: recent.completedTransactions ? `${(recent.completedTransactions / 100).toFixed(0)}K FCFA` : '0 FCFA',
      change: '+25%',
      icon: DollarSign,
      color: 'yellow',
      bgColor: 'bg-secondary-500'
    }
  ];

  const secondaryStats = [
    {
      label: 'Utilisateurs actifs',
      value: userStats.activeUsers || 0,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      label: 'En ligne',
      value: stats.onlineUsers || 0,
      icon: MessageSquare,
      color: 'text-orange-600'
    },
    {
      label: 'Nouveaux ce mois',
      value: userStats.newUsersThisMonth || 0,
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      label: 'Vérifiés',
      value: userStats.verifiedUsers || 0,
      icon: Eye,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">{stat.title}</h3>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        {secondaryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-lg shadow-sm sm:shadow p-3 sm:p-4 flex items-center space-x-2 sm:space-x-4"
            >
              <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color} flex-shrink-0`} />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">{stat.label}</p>
                <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Enrollments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6"
        >
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Inscriptions récentes</h3>
          <div className="space-y-2 sm:space-y-3">
            {loadingExtra ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
              </div>
            ) : recentEnrollments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p className="text-sm">Aucune inscription récente</p>
              </div>
            ) : (
              recentEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary-800" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {enrollment.user?.firstName} {enrollment.user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{enrollment.training?.title || 'Formation'}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                    {formatTimeAgo(enrollment.enrolledAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Popular Trainings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6"
        >
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Formations populaires</h3>
          <div className="space-y-2 sm:space-y-3">
            {loadingExtra ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
              </div>
            ) : popularTrainings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p className="text-sm">Aucune formation disponible</p>
              </div>
            ) : (
              popularTrainings.map((training, index) => (
                <div key={training.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-secondary-600">#{index + 1}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{training.title}</p>
                      <p className="text-xs text-gray-500">
                        {training._count?.enrollments_rel || 0} inscrits
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold flex-shrink-0 ml-2 ${training.isPublished ? 'text-green-600' : 'text-orange-500'}`}>
                    {training.isPublished ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

    </div>
  );
};

// Helper pour formater le temps relatif
const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins}min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return date.toLocaleDateString('fr-FR');
};

export default DashboardOverview;
