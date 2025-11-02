import { motion } from 'framer-motion';
import { Clock, MapPin, Users, Star, Bookmark, BookmarkCheck } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useTrainingStore } from '../../stores/trainingStore';

const TrainingCard = ({ training, showBookmark = true }) => {
  const { user } = useAuthStore();
  const { toggleBookmark } = useTrainingStore();
  const [isBookmarked, setIsBookmarked] = useState(training.isBookmarked || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Rediriger vers connexion
      window.location.href = '/connexion';
      return;
    }

    setIsLoading(true);
    try {
      const response = await toggleBookmark(training.id);
      setIsBookmarked(response.bookmarked);
    } catch (error) {
      console.error('Erreur bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Formater le prix (convert from cents to FCFA)
  const formatPrice = (priceInCents) => {
    if (!priceInCents || priceInCents === 0) return 'Gratuit';
    const priceInFCFA = priceInCents / 100;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(priceInFCFA);
  };

  // Calculer la réduction
  const discount = training.originalCost && training.cost < training.originalCost
    ? Math.round(((training.originalCost - training.cost) / training.originalCost) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group h-full"
    >
      <Link to={`/formations/${training.id}`} className="block h-full">
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full min-h-[550px] flex flex-col">
          {/* Image */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100">
            {training.coverImage ? (
              <img
                src={training.coverImage}
                alt={training.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Users className="w-16 h-16 text-primary-300" />
              </div>
            )}
            
            {/* Badge Featured */}
            {training.isFeatured && (
              <div className="absolute top-3 left-3 bg-secondary-500 text-primary-900 px-3 py-1 rounded-full text-xs font-semibold">
                ⭐ À la une
              </div>
            )}

            {/* Badge Réduction */}
            {discount > 0 && (
              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                -{discount}%
              </div>
            )}

            {/* Bookmark */}
            {showBookmark && (
              <button
                onClick={handleBookmark}
                disabled={isLoading}
                className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-5 h-5 text-secondary-500" />
                ) : (
                  <Bookmark className="w-5 h-5 text-gray-600" />
                )}
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            {/* Catégorie */}
            <div className="flex items-center justify-between mb-2">
              <span className="inline-block px-3 py-1 bg-primary-50 text-primary-800 rounded-full text-xs font-medium">
                {training.category?.name || 'Formation'}
              </span>
              
              {/* Note */}
              {training.averageRating > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    {training.averageRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({training.reviewCount})
                  </span>
                </div>
              )}
            </div>

            {/* Titre */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-800 transition-colors">
              {training.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {training.description}
            </p>

            {/* Infos */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-2" />
                <span>{training.duration} {training.durationUnit === 'hours' ? 'heures' : 'jours'}</span>
              </div>
              
              {training.location && (
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{training.location}</span>
                </div>
              )}

              {training.deliveryMode && (
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  <span>
                    {training.deliveryMode === 'PRESENTIAL' && 'Présentiel'}
                    {training.deliveryMode === 'ONLINE' && 'En ligne'}
                    {training.deliveryMode === 'HYBRID' && 'Hybride'}
                  </span>
                </div>
              )}
            </div>

            {/* Spacer pour pousser le prix en bas */}
            <div className="flex-1"></div>

            {/* Prix et CTA */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
              <div>
                {training.isFree ? (
                  <span className="text-2xl font-bold text-green-600">Gratuit</span>
                ) : (
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-primary-800">
                      {formatPrice(training.cost)}
                    </span>
                    {training.originalCost && training.originalCost > training.cost && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(training.originalCost)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <button className="px-4 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors text-sm font-medium">
                Voir détails
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TrainingCard;
