import { motion } from 'framer-motion';
import { ArrowLeft, Check, Eye, EyeOff, Lock, Mail, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '../components/ui';
import { CEPIC_INFO } from '../config/cepic';
import { useAuthStore } from '../stores/authStore';

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    register,
    verifyTwoFA,
    resendTwoFA,
    cancelTwoFA,
    loading,
    error,
    fieldErrors,
    awaitingTwoFA,
  } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [twoFACode, setTwoFACode] = useState('');

  // Combine local formErrors avec fieldErrors du store
  const allErrors = { ...fieldErrors, ...formErrors };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (formData.password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      // 2FA form will show automatically via awaitingTwoFA state
      if (result.requiresTwoFA) {
        console.log('2FA required - showing verification form');
      } else if (result.success) {
        navigate('/');
      }
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  const handleVerifyTwoFA = async (e) => {
    e.preventDefault();
    try {
      await verifyTwoFA(twoFACode);
      navigate('/');
    } catch (err) {
      console.error('2FA verification error:', err);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendTwoFA();
      toast.success('Code renvoyé avec succès!');
    } catch (err) {
      console.error('Resend error:', err);
      toast.error('Erreur lors du renvoi du code');
    }
  };

  const handleCancelTwoFA = () => {
    cancelTwoFA();
    setTwoFACode('');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
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
          <img
            src="/logo.jpg"
            alt="CEPIC"
            className="w-16 h-16 rounded-full border-2 border-secondary-500 shadow-lg"
          />
        </Link>
        <h1 className="text-xl font-bold text-white mb-2">Rejoignez {CEPIC_INFO.shortName}</h1>
        <p className="text-sm text-primary-100 max-w-xs mx-auto">
          Commencez votre parcours de formation professionnelle
        </p>
      </div>

      {/* Left Side - Image/Branding (Desktop only) */}
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
            <h1 className="text-3xl xl:text-4xl font-bold mb-3 xl:mb-4">
              Rejoignez {CEPIC_INFO.shortName}
            </h1>
            <p className="text-lg xl:text-xl text-primary-100 mb-6 xl:mb-8 max-w-md mx-auto">
              Commencez votre parcours de formation professionnelle dès aujourd'hui
            </p>
            <div className="space-y-3 xl:space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-primary-900" />
                </div>
                <p className="text-primary-100 text-sm xl:text-base">
                  Accès à plus de 50 formations
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-primary-900" />
                </div>
                <p className="text-primary-100 text-sm xl:text-base">Certificats reconnus</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-primary-900" />
                </div>
                <p className="text-primary-100 text-sm xl:text-base">
                  Support et accompagnement personnalisé
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-6 sm:space-y-8"
        >
          {/* Title */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {awaitingTwoFA ? 'Vérification 2FA' : 'Créer un compte'}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {awaitingTwoFA
                ? 'Entrez le code de vérification envoyé à votre email'
                : 'Inscrivez-vous gratuitement pour commencer'}
            </p>
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

          {/* Conditional Forms */}
          {awaitingTwoFA ? (
            /* 2FA Verification Form */
            <form onSubmit={handleVerifyTwoFA} className="mt-6 sm:mt-8 space-y-5 sm:space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-100 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-primary-800" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="twoFACode"
                  className="block text-sm font-medium text-gray-700 mb-2 text-center"
                >
                  Code de vérification
                </label>
                <input
                  id="twoFACode"
                  type="text"
                  inputMode="numeric"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="block w-full px-4 py-3 sm:py-4 text-center text-xl sm:text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors min-h-[56px]"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
                <p className="mt-2 text-xs sm:text-sm text-gray-500 text-center">
                  Entrez le code à 6 chiffres envoyé à votre email
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading || twoFACode.length !== 6}
                className="w-full min-h-[48px]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Vérification...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Vérifier le code
                  </>
                )}
              </Button>

              <div className="flex flex-col space-y-3 items-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-sm text-primary-800 hover:text-primary-900 font-medium py-2 min-h-[44px]"
                >
                  Renvoyer le code
                </button>
                <button
                  type="button"
                  onClick={handleCancelTwoFA}
                  className="text-sm text-gray-600 hover:text-gray-900 py-2 min-h-[44px]"
                >
                  Annuler et recommencer
                </button>
              </div>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                  >
                    Prénom *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors text-base min-h-[48px] ${
                        allErrors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Jean"
                    />
                  </div>
                  {allErrors.firstName && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">{allErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                  >
                    Nom *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors text-base min-h-[48px] ${
                      allErrors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Dupont"
                  />
                  {allErrors.lastName && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">{allErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                >
                  Adresse email *
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
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors text-base min-h-[48px] ${
                      allErrors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="votre@email.com"
                  />
                </div>
                {allErrors.email && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{allErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                >
                  Mot de passe *
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
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors text-base min-h-[48px] ${
                      allErrors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center min-w-[44px] justify-center"
                    aria-label={showPassword ? 'Masquer' : 'Afficher'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {allErrors.password && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{allErrors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2"
                >
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors text-base min-h-[48px] ${
                      allErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center min-w-[44px] justify-center"
                    aria-label={showConfirmPassword ? 'Masquer' : 'Afficher'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {allErrors.confirmPassword && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">
                    {allErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start py-2">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-5 w-5 text-primary-800 focus:ring-primary-600 border-gray-300 rounded mt-0.5"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-xs sm:text-sm text-gray-700 leading-relaxed"
                >
                  J'accepte les{' '}
                  <Link
                    to="/conditions"
                    className="text-primary-800 hover:text-primary-900 font-medium"
                  >
                    conditions d'utilisation
                  </Link>{' '}
                  et la{' '}
                  <Link
                    to="/confidentialite"
                    className="text-primary-800 hover:text-primary-900 font-medium"
                  >
                    politique de confidentialité
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button type="submit" size="lg" disabled={loading} className="w-full min-h-[48px]">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Création du compte...
                  </>
                ) : (
                  <>Créer mon compte</>
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  Vous avez déjà un compte ?{' '}
                  <Link
                    to="/connexion"
                    className="font-medium text-primary-800 hover:text-primary-900"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
