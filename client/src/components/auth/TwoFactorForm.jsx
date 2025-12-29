/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import Button from "../ui/Button";

const TwoFactorForm = () => {
  const {
    verify2FA,
    resend2FA,
    backToLogin,
    userEmail,
    loading,
    error,
    clearError,
  } = useAuthStore();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  // Cooldown pour le resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleCodeChange = (index, value) => {
    // Ne permettre que les chiffres
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;

    setCode(newCode);

    // Clear error when user starts typing
    if (error) clearError();

    // Passer au champ suivant si une valeur est entrée
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Soumission automatique si tous les champs sont remplis
    if (
      newCode.every((digit) => digit !== "") &&
      newCode.join("").length === 6
    ) {
      handleSubmit(newCode.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    // Retour arrière
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Flèches gauche/droite
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pastedData.length === 6) {
      const newCode = pastedData.split("");
      setCode(newCode);
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (submitCode = null) => {
    const finalCode = submitCode || code.join("");

    if (finalCode.length !== 6) {
      return;
    }

    try {
      await verify2FA(finalCode);
    } catch (error) {
      // L'erreur est gérée par le store
      console.error("Erreur 2FA:", error);
      // Reset le code en cas d'erreur
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    try {
      await resend2FA();
      setResendCooldown(30); // 30 secondes de cooldown
    } catch (error) {
      console.error("Erreur resend:", error);
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
          <Shield className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Vérification
        </h1>
        <p className="text-gray-300 text-lg mb-2">
          Entrez le code envoyé à votre email
        </p>
        <p className="text-primary-300 font-medium">{userEmail}</p>
      </div>

      {/* Code Input */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-white mb-4 text-center">
          Code de vérification (6 chiffres)
        </label>

        <div className="flex justify-center space-x-3 mb-4">
          {code.map((digit, index) => (
            <motion.input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`w-12 h-14 text-center text-xl font-bold bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-white focus:border-transparent transition-all ${
                error ? "border-red-400 ring-1 ring-red-400" : ""
              } ${digit ? "bg-white/30" : ""}`}
              disabled={loading}
              aria-label={`Chiffre ${index + 1} sur 6`}
              aria-invalid={error ? "true" : "false"}
              inputMode="numeric"
              pattern="[0-9]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-red-500/20 border border-red-400/30 rounded-lg mb-4"
          >
            <p className="text-red-300 text-sm text-center">{error}</p>
          </motion.div>
        )}

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-gray-300 text-sm mb-2">
            Vous n'avez pas reçu le code ?
          </p>
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || loading}
            className="text-primary-300 hover:text-primary-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto space-x-1"
          >
            <RotateCcw className="w-4 h-4" />
            <span>
              {resendCooldown > 0
                ? `Renvoyer dans ${resendCooldown}s`
                : "Renvoyer le code"}
            </span>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <Button
          onClick={() => handleSubmit()}
          variant="primary"
          size="lg"
          className="w-full bg-white text-dark-900 hover:bg-gray-100"
          disabled={loading || code.join("").length !== 6}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-dark-900 border-t-transparent rounded-full animate-spin mr-2" />
              Vérification...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              Vérifier le code
              <ArrowRight className="w-5 h-5 ml-2" />
            </span>
          )}
        </Button>

        <Button
          onClick={backToLogin}
          variant="outline"
          size="lg"
          className="w-full border-white text-white hover:bg-white hover:text-dark-900"
          disabled={loading}
        >
          <span className="flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à la connexion
          </span>
        </Button>
      </div>

      {/* Demo Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-4 bg-green-500/20 border border-green-400/30 rounded-lg"
      >
        <h4 className="text-green-200 font-medium mb-2">💡 Démo</h4>
        <p className="text-green-300 text-sm">
          Utilisez le code <strong>123456</strong> pour vous connecter
        </p>
      </motion.div>
    </motion.div>
  );
};

export default TwoFactorForm;
