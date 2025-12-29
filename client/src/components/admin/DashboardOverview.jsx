import { useEffect } from 'react';
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
  RefreshCw
} from 'lucide-react';
import { useAdminStore } from '../../stores/adminStore';

const DashboardOverview = () => {
  const { dashboardData, loading, fetchDashboardData } = useAdminStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary-800" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">Jean Dupont</p>
                    <p className="text-xs text-gray-500 truncate">Gestion de projet avancée</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">Il y a 2h</span>
              </div>
            ))}
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
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">Management de projet</p>
                    <p className="text-xs text-gray-500">245 inscrits</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-green-600 flex-shrink-0 ml-2">+15%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default DashboardOverview;
