// client/src/pages/TrainingDetailPage.jsx
import { motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Target,
  User,
  Users,
} from 'lucide-react';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import PricingCard from '../components/trainings/detail/PricingCard';
import ProgramAccordion from '../components/trainings/detail/ProgramAccordion';
import ReviewSection from '../components/trainings/detail/ReviewSection';
import TrainingHero from '../components/trainings/detail/TrainingHero';
import { LoadingSpinner } from '../components/ui';
import { useTrainingStore } from '../stores/trainingStore';
import { useAuthStore } from '../stores/authStore';

export default function TrainingDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { currentTraining, loading, fetchTrainingById } = useTrainingStore();

  useEffect(() => {
    if (id) {
      fetchTrainingById(id);
    }
  }, [id, fetchTrainingById]);

  if (loading || !currentTraining) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <TrainingHero training={currentTraining} user={user} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Mobile: Pricing Card at top */}
          <div className="lg:hidden">
            <PricingCard training={currentTraining} />
          </div>

          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6 lg:space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Description</h2>
              <div className="prose prose-sm max-w-none text-gray-700 text-sm sm:text-base leading-relaxed">
                <p>{currentTraining.description}</p>
              </div>
            </motion.div>

            {/* What You'll Learn */}
            {currentTraining.objectives && currentTraining.objectives.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary-600 flex-shrink-0" />
                  <span>Ce que vous allez apprendre</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {(typeof currentTraining.objectives === 'string'
                    ? JSON.parse(currentTraining.objectives)
                    : currentTraining.objectives
                  ).map((objective, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-gray-700">{objective}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Requirements */}
            {currentTraining.prerequisites && currentTraining.prerequisites.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary-600 flex-shrink-0" />
                  <span>Prérequis</span>
                </h2>
                <ul className="space-y-2">
                  {(typeof currentTraining.prerequisites === 'string'
                    ? JSON.parse(currentTraining.prerequisites)
                    : currentTraining.prerequisites
                  ).map((req, index) => (
                    <li key={index} className="flex items-start text-xs sm:text-sm text-gray-700">
                      <span className="mr-2 text-primary-600">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Program */}
            <ProgramAccordion training={currentTraining} />

            {/* Target Audience */}
            {currentTraining.targetAudience && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary-600 flex-shrink-0" />
                  <span>À qui s'adresse cette formation ?</span>
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{currentTraining.targetAudience}</p>
              </motion.div>
            )}

            {/* Certification */}
            {currentTraining.hasCertificate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl shadow-md p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <Award className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      Certificat de fin de formation
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      Obtenez un certificat reconnu à l'issue de cette formation. Ce certificat
                      atteste de vos nouvelles compétences et peut être partagé sur votre profil
                      LinkedIn ou ajouté à votre CV.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Objectifs de la formation */}
            <motion.div
              className="bg-white rounded-lg shadow-sm p-4 sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Objectifs de la formation</h2>
              <ul className="space-y-2 sm:space-y-3">
                {currentTraining.objectives?.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Prérequis */}
            {currentTraining.prerequisites?.length > 0 && (
              <motion.div
                className="bg-white rounded-lg shadow-sm p-4 sm:p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Prérequis</h2>
                <ul className="list-disc pl-4 sm:pl-5 space-y-1.5 text-sm sm:text-base text-gray-700">
                  {currentTraining.prerequisites.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <ReviewSection training={currentTraining} />
            </motion.div>
          </div>

          {/* Right Column - Sidebar (Desktop only) */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="sticky top-24">
              <PricingCard training={currentTraining} />

              {/* Informations pratiques */}
              <motion.div
                className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Informations pratiques</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Durée</p>
                      <p className="text-sm sm:text-base font-medium">{currentTraining.duration || 'Non spécifiée'}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Prochaine session</p>
                      <p className="text-sm sm:text-base font-medium">
                        {currentTraining.startDate
                          ? new Date(currentTraining.startDate).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : 'Dates à venir'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Lieu</p>
                      <p className="text-sm sm:text-base font-medium">{currentTraining.schedule || 'À définir'}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <User className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Formateur</p>
                      <p className="text-sm sm:text-base font-medium">{currentTraining.instructor || 'À confirmer'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tags */}
              {currentTraining.tags?.length > 0 && (
                <motion.div
                  className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Compétences visées</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentTraining.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
