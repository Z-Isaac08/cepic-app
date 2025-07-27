/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import Button from "../ui/Button";

const NewUserRegistrationForm = () => {
  const { userEmail, loading, error, clearError, registerNewUser } =
    useAuthStore();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
    if (error) clearError();
  };

  const validateForm = () => {
    const errors = {};

    if (!form.firstName.trim()) errors.firstName = "Prénom requis";
    if (!form.lastName.trim()) errors.lastName = "Nom requis";
    if (!form.password || form.password.length < 6)
      errors.password = "Mot de passe trop court (min. 6 caractères)";
    if (form.password !== form.confirmPassword)
      errors.confirmPassword = "Les mots de passe ne correspondent pas";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await registerNewUser({
        email: userEmail,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password,
      });
    } catch (err) {
      console.error("Erreur lors de l'inscription", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserPlus className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Créer un compte</h2>
        <p className="text-gray-300 text-sm">Email : {userEmail}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Prénom */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Prénom
          </label>
          <input
            type="text"
            value={form.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className={`w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-white ${
              formErrors.firstName ? "border-red-400 ring-red-400" : ""
            }`}
            placeholder="Prénom"
            disabled={loading}
          />
          {formErrors.firstName && (
            <p className="text-red-300 text-sm mt-1">
              {formErrors.firstName}
            </p>
          )}
        </div>

        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Nom
          </label>
          <input
            type="text"
            value={form.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className={`w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-white ${
              formErrors.lastName ? "border-red-400 ring-red-400" : ""
            }`}
            placeholder="Nom"
            disabled={loading}
          />
          {formErrors.lastName && (
            <p className="text-red-300 text-sm mt-1">
              {formErrors.lastName}
            </p>
          )}
        </div>

        {/* Mot de passe */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            value={form.password || ""}
            onChange={(e) => handleChange("password", e.target.value)}
            className={`w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-white ${
              formErrors.password ? "border-red-400 ring-red-400" : ""
            }`}
            placeholder="Mot de passe"
            disabled={loading}
          />
          {formErrors.password && (
            <p className="text-red-300 text-sm mt-1">
              {formErrors.password}
            </p>
          )}
        </div>

        {/* Confirmation du mot de passe */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Confirmation du mot de passe
          </label>
          <input
            type="password"
            value={form.confirmPassword || ""}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className={`w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-white ${
              formErrors.confirmPassword ? "border-red-400 ring-red-400" : ""
            }`}
            placeholder="Confirmation du mot de passe"
            disabled={loading}
          />
          {formErrors.confirmPassword && (
            <p className="text-red-300 text-sm mt-1">
              {formErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* Erreur globale */}
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full bg-white text-dark-900 hover:bg-gray-100"
          disabled={loading}
        >
          {loading ? "Création en cours..." : "Créer mon compte"}
        </Button>
      </form>
    </motion.div>
  );
};

export default NewUserRegistrationForm;
