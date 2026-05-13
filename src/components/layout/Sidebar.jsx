import { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, ChevronRight, Plus, LayoutGrid, Settings, X } from 'lucide-react';
import { fetchWorkspaces } from '../../redux/slices/workspaceSlice';

export default function Sidebar({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { slug } = useParams();

  const { workspaces } = useSelector((state) => state.workspace);
  const [expandedWorkspaces, setExpandedWorkspaces] = useState({});

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  useEffect(() => {
    if (slug) {
      setExpandedWorkspaces((prev) => ({ ...prev, [slug]: true }));
    }
  }, [slug]);

  const toggleWorkspace = (workspaceSlug) => {
    setExpandedWorkspaces((prev) => ({
      ...prev,
      [workspaceSlug]: !prev[workspaceSlug],
    }));
  };

  return (
    <aside className={`
      fixed md:static inset-y-0 left-0 z-30
      w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-48px)] p-4
      transform transition-transform duration-200 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="flex items-center justify-between mb-6 md:block">
        <span className="text-sm font-semibold text-gray-700 md:hidden">Menu</span>
        <button onClick={onClose} className="md:hidden p-1 rounded hover:bg-gray-100">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      <div className="mb-6">
        <Link
          to="/workspaces/create"
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create Workspace</span>
        </Link>
      </div>

      <div className="space-y-1">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Workspaces
        </h3>

        {workspaces.map((workspace) => (
          <div key={workspace.id}>
            <button
              onClick={() => toggleWorkspace(workspace.slug)}
              className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md ${
                slug === workspace.slug
                  ? 'bg-blue-50 text-trello-blue'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: '#0079bf' }}
                >
                  {workspace.name[0].toUpperCase()}
                </div>
                <span className="truncate">{workspace.name}</span>
              </div>
              {expandedWorkspaces[workspace.slug] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {expandedWorkspaces[workspace.slug] && (
              <div className="ml-4 mt-1 space-y-1">
                <Link
                  to={`/workspaces/${workspace.slug}`}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md ${
                    location.pathname === `/workspaces/${workspace.slug}`
                      ? 'bg-blue-50 text-trello-blue'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Boards</span>
                </Link>
                <Link
                  to={`/workspaces/${workspace.slug}/settings`}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md ${
                    location.pathname === `/workspaces/${workspace.slug}/settings`
                      ? 'bg-blue-50 text-trello-blue'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </div>
            )}
          </div>
        ))}

        {workspaces.length === 0 && (
          <p className="px-3 py-2 text-sm text-gray-500">No workspaces yet</p>
        )}
      </div>
    </aside>
  );
}
