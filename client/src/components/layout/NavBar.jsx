/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  ChevronDown,
  GraduationCap,
  Heart,
  Home,
  Image,
  Info,
  LogOut,
  Mail,
  Settings,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuthStore } from '../../stores/authStore';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const navigation = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Formations', href: '/formations', icon: BookOpen },
    { name: 'À propos', href: '/a-propos', icon: Info },
    { name: 'Galerie', href: '/galerie', icon: Image },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  const isActive = (path) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  // Scroll detection pour faire apparaître/disparaître la NavBar
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollPosition = window.scrollY;

      // La NavBar apparaît quand on dépasse 80% de la hauteur du hero
      setIsVisible(scrollPosition > heroHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);

    // Check initial position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed w-full z-50 bg-white/95 backdrop-blur-sm shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 w-full">
              {/* Logo CEPIC */}
              <Link to="/" className="flex items-center space-x-2">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src="/logo.jpg"
                  alt="CEPIC"
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-primary-800">CEPIC</span>
                  <span className="text-xs text-gray-500 hidden sm:block">
                    Excellence en Formation
                  </span>
                </div>
              </Link>

              {/* Navigation et Admin */}
              <div className="flex items-center space-x-4">
                {/* Liens de navigation */}
                <div className="hidden md:flex items-center space-x-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'text-primary-800 bg-primary-50'
                          : 'text-gray-700 hover:text-primary-800 hover:bg-primary-50'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>

                {/* Lien Admin pour les administrateurs */}
                {user && user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-800 hover:bg-primary-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}

                {/* Informations utilisateur */}
                {user ? (
                  <div className="relative user-menu-container">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-2 text-sm text-gray-700 hover:text-primary-800 transition-colors"
                    >
                      <span className="hidden md:inline font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                      <div className="w-8 h-8 bg-primary-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.firstName?.charAt(0)}
                        {user.lastName?.charAt(0)}
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                        <Link
                          to="/mes-inscriptions"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                        >
                          <GraduationCap className="w-4 h-4" />
                          <span>Mes Inscriptions</span>
                        </Link>
                        <Link
                          to="/favoris"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span>Mes Favoris</span>
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={async () => {
                            await logout();
                            setUserMenuOpen(false);
                            navigate('/connexion');
                          }}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Déconnexion</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/connexion"
                    className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-800 hover:bg-primary-900 transition-colors"
                  >
                    Connexion
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default NavBar;
