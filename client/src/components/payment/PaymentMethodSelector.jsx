import { CreditCard, Smartphone } from 'lucide-react';

export const PaymentMethodSelector = ({ selected, onSelect }) => {
  const methods = [
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      icon: Smartphone,
      options: ['Orange Money', 'MTN Money', 'Moov Money']
    },
    {
      id: 'credit_card',
      name: 'Carte Bancaire',
      icon: CreditCard,
      options: ['Visa', 'Mastercard']
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Moyen de paiement</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`p-6 border-2 rounded-lg transition-all ${
                selected === method.id
                  ? 'border-primary-600 bg-primary-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <Icon className={`w-12 h-12 mb-3 ${
                  selected === method.id ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <p className={`font-medium ${
                  selected === method.id ? 'text-primary-900' : 'text-gray-700'
                }`}>
                  {method.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {method.options.join(', ')}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
