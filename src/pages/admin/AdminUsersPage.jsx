import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Users, UserCheck, UserX, AlertCircle, RefreshCw, Search } from 'lucide-react';

function PageHeader({ title, subtitle }) {
  return (
    <div className="bg-white border-b border-trello-gray-border px-8 py-6">
      <h1 className="text-xl font-semibold text-trello-navy">{title}</h1>
      {subtitle && <p className="text-sm text-trello-secondary mt-0.5">{subtitle}</p>}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color = 'text-trello-blue' }) {
  return (
    <div className="bg-white border border-trello-gray-border rounded-trello p-5 shadow-trello-card">
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-xs font-bold text-trello-gray-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-3xl font-bold text-trello-navy">{value}</div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/admin/users');
      setUsers(res.data.data || []);
    } catch {
      setError('Admin users endpoint not available yet. Wire GET /api/v1/admin/users on the backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || u.email?.toLowerCase().includes(q) || u.full_name?.toLowerCase().includes(q);
  });

  const active = users.filter((u) => u.is_active).length;
  const inactive = users.length - active;

  return (
    <div>
      <PageHeader title="Users" subtitle="All registered users." />

      <div className="p-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard icon={Users} label="Total users" value={loading ? '...' : users.length} />
          <StatCard icon={UserCheck} label="Active" value={loading ? '...' : active} color="text-green-600" />
          <StatCard icon={UserX} label="Inactive" value={loading ? '...' : inactive} color="text-red-500" />
        </div>

        {error && (
          <div className="bg-orange-50 border border-orange-200 rounded-trello p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-orange-800 mb-1">Backend endpoint needed</div>
              <div className="text-xs text-orange-700">{error}</div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-trello-gray-medium" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs pl-9 pr-3 py-2 border border-trello-gray-border rounded-trello text-sm focus:outline-none focus:border-trello-blue"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trello-blue" />
          </div>
        ) : filtered.length === 0 && !error ? (
          <div className="text-center py-16 text-trello-secondary text-sm">
            {users.length === 0 ? 'No users found.' : 'No results match your search.'}
          </div>
        ) : (
          <div className="bg-white border border-trello-gray-border rounded-trello overflow-hidden shadow-trello-card">
            <table className="w-full text-sm">
              <thead className="bg-trello-gray-light border-b border-trello-gray-border">
                <tr>
                  {['User', 'Email', 'Status', 'Joined'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-trello-gray-medium uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-trello-gray-border">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-trello-gray-light transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-trello-blue flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.full_name?.charAt(0).toUpperCase() || u.email?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className="font-medium text-trello-navy">{u.full_name || '-'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-trello-secondary">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-trello-pill ${
                        u.is_active
                          ? 'bg-green-50 text-green-700'
                          : 'bg-trello-gray-light text-trello-gray-dark'
                      }`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-trello-secondary">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <button
            onClick={load}
            className="mt-4 flex items-center gap-1.5 text-xs text-trello-gray-medium hover:text-trello-navy transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        )}
      </div>
    </div>
  );
}
