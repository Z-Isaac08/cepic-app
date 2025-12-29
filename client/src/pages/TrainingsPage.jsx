import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useTrainingStore } from '../stores/trainingStore';
import { TrainingCard } from '../components/trainings';
import { PageHeader, LoadingSpinner, EmptyState, Button, Badge } from '../components/ui';

const TrainingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    trainings, 
    categories, 
    loading, 
    fetchTrainings, 
    fetchCategories
  } = useTrainingStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    categoryId: searchParams.get('category') || '',
    deliveryMode: '',
    isFree: null,
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    // Appliquer les filtres depuis l'URL
    const categorySlug = searchParams.get('category');
    if (categorySlug) {
      const category = categories.find(c => c.slug === categorySlug);
      if (category) {
        setLocalFilters(prev => ({ ...prev, categoryId: category.id }));
      }
    }
  }, [searchParams, categories]);

  useEffect(() => {
    // Fetch trainings avec filtres (nettoyer les valeurs vides)
    const params = Object.entries({
      ...localFilters,
      search: searchTerm,
    }).reduce((acc, [key, value]) => {
      // Ne garder que les valeurs non vides
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    console.log('🔍 Filtres envoyés:', params);
    fetchTrainings(params);
  }, [localFilters, searchTerm, fetchTrainings]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setLocalFilters({
      categoryId: '',
      deliveryMode: '',
      isFree: null,
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setSearchTerm('');
  };

  // Compter seulement les filtres actifs (sans sortBy et sortOrder)
  const activeFiltersCount = Object.entries(localFilters)
    .filter(([key, value]) => {
      // Exclure sortBy et sortOrder du comptage
      if (key === 'sortBy' || key === 'sortOrder') return false;
      // Compter si la valeur n'est pas vide
      return value !== '' && value !== null;
    })
    .length;

  return (
    <div>
      <PageHeader
        title="Nos Formations"
        subtitle="Découvrez toutes nos formations professionnelles"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Formations' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Barre de recherche et filtres */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une formation..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base min-h-[48px]"
              />
            </div>

            {/* Bouton filtres */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[48px] sm:min-w-[140px]"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="font-medium">Filtres</span>
              {activeFiltersCount > 0 && (
                <Badge variant="primary" size="sm">{activeFiltersCount}</Badge>
              )}
            </button>
          </div>

          {/* Panneau de filtres */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={localFilters.categoryId}
                    onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                    className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-base min-h-[44px]"
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Mode de formation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mode de formation
                  </label>
                  <select
                    value={localFilters.deliveryMode}
                    onChange={(e) => handleFilterChange('deliveryMode', e.target.value)}
                    className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-base min-h-[44px]"
                  >
                    <option value="">Tous les modes</option>
                    <option value="PRESENTIAL">Présentiel</option>
                    <option value="ONLINE">En ligne</option>
                    <option value="HYBRID">Hybride</option>
                  </select>
                </div>

                {/* Prix */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix
                  </label>
                  <select
                    value={localFilters.isFree === null ? '' : localFilters.isFree}
                    onChange={(e) => handleFilterChange('isFree', e.target.value === '' ? null : e.target.value === 'true')}
                    className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-base min-h-[44px]"
                  >
                    <option value="">Tous les prix</option>
                    <option value="true">Gratuit</option>
                    <option value="false">Payant</option>
                  </select>
                </div>

                {/* Tri */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trier par
                  </label>
                  <select
                    value={localFilters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-base min-h-[44px]"
                  >
                    <option value="createdAt">Plus récent</option>
                    <option value="title">Nom (A-Z)</option>
                    <option value="cost">Prix croissant</option>
                    <option value="averageRating">Mieux notées</option>
                  </select>
                </div>
              </div>

              {/* Bouton reset */}
              {activeFiltersCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px]"
                  >
                    <X className="w-4 h-4" />
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Résultats */}
          <div className="flex items-center justify-between text-sm text-gray-600 py-2">
            <span className="font-medium">
              {trainings.length} formation{trainings.length > 1 ? 's' : ''} trouvée{trainings.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Liste des formations */}
        {loading ? (
          <LoadingSpinner size="lg" text="Chargement des formations..." />
        ) : trainings.length === 0 ? (
          <EmptyState
            title="Aucune formation trouvée"
            description="Essayez de modifier vos critères de recherche ou vos filtres"
            action={
              <Button onClick={handleResetFilters} variant="primary" className="min-h-[48px]">
                Réinitialiser les filtres
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {trainings.map((training) => (
              <TrainingCard key={training.id} training={training} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingsPage;
