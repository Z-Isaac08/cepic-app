/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, TrendingUp, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useBookStore } from '../stores/bookStore'
import SearchAndFilters from '../components/library/SearchAndFilters'
import BookCard from '../components/library/BookCard'
import FloatingCartButton from '../components/library/FloatingCartButton'
import CartSidebar from '../components/library/CartSidebar'

const LibraryPage = () => {
  const navigate = useNavigate()
  const { getFilteredBooks, viewMode, selectedBooks, books } = useBookStore()
  
  const filteredBooks = getFilteredBooks()
  const bestsellers = books.filter(book => book.bestseller)
  const newReleases = books.filter(book => book.newRelease)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header avec navigation */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm z-30 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold flex items-center">
                  <BookOpen className="w-8 h-8 mr-3 text-primary-500" />
                  Librairie
                </h1>
                <p className="text-gray-400 mt-1">
                  Découvrez notre collection de {books.length} livres exceptionnels
                </p>
              </div>
            </div>

            {/* Indicateur de sélection */}
            {selectedBooks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden md:flex items-center space-x-2 bg-primary-500/20 border border-primary-500 rounded-lg px-4 py-2"
              >
                <span className="text-primary-400 font-semibold">
                  {selectedBooks.length} livre{selectedBooks.length > 1 ? 's' : ''} sélectionné{selectedBooks.length > 1 ? 's' : ''}
                </span>
              </motion.div>
            )}
          </div>

          {/* Barre de recherche et filtres */}
          <SearchAndFilters />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Section Bestsellers */}
        {bestsellers.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-yellow-500" />
                Bestsellers
              </h2>
              <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                {bestsellers.length} livre{bestsellers.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {bestsellers.slice(0, 6).map((book, index) => (
                <BookCard key={book.id} book={book} index={index} viewMode="grid" />
              ))}
            </div>
            {bestsellers.length > 6 && (
              <div className="text-center mt-6">
                <button className="text-primary-400 hover:text-primary-300 font-medium">
                  Voir tous les bestsellers ({bestsellers.length})
                </button>
              </div>
            )}
          </motion.section>
        )}

        {/* Section Nouveautés */}
        {newReleases.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                <Sparkles className="w-6 h-6 mr-3 text-green-500" />
                Nouveautés
              </h2>
              <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                {newReleases.length} livre{newReleases.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {newReleases.slice(0, 6).map((book, index) => (
                <BookCard key={book.id} book={book} index={index} viewMode="grid" />
              ))}
            </div>
            {newReleases.length > 6 && (
              <div className="text-center mt-6">
                <button className="text-primary-400 hover:text-primary-300 font-medium">
                  Voir toutes les nouveautés ({newReleases.length})
                </button>
              </div>
            )}
          </motion.section>
        )}

        {/* Section Tous les livres */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {filteredBooks.length === books.length ? 'Tous les livres' : 'Résultats de recherche'}
            </h2>
            <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
              {filteredBooks.length} livre{filteredBooks.length > 1 ? 's' : ''}
            </span>
          </div>
          
          {filteredBooks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <BookOpen className="w-20 h-20 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-400 mb-3">
                Aucun livre trouvé
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Aucun livre ne correspond à vos critères de recherche. 
                Essayez de modifier vos filtres ou votre recherche.
              </p>
              <button
                onClick={() => {
                  // Reset des filtres via le store
                  const { setSearchQuery, setSelectedCategory, setPriceRange } = useBookStore.getState()
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setPriceRange([0, 25000])
                }}
                className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </motion.div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6"
                : "space-y-4"
            }>
              {filteredBooks.map((book, index) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  index={index} 
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

          {/* Message informatif si pas de résultats filtrés mais livres disponibles */}
          {filteredBooks.length === 0 && books.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700"
            >
              <h4 className="text-lg font-semibold text-white mb-2">
                Suggestions pour améliorer votre recherche :
              </h4>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• Vérifiez l'orthographe de vos mots-clés</li>
                <li>• Essayez des termes de recherche plus généraux</li>
                <li>• Ajustez votre fourchette de prix</li>
                <li>• Changez de catégorie</li>
              </ul>
            </motion.div>
          )}
        </motion.section>

        {/* Statistiques en bas de page */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-gray-800"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">{books.length}</div>
            <div className="text-sm text-gray-400">Livres disponibles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{bestsellers.length}</div>
            <div className="text-sm text-gray-400">Bestsellers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{newReleases.length}</div>
            <div className="text-sm text-gray-400">Nouveautés</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {[...new Set(books.map(book => book.category))].length}
            </div>
            <div className="text-sm text-gray-400">Catégories</div>
          </div>
        </motion.div>
      </div>

      {/* Composants flottants */}
      <FloatingCartButton />
      <CartSidebar />
    </div>
  )
}

export default LibraryPage