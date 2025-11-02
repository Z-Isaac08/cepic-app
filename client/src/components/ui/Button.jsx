/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const Button = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-primary-800 hover:bg-primary-900 text-white focus:ring-primary-800 hover:shadow-lg",
    secondary:
      "bg-secondary-500 hover:bg-secondary-600 text-primary-900 focus:ring-secondary-500 hover:shadow-lg",
    outline:
      "border-2 border-primary-800 bg-transparent text-primary-800 hover:bg-primary-800 hover:text-white hover:border-primary-800 focus:ring-primary-800 transition-colors",
    "outline-white":
      "border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary-800 hover:border-white focus:ring-white transition-colors",
    ghost: "text-primary-800 hover:bg-primary-50 focus:ring-primary-800",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-600 hover:shadow-lg",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed transform-none hover:scale-100"
    : "";

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
