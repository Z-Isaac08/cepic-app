import { motion } from 'framer-motion';
import { GraduationCap, Plus } from 'lucide-react';

const TrainingsManagement = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <GraduationCap className="w-8 h-8 text-primary-800" />
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Formations</h2>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Nouvelle formation</span>
        </button>
      </div>
      <p className="text-gray-600">Module de gestion des formations - En développement</p>
    </motion.div>
  );
};

export default TrainingsManagement;
