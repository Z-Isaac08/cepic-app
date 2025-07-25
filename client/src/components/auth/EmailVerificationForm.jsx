/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import Button from "../ui/Button";

const EmailVerificationForm = () => {
  const { checkEmail, loading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleInputChange = (value) => {
    setEmail(value);
    if (emailError) setEmailError("");
    if (error) clearError();
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email requis");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email invalide");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) return;

    try {
      await checkEmail(email);
    } catch (error) {
      console.error("Erreur vérification email:", error);
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
          <Mail className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Bienvenue
        </h1>
        <p className="text-gray-300 text-lg">
          Entrez votre email pour commencer
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
            value={email}
            onChange={(e) => handleInputChange(e.target.value)}
            className={`w-full p-4 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:border-transparent transition-all ${
              emailError ? "border-red-400 ring-1 ring-red-400" : ""
            }`}
            placeholder="votre@email.com"
            disabled={loading}
          />
          {emailError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-300 text-sm mt-1"
            >
              {emailError}
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
              Vérification...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              Suivant
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
          Démo - Emails de test
        </h4>
        <div className="text-blue-300 text-sm space-y-1">
          <p>
            👤 <strong>Utilisateurs existants</strong> : admin@test.com,
            user@test.com, demo@example.com
          </p>
          <p>
            ✨ <strong>Nouveaux utilisateurs</strong> : tout autre email
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmailVerificationForm;
