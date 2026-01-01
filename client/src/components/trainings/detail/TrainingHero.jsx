// client/src/components/trainings/detail/TrainingHero.jsx
import { motion } from 'framer-motion';
import { Clock, Loader2, MapPin, Monitor, Users, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useEnrollmentStore } from '../../../stores/enrollmentStore';
import { Badge, Button } from '../../ui';

const TrainingHero = ({ training, user }) => {
  const navigate = useNavigate();
  const { createEnrollment } = useEnrollmentStore();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const getDeliveryIcon = (mode) => {
    switch (mode) {
      case 'ONLINE':
        return <Monitor className="w-5 h-5" />;
      case 'HYBRID':
        return <Zap className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/connexion');
      return;
    }

    // Si formation gratuite (strictement price === 0), inscription directe
    const isFree = training.price === 0;

    if (isFree) {
      setIsEnrolling(true);
      try {
        const response = await createEnrollment(training.id);
        toast.success(response.message || 'Inscription confirmée !');
        navigate('/mes-formations');
      } catch (error) {
        toast.error(error.response?.data?.error || "Erreur lors de l'inscription");
      } finally {
        setIsEnrolling(false);
      }
    } else {
      navigate(`/rejoindre/${training.id}`);
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-primary-800 via-primary-700 to-secondary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 lg:py-16 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-4 sm:mb-6 overflow-x-auto" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm whitespace-nowrap">
            <li>
              <Link to="/" className="text-primary-200 hover:text-white transition-colors py-1 min-h-[44px] inline-flex items-center">
                Accueil
              </Link>
            </li>
            <li>
              <span className="mx-1 sm:mx-2 text-primary-300">/</span>
            </li>
            <li>
              <Link
                to="/formations"
                className="text-primary-200 hover:text-white transition-colors py-1 min-h-[44px] inline-flex items-center"
              >
                Formations
              </Link>
            </li>
            <li>
              <span className="mx-1 sm:mx-2 text-primary-300">/</span>
            </li>
            <li className="text-white font-medium truncate max-w-[150px] sm:max-w-xs" title={training.title}>
              {training.title}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Left Column - Content */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
              <Badge variant="secondary" className="bg-white/20 border-0 text-xs sm:text-sm">
                {training.category?.name}
              </Badge>
              {training.isNew && <Badge variant="accent" className="text-xs sm:text-sm">Nouveau</Badge>}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight">{training.title}</h1>

            <p className="text-sm sm:text-base lg:text-lg text-primary-100 mb-4 sm:mb-6 leading-relaxed">
              {training.shortDescription || training.description.substring(0, 180)}
              ...
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex items-center text-xs sm:text-sm">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-primary-200 flex-shrink-0" />
                <span>
                  {training.duration} {training.durationUnit === 'hours' ? 'heures' : 'jours'}
                </span>
              </div>

              <div className="flex items-center text-xs sm:text-sm">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-primary-200 flex-shrink-0" />
                <span>{training.level}</span>
              </div>

              <div className="flex items-center text-xs sm:text-sm">
                {getDeliveryIcon(training.deliveryMode)}
                <span className="ml-1.5 sm:ml-2 capitalize">
                  {training.deliveryMode === 'ONLINE'
                    ? 'En ligne'
                    : training.deliveryMode === 'HYBRID'
                    ? 'Hybride'
                    : 'Présentiel'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                size="lg"
                variant="primary"
                className="w-full sm:w-auto min-h-[48px]"
                onClick={handleEnroll}
                disabled={isEnrolling}
              >
                {isEnrolling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Inscription en cours...
                  </>
                ) : (
                  "S'inscrire maintenant"
                )}
              </Button>
              <Button variant="outline-white" size="lg" className="w-full sm:w-auto min-h-[48px]">
                Voir la vidéo
              </Button>
            </div>
          </div>

          {/* Right Column - Image (Hidden on mobile, shown in main content area) */}
          <div className="hidden lg:block lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden"
            >
              {training.coverImage ? (
                <img
                  src={training.coverImage}
                  alt={training.title}
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover"
                />
              ) : (
                <div className="h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <span className="text-primary-400 text-sm">Image non disponible</span>
                </div>
              )}

              <div className="p-4 sm:p-6">
                <div className="flex items-baseline justify-between gap-2 mb-4">
                  <div className="flex flex-col">
                    <span
                      className={`text-2xl sm:text-3xl font-bold ${
                        training.price === 0 ? 'text-green-600' : 'text-primary-800'
                      }`}
                    >
                      {training.price === 0
                        ? 'Gratuit'
                        : new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'XOF',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(training.price)}
                    </span>
                    {training.originalCost &&
                      training.originalCost > training.price &&
                      training.price > 0 && (
                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'XOF',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(training.originalCost)}
                        </span>
                      )}
                  </div>
                  {training.originalCost &&
                    training.originalCost > training.price &&
                    training.price > 0 && (
                      <Badge variant="accent" className="text-xs sm:text-sm flex-shrink-0">
                        -
                        {Math.round(
                          ((training.originalCost - training.price) / training.originalCost) * 100
                        )}
                        %
                      </Badge>
                    )}
                </div>

                <div className="space-y-2 sm:space-y-3 border-t border-gray-200 pt-3 sm:pt-4">
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                    <span>Niveau</span>
                    <span className="font-semibold text-gray-900">{training.level}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                    <span>Durée</span>
                    <span className="font-semibold text-gray-900">
                      {training.duration} {training.durationUnit === 'hours' ? 'heures' : 'jours'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                    <span>Format</span>
                    <span className="font-semibold text-gray-900">
                      {training.deliveryMode === 'ONLINE'
                        ? 'En ligne'
                        : training.deliveryMode === 'HYBRID'
                        ? 'Hybride'
                        : 'Présentiel'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingHero;
