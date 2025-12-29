// client/src/pages/FavoritesPage.jsx
import { Heart } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router';
import TrainingCard from '../components/trainings/TrainingCard';
import { Button } from '../components/ui';
import { useTrainingStore } from '../stores/trainingStore';

const FavoritesPage = () => {
  const { bookmarks, fetchBookmarks, trainings } = useTrainingStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Charger les favoris au montage du composant
    fetchBookmarks();
  }, [fetchBookmarks]);

  // Filtrer les formations pour ne garder que celles qui sont dans les favoris
  const favoriteTrainings = trainings.filter((training) =>
    bookmarks.some((bookmark) => bookmark.trainingId === training.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 flex-shrink-0" />
            Mes Favoris
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Retrouvez toutes les formations que vous avez sauvegardées
          </p>
        </div>

        {/* Content */}
        {favoriteTrainings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 lg:p-12 text-center">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Aucun favori pour le moment
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
              Commencez à sauvegarder vos formations préférées pour les retrouver facilement ici
            </p>
            <Link to="/formations">
              <Button className="min-h-[48px]">Découvrir nos formations</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {favoriteTrainings.map((training) => (
              <TrainingCard key={training.id} training={training} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
