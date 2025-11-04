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
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-lg shadow p-4 flex items-center space-x-4"
            >
              <Icon className={`w-8 h-8 ${stat.color}`} />
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Inscriptions récentes</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-800" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Jean Dupont</p>
                    <p className="text-xs text-gray-500">Gestion de projet avancée</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">Il y a 2h</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Popular Trainings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Formations populaires</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-secondary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Management de projet</p>
                    <p className="text-xs text-gray-500">245 inscrits</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-green-600">+15%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-xl shadow-lg p-6 text-white"
      >
        <h3 className="text-xl font-bold mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all text-center">
            <GraduationCap className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm font-medium">Nouvelle formation</span>
          </button>
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all text-center">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm font-medium">Gérer utilisateurs</span>
          </button>
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all text-center">
            <MessageSquare className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm font-medium">Messages</span>
          </button>
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm font-medium">Statistiques</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
