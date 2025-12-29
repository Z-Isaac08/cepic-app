import { motion } from 'framer-motion';
import { Award, GraduationCap, Heart, Lightbulb, Target, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { CategoryCard, TrainingCard } from '../components/trainings';
import { Button, LoadingSpinner } from '../components/ui';
import { CEPIC_INFO, VALUES } from '../config/cepic';
import { useTrainingStore } from '../stores/trainingStore';

const HomePage = () => {
  const { trainings, categories, loading, fetchTrainings, fetchCategories } = useTrainingStore();
  const [stats] = useState({
    trainings: 23,
    students: 500,
    satisfaction: 98,
    years: 2,
  });

  useEffect(() => {
    fetchTrainings({ featured: true, limit: 4 });
    fetchCategories();
  }, [fetchTrainings, fetchCategories]);

  // Formations à la une (max 4)
  const featuredTrainings = trainings.filter((t) => t.isFeatured).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-2 bg-secondary-500/20 backdrop-blur-sm rounded-full mb-6">
                <span className="text-secondary-500 font-semibold">
                  Excellence en Formation Professionnelle
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Développez vos <span className="text-secondary-500">compétences</span> avec CEPIC
              </h1>

              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {CEPIC_INFO.fullName} - Votre partenaire pour une formation de qualité en Côte
                d'Ivoire
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/formations">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Découvrir nos formations
                    {/* <ArrowRight className="w-5 h-5" /> */}
                  </Button>
                </Link>
                <Link to="/a-propos">
                  <Button size="lg" variant="outline-white" className="w-full sm:w-auto">
                    En savoir plus
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <div className="text-3xl font-bold text-secondary-500">{stats.trainings}+</div>
                  <div className="text-sm text-white/80">Formations</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary-500">{stats.students}+</div>
                  <div className="text-sm text-white/80">Participants</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary-500">{stats.satisfaction}%</div>
                  <div className="text-sm text-white/80">Satisfaction</div>
                </div>
              </div>
            </motion.div>

            {/* Right Image/Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-secondary-500/20 rounded-3xl blur-3xl" />
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <GraduationCap className="w-full h-64 text-secondary-500" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Modern Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="flex flex-col items-center gap-3 group">
            <span className="text-xs font-medium text-secondary-500 uppercase tracking-wider group-hover:text-secondary-400 transition-colors drop-shadow-lg">
              Défiler
            </span>
            {/* Mouse Icon */}
            <div className="relative w-6 h-10 border-2 border-secondary-500 rounded-full group-hover:border-secondary-400 transition-colors shadow-lg">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-secondary-500 rounded-full"
              />
            </div>
            {/* Down Arrow */}
            <motion.svg
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              className="w-4 h-4 text-secondary-500 group-hover:text-secondary-400 transition-colors drop-shadow-lg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </motion.svg>
          </div>
        </motion.div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* FORMATIONS À LA UNE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Formations à la une
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez nos formations les plus populaires et développez vos compétences
            </p>
          </motion.div>

          {loading ? (
            <LoadingSpinner size="lg" text="Chargement des formations..." />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredTrainings.map((training, index) => (
                <TrainingCard key={training.id} training={training} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/formations">
              <Button variant="outline" size="lg">
                Voir toutes les formations
                {/* <ArrowRight className="ml-2 w-5 h-5" /> */}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CATÉGORIES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos domaines de formation
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explorez nos différentes catégories de formations professionnelles
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI CEPIC */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir CEPIC ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Notre engagement pour votre réussite professionnelle
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value, index) => {
              const IconComponent =
                {
                  Award,
                  Users,
                  Lightbulb,
                  Heart,
                }[value.icon] || Award;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-primary-800" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CHIFFRES CLÉS */}
      <section className="py-20 bg-gradient-to-br from-primary-800 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <TrendingUp className="w-12 h-12 text-secondary-500 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">{stats.trainings}+</div>
              <div className="text-white/80">Formations disponibles</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Users className="w-12 h-12 text-secondary-500 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">{stats.students}+</div>
              <div className="text-white/80">Participants formés</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Target className="w-12 h-12 text-secondary-500 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">{stats.satisfaction}%</div>
              <div className="text-white/80">Taux de satisfaction</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Award className="w-12 h-12 text-secondary-500 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">{stats.years}+</div>
              <div className="text-white/80">Années d'expérience</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Prêt à développer vos compétences ?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Rejoignez des centaines de professionnels qui ont fait confiance à CEPIC pour leur
              formation
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/formations">
                <Button size="lg" variant="primary">
                  Parcourir les formations
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Nous contacter
                </Button>
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-4">Besoin d'informations ?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <a
                  href={`tel:${CEPIC_INFO.phone.primary}`}
                  className="text-primary-800 hover:text-primary-900 font-medium"
                >
                  {CEPIC_INFO.phone.primary}
                </a>
                <a
                  href={`mailto:${CEPIC_INFO.email}`}
                  className="text-primary-800 hover:text-primary-900 font-medium"
                >
                  {CEPIC_INFO.email}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
