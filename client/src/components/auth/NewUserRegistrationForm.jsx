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
        {/* Champs texte */}
        {[
          { name: "firstName", label: "Prénom" },
          { name: "lastName", label: "Nom" },
          { name: "password", label: "Mot de passe", type: "password" },
          {
            name: "confirmPassword",
            label: "Confirmation du mot de passe",
            type: "password",
          },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-white mb-1">
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              value={form[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={`w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-white ${
                formErrors[field.name] ? "border-red-400 ring-red-400" : ""
              }`}
              placeholder={field.label}
              disabled={loading}
            />
            {formErrors[field.name] && (
              <p className="text-red-300 text-sm mt-1">
                {formErrors[field.name]}
              </p>
            )}
          </div>
        ))}

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
