/* eslint-disable no-unused-vars */
import EventHero from "@components/features/EventHero";
import EventOverview from "@components/features/EventOverview";
import { motion } from "framer-motion";
import { useAuthStore } from "../stores/authStore";

const Home = () => {
  const { isLoggedIn } = useAuthStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <EventHero />
      {/* EventOverview s'affiche SEULEMENT si l'utilisateur est connecté */}
      {isLoggedIn() && <EventOverview />}
    </motion.div>
  );
};

export default Home;
