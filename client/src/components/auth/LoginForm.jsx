/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import Button from "../ui/Button";

const LoginForm = () => {
  const { login, loading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear errors when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email invalide";
    }

    if (!formData.password) {
      errors.password = "Mot de passe requis";
    } else if (formData.password.length < 6) {
      errors.password = "Mot de passe trop court (min. 6 caractères)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
    } catch (error) {
      // L'erreur est gérée par le store
      console.error("Erreur de connexion:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Lock className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Bienvenue
        </h1>
        <p className="text-gray-300 text-lg">
          Connectez-vous pour accéder à l'événement
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Adresse email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full p-4 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:border-transparent transition-all ${
              formErrors.email ? "border-red-400 ring-1 ring-red-400" : ""
            }`}
            placeholder="votre@email.com"
            disabled={loading}
          />
          {formErrors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-300 text-sm mt-1"
            >
              {formErrors.email}
            </motion.p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Lock className="w-4 h-4 inline mr-2" />
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`w-full p-4 pr-12 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:border-transparent transition-all ${
                formErrors.password ? "border-red-400 ring-1 ring-red-400" : ""
              }`}
              placeholder="Votre mot de passe"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {formErrors.password && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-300 text-sm mt-1"
            >
              {formErrors.password}
            </motion.p>
          )}
        </div>

        {/* Global Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-red-500/20 border border-red-400/30 rounded-lg"
          >
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full bg-white text-dark-900 hover:bg-gray-100"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-dark-900 border-t-transparent rounded-full animate-spin mr-2" />
              Connexion en cours...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              Se connecter
              <ArrowRight className="w-5 h-5 ml-2" />
            </span>
          )}
        </Button>
      </form>

      {/* Demo Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg"
      >
        <h4 className="text-blue-200 font-medium mb-2">
          Démo - Informations de test
        </h4>
        <div className="text-blue-300 text-sm space-y-1">
          <p>📧 Email : n'importe quel email valide</p>
          <p>🔒 Mot de passe : minimum 6 caractères</p>
          <p>
            🔐 Code 2FA : <strong>123456</strong>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;
