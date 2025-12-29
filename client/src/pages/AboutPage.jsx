import { motion } from 'framer-motion';
import { Award, CheckCircle, Heart, Lightbulb, Target, TrendingUp, Users } from 'lucide-react';
import { PageHeader } from '../components/ui';
import { ACHIEVEMENTS, CEPIC_INFO, VALUES } from '../config/cepic';

const AboutPage = () => {
  const stats = [
    { label: "Années d'expérience", value: '2+', icon: TrendingUp },
    { label: 'Formations réalisées', value: '50+', icon: Award },
    { label: 'Participants formés', value: '200+', icon: Users },
    { label: 'Taux de satisfaction', value: '95%', icon: Heart },
  ];

  const iconMap = {
    Award,
    Users,
    Lightbulb,
    Heart,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="À propos de CEPIC"
        subtitle={CEPIC_INFO.fullName}
        breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'À propos' }]}
      />

      {/* Mission Section */}
      <section className="py-10 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Notre Mission</h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-primary-600 to-secondary-500 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto px-2">
              CEPIC est un cabinet spécialisé dans la formation professionnelle, l'accompagnement
              des entreprises et l'intermédiation commerciale. Nous nous engageons à fournir des
              formations de qualité qui répondent aux besoins du marché et contribuent au
              développement des compétences en Côte d'Ivoire et en Afrique.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-8 sm:mt-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-primary-50 to-white p-4 sm:p-6 rounded-lg sm:rounded-xl text-center"
                >
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 mx-auto mb-2 sm:mb-3" />
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-10 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Nos Valeurs</h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-primary-600 to-secondary-500 mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {VALUES.map((value, index) => {
              const Icon = iconMap[value.icon];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm sm:shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-10 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Nos Réalisations</h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-primary-600 to-secondary-500 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
              Quelques exemples de nos formations et prestations réalisées
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {ACHIEVEMENTS.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">{achievement.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3">{achievement.description}</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs text-gray-600">
                      <span className="bg-white px-2 sm:px-3 py-1 rounded-full">{achievement.period}</span>
                      <span className="bg-white px-2 sm:px-3 py-1 rounded-full truncate max-w-[150px] sm:max-w-none">{achievement.client}</span>
                      {achievement.cost && (
                        <span className="bg-white px-2 sm:px-3 py-1 rounded-full">{achievement.cost}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="py-10 sm:py-12 lg:py-16 bg-gradient-to-br from-primary-900 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center mb-4 sm:mb-6">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold">Direction</h2>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg sm:rounded-xl">
                <p className="text-xl sm:text-2xl font-bold mb-1">{CEPIC_INFO.director.name}</p>
                <p className="text-sm sm:text-base text-primary-200">{CEPIC_INFO.director.title}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
