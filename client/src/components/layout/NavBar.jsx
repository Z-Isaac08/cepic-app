/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, Info, Menu, UserPlus, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import Button from "../ui/Button";

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
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
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

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? "text-primary-600 bg-primary-50"
                        : "text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* CTA Button */}
              <div className="hidden md:flex items-center space-x-4">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    // Scroll vers le hero et déclencher l'inscription
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setTimeout(() => {
                      const event = new CustomEvent("openRegistration");
                      window.dispatchEvent(event);
                    }, 500);
                  }}
                  className="flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>S'inscrire</span>
                </Button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white border-t border-gray-200"
              >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? "text-primary-600 bg-primary-50"
                          : "text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 pb-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full flex items-center justify-center space-x-2"
                      onClick={() => {
                        setIsOpen(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setTimeout(() => {
                          const event = new CustomEvent("openRegistration");
                          window.dispatchEvent(event);
                        }, 500);
                      }}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>S'inscrire à l'événement</span>
                    </Button>
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
