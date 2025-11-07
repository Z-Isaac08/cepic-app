import { motion } from "framer-motion";
import { Check, Eye, EyeOff, GraduationCap, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui";
import { CEPIC_INFO } from "../config/cepic";
import { useAuthStore } from "../stores/authStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, awaitingTwoFA } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      // Error is already in store
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex flex-col items-center">
              <img 
                src="/logo_cepic.jpg" 
                alt="Logo CEPIC" 
                className="w-32 h-32 object-contain mb-4 rounded-full border-2 border-primary-100 shadow-md"
              />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-800">{CEPIC_INFO.shortName}</div>
                <div className="text-sm text-gray-500">
                  {CEPIC_INFO.fullName}
                </div>
              </div>
            </Link>
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Bon retour !</h2>
            <p className="mt-2 text-gray-600">
              Connectez-vous pour accéder à vos formations
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
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
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-800 focus:ring-primary-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Se souvenir de moi
                </label>
              </div>

              <Link
                to="/mot-de-passe-oublie"
                className="text-sm font-medium text-primary-800 hover:text-primary-900"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full"
            >
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
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Vous n'avez pas de compte ?{" "}
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

      {/* Right Side - Image/Branding */}
      <div className="hidden lg:block lg:flex-1 relative bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-600">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-white"
          >
            <GraduationCap className="w-24 h-24 mx-auto mb-8 text-secondary-500" />
            <h1 className="text-4xl font-bold mb-4">Bienvenue sur CEPIC</h1>
            <p className="text-xl text-primary-100 mb-8 max-w-md mx-auto">
              {CEPIC_INFO.fullName}
            </p>
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-primary-900" />
                </div>
                <p className="text-primary-100">
                  Formations certifiantes reconnues
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-primary-900" />
                </div>
                <p className="text-primary-100">
                  Formateurs experts et certifiés
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-primary-900" />
                </div>
                <p className="text-primary-100">
                  Suivi personnalisé de votre progression
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
