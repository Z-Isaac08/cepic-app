// src/components/library/FloatingCartButton.jsx
import { ShoppingCart } from "lucide-react";
import { useBookStore } from "../../stores/bookStore";

const FloatingCartButton = () => {
  const { selectedBooks } = useBookStore();

  if (selectedBooks.length === 0) return null;

  return (
    <button
      className="fixed bottom-6 right-6 bg-white text-dark-900 shadow-lg px-4 py-3 rounded-full flex items-center space-x-2 hover:scale-105 transition-transform z-50"
      onClick={() => alert("Redirection vers le panier...")}
    >
      <ShoppingCart className="w-5 h-5" />
      <span>{selectedBooks.length}</span>
    </button>
  );
};

export default FloatingCartButton;
