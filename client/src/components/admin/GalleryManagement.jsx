import { AnimatePresence, motion } from 'framer-motion';
import {
  Edit,
  FileImage,
  Image as ImageIcon,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAdminStore } from '../../stores/adminStore';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const GalleryManagement = () => {
  const {
    galleryImages,
    categories,
    loading,
    fetchGalleryImages,
    fetchCategories,
    uploadGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
  } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchGalleryImages();
    fetchCategories();
  }, [fetchGalleryImages, fetchCategories]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      // Réinitialiser la valeur de l'input pour permettre de sélectionner à nouveau le même fichier
      e.target.value = '';
    }
  };

  const handleFiles = async (files) => {
    const validFiles = Array.from(files).filter((file) => {
      if (!ACCEPTED_FORMATS.includes(file.type)) {
        toast.error(`${file.name}: Format non supporté`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: Fichier trop volumineux (max 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    const toastId = toast.loading(`Upload de ${validFiles.length} image(s)...`);

    try {
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', file.name.split('.')[0]);
        formData.append('description', '');

        await uploadGalleryImage(formData);
      }

      // Recharger les images après l'upload
      await fetchGalleryImages();
      toast.success(`${validFiles.length} image(s) uploadée(s)`, { id: toastId });
    } catch (error) {
      console.error('Error uploading:', error);
      toast.error(error.response?.data?.error || "Erreur lors de l'upload", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleOpenModal = (image = null) => {
    if (image) {
      setEditingImage(image);
      setFormData({
        title: image.title || '',
        description: image.description || '',
        category: image.category || '',
      });
      setPreviewImage(image.imageUrl);
    } else {
      setEditingImage(null);
      setFormData({
        title: '',
        description: '',
        category: '',
      });
      setPreviewImage(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingImage(null);
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Le titre est requis');
      return;
    }

    try {
      if (editingImage) {
        await updateGalleryImage(editingImage.id, formData);
        toast.success('Image modifiée avec succès');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error(error.message || "Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;

    try {
      await deleteGalleryImage(imageId);
      toast.success('Image supprimée');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error(error.message || 'Erreur lors de la suppression');
    }
  };

  const filteredImages = galleryImages.filter((image) => {
    const matchSearch =
      searchTerm === '' || image.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory = categoryFilter === 'all' || image.category === categoryFilter;

    return matchSearch && matchCategory;
  });

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading && galleryImages.length === 0) {
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
          <ImageIcon className="w-8 h-8 text-primary-800" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion de la Galerie</h2>
            <p className="text-sm text-gray-600">{filteredImages.length} image(s)</p>
          </div>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors disabled:opacity-50"
        >
          <Upload className="w-5 h-5" />
          <span>{uploading ? 'Upload...' : 'Ajouter des photos'}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une image..."
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
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 transition-colors cursor-pointer ${
          dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-gray-100'
        }`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <div className="text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">Glissez-déposez vos images ici</p>
          <p className="text-sm text-gray-500 mb-4">
            ou cliquez sur "Ajouter des photos" ci-dessus
          </p>
          <p className="text-xs text-gray-400">Formats acceptés: JPG, PNG, WEBP (max 5MB)</p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
          >
            <img src={image.imageUrl} alt={image.title} className="w-full h-full object-cover" />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(image)}
                  className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                  title="Éditer"
                >
                  <Edit className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
              <p className="text-white text-sm font-medium truncate">{image.title}</p>
              <p className="text-white text-xs opacity-75">
                {new Date(image.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <FileImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune image trouvée</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && editingImage && (
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
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
            >
              {/* Modal Header */}
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Éditer l'image</h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Image Preview */}
                {previewImage && (
                  <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Titre de l'image"
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
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Description de l'image..."
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Aucune catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
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
                    Mettre à jour
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

export default GalleryManagement;
