import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Scale, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { CEPIC_INFO } from '../config/cepic';

const LegalPage = () => {
  const location = useLocation();
  const path = location.pathname;

  const getContent = () => {
    switch (path) {
      case '/conditions':
        return {
          title: "Conditions d'utilisation",
          icon: FileText,
          content: (
            <div className="space-y-4">
              <p>Bienvenue sur la plateforme de formation {CEPIC_INFO.shortName}.</p>
              <p>
                En utilisant nos services, vous acceptez les présentes conditions d'utilisation.
              </p>
              <h3 className="text-lg font-semibold mt-6">1. Accès aux formations</h3>
              <p>
                L'accès aux formations est réservé aux utilisateurs inscrits et à jour de leurs
                paiements.
              </p>
              <h3 className="text-lg font-semibold mt-6">2. Propriété intellectuelle</h3>
              <p>
                Tous les contenus présents sur la plateforme sont la propriété exclusive de{' '}
                {CEPIC_INFO.fullName}.
              </p>
            </div>
          ),
        };
      case '/confidentialite':
        return {
          title: 'Politique de confidentialité',
          icon: Shield,
          content: (
            <div className="space-y-4">
              <p>
                Nous accordons une grande importance à la protection de vos données personnelles.
              </p>
              <h3 className="text-lg font-semibold mt-6">Collecte des données</h3>
              <p>
                Nous collectons uniquement les données nécessaires au bon fonctionnement de nos
                services (nom, email, téléphone).
              </p>
              <h3 className="text-lg font-semibold mt-6">Utilisation des données</h3>
              <p>
                Vos données ne sont jamais revendues à des tiers. Elles servent uniquement à gérer
                votre compte et vos inscriptions.
              </p>
            </div>
          ),
        };
      case '/mentions-legales':
        return {
          title: 'Mentions légales',
          icon: Scale,
          content: (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Éditeur du site</h3>
              <p>{CEPIC_INFO.fullName}</p>
              <p>Adresse : {CEPIC_INFO.address}</p>
              <p>Email : {CEPIC_INFO.email}</p>
              <p>Téléphone : {CEPIC_INFO.phone.primary}</p>
              <h3 className="text-lg font-semibold mt-6">Hébergement</h3>
              <p>Ce site est hébergé sur une infrastructure sécurisée.</p>
            </div>
          ),
        };
      default:
        return {
          title: 'Page légale',
          icon: FileText,
          content: <p>Contenu non disponible.</p>,
        };
    }
  };

  const { title, icon: Icon, content } = getContent();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-primary-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="bg-primary-900 px-8 py-10 text-white">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Icon className="w-8 h-8 text-secondary-500" />
              </div>
              <h1 className="text-3xl font-bold">{title}</h1>
            </div>
          </div>

          <div className="p-8 text-gray-600 leading-relaxed">{content}</div>
        </motion.div>
      </div>
    </div>
  );
};

export default LegalPage;
