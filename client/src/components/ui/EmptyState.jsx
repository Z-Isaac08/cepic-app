import { motion } from 'framer-motion';
import { FileQuestion } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ 
  icon: Icon = FileQuestion,
  title = 'Aucun résultat',
  description = '',
  action = null,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-8 sm:py-12 px-4 ${className}`}
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-50 rounded-full flex items-center justify-center mb-3 sm:mb-4">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-300" />
      </div>

      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1.5 sm:mb-2 text-center">
        {title}
      </h3>

      {description && (
        <p className="text-sm sm:text-base text-gray-600 text-center max-w-md mb-4 sm:mb-6 px-2">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-2 sm:mt-4">
          {action}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
