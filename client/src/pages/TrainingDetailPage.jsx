// client/src/pages/TrainingDetailPage.jsx
import { useEffect } from "react";
import { useParams } from "react-router";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Target, 
  Users, 
  Award,
  CheckCircle 
} from "lucide-react";
import TrainingHero from "../components/trainings/detail/TrainingHero";
import ProgramAccordion from "../components/trainings/detail/ProgramAccordion";
import ReviewSection from "../components/trainings/detail/ReviewSection";
import PricingCard from "../components/trainings/detail/PricingCard";
import { LoadingSpinner } from "../components/ui";
import { useTrainingStore } from "../stores/trainingStore";

export default function TrainingDetailPage() {
  const { id } = useParams();
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
      <TrainingHero training={currentTraining} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Description
              </h2>
              <div className="prose prose-sm max-w-none text-gray-700">
                <p>{currentTraining.description}</p>
              </div>
            </motion.div>

            {/* What You'll Learn */}
            {currentTraining.objectives && currentTraining.objectives.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-primary-600" />
                  Ce que vous allez apprendre
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {(typeof currentTraining.objectives === 'string' 
                    ? JSON.parse(currentTraining.objectives) 
                    : currentTraining.objectives
                  ).map((objective, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{objective}</span>
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
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2 text-primary-600" />
                  Prérequis
                </h2>
                <ul className="space-y-2">
                  {(typeof currentTraining.prerequisites === 'string'
                    ? JSON.parse(currentTraining.prerequisites)
                    : currentTraining.prerequisites
                  ).map((req, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <span className="mr-2">•</span>
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
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-primary-600" />
                  À qui s'adresse cette formation ?
                </h2>
                <p className="text-gray-700">{currentTraining.targetAudience}</p>
              </motion.div>
            )}

            {/* Certification */}
            {currentTraining.hasCertificate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl shadow-md p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Award className="w-12 h-12 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Certificat de fin de formation
                    </h3>
                    <p className="text-gray-700">
                      Obtenez un certificat reconnu à l'issue de cette formation. 
                      Ce certificat atteste de vos nouvelles compétences et peut être 
                      partagé sur votre profil LinkedIn ou ajouté à votre CV.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            <ReviewSection training={currentTraining} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <PricingCard training={currentTraining} />
          </div>
        </div>
      </div>
    </div>
  );
}
