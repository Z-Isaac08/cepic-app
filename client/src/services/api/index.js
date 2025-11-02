// Export tous les services API CEPIC
export * as authAPI from './auth';
export * as trainingsAPI from './trainings';
export * as categoriesAPI from './categories';
export * as enrollmentsAPI from './enrollments';
export * as paymentsAPI from './payments';
export * as galleryAPI from './gallery';
export * as contactAPI from './contact';

// Export par défaut pour import simplifié
import auth from './auth';
import trainings from './trainings';
import categories from './categories';
import enrollments from './enrollments';
import payments from './payments';
import gallery from './gallery';
import contact from './contact';

export default {
  auth,
  trainings,
  categories,
  enrollments,
  payments,
  gallery,
  contact
};
