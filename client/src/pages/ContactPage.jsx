import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle
} from 'lucide-react';
import { PageHeader, Button } from '../components/ui';
import { CEPIC_INFO } from '../config/cepic';
import { useContactStore } from '../stores/contactStore';

const ContactPage = () => {
  const { loading, success, error, sendMessage, resetSuccess } = useContactStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendMessage(formData);
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => resetSuccess(), 5000);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Adresse',
      content: CEPIC_INFO.address,
      color: 'text-primary-600'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      content: (
        <div className="space-y-1">
          <a href={`tel:${CEPIC_INFO.phone.primary}`} className="block hover:text-primary-800">
            {CEPIC_INFO.phone.primary}
          </a>
          <a href={`tel:${CEPIC_INFO.phone.secondary}`} className="block hover:text-primary-800">
            {CEPIC_INFO.phone.secondary}
          </a>
        </div>
      ),
      color: 'text-green-600'
    },
    {
      icon: Mail,
      title: 'Email',
      content: (
        <a href={`mailto:${CEPIC_INFO.email}`} className="hover:text-primary-800">
          {CEPIC_INFO.email}
        </a>
      ),
      color: 'text-blue-600'
    },
    {
      icon: Clock,
      title: 'Horaires',
      content: (
        <div className="space-y-1 text-sm">
          <p>{CEPIC_INFO.hours.weekdays}</p>
          <p>{CEPIC_INFO.hours.saturday}</p>
          <p>{CEPIC_INFO.hours.sunday}</p>
        </div>
      ),
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Contactez-nous"
        subtitle="Nous sommes à votre écoute pour répondre à toutes vos questions"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Contact' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Mobile: Contact Info first */}
        <div className="lg:hidden space-y-4 mb-6">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-10 h-10 ${info.color}/10 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${info.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                      {info.title}
                    </h3>
                    <div className="text-xs text-gray-600">
                      {info.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6 lg:p-8"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Envoyez-nous un message
              </h2>

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-start sm:items-center"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <p className="text-sm text-green-800">
                    Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors text-base min-h-[48px]"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors text-base min-h-[48px]"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors text-base min-h-[48px]"
                      placeholder="+225 XX XX XX XX XX"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Sujet *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors text-base min-h-[48px]"
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="formation">Demande d'information sur une formation</option>
                      <option value="inscription">Inscription à une formation</option>
                      <option value="devis">Demande de devis</option>
                      <option value="partenariat">Partenariat</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors resize-none text-base"
                    placeholder="Décrivez votre demande..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full sm:w-auto min-h-[48px]"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Contact Info - Desktop */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 ${info.color}/10 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {info.title}
                      </h3>
                      <div className="text-sm text-gray-600">
                        {info.content}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">
                Localisation
              </h3>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <MapPin className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Cocody M'Badon village, Abidjan
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
