const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizes = {
    sm: 'px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs',
    md: 'px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm',
    lg: 'px-3 sm:px-4 py-1 sm:py-1.5 text-sm sm:text-base',
  };

  return (
    <span 
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
