import { motion } from 'framer-motion';
import { Users, UserPlus } from 'lucide-react';

const UsersManagement = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-primary-800" />
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors">
          <UserPlus className="w-5 h-5" />
          <span>Nouvel utilisateur</span>
        </button>
      </div>
      <p className="text-gray-600">Module de gestion des utilisateurs - En développement</p>
    </motion.div>
  );
};

export default UsersManagement;
