const prisma = require('../lib/prisma');

// Obtenir les statistiques du dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    // Statistiques utilisateurs
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({
      where: {
        isActive: true,
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 jours
        }
      }
    });
    const verifiedUsers = await prisma.user.count({
      where: { isVerified: true }
    });

    // Croissance utilisateurs (30 derniers jours vs 30 jours précédents)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    const newUsersLast30 = await prisma.user.count({
      where: {
        createdAt: { gte: thirtyDaysAgo }
      }
    });
    const newUsersPrev30 = await prisma.user.count({
      where: {
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }
      }
    });

    const userGrowth = calculateGrowthRate(newUsersLast30, newUsersPrev30);

    // Statistiques de sécurité
    const securityStats = await getSecurityStats();

    // Métriques système (simulées - à implémenter avec de vrais outils de monitoring)
    const systemHealth = {
      status: 'healthy',
      uptime: '99.9%',
      avgResponseTime: '120ms',
      cpuUsage: '45%',
      memoryUsage: '62%',
      diskUsage: '34%',
      activeConnections: Math.floor(Math.random() * 100) + 50
    };

    // Activité récente
    const recentActivity = {
      newUsers: newUsersLast30,
      completedTransactions: Math.floor(Math.random() * 150) + 50, // À remplacer par vraies données
      eventRegistrations: Math.floor(Math.random() * 80) + 20
    };


    res.status(200).json({
      success: true,
      data: {
        userStats: {
          totalUsers,
          activeUsers,
          verifiedUsers,
          newUsersThisMonth: newUsersLast30,
          userGrowth,
          activeUserGrowth: calculateGrowthRate(activeUsers, Math.floor(activeUsers * 0.9)) // Simulé
        },
        security: securityStats,
        systemHealth,
        recent: recentActivity,
        onlineUsers: Math.floor(Math.random() * 50) + 10,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir la liste des utilisateurs avec filtres
const getUsers = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      search, 
      status, 
      role,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Construction des filtres
    const where = {};
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;
    if (status === 'verified') where.isVerified = true;
    if (status === 'unverified') where.isVerified = false;
    if (role) where.role = role;

    // Récupération des utilisateurs
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          isVerified: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true
        },
        skip,
        take: parseInt(limit),
        orderBy: {
          [sortBy]: sortOrder
        }
      }),
      prisma.user.count({ where })
    ]);


    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          hasNext: skip + users.length < totalCount,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Mettre à jour le statut d'un utilisateur
const updateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isActive, isVerified } = req.body;

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, isActive: true, isVerified: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    // Empêcher l'admin de se désactiver lui-même
    if (userId === req.user.id && isActive === false) {
      return res.status(400).json({
        success: false,
        error: 'Vous ne pouvez pas vous désactiver vous-même'
      });
    }

    // Mettre à jour l'utilisateur
    const updateData = {};
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (typeof isVerified === 'boolean') updateData.isVerified = isVerified;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        isVerified: true
      }
    });


    res.status(200).json({
      success: true,
      data: { user: updatedUser },
      message: 'Statut utilisateur mis à jour avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    // Empêcher la suppression de son propre compte
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }

    // Empêcher la suppression d'autres admins (optionnel)
    if (user.role === 'ADMIN') {
      return res.status(400).json({
        success: false,
        error: 'Impossible de supprimer un autre administrateur'
      });
    }

    // Supprimer l'utilisateur et toutes ses données liées
    await prisma.$transaction(async (tx) => {
      // Supprimer les sessions
      await tx.session.deleteMany({
        where: { userId }
      });

      // Supprimer les codes 2FA
      await tx.twoFACode.deleteMany({
        where: { userId }
      });

      // Supprimer les logs d'audit (optionnel)
      await tx.auditLog.deleteMany({
        where: { userId }
      });

      // Supprimer l'utilisateur
      await tx.user.delete({
        where: { id: userId }
      });
    });


    res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir les statistiques de sécurité
const getSecurityLogs = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      type, 
      userId,
      startDate,
      endDate
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Construction des filtres
    const where = {};
    if (type) where.action = { contains: type };
    if (userId) where.userId = userId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [logs, totalCount] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.auditLog.count({ where })
    ]);


    res.status(200).json({
      success: true,
      data: {
        logs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir les statistiques du système
const getSystemHealth = async (req, res, next) => {
  try {
    // Métriques de base de données
    const dbStats = await getDatabaseStats();
    
    // Métriques de performance (simulées - à implémenter avec de vrais outils)
    const performanceMetrics = {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      version: process.version,
      platform: process.platform
    };

    // Statut des services
    const serviceStatus = {
      database: 'healthy',
      redis: 'healthy', // À implémenter si Redis est utilisé
      email: 'healthy',
      storage: 'healthy'
    };


    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        database: dbStats,
        performance: performanceMetrics,
        services: serviceStatus,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir les analytics
const getAnalytics = async (req, res, next) => {
  try {
    const { timeRange = '7d', metric = 'users' } = req.query;

    // Calculer les dates en fonction de la période
    const { startDate, endDate } = calculateDateRange(timeRange);

    let data = [];

    switch (metric) {
      case 'users':
        data = await getUserAnalytics(startDate, endDate, timeRange);
        break;
      case 'revenue':
        data = await getRevenueAnalytics(startDate, endDate, timeRange);
        break;
      case 'transactions':
        data = await getTransactionAnalytics(startDate, endDate, timeRange);
        break;
      case 'events':
        data = await getEventAnalytics(startDate, endDate, timeRange);
        break;
      default:
        data = await getUserAnalytics(startDate, endDate, timeRange);
    }


    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// Fonctions utilitaires

const calculateGrowthRate = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100 * 100) / 100;
};

const getSecurityStats = async () => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const [totalLogins, failedAttempts] = await Promise.all([
    prisma.auditLog.count({
      where: {
        action: { contains: 'login_success' },
        createdAt: { gte: oneDayAgo }
      }
    }),
    prisma.auditLog.count({
      where: {
        action: { contains: 'login_failed' },
        createdAt: { gte: oneDayAgo }
      }
    })
  ]);

  return {
    totalLogins,
    failedAttempts,
    blockedIPs: Math.floor(Math.random() * 10), // À implémenter avec un vrai système de blocage
    suspiciousActivity: Math.floor(Math.random() * 5)
  };
};

const getDatabaseStats = async () => {
  const [userCount, sessionCount, auditLogCount] = await Promise.all([
    prisma.user.count(),
    prisma.session.count(),
    prisma.auditLog.count()
  ]);

  return {
    totalUsers: userCount,
    activeSessions: sessionCount,
    auditLogs: auditLogCount,
    connectionStatus: 'connected'
  };
};

const calculateDateRange = (timeRange) => {
  const now = new Date();
  let startDate;

  switch (timeRange) {
    case '24h':
      startDate = new Date(now - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      startDate = new Date(now - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
  }

  return { startDate, endDate: now };
};

const getUserAnalytics = async (startDate, endDate, timeRange) => {
  // Simplification pour la démonstration - à implémenter avec de vraies requêtes groupées
  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      createdAt: true
    }
  });

  // Grouper par période selon le timeRange
  return groupDataByPeriod(users, timeRange, 'createdAt');
};

const getRevenueAnalytics = async (startDate, endDate, timeRange) => {
  // Données simulées - à remplacer par de vraies données de revenus
  return generateMockAnalytics(timeRange, 'revenue');
};

const getTransactionAnalytics = async (startDate, endDate, timeRange) => {
  // Données simulées - à remplacer par de vraies données de transactions
  return generateMockAnalytics(timeRange, 'transactions');
};

const getEventAnalytics = async (startDate, endDate, timeRange) => {
  // Données simulées - à remplacer par de vraies données d'événements
  return generateMockAnalytics(timeRange, 'events');
};

const groupDataByPeriod = (data, timeRange, dateField) => {
  // Simplification - à implémenter avec une vraie logique de groupement
  const periods = {
    '24h': 24,
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '1y': 12
  };

  const periodCount = periods[timeRange] || 7;
  
  return Array.from({ length: periodCount }, (_, i) => ({
    label: `P${i + 1}`,
    value: Math.floor(Math.random() * 50) + 10,
    date: new Date(Date.now() - (periodCount - i) * 24 * 60 * 60 * 1000)
  }));
};

const generateMockAnalytics = (timeRange, type) => {
  const periods = {
    '24h': 24,
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '1y': 12
  };

  const periodCount = periods[timeRange] || 7;
  const multiplier = type === 'revenue' ? 100 : 1;
  
  return Array.from({ length: periodCount }, (_, i) => ({
    label: `P${i + 1}`,
    value: (Math.floor(Math.random() * 50) + 10) * multiplier,
    date: new Date(Date.now() - (periodCount - i) * 24 * 60 * 60 * 1000)
  }));
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  deleteUser,
  getSecurityLogs,
  getSystemHealth,
  getAnalytics
};