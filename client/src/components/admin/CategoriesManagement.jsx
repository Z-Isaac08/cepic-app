import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  X,
  RefreshCw,
  Code,
  Palette,
  Briefcase,
  GraduationCap,
  Laptop,
  Database,
  Globe,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react';
import { useAdminStore } from '../../stores/adminStore';

// Icônes disponibles pour les catégories
const AVAILABLE_ICONS = [
  { name: 'Code', component: Code },
  { name: 'Palette', component: Palette },
  { name: 'Briefcase', component: Briefcase },
  { name: 'GraduationCap', component: GraduationCap },
  { name: 'Laptop', component: Laptop },
  { name: 'Database', component: Database },
  { name: 'Globe', component: Globe },
  { name: 'Lightbulb', component: Lightbulb },
  { name: 'Target', component: Target },
  { name: 'TrendingUp', component: TrendingUp },
  { name: 'BookOpen', component: BookOpen }
];

const CategoriesManagement = () => {
  const {
    categories,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  } = useAdminStore();

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'BookOpen'
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || 'BookOpen'
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        icon: 'BookOpen'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Le nom est requis');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast.success('Catégorie modifiée avec succès');
      } else {
        await createCategory(formData);
        toast.success('Catégorie créée avec succès');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (categoryId, trainingCount) => {
    if (trainingCount > 0) {
      toast.error(`Impossible de supprimer: ${trainingCount} formation(s) utilisent cette catégorie`);
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

    try {
      await deleteCategory(categoryId);
      toast.success('Catégorie supprimée');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Erreur lors de la suppression');
    }
  };

  const getIconComponent = (iconName) => {
    const icon = AVAILABLE_ICONS.find(i => i.name === iconName);
    return icon ? icon.component : BookOpen;
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-8 h-8 text-primary-800" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Catégories</h2>
            <p className="text-sm text-gray-600">{categories.length} catégorie(s)</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle catégorie</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icône</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formations</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => {
              const IconComponent = getIconComponent(category.icon);
              const trainingCount = category._count?.trainings || 0;

              return (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary-800" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-md truncate">
                      {category.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {trainingCount} formation(s)
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleOpenModal(category)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Éditer"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, trainingCount)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                        disabled={trainingCount > 0}
                      >
                        <Trash2 className={`w-5 h-5 ${trainingCount > 0 ? 'opacity-50 cursor-not-allowed' : ''}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune catégorie trouvée</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
            >
              {/* Modal Header */}
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingCategory ? 'Éditer la catégorie' : 'Nouvelle catégorie'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Icon Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icône *
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                      {(() => {
                        const IconComponent = getIconComponent(formData.icon);
                        return <IconComponent className="w-8 h-8 text-primary-800" />;
                      })()}
                    </div>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {AVAILABLE_ICONS.map(icon => (
                        <option key={icon.name} value={icon.name}>{icon.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ex: Développement Web"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Description de la catégorie..."
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors"
                  >
                    {editingCategory ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoriesManagement;
