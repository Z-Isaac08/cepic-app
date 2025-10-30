// Export tous les services API
export * as trainingsAPI from './trainings';
export * as enrollmentsAPI from './enrollments';
export * as paymentsAPI from './payments';

// Export par défaut pour import simplifié
import trainings from './trainings';
import enrollments from './enrollments';
import payments from './payments';

export default {
  trainings,
  enrollments,
  payments
};
