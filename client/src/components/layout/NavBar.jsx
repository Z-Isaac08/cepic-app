/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, Info, Users, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuthStore } from "../../stores/authStore";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  const navigation = [
    { name: "Accueil", href: "/", icon: Calendar },
    { name: "À propos", href: "/about", icon: Info },
    { name: "Programme", href: "/program", icon: Clock },
    { name: "Intervenants", href: "/speakers", icon: Users },
  ];

  const isActive = (path) => location.pathname === path;

  // Scroll detection pour faire apparaître/disparaître la NavBar
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const scrollPosition = window.scrollY;

      // La NavBar apparaît quand on dépasse 80% de la hauteur du hero
      setIsVisible(scrollPosition > heroHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);

    // Check initial position
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed w-full z-50 bg-white/95 backdrop-blur-sm shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 w-full">
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center space-x-2"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center"
                >
                  <Calendar className="w-6 h-6 text-white" />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gradient">
                    ProjectMoney
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:block">
                    Gestion Financière
                  </span>
                </div>
              </Link>

              {/* Navigation et Admin */}
              <div className="flex items-center space-x-4">
                {/* Lien Admin pour les administrateurs */}
                {user && user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}

                {/* Informations utilisateur */}
                {user && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="hidden md:inline">
                      {user.firstName} {user.lastName}
                    </span>
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                  </div>
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
