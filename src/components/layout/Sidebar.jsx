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
      w-64 bg-white border-r border-trello-gray-border min-h-[calc(100vh-60px)] p-4
      transform transition-transform duration-200 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="flex items-center justify-between mb-4 md:hidden">
        <span className="text-sm font-semibold text-trello-navy">Menu</span>
        <button onClick={onClose} className="p-1 rounded-trello hover:bg-trello-gray-light transition-colors">
          <X className="w-5 h-5 text-trello-gray-neutral" />
        </button>
      </div>

      <div className="mb-4">
        <Link
          to="/app/workspaces/create"
          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-trello-navy-2 hover:bg-trello-gray-light rounded-trello transition-colors"
        >
          <Plus className="w-4 h-4 text-trello-gray-neutral" />
          <span>Create Workspace</span>
        </Link>
      </div>

      <div className="space-y-0.5">
        <h3 className="px-3 text-xs font-semibold text-trello-gray-neutral uppercase tracking-wider mb-2">
          Workspaces
        </h3>

        {workspaces.map((workspace) => (
          <div key={workspace.id}>
            <button
              onClick={() => toggleWorkspace(workspace.slug)}
              className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-trello transition-colors ${
                slug === workspace.slug
                  ? 'bg-trello-blue-pale text-trello-blue font-medium'
                  : 'text-trello-navy-2 hover:bg-trello-gray-light'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-trello flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: '#0C66E4' }}
                >
                  {workspace.name[0].toUpperCase()}
                </div>
                <span className="truncate">{workspace.name}</span>
              </div>
              {expandedWorkspaces[workspace.slug] ? (
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              )}
            </button>

            {expandedWorkspaces[workspace.slug] && (
              <div className="ml-4 mt-0.5 space-y-0.5">
                <Link
                  to={`/app/workspaces/${workspace.slug}`}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-trello transition-colors ${
                    location.pathname === `/app/workspaces/${workspace.slug}`
                      ? 'bg-trello-blue-pale text-trello-blue font-medium'
                      : 'text-trello-gray-dark hover:bg-trello-gray-light'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Boards</span>
                </Link>
                <Link
                  to={`/app/workspaces/${workspace.slug}/settings`}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-trello transition-colors ${
                    location.pathname === `/app/workspaces/${workspace.slug}/settings`
                      ? 'bg-trello-blue-pale text-trello-blue font-medium'
                      : 'text-trello-gray-dark hover:bg-trello-gray-light'
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
          <p className="px-3 py-2 text-sm text-trello-gray-neutral">No workspaces yet</p>
        )}
      </div>
    </aside>
  );
}
