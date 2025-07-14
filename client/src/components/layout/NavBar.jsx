/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, Info, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

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
            <div className="flex justify-center items-center h-16">
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center justify-center space-x-2"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center"
                >
                  <Calendar className="w-6 h-6 text-white" />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gradient">
                    Lorem Ipsum Conf
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:block">
                    15 Septembre 2025
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default NavBar;
