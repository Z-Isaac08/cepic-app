import { Heart } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router';
import { Button } from '../components/ui';

const FavoritesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // TODO: Implémenter la logique des favoris avec un store
  const favorites = [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500" />
            Mes Favoris
          </h1>
          <p className="mt-2 text-gray-600">
            Retrouvez toutes les formations que vous avez sauvegardées
          </p>
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun favori pour le moment
            </h2>
            <p className="text-gray-600 mb-6">
              Commencez à sauvegarder vos formations préférées pour les retrouver facilement ici
            </p>
            <Link to="/formations">
              <Button>
                Découvrir nos formations
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* TODO: Afficher les formations favorites */}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
