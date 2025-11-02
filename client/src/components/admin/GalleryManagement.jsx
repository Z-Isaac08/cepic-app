import { motion } from 'framer-motion';
import { Image as ImageIcon, Upload } from 'lucide-react';

const GalleryManagement = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <ImageIcon className="w-8 h-8 text-primary-800" />
          <h2 className="text-2xl font-bold text-gray-900">Gestion de la Galerie</h2>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors">
          <Upload className="w-5 h-5" />
          <span>Ajouter des photos</span>
        </button>
      </div>
      <p className="text-gray-600">Module de gestion de la galerie - En développement</p>
    </motion.div>
  );
};

export default GalleryManagement;
