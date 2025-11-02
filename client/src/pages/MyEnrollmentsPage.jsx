import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { 
  GraduationCap, 
  Clock, 
  Calendar,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { PageHeader, LoadingSpinner, EmptyState, Badge, Button } from '../components/ui';
import { useEnrollmentStore } from '../stores/enrollmentStore';
import { useAuthStore } from '../stores/authStore';

const MyEnrollmentsPage = () => {
  const { user } = useAuthStore();
  const { enrollments, loading, fetchMyEnrollments } = useEnrollmentStore();
  const [filter, setFilter] = useState('all'); // all, active, completed, cancelled

  useEffect(() => {
    if (user) {
      fetchMyEnrollments();
    }
  }, [user, fetchMyEnrollments]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: 'warning', label: 'En attente', icon: AlertCircle },
      ACTIVE: { variant: 'primary', label: 'En cours', icon: CheckCircle },
      COMPLETED: { variant: 'success', label: 'Terminée', icon: CheckCircle },
      CANCELLED: { variant: 'default', label: 'Annulée', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center">
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus) => {
    const paymentConfig = {
      UNPAID: { variant: 'danger', label: 'Non payé' },
      PENDING: { variant: 'warning', label: 'En attente' },
      PAID: { variant: 'success', label: 'Payé' },
      REFUNDED: { variant: 'default', label: 'Remboursé' }
    };

    const config = paymentConfig[paymentStatus] || paymentConfig.UNPAID;

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (filter === 'all') return true;
    if (filter === 'active') return enrollment.status === 'ACTIVE';
    if (filter === 'completed') return enrollment.status === 'COMPLETED';
    if (filter === 'cancelled') return enrollment.status === 'CANCELLED';
    return true;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader 
          title="Mes Inscriptions"
          subtitle="Gérez vos formations"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EmptyState
            icon={GraduationCap}
            title="Connexion requise"
            description="Vous devez être connecté pour voir vos inscriptions."
            action={
              <Button onClick={() => window.location.href = '/connexion'}>
                Se connecter
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Mes Inscriptions"
        subtitle="Gérez vos formations et téléchargez vos certificats"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Mes Inscriptions' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'active', label: 'En cours' },
            { id: 'completed', label: 'Terminées' },
            { id: 'cancelled', label: 'Annulées' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                filter === tab.id
                  ? 'bg-primary-800 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-sm">
                ({enrollments.filter(e => {
                  if (tab.id === 'all') return true;
                  if (tab.id === 'active') return e.status === 'ACTIVE';
                  if (tab.id === 'completed') return e.status === 'COMPLETED';
                  if (tab.id === 'cancelled') return e.status === 'CANCELLED';
                  return false;
                }).length})
              </span>
            </button>
          ))}
        </div>

        {/* Enrollments List */}
        {filteredEnrollments.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="Aucune inscription"
            description={
              filter === 'all'
                ? "Vous n'êtes inscrit à aucune formation pour le moment."
                : `Vous n'avez aucune formation ${filter === 'active' ? 'en cours' : filter === 'completed' ? 'terminée' : 'annulée'}.`
            }
            action={
              <Link to="/formations">
                <Button>
                  Parcourir les formations
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-6">
            {filteredEnrollments.map((enrollment, index) => (
              <motion.div
                key={enrollment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Training Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Link 
                            to={`/formations/${enrollment.training.id}`}
                            className="text-xl font-bold text-gray-900 hover:text-primary-800 transition-colors"
                          >
                            {enrollment.training.title}
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">
                            {enrollment.training.category?.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Inscrit le {formatDate(enrollment.enrolledAt)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {enrollment.training.duration} {enrollment.training.durationUnit === 'hours' ? 'heures' : 'jours'}
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          {formatPrice(enrollment.amount)}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {getStatusBadge(enrollment.status)}
                        {getPaymentBadge(enrollment.paymentStatus)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:w-48">
                      <Link to={`/trainings/${enrollment.training.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Voir la formation
                        </Button>
                      </Link>

                      {enrollment.certificateUrl && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(enrollment.certificateUrl, '_blank')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Certificat
                        </Button>
                      )}

                      {enrollment.paymentStatus === 'UNPAID' && enrollment.status !== 'CANCELLED' && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          onClick={() => window.location.href = `/payment/${enrollment.id}`}
                        >
                          Payer maintenant
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar (for active enrollments) */}
                  {enrollment.status === 'ACTIVE' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Progression</span>
                        <span className="font-semibold">75%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-600 to-secondary-500 transition-all duration-300"
                          style={{ width: '75%' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnrollmentsPage;
