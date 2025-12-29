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
  Menu,
  Settings,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuthStore } from '../../stores/authStore';

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
      if (mobileMenuOpen && !event.target.closest('.mobile-menu-container') && !event.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen, mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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
            <div className="flex justify-between items-center h-14 sm:h-16 w-full">
              {/* Logo CEPIC */}
              <Link to="/" className="flex items-center space-x-2 min-h-[44px]">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src="/logo.jpg"
                  alt="CEPIC"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-bold text-primary-800">CEPIC</span>
                  <span className="text-[10px] sm:text-xs text-gray-500 hidden xs:block">
                    Excellence en Formation
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
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

              {/* Right side actions */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Admin Link - Desktop */}
                {user && user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="hidden sm:flex items-center space-x-2 px-3 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:text-primary-800 hover:bg-primary-50 transition-colors min-h-[44px]"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden md:inline">Admin</span>
                  </Link>
                )}

                {/* User Menu */}
                {user ? (
                  <div className="relative user-menu-container">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-2 text-sm text-gray-700 hover:text-primary-800 transition-colors min-h-[44px] px-2"
                    >
                      <span className="hidden lg:inline font-medium max-w-[120px] truncate">
                        {user.firstName} {user.lastName}
                      </span>
                      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary-800 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium flex-shrink-0">
                        {user.firstName?.charAt(0)}
                        {user.lastName?.charAt(0)}
                      </div>
                      <ChevronDown className="w-4 h-4 hidden sm:block" />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 sm:w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100"
                        >
                          {/* Mobile: Show user name */}
                          <div className="lg:hidden px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>

                          {/* Admin link for mobile */}
                          {user.role === 'ADMIN' && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="sm:hidden flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                            >
                              <Settings className="w-5 h-5" />
                              <span>Administration</span>
                            </Link>
                          )}

                          <Link
                            to="/mes-formations"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                          >
                            <GraduationCap className="w-5 h-5" />
                            <span>Mes Formations</span>
                          </Link>
                          <Link
                            to="/favoris"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                          >
                            <Heart className="w-5 h-5" />
                            <span>Mes Favoris</span>
                          </Link>
                          <hr className="my-2" />
                          <button
                            onClick={async () => {
                              await logout();
                              setUserMenuOpen(false);
                              navigate('/connexion');
                            }}
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <LogOut className="w-5 h-5" />
                            <span>Déconnexion</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to="/connexion"
                    className="hidden sm:flex px-4 py-2.5 rounded-md text-sm font-medium text-white bg-primary-800 hover:bg-primary-900 transition-colors min-h-[44px] items-center"
                  >
                    Connexion
                  </Link>
                )}

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden flex items-center justify-center w-11 h-11 rounded-md text-gray-700 hover:text-primary-800 hover:bg-primary-50 transition-colors mobile-menu-button"
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden bg-white border-t border-gray-100 shadow-lg mobile-menu-container overflow-hidden"
              >
                <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
                  <div className="px-4 py-3 space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3.5 rounded-lg text-base font-medium transition-colors ${
                          isActive(item.href)
                            ? 'text-primary-800 bg-primary-50'
                            : 'text-gray-700 hover:text-primary-800 hover:bg-primary-50 active:bg-primary-100'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    ))}

                    {/* Mobile: Connection button if not logged in */}
                    {!user && (
                      <div className="pt-3 border-t border-gray-100 mt-3">
                        <Link
                          to="/connexion"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-center w-full px-4 py-3.5 rounded-lg text-base font-medium text-white bg-primary-800 hover:bg-primary-900 active:bg-primary-950 transition-colors"
                        >
                          Connexion
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default NavBar;
