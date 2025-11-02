import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Link } from "react-router";

const CategoryCard = ({ category, index = 0 }) => {
  // Récupérer l'icône dynamiquement
  const IconComponent = Icons[category.icon] || Icons.BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link to={`/formations?category=${category.slug}`} className="block group h-full">
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 h-full min-h-[280px] flex flex-col">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <IconComponent
              className="w-8 h-8"
              style={{ color: category.color }}
            />
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-800 transition-colors">
            {category.name}
          </h3>

          <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{category.description}</p>

          {/* Stats */}
          {category._count?.trainings !== undefined && (
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span className="font-semibold text-primary-800">
                {category._count.trainings}
              </span>
              <span className="ml-1">
                {category._count.trainings > 1 ? "formations" : "formation"}
              </span>
            </div>
          )}

          {/* Arrow */}
          <div className="flex items-center text-primary-800 font-medium text-sm group-hover:translate-x-2 transition-transform">
            Découvrir
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
