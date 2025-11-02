import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui";
import { useAuthStore } from "../stores/authStore";

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    register,
    verifyTwoFA,
    resendTwoFA,
    cancelTwoFA,
    loading,
    error,
    awaitingTwoFA,
  } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [twoFACode, setTwoFACode] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (formData.password.length < 8) {
      errors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas";
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
        phone: formData.phone,
        password: formData.password,
      });

      // 2FA form will show automatically via awaitingTwoFA state
      if (result.requiresTwoFA) {
        console.log("2FA required - showing verification form");
      } else if (result.success) {
        navigate("/");
      }
    } catch (err) {
      console.error("Register error:", err);
    }
  };

  const handleVerifyTwoFA = async (e) => {
    e.preventDefault();
    try {
      await verifyTwoFA(twoFACode);
      navigate("/");
    } catch (err) {
      console.error("2FA verification error:", err);
    }
  };

  const handleResendCode = async () => {
    try {
      await resendTwoFA();
      toast.success("Code renvoyé avec succès!");
    } catch (err) {
      console.error("Resend error:", err);
      toast.error("Erreur lors du renvoi du code");
    }
  };

  const handleCancelTwoFA = () => {
    cancelTwoFA();
    setTwoFACode("");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:block lg:flex-1 relative bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-600">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-white"
          >
            <GraduationCap className="w-24 h-24 mx-auto mb-8 text-secondary-500" />
            <h1 className="text-4xl font-bold mb-4">Rejoignez CEPIC</h1>
            <p className="text-xl text-primary-100 mb-8 max-w-md mx-auto">
              Commencez votre parcours de formation professionnelle dès
              aujourd'hui
            </p>
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-primary-900" />
                </div>
                <p className="text-primary-100">
                  Accès à plus de 50 formations
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-primary-900" />
                </div>
                <p className="text-primary-100">Certificats reconnus</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-primary-900" />
                </div>
                <p className="text-primary-100">
                  Support et accompagnement personnalisé
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8 py-12"
        >
          {/* Logo */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="w-12 h-12 bg-primary-800 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-secondary-500" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-primary-800">CEPIC</div>
                <div className="text-xs text-gray-500">
                  Formation professionnelle
                </div>
              </div>
            </Link>
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              {awaitingTwoFA ? "Vérification 2FA" : "Créer un compte"}
            </h2>
            <p className="mt-2 text-gray-600">
              {awaitingTwoFA
                ? "Entrez le code de vérification envoyé à votre email"
                : "Inscrivez-vous gratuitement pour commencer"}
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

          {/* Conditional Forms */}
          {awaitingTwoFA ? (
            /* 2FA Verification Form */
            <form onSubmit={handleVerifyTwoFA} className="mt-8 space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                  <Shield className="w-10 h-10 text-primary-800" />
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
                  value={twoFACode}
                  onChange={(e) =>
                    setTwoFACode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="block w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Entrez le code à 6 chiffres envoyé à votre email
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading || twoFACode.length !== 6}
                className="w-full"
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

              <div className="flex flex-col space-y-3">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-sm text-primary-800 hover:text-primary-900 font-medium"
                >
                  Renvoyer le code
                </button>
                <button
                  type="button"
                  onClick={handleCancelTwoFA}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Annuler et recommencer
                </button>
              </div>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors"
                      placeholder="Jean"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors"
                    placeholder="Dupont"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Téléphone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors"
                    placeholder="+225 XX XX XX XX XX"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors ${
                      formErrors.password ? "border-red-300" : "border-gray-300"
                    }`}
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
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors ${
                      formErrors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary-800 focus:ring-primary-600 border-gray-300 rounded mt-1"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  J'accepte les{" "}
                  <Link
                    to="/conditions"
                    className="text-primary-800 hover:text-primary-900 font-medium"
                  >
                    conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link
                    to="/confidentialite"
                    className="text-primary-800 hover:text-primary-900 font-medium"
                  >
                    politique de confidentialité
                  </Link>
                </label>
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
                    Création du compte...
                  </>
                ) : (
                  <>Créer mon compte</>
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Vous avez déjà un compte ?{" "}
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
