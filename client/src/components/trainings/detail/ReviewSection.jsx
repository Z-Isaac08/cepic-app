import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, MessageSquare, Send } from 'lucide-react';
import { Button } from '../../ui';
import { useAuthStore } from '../../../stores/authStore';
import { useTrainingStore } from '../../../stores/trainingStore';

const ReviewSection = ({ training }) => {
  const { user } = useAuthStore();
  const { addReview } = useTrainingStore();
  const [filter, setFilter] = useState('all'); // all, 5, 4, 3, 2, 1
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const reviews = training.reviews || [];
  const averageRating = training.rating || 0;
  const totalReviews = reviews.length;

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => Math.floor(r.rating) === rating).length,
    percentage: totalReviews > 0 
      ? (reviews.filter(r => Math.floor(r.rating) === rating).length / totalReviews) * 100 
      : 0
  }));

  // Filter reviews
  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(r => Math.floor(r.rating) === parseInt(filter));

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      window.location.href = '/connexion';
      return;
    }

    setSubmitting(true);
    try {
      await addReview(training.id, reviewForm);
      setReviewForm({ rating: 5, comment: '' });
      setShowReviewForm(false);
      alert('Votre avis a été ajouté avec succès!');
    } catch (error) {
      alert(error.response?.data?.error || 'Erreur lors de l\'ajout de l\'avis');
    } finally {
      setSubmitting(false);
    }
  };

  // Render stars
  const renderStars = (rating, size = 'sm') => {
    const sizeClass = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Render interactive stars for form
  const renderInteractiveStars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => {
              console.log('Star clicked:', star);
              setReviewForm({ ...reviewForm, rating: star });
            }}
            className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
          >
            <Star
              className={`w-8 h-8 ${
                star <= reviewForm.rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-3 text-sm text-gray-600">
          {reviewForm.rating} étoile{reviewForm.rating > 1 ? 's' : ''}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Avis des participants</h2>
        
        {/* Rating Summary */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {averageRating.toFixed(1)}
              </div>
              {renderStars(averageRating, 'lg')}
              <p className="text-sm text-gray-600 mt-2">
                {totalReviews} avis
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <button
                key={rating}
                onClick={() => setFilter(filter === rating.toString() ? 'all' : rating.toString())}
                className={`w-full flex items-center space-x-3 hover:bg-gray-50 p-2 rounded transition-colors ${
                  filter === rating.toString() ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm font-medium text-gray-900">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Add Review Button */}
        {user && !showReviewForm && (
          <div className="mt-6">
            <Button
              onClick={() => {
                console.log('Opening review form');
                setShowReviewForm(true);
              }}
              className="w-full md:w-auto"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Laisser un avis
            </Button>
          </div>
        )}
        
        {/* Debug info */}
        {!user && (
          <div className="mt-6 text-sm text-gray-600">
            Connectez-vous pour laisser un avis
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 bg-gray-50 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Votre avis
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note
                </label>
                {renderInteractiveStars()}
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre commentaire
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Partagez votre expérience avec cette formation..."
                  rows={4}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submitting ? 'Envoi...' : 'Publier l\'avis'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewForm({ rating: 5, comment: '' });
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-gray-200">
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Aucun avis pour le moment' 
                : `Aucun avis avec ${filter} étoile${filter > 1 ? 's' : ''}`}
            </p>
            {filter !== 'all' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilter('all')}
                className="mt-4"
              >
                Voir tous les avis
              </Button>
            )}
          </div>
        ) : (
          filteredReviews.map((review, index) => (
            <motion.div
              key={review.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {review.user?.avatar ? (
                      <img
                        src={review.user.avatar}
                        alt={`${review.user.firstName} ${review.user.lastName}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-sm font-bold">
                        {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {review.user?.firstName} {review.user?.lastName}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        • {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verified Badge */}
                {review.isVerified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Achat vérifié
                  </span>
                )}
              </div>

              {/* Review Content */}
              <div className="ml-13">
                {review.title && (
                  <h5 className="font-semibold text-gray-900 mb-2">
                    {review.title}
                  </h5>
                )}
                <p className="text-gray-700 mb-3">
                  {review.comment}
                </p>

                {/* Review Actions */}
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-primary-800 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Utile ({review.helpfulCount || 0})</span>
                  </button>
                  <button className="text-sm text-gray-600 hover:text-primary-800 transition-colors">
                    Signaler
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredReviews.length > 5 && (
        <div className="p-6 border-t border-gray-200 text-center">
          <Button variant="outline">
            Voir plus d'avis
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
