import { CreditCard, Lock } from 'lucide-react';
import { useState } from 'react';

export const CreditCardForm = ({ amount, onSubmit, loading }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    const formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 2) {
      return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    }
    return digits;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      cardNumber: cardNumber.replace(/\s/g, ''),
      expiry,
      cvv,
      name,
      amount,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-start mb-8">
          <CreditCard className="w-10 h-10" />
          <div className="text-xs opacity-75">VISA / MASTERCARD</div>
        </div>
        <div className="mb-6">
          <div className="text-xl tracking-wider font-mono">
            {cardNumber || '•••• •••• •••• ••••'}
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs opacity-75 mb-1">Titulaire</div>
            <div className="font-medium uppercase">{name || 'VOTRE NOM'}</div>
          </div>
          <div>
            <div className="text-xs opacity-75 mb-1">Expire</div>
            <div className="font-medium">{expiry || 'MM/YY'}</div>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Numéro de carte
        </label>
        <input
          type="text"
          id="cardNumber"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          placeholder="1234 5678 9012 3456"
          required
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-2">
            Date d'expiration
          </label>
          <input
            type="text"
            id="expiry"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/YY"
            maxLength="5"
            required
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
            CVV
          </label>
          <div className="relative">
            <input
              type="text"
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
              placeholder="123"
              maxLength="3"
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nom sur la carte
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
          placeholder="JOHN DOE"
          required
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 uppercase"
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-600">Montant à payer</p>
          <p className="text-2xl font-bold text-primary-800">
            {new Intl.NumberFormat('fr-FR').format(amount)} FCFA
          </p>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Lock className="w-3 h-3 mr-1" />
          Paiement sécurisé SSL
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !cardNumber || !expiry || !cvv || !name}
        className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Traitement en cours...
          </span>
        ) : (
          `Payer ${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`
        )}
      </button>

      <p className="text-xs text-center text-gray-500">
        En cliquant sur "Payer", vous acceptez nos conditions d'utilisation
      </p>
    </form>
  );
};
