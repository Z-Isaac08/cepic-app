import { Smartphone } from 'lucide-react';
import { useState } from 'react';

export const MobileMoneyForm = ({ amount, onSubmit, loading }) => {
  const [operator, setOperator] = useState('wave');
  const [phone, setPhone] = useState('');

  const operators = [
    { id: 'wave', name: 'Wave', color: 'bg-cyan-500' },
    { id: 'orange', name: 'Orange Money', color: 'bg-orange-500' },
    { id: 'mtn', name: 'MTN Money', color: 'bg-yellow-500' },
    { id: 'moov', name: 'Moov Money', color: 'bg-blue-500' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ operator, phone, amount });
  };

  const formatPhoneNumber = (value) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    // Format as XX XX XX XX XX
    const formatted = digits.match(/.{1,2}/g)?.join(' ') || digits;
    return formatted.substring(0, 14); // Max 10 digits + 4 spaces
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label id="operator-label" className="block text-sm font-medium text-gray-700 mb-2">
          Opérateur Mobile Money
        </label>
        <div role="radiogroup" aria-labelledby="operator-label" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {operators.map((op) => (
            <button
              key={op.id}
              type="button"
              role="radio"
              aria-checked={operator === op.id}
              onClick={() => setOperator(op.id)}
              className={`p-4 border-2 rounded-lg transition-all ${
                operator === op.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-8 h-8 ${op.color} rounded-full mx-auto mb-2`} aria-hidden="true" />
              <p
                className={`text-xs font-medium ${
                  operator === op.id ? 'text-primary-900' : 'text-gray-700'
                }`}
              >
                {op.name.split(' ')[0]}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Numéro de téléphone
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Smartphone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            placeholder="XX XX XX XX XX"
            required
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Format: 10 chiffres sans indicatif pays</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-600">Montant à payer</p>
          <p className="text-2xl font-bold text-primary-800">
            {new Intl.NumberFormat('fr-FR').format(amount)} FCFA
          </p>
        </div>
        <p className="text-xs text-gray-500">
          Vous recevrez une notification sur votre téléphone pour confirmer le paiement
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || phone.replace(/\s/g, '').length !== 10}
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
    </form>
  );
};
