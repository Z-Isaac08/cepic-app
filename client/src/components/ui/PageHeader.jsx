import { motion } from 'framer-motion';

const PageHeader = ({ 
  title, 
  subtitle = '', 
  breadcrumbs = [],
  actions = null,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-primary-800 to-primary-900 text-white py-8 sm:py-10 lg:py-12 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="flex mb-3 sm:mb-4 overflow-x-auto" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 sm:space-x-2 md:space-x-3 whitespace-nowrap">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="inline-flex items-center">
                  {index > 0 && (
                    <svg className="w-3 h-3 text-white/60 mx-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {crumb.href ? (
                    <a href={crumb.href} className="text-xs sm:text-sm text-white/80 hover:text-white transition-colors py-1 min-h-[44px] flex items-center">
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-xs sm:text-sm text-white font-medium">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Header Content */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-base lg:text-lg text-white/80">
                {subtitle}
              </p>
            )}
          </div>

          {/* Actions */}
          {actions && (
            <div className="mt-2 md:mt-0 md:ml-6">
              {actions}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PageHeader;
