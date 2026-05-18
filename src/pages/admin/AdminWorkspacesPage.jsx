import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { LayoutGrid, Users, AlertCircle, RefreshCw } from 'lucide-react';

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

export default function AdminWorkspacesPage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/admin/workspaces');
      setWorkspaces(res.data.data || []);
    } catch {
      setError('Admin workspace endpoint not available yet. Wire GET /api/v1/admin/workspaces on the backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const totalBoards = workspaces.reduce((s, w) => s + (w.board_count || 0), 0);
  const totalMembers = workspaces.reduce((s, w) => s + (w.member_count || 0), 0);

  return (
    <div>
      <PageHeader
        title="Workspaces & Boards"
        subtitle="All workspaces across all users."
      />

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard icon={LayoutGrid} label="Workspaces" value={loading ? '...' : workspaces.length} />
          <StatCard icon={LayoutGrid} label="Total boards" value={loading ? '...' : totalBoards} color="text-green-600" />
          <StatCard icon={Users} label="Total members" value={loading ? '...' : totalMembers} color="text-purple-600" />
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

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trello-blue" />
          </div>
        ) : workspaces.length === 0 && !error ? (
          <div className="text-center py-16 text-trello-secondary text-sm">No workspaces found.</div>
        ) : (
          <div className="bg-white border border-trello-gray-border rounded-trello overflow-hidden shadow-trello-card">
            <table className="w-full text-sm">
              <thead className="bg-trello-gray-light border-b border-trello-gray-border">
                <tr>
                  {['Workspace', 'Owner', 'Boards', 'Members', 'Created'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-trello-gray-medium uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-trello-gray-border">
                {workspaces.map((w) => (
                  <tr key={w.id} className="hover:bg-trello-gray-light transition-colors">
                    <td className="px-4 py-3 font-medium text-trello-navy">{w.name}</td>
                    <td className="px-4 py-3 text-trello-secondary">{w.owner_email}</td>
                    <td className="px-4 py-3 text-trello-secondary">{w.board_count ?? '-'}</td>
                    <td className="px-4 py-3 text-trello-secondary">{w.member_count ?? '-'}</td>
                    <td className="px-4 py-3 text-trello-secondary">
                      {w.created_at ? new Date(w.created_at).toLocaleDateString() : '-'}
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
