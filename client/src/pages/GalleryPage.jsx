import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon } from 'lucide-react';
import { PageHeader, LoadingSpinner, EmptyState } from '../components/ui';
import { useGalleryStore } from '../stores/galleryStore';

const GalleryPage = () => {
  const { photos, loading, fetchPhotos, filterByCategory, clearFilters } = useGalleryStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const categories = [
    { id: 'all', label: 'Tout' },
    { id: 'Formations', label: 'Formations' },
    { id: 'Événements', label: 'Événements' },
    { id: 'Équipe', label: 'Équipe' },
    { id: 'Locaux', label: 'Locaux' }
  ];

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      await clearFilters();
    } else {
      await filterByCategory(categoryId);
    }
  };

  const filteredPhotos = selectedCategory === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Galerie"
        subtitle="Découvrez nos formations et événements en images"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Galerie' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 sm:px-6 py-2.5 sm:py-2 rounded-full font-medium transition-all text-sm sm:text-base min-h-[44px] ${
                selectedCategory === category.id
                  ? 'bg-primary-800 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.label}
              {category.id !== 'all' && (
                <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm">
                  ({photos.filter(p => p.category === category.id).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        {filteredPhotos.length === 0 ? (
          <EmptyState
            icon={ImageIcon}
            title="Aucune photo"
            description="Aucune photo n'est disponible pour le moment dans cette catégorie."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative aspect-square rounded-lg sm:rounded-xl overflow-hidden shadow-sm sm:shadow-md hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title || 'Photo CEPIC'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 text-white">
                    {photo.title && (
                      <h3 className="font-semibold text-xs sm:text-base mb-0.5 sm:mb-1 line-clamp-1">{photo.title}</h3>
                    )}
                    {photo.description && (
                      <p className="text-xs sm:text-sm text-gray-200 line-clamp-1 sm:line-clamp-2 hidden sm:block">
                        {photo.description}
                      </p>
                    )}
                  </div>
                </div>
                {photo.category && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] sm:text-xs font-medium text-gray-900">
                      {photo.category}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2.5 sm:p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title || 'Photo CEPIC'}
                className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg"
              />
              {(selectedPhoto.title || selectedPhoto.description) && (
                <div className="mt-3 sm:mt-4 text-white text-center px-2">
                  {selectedPhoto.title && (
                    <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
                      {selectedPhoto.title}
                    </h3>
                  )}
                  {selectedPhoto.description && (
                    <p className="text-sm sm:text-base text-gray-300">{selectedPhoto.description}</p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
