/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import Button from "../ui/Button";

const ExistingUserLoginForm = () => {
  const { userEmail, loginExistingUser, loading, error, clearError } =
    useAuthStore();

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (value) => {
    setPassword(value);
    if (passwordError) setPasswordError("");
    if (error) clearError();
  };

  const validate = () => {
    if (!password || password.length < 6) {
      setPasswordError("Mot de passe trop court (min. 6 caractères)");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await loginExistingUser(userEmail, password);
    } catch (err) {
      console.error("Erreur de connexion :", err);
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
          <Lock className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Connexion</h2>
        <p className="text-gray-300 text-sm">Email : {userEmail}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => handleChange(e.target.value)}
            className={`w-full p-4 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:border-transparent ${
              passwordError ? "border-red-400 ring-red-400" : ""
            }`}
            placeholder="******"
            disabled={loading}
          />
          {passwordError && (
            <p className="text-red-300 text-sm mt-1">{passwordError}</p>
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
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </motion.div>
  );
};

export default ExistingUserLoginForm;
