/* eslint-disable no-unused-vars */
import { useEventStore } from "@stores/eventStore";
import { useAuthStore } from "@stores/authStore";
import { motion } from "framer-motion";
import {
  Check,
  CreditCard,
  Lock,
  Mail,
  Phone,
} from "lucide-react";
import { useState, useEffect } from "react";
import Button from "../ui/Button";

const RegistrationSteps = ({ onComplete }) => {
  const { event, registerForEvent, processPayment, loading } = useEventStore();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(2); // Skip step 1 since user is authenticated
  const [formData, setFormData] = useState({
    // Étape 1 - Informations personnelles (prefilled from auth)
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    position: "",

    // Étape 2 - Informations de paiement
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",

    // Adresse de facturation
    billingAddress: "",
    billingCity: "",
    billingZip: "",
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Prefill user data from authentication
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        // Set default cardName to user's full name
        cardName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      }));
    }
  }, [user]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price);
  };


  const validateStep2 = () => {
    const newErrors = {};

    if (formData.paymentMethod === "card") {
      if (!formData.cardNumber.trim())
        newErrors.cardNumber = "Numéro de carte requis";
      if (!formData.expiryDate.trim())
        newErrors.expiryDate = "Date d'expiration requise";
      if (!formData.cvv.trim()) newErrors.cvv = "CVV requis";
      if (!formData.cardName.trim())
        newErrors.cardName = "Nom sur la carte requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };


  const handleSubmit = async () => {
    if (!validateStep2()) return;

    try {
      // Simuler l'inscription
      await registerForEvent({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        position: formData.position,
      });

      // Simuler le paiement
      await processPayment({
        method: formData.paymentMethod,
        amount: event.price,
        cardNumber: formData.cardNumber,
        cardName: formData.cardName,
      });

      setIsSuccess(true);
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header avec titre et barre de progression */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        {!isSuccess && (
          <>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Paiement sécurisé
            </h2>
            <p className="text-gray-300 mb-6">
              Finalisez votre inscription pour {event.title}
            </p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm mb-2 text-white">
                <span className="opacity-100 flex items-center">
                  <Check className="w-4 h-4 mr-1" />
                  Connecté
                </span>
                <span className="opacity-100">
                  Paiement
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  className="bg-white h-2 rounded-full"
                  initial={{ width: "50%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Contenu principal */}
      <div className="bg-white/10 backdrop-blur-md m-7 rounded-2xl p-5 md:p-12">
        {isSuccess ? (
          <SuccessStep event={event} onComplete={onComplete} />
        ) : (
          <Step2Payment
            formData={formData}
            errors={errors}
            event={event}
            user={user}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};


// ===============================
// Étape 2 - Paiement
// ===============================
const Step2Payment = ({
  formData,
  errors,
  event,
  user,
  onChange,
  onSubmit,
  loading,
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Finaliser votre inscription
        </h3>
        <p className="text-gray-300">Sécurisez votre place maintenant</p>
      </div>

      {/* Récapitulatif */}
      <div className="bg-white/20 rounded-lg p-6 mb-6">
        <h4 className="font-semibold text-white mb-4">
          Récapitulatif de votre commande
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-300">
            <span>Événement</span>
            <span className="font-medium text-white">{event.title}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Participant</span>
            <span className="font-medium text-white">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Email</span>
            <span className="font-medium text-white">
              {user?.email}
            </span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Date</span>
            <span className="font-medium text-white">
              {new Date(event.date).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <hr className="border-white/30 my-3" />
          <div className="flex justify-between text-lg font-bold text-white">
            <span>Total</span>
            <span>{formatPrice(event.price)} FCFA</span>
          </div>
        </div>
      </div>

      {/* Méthodes de paiement */}
      <div>
        <label className="block text-sm font-medium text-white mb-4">
          Méthode de paiement
        </label>
        <div className="space-y-3">
          <label className="flex items-center p-4 bg-white/10 border border-white/30 rounded-lg cursor-pointer hover:bg-white/20 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={formData.paymentMethod === "card"}
              onChange={(e) => onChange("paymentMethod", e.target.value)}
              className="text-primary-600"
            />
            <CreditCard className="w-5 h-5 ml-3 mr-3 text-white" />
            <span className="font-medium text-white">Carte bancaire</span>
            <div className="ml-auto flex space-x-2">
              <div className="bg-white text-blue-600 px-2 py-1 rounded text-xs font-bold">
                VISA
              </div>
              <div className="bg-white text-red-600 px-2 py-1 rounded text-xs font-bold">
                MC
              </div>
            </div>
          </label>

          <label className="flex items-center p-4 bg-white/10 border border-white/30 rounded-lg cursor-pointer hover:bg-white/20 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="mobile"
              checked={formData.paymentMethod === "mobile"}
              onChange={(e) => onChange("paymentMethod", e.target.value)}
              className="text-primary-600"
            />
            <Phone className="w-5 h-5 ml-3 mr-3 text-white" />
            <span className="font-medium text-white">Mobile Money</span>
            <div className="ml-auto text-sm text-gray-300">
              Orange Money, MTN Money
            </div>
          </label>
        </div>
      </div>

      {/* Formulaire carte bancaire */}
      {formData.paymentMethod === "card" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Nom sur la carte *
            </label>
            <input
              type="text"
              value={formData.cardName}
              onChange={(e) => onChange("cardName", e.target.value)}
              className={`w-full p-4 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:border-transparent transition-all ${
                errors.cardName ? "border-red-400" : ""
              }`}
              placeholder="Nom comme sur la carte"
            />
            {errors.cardName && (
              <p className="text-red-300 text-sm mt-1">{errors.cardName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Numéro de carte *
            </label>
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => onChange("cardNumber", e.target.value)}
              className={`w-full p-4 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:border-transparent transition-all ${
                errors.cardNumber ? "border-red-400" : ""
              }`}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
            />
            {errors.cardNumber && (
              <p className="text-red-300 text-sm mt-1">{errors.cardNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Date d'expiration *
              </label>
              <input
                type="text"
                value={formData.expiryDate}
                onChange={(e) => onChange("expiryDate", e.target.value)}
                className={`w-full p-4 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:border-transparent transition-all ${
                  errors.expiryDate ? "border-red-400" : ""
                }`}
                placeholder="MM/AA"
                maxLength="5"
              />
              {errors.expiryDate && (
                <p className="text-red-300 text-sm mt-1">{errors.expiryDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                CVV *
              </label>
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) => onChange("cvv", e.target.value)}
                className={`w-full p-4 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:border-transparent transition-all ${
                  errors.cvv ? "border-red-400" : ""
                }`}
                placeholder="123"
                maxLength="4"
              />
              {errors.cvv && (
                <p className="text-red-300 text-sm mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Informations Mobile Money */}
      {formData.paymentMethod === "mobile" && (
        <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
          <div className="flex items-start">
            <Phone className="w-5 h-5 text-blue-300 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium text-blue-200 mb-2">
                Paiement Mobile Money
              </h4>
              <p className="text-blue-300 text-sm">
                Après confirmation, vous recevrez un SMS avec les instructions
                pour finaliser le paiement via Orange Money ou MTN Money.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Security notice */}
      <div className="flex items-center space-x-2 text-sm text-gray-300 bg-white/10 p-3 rounded-lg">
        <Lock className="w-4 h-4 text-green-400" />
        <span>Vos informations de paiement sont sécurisées et cryptées</span>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-6">
        <Button
          variant="primary"
          size="lg"
          onClick={onSubmit}
          disabled={loading}
          className="min-w-[180px] bg-white text-dark-900 hover:bg-gray-100"
        >
          {loading ? (
            <span className="flex items-center">
              <div className="w-5 h-5 border-2 border-dark-900 border-t-transparent rounded-full animate-spin mr-2"></div>
              Traitement...
            </span>
          ) : (
            <span className="flex items-center">
              Confirmer l'inscription
              <Check className="w-5 h-5 ml-2" />
            </span>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

// ===============================
// Écran de succès
// ===============================
const SuccessStep = ({ event, onComplete }) => {
  const registrationId = `REG-${Date.now()}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-10 h-10 text-green-400" />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Inscription confirmée !
        </h3>
        <p className="text-gray-300">
          Félicitations ! Votre place pour{" "}
          <strong className="text-white">{event.title}</strong> est réservée.
        </p>
      </div>

      <div className="bg-white/20 rounded-lg p-6">
        <h4 className="font-semibold text-white mb-4">
          Détails de votre inscription
        </h4>
        <div className="space-y-2 text-left">
          <div className="flex justify-between text-gray-300">
            <span>Numéro d'inscription</span>
            <span className="font-mono font-medium text-white">
              {registrationId}
            </span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Date de l'événement</span>
            <span className="font-medium text-white">
              {new Date(event.date).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Lieu</span>
            <span className="font-medium text-white">
              {event.location.venue}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
        <div className="flex items-start">
          <Mail className="w-5 h-5 text-blue-300 mt-0.5 mr-3" />
          <div className="text-left">
            <h4 className="font-medium text-blue-200 mb-1">
              Confirmation par email
            </h4>
            <p className="text-blue-300 text-sm">
              Un email de confirmation avec votre QR code d'accès vous a été
              envoyé. Présentez-le le jour de l'événement.
            </p>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={onComplete}
        className="w-full bg-white text-dark-900 hover:bg-gray-100"
      >
        Parfait, merci !
      </Button>
    </motion.div>
  );
};

export default RegistrationSteps;
