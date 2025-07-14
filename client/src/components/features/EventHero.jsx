/* eslint-disable no-unused-vars */
import { useEventStore } from "@stores/eventStore";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Percent,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../ui/Button";
import RegistrationSteps from "./RegistrationSteps";

const EventHero = () => {
  const navigate = useNavigate();
  const { event, getAvailableSpots, getDiscountPercentage, isSoldOut } =
    useEventStore();
  const [showRegistration, setShowRegistration] = useState(false);

  const availableSpots = getAvailableSpots();
  const discount = getDiscountPercentage();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price);
  };

  const handleRegistrationClick = () => {
    if (!isSoldOut()) {
      setShowRegistration(true);
    }
  };

  const handleBackToHero = () => {
    setShowRegistration(false);
  };

  // Écouter l'événement depuis la navbar
  useEffect(() => {
    const handleOpenRegistration = () => {
      setShowRegistration(true);
    };

    window.addEventListener("openRegistration", handleOpenRegistration);
    return () =>
      window.removeEventListener("openRegistration", handleOpenRegistration);
  }, []);

  return (
    <section className="relative min-h-screen p-5 flex items-center justify-center overflow-hidden">
      {/* Background - reste toujours présent */}
      <div className="absolute inset-0 gradient-primary opacity-90" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop')] bg-cover bg-center bg-fixed" />
      <div className="absolute inset-0 bg-black/50" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content - Alternance entre Hero Content et Registration Steps */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <AnimatePresence mode="wait">
          {showRegistration ? (
            <motion.div
              key="registration"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              {/* Bouton retour */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToHero}
                  className="border-white text-white hover:bg-white hover:text-dark-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à l'événement
                </Button>
              </motion.div>

              {/* Formulaire d'inscription intégré */}
              <RegistrationSteps onComplete={handleBackToHero} />
            </motion.div>
          ) : (
            <motion.div
              key="hero-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="text-center text-white"
            >
              <HeroContent
                event={event}
                availableSpots={availableSpots}
                discount={discount}
                formatDate={formatDate}
                formatPrice={formatPrice}
                onRegistrationClick={handleRegistrationClick}
                onProgramClick={() => navigate("/program")}
                isSoldOut={isSoldOut()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Urgency Banner - seulement visible sur le hero principal */}
      <AnimatePresence>
        {!showRegistration && availableSpots <= 50 && availableSpots > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="bg-red-500 text-white px-6 py-3 rounded-full text-sm font-semibold animate-pulse">
              ⚡ Plus que {availableSpots} places disponibles !
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Indicator - seulement visible sur le hero principal */}
      <AnimatePresence>
        {!showRegistration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            style={{ marginBottom: availableSpots <= 50 ? "4rem" : "0" }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-white rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// ===============================
// Composant Hero Content séparé pour plus de clarté
// ===============================
const HeroContent = ({
  event,
  availableSpots,
  discount,
  formatDate,
  formatPrice,
  onRegistrationClick,
  onProgramClick,
  isSoldOut,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      {/* Event Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="flex justify-center space-x-2"
      >
        {event.categories.map((category, index) => (
          <span
            key={category}
            className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
          >
            {category}
          </span>
        ))}
      </motion.div>

      {/* Main Heading */}
      <div className="space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
        >
          {event.title.split(" ").slice(0, 2).join(" ")}
          <span className="block bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">
            {event.title.split(" ").slice(2).join(" ")}
          </span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-2xl text-gray-200 font-medium"
        >
          {event.subtitle}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          {event.description}
        </motion.p>
      </div>

      {/* Event Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <Calendar className="w-6 h-6 mx-auto mb-2 text-primary-300" />
          <div className="text-sm text-gray-300">Date</div>
          <div className="font-semibold">{formatDate(event.date)}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-secondary-300" />
          <div className="text-sm text-gray-300">Horaire</div>
          <div className="font-semibold">
            {event.time} - {event.endTime}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <MapPin className="w-6 h-6 mx-auto mb-2 text-primary-300" />
          <div className="text-sm text-gray-300">Lieu</div>
          <div className="font-semibold">{event.location.city}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <Users className="w-6 h-6 mx-auto mb-2 text-secondary-300" />
          <div className="text-sm text-gray-300">Places restantes</div>
          <div className="font-semibold">{availableSpots}</div>
        </div>
      </motion.div>

      {/* Price & CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="space-y-6"
      >
        {/* Price Display */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4">
            {discount > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-2xl text-gray-400 line-through">
                  {formatPrice(event.originalPrice)} FCFA
                </span>
                <div className="flex items-center bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                  <Percent className="w-3 h-3 mr-1" />-{discount}%
                </div>
              </div>
            )}
          </div>
          <div className="text-4xl md:text-5xl font-bold text-white mt-2">
            {formatPrice(event.price)} FCFA
          </div>
          <p className="text-gray-300 text-sm mt-1">
            Déjeuner et supports inclus
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="primary"
            size="lg"
            className="group bg-white text-dark-900 hover:bg-gray-100 hover:scale-105 min-w-[200px]"
            onClick={onRegistrationClick}
            disabled={isSoldOut}
          >
            <span className="flex items-center">
              {isSoldOut ? "Complet" : "S'inscrire maintenant"}
              {!isSoldOut && (
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              )}
            </span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="group border-white text-white hover:text-dark-900 min-w-[200px]"
            onClick={onProgramClick}
          >
            <span className="flex items-center">
              Voir la librairie
              <Calendar className="w-5 h-5 ml-2" />
            </span>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventHero;
