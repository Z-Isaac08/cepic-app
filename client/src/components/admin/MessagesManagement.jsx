import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

const MessagesManagement = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <MessageSquare className="w-8 h-8 text-primary-800" />
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Messages</h2>
      </div>
      <p className="text-gray-600">Module de gestion des messages de contact - En développement</p>
    </motion.div>
  );
};

export default MessagesManagement;
