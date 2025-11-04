import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { useAdminStore } from '../../stores/adminStore';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const periods = [
  { key: 'today', label: "Aujourd'hui" },
  { key: '7d', label: '7 derniers jours' },
  { key: '30d', label: '30 derniers jours' },
  { key: '12m', label: '12 derniers mois' },
];

const colors = {
  primary: '#1f3a8a',
  primaryLight: '#93c5fd',
  secondary: '#16a34a',
  secondaryLight: '#86efac',
  accent: '#f59e0b',
  accentLight: '#fde68a',
};

const mockData = {
  enrollments: Array.from({ length: 7 }).map((_, i) => ({
    date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('fr-FR', { weekday: 'short' }),
    value: Math.floor(Math.random() * 40) + 10,
  })),
  popularTrainings: [
    { name: 'Excel Pro', value: 120 },
    { name: 'Gestion Projet', value: 90 },
    { name: 'Comptabilité', value: 75 },
    { name: 'Marketing', value: 60 },
    { name: 'Dev Web', value: 55 },
  ],
  revenue: Array.from({ length: 12 }).map((_, i) => ({
    month: new Date(new Date().getFullYear(), i, 1).toLocaleDateString('fr-FR', { month: 'short' }),
    amount: Math.floor(Math.random() * 8000) + 2000,
  })),
  categories: [
    { name: 'Tech', value: 35 },
    { name: 'Business', value: 25 },
    { name: 'Finance', value: 20 },
    { name: 'Design', value: 12 },
    { name: 'Autres', value: 8 },
  ],
  kpis: {
    totalUsers: 2480,
    newThisPeriod: 86,
    totalRevenue: 125430,
    growthRate: 12.4,
  },
  insights: [
    'Les inscriptions augmentent en fin de semaine',
    'Excel Pro reste la formation la plus populaire',
    'Le revenu moyen mensuel est en hausse de 8% vs N-1',
  ],
};

const AnalyticsPanel = () => {
  const { dashboardData, fetchAnalytics } = useAdminStore();
  const [period, setPeriod] = useState('7d');

  // Charger les différentes métriques pour la période sélectionnée
  useEffect(() => {
    const metrics = ['enrollments', 'popularTrainings', 'revenue', 'categories', 'kpis'];
    metrics.forEach((m) => {
      fetchAnalytics(period, m).catch(() => {});
    });
  }, [period, fetchAnalytics]);

  const analytics = dashboardData?.analytics || {};

  const enrollmentsData = useMemo(() => {
    const d = analytics.enrollments?.[period]?.data || analytics.enrollments?.[period] || null;
    if (Array.isArray(d) && d.length) return d;
    return mockData.enrollments;
  }, [analytics, period]);

  const popularTrainingsData = useMemo(() => {
    const d = analytics.popularTrainings?.[period]?.data || analytics.popularTrainings?.[period] || null;
    if (Array.isArray(d) && d.length) return d;
    return mockData.popularTrainings;
  }, [analytics, period]);

  const revenueData = useMemo(() => {
    const d = analytics.revenue?.[period]?.data || analytics.revenue?.[period] || null;
    if (Array.isArray(d) && d.length) return d;
    return mockData.revenue;
  }, [analytics, period]);

  const categoriesData = useMemo(() => {
    const d = analytics.categories?.[period]?.data || analytics.categories?.[period] || null;
    if (Array.isArray(d) && d.length) return d;
    return mockData.categories;
  }, [analytics, period]);

  const kpis = useMemo(() => {
    const d = analytics.kpis?.[period] || {};
    return {
      totalUsers: d.totalUsers ?? mockData.kpis.totalUsers,
      newThisPeriod: d.newThisPeriod ?? mockData.kpis.newThisPeriod,
      totalRevenue: d.totalRevenue ?? mockData.kpis.totalRevenue,
      growthRate: d.growthRate ?? mockData.kpis.growthRate,
    };
  }, [analytics, period]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-8 h-8 text-primary-800" />
          <h2 className="text-2xl font-bold text-gray-900">Analytiques</h2>
        </div>
        <div className="flex items-center gap-2">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === p.key ? 'bg-primary-100 text-primary-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg border border-gray-100 bg-gray-50">
          <div className="text-sm text-gray-500">Total utilisateurs</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{kpis.totalUsers.toLocaleString('fr-FR')}</div>
        </div>
        <div className="p-4 rounded-lg border border-gray-100 bg-gray-50">
          <div className="text-sm text-gray-500">Nouveaux cette période</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{kpis.newThisPeriod.toLocaleString('fr-FR')}</div>
        </div>
        <div className="p-4 rounded-lg border border-gray-100 bg-gray-50">
          <div className="text-sm text-gray-500">Revenu total</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{kpis.totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</div>
        </div>
        <div className="p-4 rounded-lg border border-gray-100 bg-gray-50">
          <div className="text-sm text-gray-500">Taux de croissance</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{kpis.growthRate}%</div>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Inscriptions par jour */}
        <div className="p-4 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Inscriptions par jour</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: '#e5e7eb' }} formatter={(v) => [`${v}`, 'Inscriptions']} />
                <Legend />
                <Line type="monotone" dataKey="value" name="Inscriptions" stroke={colors.primary} strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Formations populaires */}
        <div className="p-4 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Formations populaires</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularTrainingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: '#e5e7eb' }} formatter={(v) => [`${v}`, 'Inscriptions']} />
                <Legend />
                <Bar dataKey="value" name="Inscriptions" fill={colors.secondary} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenus mensuels */}
        <div className="p-4 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Revenus</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.accent} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={colors.accent} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ borderRadius: 8, borderColor: '#e5e7eb' }}
                  formatter={(v) => [
                    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(v),
                    'Revenus',
                  ]}
                />
                <Legend />
                <Area type="monotone" dataKey="amount" name="Revenus" stroke={colors.accent} fill="url(#revGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition par catégorie */}
        <div className="p-4 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Répartition par catégorie</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: '#e5e7eb' }} formatter={(v, n) => [`${v}%`, n]} />
                <Legend />
                <Pie data={categoriesData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                  {categoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={[colors.primary, colors.secondary, colors.accent, colors.primaryLight, colors.secondaryLight][index % 5]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Footer insights */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
        <div className="p-4 rounded-lg bg-gray-50">
          <div className="font-semibold text-gray-800 mb-2">Formations les plus vendues</div>
          <ul className="space-y-2">
            {(popularTrainingsData || []).slice(0, 5).map((t) => (
              <li key={t.name} className="flex items-center justify-between">
                <span className="text-gray-700">{t.name}</span>
                <span className="text-gray-900 font-medium">{t.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 rounded-lg bg-gray-50">
          <div className="font-semibold text-gray-800 mb-2">Catégories populaires</div>
          <ul className="space-y-2">
            {(categoriesData || []).slice(0, 5).map((c) => (
              <li key={c.name} className="flex items-center justify-between">
                <span className="text-gray-700">{c.name}</span>
                <span className="text-gray-900 font-medium">{c.value}%</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 rounded-lg bg-gray-50">
          <div className="font-semibold text-gray-800 mb-2">Tendances</div>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {mockData.insights.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPanel;
