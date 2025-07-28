import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../stores/adminStore';
import Loading from '../ui/Loading';

const SystemHealth = ({ systemHealth, loading }) => {
  const { fetchSystemHealth } = useAdminStore();
  const [refreshInterval, setRefreshInterval] = useState(30); // secondes
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchSystemHealth();
      }, refreshInterval * 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, fetchSystemHealth]);

  if (loading && !systemHealth) {
    return <Loading size="lg" text="Chargement des métriques système..." />;
  }

  const systemStatus = systemHealth?.status || 'unknown';
  const statusColors = {
    healthy: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
    unknown: 'bg-gray-500'
  };

  return (
    <div className="space-y-6">
      {/* Header avec statut global */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-4 h-4 rounded-full ${statusColors[systemStatus]}`}></div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Statut du Système: {systemStatus === 'healthy' ? 'Opérationnel' : 'Problème détecté'}
              </h3>
              <p className="text-sm text-gray-500">
                Dernière mise à jour: {systemHealth?.timestamp ? 
                  new Date(systemHealth.timestamp).toLocaleString('fr-FR') : 
                  'Jamais'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Auto-refresh toggle */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Auto-refresh</label>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            {/* Refresh interval */}
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              disabled={!autoRefresh}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value={10}>10s</option>
              <option value={30}>30s</option>
              <option value={60}>1min</option>
              <option value={300}>5min</option>
            </select>

            {/* Manual refresh */}
            <button
              onClick={() => fetchSystemHealth()}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Actualisation...' : 'Actualiser'}
            </button>
          </div>
        </div>
      </div>

      {/* Métriques de performance */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Performance du Serveur</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PerformanceMetric
            title="Temps de Fonctionnement"
            value={systemHealth?.uptime || '0%'}
            target="99.9%"
            status={parseFloat(systemHealth?.uptime) >= 99.9 ? 'good' : 'warning'}
            icon="⏱️"
            description="Disponibilité du service"
          />
          <PerformanceMetric
            title="Temps de Réponse"
            value={systemHealth?.avgResponseTime || '0ms'}
            target="< 200ms"
            status={parseInt(systemHealth?.avgResponseTime) < 200 ? 'good' : 'warning'}
            icon="⚡"
            description="Moyenne API"
          />
          <PerformanceMetric
            title="CPU"
            value={systemHealth?.cpuUsage || '0%'}
            target="< 80%"
            status={parseInt(systemHealth?.cpuUsage) < 80 ? 'good' : 'warning'}
            icon="🖥️"
            description="Utilisation processeur"
          />
          <PerformanceMetric
            title="Mémoire"
            value={systemHealth?.memoryUsage || '0%'}
            target="< 85%"
            status={parseInt(systemHealth?.memoryUsage) < 85 ? 'good' : 'warning'}
            icon="💾"
            description="RAM utilisée"
          />
        </div>
      </div>

      {/* Métriques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Métriques système */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Métriques Système</h4>
          <div className="space-y-4">
            <SystemMetricBar
              label="Utilisation CPU"
              value={parseInt(systemHealth?.cpuUsage) || 0}
              max={100}
              color="blue"
              unit="%"
            />
            <SystemMetricBar
              label="Utilisation Mémoire"
              value={parseInt(systemHealth?.memoryUsage) || 0}
              max={100}
              color="green"
              unit="%"
            />
            <SystemMetricBar
              label="Utilisation Disque"
              value={parseInt(systemHealth?.diskUsage) || 0}
              max={100}
              color="purple"
              unit="%"
            />
            <SystemMetricBar
              label="Connexions Actives"
              value={systemHealth?.activeConnections || 0}
              max={1000}
              color="orange"
              unit=""
            />
          </div>
        </div>

        {/* Base de données */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Base de Données</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
              <div>
                <div className="font-medium">Statut de Connexion</div>
                <div className="text-sm text-gray-500">PostgreSQL</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  systemHealth?.database?.connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm font-medium">
                  {systemHealth?.database?.connectionStatus === 'connected' ? 'Connecté' : 'Déconnecté'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 border border-gray-200 rounded">
                <div className="text-2xl font-bold text-gray-900">
                  {systemHealth?.database?.totalUsers || 0}
                </div>
                <div className="text-sm text-gray-500">Utilisateurs</div>
              </div>
              <div className="text-center p-3 border border-gray-200 rounded">
                <div className="text-2xl font-bold text-gray-900">
                  {systemHealth?.database?.activeSessions || 0}
                </div>
                <div className="text-sm text-gray-500">Sessions</div>
              </div>
            </div>

            <div className="text-center p-3 border border-gray-200 rounded">
              <div className="text-2xl font-bold text-gray-900">
                {systemHealth?.database?.auditLogs || 0}
              </div>
              <div className="text-sm text-gray-500">Logs d'audit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Services externes */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Statut des Services</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(systemHealth?.services || {
            database: 'healthy',
            redis: 'healthy',
            email: 'healthy',
            storage: 'healthy'
          }).map(([service, status]) => (
            <ServiceStatus
              key={service}
              name={service}
              status={status}
              icon={getServiceIcon(service)}
            />
          ))}
        </div>
      </div>

      {/* Métriques en temps réel */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Activité en Temps Réel</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {systemHealth?.realtimeMetrics?.requestsPerMinute || 0}
            </div>
            <div className="text-sm text-gray-500">Requêtes/minute</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {systemHealth?.realtimeMetrics?.activeConnections || 0}
            </div>
            <div className="text-sm text-gray-500">Connexions actives</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {(systemHealth?.realtimeMetrics?.errorRate || 0).toFixed(2)}%
            </div>
            <div className="text-sm text-gray-500">Taux d'erreur</div>
          </div>
        </div>
      </div>

      {/* Alertes système */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Alertes et Notifications</h4>
        <div className="space-y-3">
          {(systemHealth?.alerts || [
            { type: 'warning', message: 'Utilisation CPU élevée détectée', time: '5 minutes ago' },
            { type: 'info', message: 'Sauvegarde automatique effectuée', time: '1 hour ago' },
            { type: 'success', message: 'Tous les services fonctionnent normalement', time: '2 hours ago' }
          ]).map((alert, index) => (
            <div key={index} className={`p-3 rounded-md border-l-4 ${
              alert.type === 'warning' ? 'border-yellow-400 bg-yellow-50' :
              alert.type === 'error' ? 'border-red-400 bg-red-50' :
              alert.type === 'success' ? 'border-green-400 bg-green-50' :
              'border-blue-400 bg-blue-50'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{alert.message}</p>
                  <p className="text-sm text-gray-500">{alert.time}</p>
                </div>
                <div className={`text-sm font-medium ${
                  alert.type === 'warning' ? 'text-yellow-800' :
                  alert.type === 'error' ? 'text-red-800' :
                  alert.type === 'success' ? 'text-green-800' :
                  'text-blue-800'
                }`}>
                  {alert.type.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PerformanceMetric = ({ title, value, target, status, icon, description }) => {
  const statusColors = {
    good: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    critical: 'border-red-200 bg-red-50'
  };

  return (
    <div className={`border rounded-lg p-4 ${statusColors[status]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl">{icon}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
        <p className="text-xs text-gray-400">Cible: {target}</p>
      </div>
    </div>
  );
};

const SystemMetricBar = ({ label, value, max, color, unit }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-600">{value}{unit}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const ServiceStatus = ({ name, status, icon }) => {
  const statusConfig = {
    healthy: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Opérationnel' },
    warning: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Attention' },
    critical: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Critique' },
    unknown: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Inconnu' }
  };

  const config = statusConfig[status] || statusConfig.unknown;

  return (
    <div className={`border rounded-lg p-4 ${config.color}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl">{icon}</div>
        <div className={`w-3 h-3 rounded-full ${
          status === 'healthy' ? 'bg-green-500' :
          status === 'warning' ? 'bg-yellow-500' :
          status === 'critical' ? 'bg-red-500' :
          'bg-gray-500'
        }`}></div>
      </div>
      <div>
        <p className="font-medium capitalize">{name}</p>
        <p className="text-sm">{config.label}</p>
      </div>
    </div>
  );
};

const getServiceIcon = (service) => {
  const icons = {
    database: '🗄️',
    redis: '📊',
    email: '📧',
    storage: '💾',
    api: '🔌',
    auth: '🔐'
  };
  return icons[service] || '⚙️';
};

export default SystemHealth;