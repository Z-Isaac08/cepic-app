import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  GraduationCap,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Upload,
  Eye,
  EyeOff,
  Users,
  DollarSign,
  Clock,
  RefreshCw
} from 'lucide-react';
import { useAdminStore } from '../../stores/adminStore';

const TrainingsManagement = () => {
  const { 
    trainings, 
    categories, 
    loading, 
    fetchTrainings, 
    fetchCategories,
    createTraining,
    updateTraining,
    deleteTraining,
    toggleTrainingPublish
  } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    cost: '',
    duration: '',
    durationUnit: 'months',
    maxParticipants: '',
    location: '',
    deliveryMode: 'PRESENTIAL',
    imageUrl: '',
    content: ''
  });

  useEffect(() => {
    fetchTrainings();
    fetchCategories();
  }, [fetchTrainings, fetchCategories]);

  const handleOpenModal = (training = null) => {
    if (training) {
      setEditingTraining(training);
      setFormData({
        title: training.title || '',
        description: training.description || '',
        categoryId: training.categoryId || '',
        cost: training.cost ? training.cost / 100 : '',
        duration: training.duration || '',
        durationUnit: training.durationUnit || 'months',
        maxParticipants: training.maxParticipants || '',
        location: training.location || '',
        deliveryMode: training.deliveryMode || 'PRESENTIAL',
        imageUrl: training.imageUrl || '',
        content: training.content || ''
      });
      setImagePreview(training.imageUrl);
    } else {
      setEditingTraining(null);
      setFormData({
        title: '',
        description: '',
        categoryId: '',
        cost: '',
        duration: '',
        durationUnit: 'months',
        maxParticipants: '',
        location: '',
        deliveryMode: 'PRESENTIAL',
        imageUrl: '',
        content: ''
      });
      setImagePreview(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTraining(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        cost: parseInt(formData.cost) * 100,
        duration: parseInt(formData.duration),
        maxParticipants: parseInt(formData.maxParticipants)
      };

      if (editingTraining) {
        await updateTraining(editingTraining.id, submitData);
        toast.success('Formation modifiée avec succès');
      } else {
        await createTraining(submitData);
        toast.success('Formation créée avec succès');
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error saving training:', error);
      toast.error(error.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (trainingId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) return;
    
    try {
      await deleteTraining(trainingId);
      toast.success('Formation supprimée');
    } catch (error) {
      console.error('Error deleting training:', error);
      toast.error(error.message || 'Erreur lors de la suppression');
    }
  };

  const handleTogglePublish = async (trainingId, currentStatus) => {
    try {
      await toggleTrainingPublish(trainingId, currentStatus);
      toast.success(currentStatus ? 'Formation dépubliée' : 'Formation publiée');
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast.error(error.message || 'Erreur lors de la modification');
    }
  };

  const filteredTrainings = trainings.filter(training => {
    const matchSearch = searchTerm === '' ||
      training.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchCategory = categoryFilter === 'all' || training.categoryId === categoryFilter;
    
    return matchSearch && matchCategory;
  });

  if (loading && trainings.length === 0) {
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
          <GraduationCap className="w-8 h-8 text-primary-800" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des Formations</h2>
            <p className="text-sm text-gray-600">{filteredTrainings.length} formation(s)</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle formation</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une formation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Trainings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainings.map((training) => (
          <motion.div
            key={training.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-200">
              {training.imageUrl ? (
                <img
                  src={training.imageUrl}
                  alt={training.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <GraduationCap className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleTogglePublish(training.id, training.isPublished)}
                  className={`p-2 rounded-full ${
                    training.isPublished
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-500 hover:bg-gray-600'
                  } text-white transition-colors`}
                  title={training.isPublished ? 'Publié' : 'Non publié'}
                >
                  {training.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {training.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {training.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{training._count?.enrollments || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{(training.cost / 100).toLocaleString()} FCFA</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{training.duration} {training.durationUnit === 'months' ? 'mois' : 'jours'}</span>
                </div>
              </div>

              {/* Category */}
              {training.category && (
                <div className="mb-3">
                  <span className="inline-block px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                    {training.category.name}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleOpenModal(training)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm font-medium">Éditer</span>
                </button>
                <button
                  onClick={() => handleDelete(training.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Supprimer</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTrainings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune formation trouvée</p>
        </div>
      )}

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
              className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingTraining ? 'Éditer la formation' : 'Nouvelle formation'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image de la formation
                  </label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                    <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary-500 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Cliquez pour uploader une image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ex: Gestion de projet avancée"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Description de la formation..."
                  />
                </div>

                {/* Category & Cost */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie *
                    </label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix (FCFA) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.cost}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="50000"
                    />
                  </div>
                </div>

                {/* Duration & Max Participants */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="3"
                      />
                      <select
                        value={formData.durationUnit}
                        onChange={(e) => setFormData(prev => ({ ...prev, durationUnit: e.target.value }))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="months">Mois</option>
                        <option value="days">Jours</option>
                        <option value="hours">Heures</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Participants max *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="30"
                    />
                  </div>
                </div>

                {/* Location & Delivery Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lieu *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Abidjan, Côte d'Ivoire"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mode de livraison *
                    </label>
                    <select
                      required
                      value={formData.deliveryMode}
                      onChange={(e) => setFormData(prev => ({ ...prev, deliveryMode: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="PRESENTIAL">Présentiel</option>
                      <option value="REMOTE">Distanciel</option>
                      <option value="HYBRID">Hybride</option>
                    </select>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenu / Modules
                  </label>
                  <textarea
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Détaillez le contenu de la formation, les modules, etc."
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
                    {editingTraining ? 'Mettre à jour' : 'Créer'}
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

export default TrainingsManagement;
