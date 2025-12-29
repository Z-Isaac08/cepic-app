import { motion } from 'framer-motion';
import { ArrowLeft, Check, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui';
import { CEPIC_INFO } from '../config/cepic';
import { useAuthStore } from '../stores/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, awaitingTwoFA } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      // Login always succeeds directly (no 2FA for login)
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      // Error is already in store
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Header with Logo and Welcome Message */}
      <div className="lg:hidden bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-600 py-8 px-4 text-center relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 text-white/80 hover:text-white transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-4">
          <img src="/logo.jpg" alt="CEPIC" className="w-16 h-16 rounded-full border-2 border-secondary-500 shadow-lg" />
        </Link>
        <h1 className="text-xl font-bold text-white mb-2">Bienvenue sur CEPIC</h1>
        <p className="text-sm text-primary-100 max-w-xs mx-auto">{CEPIC_INFO.fullName}</p>
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-6 sm:space-y-8"
        >
          {/* Title */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Bon retour !</h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">Connectez-vous pour accéder à vos formations</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-5 sm:space-y-6">
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors text-base min-h-[48px]"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-3 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors text-base min-h-[48px]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center min-w-[44px] justify-center"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center min-h-[44px]">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 text-primary-800 focus:ring-primary-600 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Se souvenir de moi
                </label>
              </div>

              <Link
                to="/mot-de-passe-oublie"
                className="text-sm font-medium text-primary-800 hover:text-primary-900 py-2 min-h-[44px] inline-flex items-center"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit Button */}
            <Button type="submit" size="lg" disabled={loading} className="w-full min-h-[48px]">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Connexion...
                </>
              ) : (
                <>Se connecter</>
              )}
            </Button>

            {/* Register Link */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                Vous n'avez pas de compte ?{' '}
                <Link
                  to="/inscription"
                  className="font-medium text-primary-800 hover:text-primary-900"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Right Side - Image/Branding (Desktop only) */}
      <div className="hidden lg:block lg:flex-1 relative bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-600">
        <div className="absolute inset-0 flex items-center justify-center p-8 xl:p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-white"
          >
            <img
              src="/logo.jpg"
              alt="Logo CEPIC"
              className="w-24 xl:w-32 h-24 xl:h-32 mx-auto mb-4 xl:mb-6 rounded-full border-4 border-secondary-500 shadow-lg"
            />
            <h1 className="text-3xl xl:text-4xl font-bold mb-3 xl:mb-4">Bienvenue sur CEPIC</h1>
            <p className="text-lg xl:text-xl text-primary-100 mb-6 xl:mb-8 max-w-md mx-auto">{CEPIC_INFO.fullName}</p>
            <div className="space-y-3 xl:space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-primary-900" />
                </div>
                <p className="text-primary-100 text-sm xl:text-base">Formations certifiantes reconnues</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-primary-900" />
                </div>
                <p className="text-primary-100 text-sm xl:text-base">Formateurs experts et certifiés</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-primary-900" />
                </div>
                <p className="text-primary-100 text-sm xl:text-base">Suivi personnalisé de votre progression</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
