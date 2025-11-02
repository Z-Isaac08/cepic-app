import { useState } from 'react';
import { Navigate } from 'react-router';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

// Import admin components (to be created)
import DashboardOverview from '../components/admin/DashboardOverview';
import TrainingsManagement from '../components/admin/TrainingsManagement';
import UsersManagement from '../components/admin/UsersManagement';
import CategoriesManagement from '../components/admin/CategoriesManagement';
import GalleryManagement from '../components/admin/GalleryManagement';
import MessagesManagement from '../components/admin/MessagesManagement';
import SettingsPanel from '../components/admin/SettingsPanel';
import AnalyticsPanel from '../components/admin/AnalyticsPanel';

const AdminPage = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check if user is admin
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'trainings', label: 'Formations', icon: GraduationCap },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'categories', label: 'Catégories', icon: BookOpen },
    { id: 'gallery', label: 'Galerie', icon: ImageIcon },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytiques', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'trainings':
        return <TrainingsManagement />;
      case 'users':
        return <UsersManagement />;
      case 'categories':
        return <CategoriesManagement />;
      case 'gallery':
        return <GalleryManagement />;
      case 'messages':
        return <MessagesManagement />;
      case 'analytics':
        return <AnalyticsPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <DashboardOverview />;
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-primary-900 to-primary-800 text-white shadow-xl transition-transform duration-300`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-primary-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CEPIC Admin</h1>
              <p className="text-xs text-primary-200">Gestion de la plateforme</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-secondary-500 text-primary-900 shadow-lg'
                    : 'text-primary-100 hover:bg-primary-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-primary-300 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {menuItems.find(item => item.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-gray-500">
                  Gérez votre plateforme de formation
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-primary-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-primary-800 font-medium">En ligne</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminPage;
