import { motion } from "framer-motion";
import { ArrowLeft, Calendar, CheckCircle, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Button } from "../components/ui";
import { getTrainingById } from "../services/api/trainings";
import { useAuthStore } from "../stores/authStore";

const EnrollPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");

  useEffect(() => {
    // Si pas connecté, rediriger vers login
    if (!user) {
      navigate("/connexion", {
        state: {
          from: `/enroll/${id}`,
          message:
            "Veuillez vous connecter pour vous inscrire à cette formation",
        },
      });
      return;
    }

    // Charger les détails de la formation depuis l'API
    const fetchTraining = async () => {
      try {
        const response = await getTrainingById(id);
        console.log("API Response:", response);
        // L'API retourne { success: true, data: training }
        setTraining(response.data);
      } catch (error) {
        console.error("Error loading training:", error);
        setTraining(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTraining();
  }, [user, id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implémenter la logique de paiement
    console.log("Processing payment with method:", paymentMethod);

    // Rediriger vers confirmation
    navigate("/mes-inscriptions", {
      state: {
        message: "Inscription réussie! Vous recevrez un email de confirmation.",
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Formation non trouvée
          </h2>
          <Link to="/formations">
            <Button>Retour aux formations</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/formations/${id}`}
            className="inline-flex items-center text-primary-800 hover:text-primary-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la formation
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Inscription à la formation
          </h1>
          <p className="mt-2 text-gray-600">
            Complétez votre inscription et procédez au paiement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de paiement */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Informations de paiement
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations de l'utilisateur */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Vos informations
                  </h3>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Nom complet</p>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Mode de paiement */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Mode de paiement
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-800 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="mobile_money"
                        checked={paymentMethod === "mobile_money"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-primary-800 focus:ring-primary-600"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">
                          Mobile Money
                        </p>
                        <p className="text-sm text-gray-600">
                          Orange Money, MTN Money, Moov Money
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-800 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="bank_transfer"
                        checked={paymentMethod === "bank_transfer"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-primary-800 focus:ring-primary-600"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">
                          Virement bancaire
                        </p>
                        <p className="text-sm text-gray-600">
                          Paiement par virement
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-800 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="on_site"
                        checked={paymentMethod === "on_site"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-primary-800 focus:ring-primary-600"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">
                          Paiement sur place
                        </p>
                        <p className="text-sm text-gray-600">
                          Payez directement au centre
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Bouton de soumission */}
                <div className="pt-4">
                  <Button type="submit" size="lg" className="w-full">
                    Confirmer l'inscription
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6 sticky top-24"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Récapitulatif
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {training.title}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {training.duration}{" "}
                      {training.durationUnit === "hours" ? "heures" : "jours"}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {training.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Max {training.maxParticipants} participants
                    </div>
                  </div>
                </div>

                <hr />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Prix de la formation</span>
                    <span className="font-medium">
                      {(training.cost / 100).toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frais de dossier</span>
                    <span className="font-medium">0 FCFA</span>
                  </div>
                </div>

                <hr />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-800">
                    {(training.cost / 100).toLocaleString()} FCFA
                  </span>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium mb-1">Garantie CEPIC</p>
                      <p>Certification reconnue et suivi personnalisé inclus</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollPage;
