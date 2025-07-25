// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Check, Eye, Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { useBookStore } from "../../stores/bookStore";

const BookCard = ({ book, index, viewMode = "grid" }) => {
  const { selectedBooks, addBook, removeBook } = useBookStore();
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const isSelected = selectedBooks.some((b) => b.id === book.id);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price);
  };

  const getDiscountPercentage = () => {
    if (book.originalPrice > book.price) {
      return Math.round(
        ((book.originalPrice - book.price) / book.originalPrice) * 100
      );
    }
    return 0;
  };

  const handleToggleSelection = (e) => {
    e.stopPropagation();
    if (isSelected) {
      removeBook(book.id);
    } else {
      addBook(book);
    }
  };

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-all cursor-pointer"
        onClick={() => setShowPreview(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center space-x-4">
          {/* Image */}
          <div className="relative">
            <img
              src={book.cover}
              alt={book.title}
              className="w-16 h-24 object-cover rounded"
            />
            {book.bestseller && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-xs font-bold px-1 py-0.5 rounded text-black">
                ⭐
              </span>
            )}
          </div>

          {/* Informations */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white text-lg truncate">
                  {book.title}
                </h3>
                <p className="text-gray-400 text-sm">{book.author}</p>
                <p className="text-gray-500 text-xs">
                  {book.category} • {book.pages} pages
                </p>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-300">{book.rating}</span>
                  <span className="text-xs text-gray-500">
                    ({book.reviews})
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {getDiscountPercentage() > 0 && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(book.originalPrice)} FCFA
                    </span>
                  )}
                  <span className="text-lg font-bold text-primary-400">
                    {formatPrice(book.price)} FCFA
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleSelection}
              className={`p-2 rounded-full transition-all ${
                isSelected
                  ? "bg-green-500 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-primary-500 hover:text-white"
              }`}
            >
              {isSelected ? (
                <Check className="w-4 h-4" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group cursor-pointer"
      onClick={() => setShowPreview(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          <span className="bg-black/70 text-white text-lg font-bold px-2 py-1 rounded">
            {index + 1}
          </span>
          {book.bestseller && (
            <div className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
              BESTSELLER
            </div>
          )}
          {book.newRelease && (
            <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              NOUVEAU
            </div>
          )}
          {getDiscountPercentage() > 0 && (
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{getDiscountPercentage()}%
            </div>
          )}
        </div>

        {/* Actions au hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-4 left-4 right-4 space-y-2"
        >
          <button
            onClick={handleToggleSelection}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
              isSelected
                ? "bg-green-500 text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {isSelected ? (
              <span className="flex items-center justify-center">
                <Check className="w-4 h-4 mr-2" />
                Ajouté
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Ajouter
              </span>
            )}
          </button>

          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPreview(true);
              }}
              className="flex-1 py-2 px-3 bg-black/70 text-white rounded-lg hover:bg-black/90 transition-all"
            >
              <Eye className="w-4 h-4 mx-auto" />
            </button>
            <button className="flex-1 py-2 px-3 bg-black/70 text-white rounded-lg hover:bg-black/90 transition-all">
              <Heart className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </motion.div>

        {/* État sélectionné */}
        {isSelected && !isHovered && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-green-500 text-white font-bold text-lg px-4 py-2 rounded-lg flex items-center">
              <Check className="w-5 h-5 mr-2" />
              Ajouté
            </div>
          </div>
        )}
      </div>

      {/* Informations du livre */}
      <div className="mt-3 space-y-2">
        <h3 className="font-semibold text-white text-lg leading-tight line-clamp-2">
          {book.title}
        </h3>

        <p className="text-gray-400 text-sm">{book.author}</p>

        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-300">{book.rating}</span>
          <span className="text-xs text-gray-500">({book.reviews} avis)</span>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
