import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { FileText, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

function PageHeader({ title, subtitle }) {
  return (
    <div className="bg-white border-b border-trello-gray-border px-8 py-6">
      <h1 className="text-xl font-semibold text-trello-navy">{title}</h1>
      {subtitle && <p className="text-sm text-trello-secondary mt-0.5">{subtitle}</p>}
    </div>
  );
}

function SubmissionRow({ sub }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border-b border-trello-gray-border last:border-0">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-trello-gray-light transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-trello-navy truncate">{sub.app_name || 'Untitled idea'}</div>
          <div className="text-xs text-trello-secondary">{sub.email} · {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : '-'}</div>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-trello-pill flex-shrink-0 ${
          sub.status === 'reviewed'
            ? 'bg-green-50 text-green-700'
            : sub.status === 'in_progress'
            ? 'bg-orange-50 text-orange-700'
            : 'bg-trello-blue-pale text-trello-blue'
        }`}>
          {sub.status || 'new'}
        </span>
        {expanded ? <ChevronUp className="w-4 h-4 text-trello-gray-medium flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-trello-gray-medium flex-shrink-0" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 text-sm text-trello-secondary space-y-2 bg-trello-gray-light border-t border-trello-gray-border">
          {sub.description && (
            <div className="pt-3">
              <span className="font-semibold text-trello-navy">Description: </span>
              {sub.description}
            </div>
          )}
          {sub.reference_product && (
            <div>
              <span className="font-semibold text-trello-navy">Reference: </span>
              {sub.reference_product}
            </div>
          )}
          {sub.detail_level && (
            <div>
              <span className="font-semibold text-trello-navy">Detail level: </span>
              {sub.detail_level}
            </div>
          )}
          {sub.raw && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-trello-gray-medium hover:text-trello-navy">
                View raw submission
              </summary>
              <pre className="mt-2 text-xs bg-white border border-trello-gray-border rounded p-3 overflow-auto max-h-48 text-trello-navy">
                {JSON.stringify(sub.raw, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/admin/submissions');
      setSubmissions(res.data.data || []);
    } catch {
      setError('Admin submissions endpoint not available yet. Wire GET /api/v1/admin/submissions on the backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <PageHeader
        title="Survey Submissions"
        subtitle="Product idea submissions from the landing page survey."
      />

      <div className="p-8">
        {error && (
          <div className="bg-orange-50 border border-orange-200 rounded-trello p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-orange-800 mb-1">Backend endpoint needed</div>
              <div className="text-xs text-orange-700 mb-3">{error}</div>
              <div className="text-xs text-orange-700 font-mono bg-orange-100 rounded p-2 leading-relaxed">
                {`// Go handler stub\nfunc (h *AdminHandler) ListSubmissions(c *gin.Context) {\n  // Query survey submissions table\n  // Return paginated list\n}`}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trello-blue" />
          </div>
        ) : submissions.length === 0 && !error ? (
          <div className="text-center py-16">
            <FileText className="w-10 h-10 text-trello-gray-border mx-auto mb-3" />
            <div className="text-sm text-trello-secondary">No submissions yet.</div>
          </div>
        ) : submissions.length > 0 ? (
          <div className="bg-white border border-trello-gray-border rounded-trello shadow-trello-card overflow-hidden">
            {submissions.map((sub) => (
              <SubmissionRow key={sub.id} sub={sub} />
            ))}
          </div>
        ) : null}

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
