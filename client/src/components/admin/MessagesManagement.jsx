import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Copy,
  Eye,
  Mail,
  MessageSquare,
  Reply,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAdminStore } from '../../stores/adminStore';
import Badge from '../ui/Badge';

const formatRelativeTime = (date) => {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = (now - d) / 1000; // seconds
    if (diff < 60) return `il y a ${Math.floor(diff)}s`;
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
    const days = Math.floor(diff / 86400);
    if (days === 1) return 'hier';
    if (days < 7) return `il y a ${days}j`;
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      active ? 'bg-primary-100 text-primary-800' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);

const MessagesManagement = () => {
  const { messages, messagesLoading, getMessages, markAsRead, deleteMessage, getUnreadCount } =
    useAdminStore();
  const [activeTab, setActiveTab] = useState('all'); // all | unread | read
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getMessages();
  }, [getMessages]);

  const filtered = useMemo(() => {
    const base = messages || [];
    const byTab = base.filter((m) => {
      if (activeTab === 'unread') return !m.isRead;
      if (activeTab === 'read') return m.isRead;
      return true;
    });
    if (!search.trim()) return byTab;
    const q = search.toLowerCase();
    return byTab.filter(
      (m) =>
        (m.name || '').toLowerCase().includes(q) ||
        (m.email || '').toLowerCase().includes(q) ||
        (m.subject || '').toLowerCase().includes(q)
    );
  }, [messages, activeTab, search]);

  const unreadCount = getUnreadCount
    ? getUnreadCount()
    : (messages || []).filter((m) => !m.isRead).length;

  const handleOpen = async (msg) => {
    setSelected(msg);
    if (!msg.isRead) {
      try {
        await markAsRead(msg.id, true);
      } catch {
        // ignore
      }
    }
  };

  const handleToggleRead = async (msg) => {
    try {
      await markAsRead(msg.id, !msg.isRead);
      toast.success(!msg.isRead ? 'Message marqué comme lu' : 'Message marqué comme non lu');
    } catch (e) {
      toast.error('Impossible de mettre à jour le statut du message');
    }
  };

  const handleDelete = async (msg) => {
    if (!confirm('Supprimer ce message ? Cette action est irréversible.')) return;
    try {
      await deleteMessage(msg.id);
      toast.success('Message supprimé');
      if (selected?.id === msg.id) setSelected(null);
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const copyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success('Email copié');
    } catch {
      toast.error('Échec de la copie');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-8 h-8 text-primary-800" />
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Messages</h2>
        </div>
        <Badge variant={unreadCount > 0 ? 'primary' : 'default'}>{unreadCount} non lu(s)</Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
            Tous
          </TabButton>
          <TabButton active={activeTab === 'unread'} onClick={() => setActiveTab('unread')}>
            Non lus
          </TabButton>
          <TabButton active={activeTab === 'read'} onClick={() => setActiveTab('read')}>
            Lus
          </TabButton>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher nom / email / sujet"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* List/Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sujet
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messagesLoading && messages.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  Chargement...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-12">
                  <div className="text-center">
                    <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aucun message</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((m, idx) => (
                <tr
                  key={m.id}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-primary-50/40`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {m.isRead ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-primary-600" />
                      )}
                      {!m.isRead && (
                        <Badge variant="primary" size="sm">
                          Nouveau
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td
                    className={`px-4 py-3 whitespace-nowrap ${
                      !m.isRead ? 'font-semibold text-gray-900' : 'text-gray-800'
                    }`}
                  >
                    {m.name || 'Anonyme'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">{m.email}</td>
                  <td
                    className={`px-4 py-3 max-w-[360px] truncate ${
                      !m.isRead ? 'font-semibold text-gray-900' : 'text-gray-800'
                    }`}
                  >
                    {m.subject}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                    {formatRelativeTime(m.createdAt)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        title="Voir détails"
                        onClick={() => handleOpen(m)}
                        className="text-primary-700 hover:text-primary-900"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        title={m.isRead ? 'Marquer comme non lu' : 'Marquer comme lu'}
                        onClick={() => handleToggleRead(m)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        {m.isRead ? (
                          <Circle className="w-5 h-5" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        title="Supprimer"
                        onClick={() => handleDelete(m)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-primary-700" />
                <h3 className="text-lg font-semibold text-gray-900">Détails du message</h3>
              </div>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setSelected(null)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={selected.isRead ? 'default' : 'primary'} size="sm">
                  {selected.isRead ? 'Lu' : 'Non lu'}
                </Badge>
                <span className="text-gray-500 text-sm">
                  {formatRelativeTime(selected.createdAt)}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs uppercase text-gray-500">Nom</div>
                  <div className="text-gray-900">{selected.name || 'Anonyme'}</div>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs uppercase text-gray-500">Email</div>
                    <div className="text-gray-900">{selected.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 text-gray-700"
                      onClick={() => copyEmail(selected.email)}
                      title="Copier l'email"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <a
                      href={`mailto:${selected.email}?subject=Re:%20${encodeURIComponent(
                        selected.subject || ''
                      )}`}
                      className="px-2 py-1 text-sm rounded border border-primary-300 text-primary-700 hover:bg-primary-50 flex items-center gap-1"
                      title="Répondre"
                    >
                      <Reply className="w-4 h-4" /> Répondre
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs uppercase text-gray-500">Sujet</div>
                <div className="text-gray-900 font-medium">{selected.subject || 'Sans sujet'}</div>
              </div>

              <div>
                <div className="text-xs uppercase text-gray-500 mb-1">Message</div>
                <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {selected.message}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!selected.isRead && (
                  <button
                    onClick={async () => {
                      try {
                        await markAsRead(selected.id, true);
                        setSelected({ ...selected, isRead: true });
                        toast.success('Marqué comme lu');
                      } catch {
                        toast.error('Action impossible');
                      }
                    }}
                    className="px-3 py-2 text-sm rounded bg-primary-800 text-white hover:bg-primary-900"
                  >
                    Marquer comme lu
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleRead(selected)}
                  className="px-3 py-2 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {selected.isRead ? 'Marquer comme non lu' : 'Marquer comme lu'}
                </button>
                <button
                  onClick={() => handleDelete(selected)}
                  className="px-3 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MessagesManagement;
