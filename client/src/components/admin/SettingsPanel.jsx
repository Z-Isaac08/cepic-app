import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

const SettingsPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="w-8 h-8 text-primary-800" />
        <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>
      </div>
      <p className="text-gray-600">Module de paramètres de la plateforme - En développement</p>
    </motion.div>
  );
};

export default SettingsPanel;
