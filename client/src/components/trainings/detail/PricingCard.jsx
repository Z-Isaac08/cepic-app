import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, CheckCircle, Download, Share2, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '../../../stores/authStore';
import { useTrainingStore } from '../../../stores/trainingStore';
import { Badge, Button } from '../../ui';

const PricingCard = ({ training }) => {
  const { user } = useAuthStore();
  const { toggleBookmark, trainings } = useTrainingStore();
  const [isLoading, setIsLoading] = useState(false);

  // Récupérer le statut de bookmark depuis le store
  const isBookmarked = training.isBookmarked || false;

  const handleBookmark = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!user) {
      window.location.href = '/connexion';
      return;
    }

    setIsLoading(true);
    try {
      const response = await toggleBookmark(training.id);

      // Le toast est géré dans le store
      if (response.bookmarked) {
        toast.success('Formation ajoutée aux favoris');
      } else {
        toast.info('Formation retirée des favoris');
      }

      return response;
    } catch (error) {
      console.error('Erreur bookmark:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour des favoris');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: training.title,
        text: training.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papier !');
    }
  };

  const handleEnroll = () => {
    if (!user) {
      window.location.href = '/connexion';
      return;
    }
    // Navigate to enrollment page or open modal
    window.location.href = `/inscription/${training.id}`;
  };

  // Format price (en FCFA)
  const formatPrice = (price) => {
    if (price === 0 || price === null || price === undefined) {
      return 'Gratuit';
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate discount (only if originalCost is defined and greater than current price)
  const discount =
    training.originalCost && training.originalCost > training.price && training.price > 0
      ? Math.round(((training.originalCost - training.price) / training.originalCost) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Price Section */}
      <div className="p-6 bg-gradient-to-br from-primary-50 to-white">
        <div className="flex items-baseline justify-between mb-4">
          <div className="flex flex-col">
            <span
              className={`text-4xl font-bold ${
                training.price === 0 ? 'text-green-600' : 'text-primary-800'
              }`}
            >
              {formatPrice(training.price)}
            </span>
            {training.originalCost &&
              training.originalCost > training.price &&
              training.price > 0 && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(training.originalCost)}
                </span>
              )}
          </div>
          {discount > 0 && (
            <Badge variant="accent" className="text-lg px-3 py-1">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button size="lg" className="w-full" onClick={handleEnroll}>
            S'inscrire maintenant
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBookmark}
              disabled={isLoading}
              className="w-full"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 mr-1" />
              ) : (
                <Bookmark className="w-4 h-4 mr-1" />
              )}
              {isBookmarked ? 'Sauvegardé' : 'Sauvegarder'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare} className="w-full">
              <Share2 className="w-4 h-4 mr-1" />
              Partager
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="p-6 bg-white border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Ce qui est inclus :</h4>
        <ul className="space-y-3">
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">Accès illimité au contenu</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">Certificat de fin de formation</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">Support et assistance</span>
          </li>
          {training.hasDownloadableResources && (
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">Ressources téléchargeables</span>
            </li>
          )}
          {training.deliveryMode === 'ONLINE' && (
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">Accessible sur mobile et tablette</span>
            </li>
          )}
        </ul>
      </div>

      {/* Quick Info */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Participants
            </span>
            <span className="font-semibold text-gray-900">
              {training._count?.enrollments_rel || 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-900">{training.level}</span>
          </div>
          {training.language && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Langue</span>
              <span className="font-semibold text-gray-900">{training.language}</span>
            </div>
          )}
        </div>
      </div>

      {/* Download Syllabus */}
      {training.syllabus && (
        <div className="p-6 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.open(training.syllabus, '_blank')}
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger le programme
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default PricingCard;
