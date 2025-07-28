import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../stores/adminStore';
import Loading from '../ui/Loading';

const SecurityAudit = ({ securityLogs, loading }) => {
  const { fetchSecurityLogs } = useAdminStore();
  const [filters, setFilters] = useState({
    type: '',
    userId: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 50
  });
  const [selectedLogs, setSelectedLogs] = useState([]);

  useEffect(() => {
    fetchSecurityLogs(filters);
  }, [filters, fetchSecurityLogs]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset à la première page lors du changement de filtre
    }));
  };

  const logTypes = [
    { value: '', label: 'Tous les types' },
    { value: 'login', label: 'Connexions' },
    { value: 'logout', label: 'Déconnexions' },
    { value: 'failed_login', label: 'Échecs de connexion' },
    { value: '2fa', label: 'Authentification 2FA' },
    { value: 'admin', label: 'Actions admin' },
    { value: 'security', label: 'Événements sécurité' }
  ];

  const severityColors = {
    'low': 'bg-blue-100 text-blue-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800'
  };

  const getSeverity = (action, success) => {
    if (action.includes('failed') || action.includes('blocked')) return 'high';
    if (action.includes('admin') && !success) return 'critical';
    if (action.includes('2fa') && !success) return 'medium';
    return 'low';
  };

  if (loading && !securityLogs) {
    return <Loading size="lg" text="Chargement des logs de sécurité..." />;
  }

  return (
    <div className="space-y-6">
      {/* Résumé de sécurité */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SecurityMetric
          title="Tentatives de Connexion"
          value={securityLogs?.summary?.totalLogins || 0}
          change={securityLogs?.summary?.loginChange || 0}
          icon="🔑"
          color="blue"
        />
        <SecurityMetric
          title="Échecs d'Authentification"
          value={securityLogs?.summary?.failedAttempts || 0}
          change={securityLogs?.summary?.failedChange || 0}
          icon="❌"
          color="red"
        />
        <SecurityMetric
          title="Actions Admin"
          value={securityLogs?.summary?.adminActions || 0}
          change={securityLogs?.summary?.adminChange || 0}
          icon="👑"
          color="purple"
        />
        <SecurityMetric
          title="Événements Suspects"
          value={securityLogs?.summary?.suspiciousEvents || 0}
          change={securityLogs?.summary?.suspiciousChange || 0}
          icon="⚠️"
          color="orange"
        />
      </div>

      {/* Filtres */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtres et Recherche</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Type d'événement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'événement
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {logTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date de début */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de début
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Date de fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de fin
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Utilisateur ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Utilisateur
            </label>
            <input
              type="text"
              placeholder="ID ou email utilisateur"
              value={filters.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setFilters({
              ...filters,
              startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0]
            })}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
          >
            Dernières 24h
          </button>
          <button
            onClick={() => setFilters({
              ...filters,
              startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0]
            })}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
          >
            7 derniers jours
          </button>
          <button
            onClick={() => handleFilterChange('type', 'failed')}
            className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
          >
            Échecs seulement
          </button>
          <button
            onClick={() => setFilters({
              type: '',
              userId: '',
              startDate: '',
              endDate: '',
              page: 1,
              limit: 50
            })}
            className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Table des logs */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Logs de Sécurité
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {securityLogs?.logs?.length || 0} événements
              </span>
              {selectedLogs.length > 0 && (
                <button
                  onClick={() => {
                    // Action d'export ou de traitement en lot
                    console.log('Export selected logs:', selectedLogs);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Exporter ({selectedLogs.length})
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedLogs.length === (securityLogs?.logs?.length || 0) && (securityLogs?.logs?.length || 0) > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLogs(securityLogs?.logs?.map(log => log.id) || []);
                      } else {
                        setSelectedLogs([]);
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Détails
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(securityLogs?.logs || []).map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedLogs.includes(log.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLogs([...selectedLogs, log.id]);
                        } else {
                          setSelectedLogs(selectedLogs.filter(id => id !== log.id));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.createdAt).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {log.user ? `${log.user.firstName} ${log.user.lastName}` : 'Système'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {log.user?.email || log.userId || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {log.success ? 'Succès' : 'Échec'}
                    </span>
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      severityColors[getSeverity(log.action, log.success)]
                    }`}>
                      {getSeverity(log.action, log.success)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ipAddress || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.details ? (
                      <button
                        onClick={() => {
                          // Afficher les détails dans un modal
                          console.log('Log details:', log.details);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Voir détails
                      </button>
                    ) : (
                      'Aucun'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!securityLogs?.logs || securityLogs.logs.length === 0) && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              Aucun log de sécurité trouvé pour les critères sélectionnés.
            </div>
          </div>
        )}
      </div>

      {/* Analyse des tendances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top IPs */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-900 mb-4">IPs les Plus Actives</h4>
          <div className="space-y-3">
            {(securityLogs?.topIPs || [
              { ip: '192.168.1.100', requests: 145, suspicious: false },
              { ip: '10.0.0.50', requests: 89, suspicious: false },
              { ip: '203.0.113.10', requests: 67, suspicious: true },
              { ip: '198.51.100.25', requests: 45, suspicious: true }
            ]).map((ipData, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                <div className="flex items-center space-x-3">
                  <span className={`w-3 h-3 rounded-full ${
                    ipData.suspicious ? 'bg-red-500' : 'bg-green-500'
                  }`}></span>
                  <span className="font-mono text-sm">{ipData.ip}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{ipData.requests} requêtes</span>
                  {ipData.suspicious && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                      Suspect
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions récentes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Actions Récentes Critiques</h4>
          <div className="space-y-3">
            {(securityLogs?.recentCritical || [
              { action: 'Multiple failed login attempts', time: '2 min ago', severity: 'high' },
              { action: 'Admin privilege escalation', time: '15 min ago', severity: 'critical' },
              { action: 'Suspicious API access pattern', time: '1 hour ago', severity: 'medium' },
              { action: 'Rate limit exceeded', time: '2 hours ago', severity: 'low' }
            ]).map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                <div>
                  <div className="text-sm font-medium text-gray-900">{event.action}</div>
                  <div className="text-xs text-gray-500">{event.time}</div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                  severityColors[event.severity]
                }`}>
                  {event.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SecurityMetric = ({ title, value, change, icon, color }) => {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    red: 'border-red-200 bg-red-50',
    purple: 'border-purple-200 bg-purple-50',
    orange: 'border-orange-200 bg-orange-50'
  };

  const changeColor = change >= 0 ? 'text-red-600' : 'text-green-600';
  const changeIcon = change >= 0 ? '↗️' : '↘️';

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl">{icon}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className={`text-xs ${changeColor} flex items-center`}>
          <span className="mr-1">{changeIcon}</span>
          {Math.abs(change)}% vs période précédente
        </p>
      </div>
    </div>
  );
};

export default SecurityAudit;