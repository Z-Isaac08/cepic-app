import { AnimatePresence, motion } from 'framer-motion';
import {
  Clock,
  Edit,
  Eye,
  EyeOff,
  GraduationCap,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import FocusLock from 'react-focus-lock';
import { toast } from 'sonner';
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
    toggleTrainingPublish,
  } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const previousFocusRef = useRef(null);

  // Formulaire simplifié selon le nouveau schéma
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    program: '',
    categoryId: '',
    price: '',
    duration: '',
    level: 'DEBUTANT',
    capacity: '',
    instructor: '',
    schedule: '',
    startDate: '',
    endDate: '',
    objectives: '',
    prerequisites: '',
    targetAudience: '',
    coverImage: '',
    tags: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchTrainings();
        await new Promise((resolve) => setTimeout(resolve, 500));
        await fetchCategories();
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        if (error.response?.status === 429) {
          toast.error('Trop de requêtes. Veuillez patienter.');
        } else {
          toast.error('Erreur lors du chargement des données');
        }
      }
    };
    loadData();
  }, [fetchTrainings, fetchCategories]);

  const handleOpenModal = (training = null) => {
    // Sauvegarder l'élément qui a le focus actuellement
    previousFocusRef.current = document.activeElement;

    if (training) {
      setEditingTraining(training);
      setFormData({
        title: training.title || '',
        description: training.description || '',
        program: training.program || '',
        categoryId: training.categoryId || '',
        price: training.price || '',
        duration: training.duration || '',
        level: training.level || 'DEBUTANT',
        capacity: training.capacity || '',
        instructor: training.instructor || '',
        schedule: training.schedule || '',
        startDate: training.startDate
          ? new Date(training.startDate).toISOString().split('T')[0]
          : '',
        endDate: training.endDate ? new Date(training.endDate).toISOString().split('T')[0] : '',
        objectives: Array.isArray(training.objectives) ? training.objectives.join('\n') : '',
        prerequisites: Array.isArray(training.prerequisites)
          ? training.prerequisites.join('\n')
          : '',
        targetAudience: training.targetAudience || '',
        coverImage: training.coverImage || '',
        tags: Array.isArray(training.tags) ? training.tags.join(', ') : '',
      });
      setImagePreview(training.coverImage);
    } else {
      setEditingTraining(null);
      setFormData({
        title: '',
        description: '',
        program: '',
        categoryId: '',
        price: '',
        duration: '',
        level: 'DEBUTANT',
        capacity: '20',
        instructor: '',
        schedule: '',
        startDate: '',
        endDate: '',
        objectives: '',
        prerequisites: '',
        targetAudience: '',
        coverImage: '',
        tags: '',
      });
      setImagePreview(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTraining(null);
    setImagePreview(null);

    // Retourner le focus à l'élément précédent
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 2 Mo");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // Ne pas stocker la base64 dans formData pour éviter les requêtes trop lourdes
        toast.info('Image chargée. Elle sera uploadée lors de la sauvegarde.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title?.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }
    if (!formData.categoryId) {
      toast.error('La catégorie est obligatoire');
      return;
    }
    if (!formData.duration?.trim()) {
      toast.error('La durée est obligatoire');
      return;
    }

    try {
      // Préparer les données selon le nouveau schéma simplifié
      const submitData = {
        title: formData.title.trim(),
        slug: formData.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        description: formData.description?.trim() || null,
        program: formData.program?.trim() || null,
        categoryId: formData.categoryId,

        // Champs simples
        duration: formData.duration.trim(), // String: "24h", "2 jours", etc.
        level: formData.level,
        price: formData.price ? parseInt(formData.price) : 0,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,

        // Champs optionnels
        instructor: formData.instructor?.trim() || null,
        schedule: formData.schedule?.trim() || null,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        targetAudience: formData.targetAudience?.trim() || null,

        // Arrays (convertir les lignes en tableau)
        objectives: formData.objectives
          ? formData.objectives
              .split('\n')
              .map((o) => o.trim())
              .filter(Boolean)
          : [],
        prerequisites: formData.prerequisites
          ? formData.prerequisites
              .split('\n')
              .map((p) => p.trim())
              .filter(Boolean)
          : [],
        tags: formData.tags
          ? formData.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };

      // IMPORTANT: Ne pas inclure coverImage si c'est du base64
      // Pour l'instant, on skip l'image (à implémenter avec upload séparé)
      if (formData.coverImage && !formData.coverImage.startsWith('data:')) {
        submitData.coverImage = formData.coverImage;
      }

      console.log('📤 Données envoyées:', submitData);

      if (editingTraining) {
        await updateTraining(editingTraining.id, submitData);
        toast.success('✅ Formation modifiée avec succès');
      } else {
        await createTraining(submitData);
        toast.success('✅ Formation créée avec succès');
      }

      handleCloseModal();
    } catch (error) {
      console.error('❌ Erreur:', error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Erreur lors de l'enregistrement");
      }
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
      // Mettre à jour le store
      const response = await toggleTrainingPublish(trainingId, currentStatus);

      // Utiliser le statut de la réponse du serveur pour le message
      const isNowPublished = response.data?.isPublished;

      // Afficher le message de succès avec le bon état
      const message = isNowPublished
        ? 'Formation publiée avec succès'
        : 'Formation dépubliée avec succès';
      toast.success(message);

      // Rafraîchir les données pour s'assurer de la cohérence
      await fetchTrainings();
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast.error(error.message || 'Erreur lors de la modification du statut de publication');

      // En cas d'erreur, recharger les données pour revenir à l'état précédent
      await fetchTrainings();
    }
  };

  const filteredTrainings = trainings.filter((training) => {
    const matchSearch =
      searchTerm === '' ||
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-primary-800 flex-shrink-0" />
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Gestion des Formations</h2>
            <p className="text-xs sm:text-sm text-gray-600">{filteredTrainings.length} formation(s)</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors min-h-[44px] text-sm sm:text-base"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle formation</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une formation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base min-h-[44px]"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base min-h-[44px]"
          >
            <option key="all" value="all">
              Toutes les catégories
            </option>
            {Array.isArray(categories) &&
              categories.map((cat) => (
                <option key={`cat-${cat.id}`} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Trainings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredTrainings.map((training) => (
          <motion.div
            key={training.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="relative h-36 sm:h-44 lg:h-48 bg-gray-200">
              {training.coverImage ? (
                <img
                  src={training.coverImage}
                  alt={training.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <GraduationCap className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1.5 sm:gap-2">
                {/* Badge niveau */}
                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/90 text-[10px] sm:text-xs font-medium rounded">
                  {training.level === 'DEBUTANT' && 'Débutant'}
                  {training.level === 'INTERMEDIAIRE' && 'Intermédiaire'}
                  {training.level === 'AVANCE' && 'Avancé'}
                  {training.level === 'EXPERT' && 'Expert'}
                </span>
                <button
                  onClick={() => handleTogglePublish(training.id, training.isPublished)}
                  className={`p-1.5 sm:p-2 rounded-full min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center ${
                    training.isPublished
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-500 hover:bg-gray-600'
                  } text-white transition-colors`}
                  title={training.isPublished ? 'Publié' : 'Non publié'}
                >
                  {training.isPublished ? (
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2">
                {training.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">{training.description}</p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2 sm:mb-3 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{training.capacity || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-primary-600">
                    {training.price?.toLocaleString() || '0'} FCFA
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{training.duration}</span>
                </div>
              </div>

              {/* Category */}
              {training.category && (
                <div className="mb-2 sm:mb-3">
                  <span className="inline-block px-2 py-0.5 sm:py-1 bg-primary-100 text-primary-800 text-[10px] sm:text-xs rounded-full">
                    {training.category.name}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 sm:pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleOpenModal(training)}
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors min-h-[40px]"
                >
                  <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Éditer</span>
                </button>
                <button
                  onClick={() => handleDelete(training.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors min-h-[40px]"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Supprimer</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTrainings.length === 0 && (
        <div className="text-center py-8 sm:py-12 bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md">
          <GraduationCap className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-gray-500">Aucune formation trouvée</p>
        </div>
      )}

      {/* Modal - VERSION SIMPLIFIÉE */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={handleCloseModal}
            aria-hidden="true"
          >
            <FocusLock returnFocus>
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg sm:rounded-xl shadow-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    handleCloseModal();
                  }
                }}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                  <h3 id="modal-title" className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                    {editingTraining ? 'Éditer la formation' : 'Nouvelle formation'}
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="p-2.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Fermer la fenêtre"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Section 1: Informations de base */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Informations de base
                  </h4>

                  {/* Titre */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Titre <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      required
                      autoFocus
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ex: Gestion de projet Agile et Scrum"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description courte
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, description: e.target.value }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Une description accrocheuse en quelques lignes..."
                    />
                  </div>

                  {/* Catégorie & Niveau */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.categoryId}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Sélectionner...</option>
                        {categories.map((cat) => (
                          <option key={`form-cat-${cat.id}`} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Niveau <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.level}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, level: e.target.value }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="DEBUTANT">Débutant</option>
                        <option value="INTERMEDIAIRE">Intermédiaire</option>
                        <option value="AVANCE">Avancé</option>
                        <option value="EXPERT">Expert</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Détails pratiques */}
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Détails pratiques
                  </h4>

                  {/* Durée & Prix & Capacité */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Durée <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, duration: e.target.value }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Ex: 24h, 2 jours, 3 semaines"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Format libre: "40h", "5 jours", "2 semaines"
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix (FCFA)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, price: e.target.value }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="150000"
                      />
                      <p className="text-xs text-gray-500 mt-1">0 = Gratuit</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Capacité max
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.capacity}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, capacity: e.target.value }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="20"
                      />
                    </div>
                  </div>

                  {/* Formateur & Horaires */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Formateur
                      </label>
                      <input
                        type="text"
                        value={formData.instructor}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, instructor: e.target.value }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Nom du formateur"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Horaires et lieu
                      </label>
                      <input
                        type="text"
                        value={formData.schedule}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, schedule: e.target.value }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Ex: Lun-Ven 9h-17h à Cocody"
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de début
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de fin
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Contenu pédagogique */}
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-semibold text-gray-900">Contenu pédagogique</h4>

                  {/* Programme détaillé */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Programme détaillé
                    </label>
                    <textarea
                      rows={4}
                      value={formData.program}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, program: e.target.value }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                      placeholder="Module 1: Introduction&#10;- Point 1&#10;- Point 2&#10;&#10;Module 2: Pratique&#10;- Exercices"
                    />
                  </div>

                  {/* Objectifs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objectifs (un par ligne)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.objectives}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, objectives: e.target.value }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Maîtriser les concepts de base&#10;Savoir appliquer la méthodologie&#10;Être capable de gérer un projet"
                    />
                  </div>

                  {/* Prérequis */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prérequis (un par ligne)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.prerequisites}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, prerequisites: e.target.value }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Connaissances de base en gestion&#10;Expérience professionnelle souhaitable"
                    />
                  </div>

                  {/* Public cible */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Public cible
                    </label>
                    <input
                      type="text"
                      value={formData.targetAudience}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, targetAudience: e.target.value }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ex: Chefs de projet, Product Owners, Développeurs"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (séparés par des virgules)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="agile, scrum, management, certification"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Pour améliorer la recherche et le référencement
                    </p>
                  </div>
                </div>

                {/* Section 4: Image (optionnel) */}
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Image de couverture (optionnel)
                  </h4>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      ⚠️ L'upload d'images n'est pas encore implémenté. Vous pouvez créer la
                      formation sans image pour le moment.
                    </p>
                  </div>

                  {/* Preview si image existante */}
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData((prev) => ({ ...prev, coverImage: '' }));
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* URL d'image alternative */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ou entrez une URL d'image
                    </label>
                    <input
                      type="url"
                      value={formData.coverImage}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, coverImage: e.target.value }));
                        setImagePreview(e.target.value);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 pt-4 sm:pt-6 border-t">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full sm:flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium min-h-[48px] order-2 sm:order-1"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:flex-1 px-4 py-3 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors font-medium min-h-[48px] order-1 sm:order-2"
                  >
                    {editingTraining ? 'Mettre à jour' : 'Créer la formation'}
                  </button>
                </div>
              </form>
              </motion.div>
            </FocusLock>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrainingsManagement;
