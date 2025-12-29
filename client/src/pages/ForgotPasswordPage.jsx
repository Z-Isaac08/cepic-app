import { motion } from 'framer-motion';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../components/ui';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation d'envoi
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <KeyRound className="w-7 h-7 sm:w-8 sm:h-8 text-primary-800" />
          </div>
        </div>
        <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
          Mot de passe oublié ?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 px-4">
          Entrez votre adresse email pour réinitialiser votre mot de passe.
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-6 sm:py-8 px-4 sm:px-6 shadow-sm sm:shadow sm:rounded-lg"
        >
          {!submitted ? (
            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Adresse email
                </label>
                <div className="relative rounded-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-3 py-3 text-base border border-gray-300 rounded-lg min-h-[48px]"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full flex justify-center min-h-[48px]">
                  Envoyer le lien de réinitialisation
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-green-100 mb-4">
                <Mail className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Email envoyé !</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                Si un compte existe avec cette adresse email ({email}), vous recevrez un lien pour
                réinitialiser votre mot de passe.
              </p>
              <div className="mt-6">
                <Button onClick={() => setSubmitted(false)} variant="outline" className="w-full min-h-[48px]">
                  Ressayer avec une autre adresse
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/connexion"
                className="font-medium text-primary-600 hover:text-primary-500 flex items-center justify-center py-2 min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la connexion
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
