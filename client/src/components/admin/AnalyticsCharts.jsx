import React, { useState } from 'react';
import Loading from '../ui/Loading';

const AnalyticsCharts = ({ analytics, loading }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('users');

  if (loading && !analytics) {
    return <Loading size="lg" text="Chargement des analytics..." />;
  }

  const timeRanges = [
    { value: '24h', label: '24 heures' },
    { value: '7d', label: '7 jours' },
    { value: '30d', label: '30 jours' },
    { value: '90d', label: '90 jours' },
    { value: '1y', label: '1 an' }
  ];

  const metrics = [
    { value: 'users', label: 'Utilisateurs', color: 'blue' },
    { value: 'revenue', label: 'Revenus', color: 'green' },
    { value: 'transactions', label: 'Transactions', color: 'purple' },
    { value: 'events', label: 'Événements', color: 'orange' }
  ];

  // Données simulées pour les graphiques
  const chartData = analytics?.[selectedMetric]?.[timeRange] || generateMockData(timeRange);

  return (
    <div className="space-y-6">
      {/* Contrôles */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Analytics & Tendances</h3>
            <p className="text-sm text-gray-500">Analyse des données de performance</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Sélection de métrique */}
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {metrics.map(metric => (
                <option key={metric.value} value={metric.value}>
                  {metric.label}
                </option>
              ))}
            </select>

            {/* Sélection de période */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Taux de Conversion"
          value={`${analytics?.conversionRate || 2.4}%`}
          change={analytics?.conversionChange || +0.3}
          trend="up"
          icon="📈"
        />
        <MetricCard
          title="Valeur Panier Moyen"
          value={`${analytics?.avgCartValue || 45}€`}
          change={analytics?.cartValueChange || +5.2}
          trend="up"
          icon="🛒"
        />
        <MetricCard
          title="Taux de Rétention"
          value={`${analytics?.retentionRate || 68}%`}
          change={analytics?.retentionChange || -2.1}
          trend="down"
          icon="🔄"
        />
        <MetricCard
          title="Sessions/Utilisateur"
          value={analytics?.avgSessions || 3.2}
          change={analytics?.sessionsChange || +0.4}
          trend="up"
          icon="👤"
        />
      </div>

      {/* Graphique principal */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900">
            Évolution - {metrics.find(m => m.value === selectedMetric)?.label}
          </h4>
          <p className="text-sm text-gray-500">
            Données des {timeRanges.find(r => r.value === timeRange)?.label.toLowerCase()}
          </p>
        </div>
        
        <div className="h-64 w-full">
          <SimpleLineChart data={chartData} color={metrics.find(m => m.value === selectedMetric)?.color} />
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sources de trafic */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Sources de Trafic</h4>
          <div className="space-y-3">
            {(analytics?.trafficSources || [
              { source: 'Direct', visits: 45, percentage: 35 },
              { source: 'Google', visits: 38, percentage: 30 },
              { source: 'Social Media', visits: 25, percentage: 20 },
              { source: 'Email', visits: 19, percentage: 15 }
            ]).map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-${['blue', 'green', 'purple', 'orange'][index]}-500`}></div>
                  <span className="text-sm font-medium text-gray-900">{source.source}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{source.visits}k</span>
                  <span className="text-sm font-medium text-gray-900">{source.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appareils utilisés */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Répartition par Appareil</h4>
          <div className="space-y-3">
            {(analytics?.deviceStats || [
              { device: 'Mobile', sessions: 58, percentage: 58 },
              { device: 'Desktop', sessions: 32, percentage: 32 },
              { device: 'Tablette', sessions: 10, percentage: 10 }
            ]).map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-${['blue', 'green', 'yellow'][index]}-500`}></div>
                  <span className="text-sm font-medium text-gray-900">{device.device}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-${['blue', 'green', 'yellow'][index]}-500 h-2 rounded-full`}
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{device.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pages populaires */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Pages les Plus Visitées</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vues
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Temps Moyen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taux de Rebond
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(analytics?.popularPages || [
                { path: '/dashboard', views: 12500, avgTime: '2:45', bounceRate: 25 },
                { path: '/library', views: 8900, avgTime: '3:20', bounceRate: 35 },
                { path: '/events', views: 6700, avgTime: '1:55', bounceRate: 45 },
                { path: '/profile', views: 4200, avgTime: '1:30', bounceRate: 55 }
              ]).map((page, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {page.path}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {page.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {page.avgTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {page.bounceRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, change, trend, icon }) => {
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  const trendIcon = trend === 'up' ? '↗️' : '↘️';

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          <p className={`text-sm ${trendColor} flex items-center`}>
            <span className="mr-1">{trendIcon}</span>
            {Math.abs(change)}% vs période précédente
          </p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
};

const SimpleLineChart = ({ data, color = 'blue' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Aucune donnée disponible
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  return (
    <div className="h-full w-full relative">
      <svg className="w-full h-full" viewBox="0 0 800 200">
        {/* Grille */}
        <defs>
          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Ligne du graphique */}
        <polyline
          fill="none"
          stroke={`var(--${color}-500, #3b82f6)`}
          strokeWidth="2"
          points={data.map((point, index) => {
            const x = (index / (data.length - 1)) * 780 + 10;
            const y = 190 - ((point.value - minValue) / range) * 180;
            return `${x},${y}`;
          }).join(' ')}
        />

        {/* Points */}
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * 780 + 10;
          const y = 190 - ((point.value - minValue) / range) * 180;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={`var(--${color}-500, #3b82f6)`}
            />
          );
        })}
      </svg>

      {/* Étiquettes X */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
        {data.map((point, index) => {
          if (index % Math.ceil(data.length / 6) === 0 || index === data.length - 1) {
            return <span key={index}>{point.label}</span>;
          }
          return null;
        })}
      </div>
    </div>
  );
};

// Génération de données factices pour la démonstration
const generateMockData = (timeRange) => {
  const ranges = {
    '24h': { points: 24, labels: (i) => `${i}:00` },
    '7d': { points: 7, labels: (i) => `J-${6-i}` },
    '30d': { points: 30, labels: (i) => `${i+1}` },
    '90d': { points: 90, labels: (i) => `S${Math.floor(i/7)+1}` },
    '1y': { points: 12, labels: (i) => ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'][i] }
  };

  const config = ranges[timeRange] || ranges['7d'];
  
  return Array.from({ length: config.points }, (_, i) => ({
    label: config.labels(i),
    value: Math.floor(Math.random() * 100) + 50
  }));
};

export default AnalyticsCharts;