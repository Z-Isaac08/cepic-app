import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

const AnalyticsPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <BarChart3 className="w-8 h-8 text-primary-800" />
        <h2 className="text-2xl font-bold text-gray-900">Analytiques</h2>
      </div>
      <p className="text-gray-600">Module d'analytiques et statistiques - En développement</p>
    </motion.div>
  );
};

export default AnalyticsPanel;
