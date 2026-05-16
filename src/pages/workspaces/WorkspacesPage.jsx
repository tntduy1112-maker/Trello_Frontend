import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, LayoutGrid } from 'lucide-react';
import { fetchWorkspaces } from '../../redux/slices/workspaceSlice';

export default function WorkspacesPage() {
  const dispatch = useDispatch();
  const { workspaces, isLoading } = useSelector((state) => state.workspace);

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trello-blue" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-trello-navy">Your Workspaces</h1>
        <Link to="/workspaces/create" className="btn btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Workspace
        </Link>
      </div>

      {workspaces.length === 0 ? (
        <div className="text-center py-16">
          <LayoutGrid className="w-16 h-16 mx-auto text-trello-gray-border mb-4" />
          <h2 className="text-xl font-semibold text-trello-gray-dark mb-2">No workspaces yet</h2>
          <p className="text-trello-gray-neutral mb-6">Create your first workspace to get started</p>
          <Link to="/workspaces/create" className="btn btn-primary">
            Create Workspace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              to={`/workspaces/${workspace.slug}`}
              className="card p-4 block hover:shadow-trello-card-hover transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-trello flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                  style={{ backgroundColor: '#0C66E4' }}
                >
                  {workspace.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-trello-navy">{workspace.name}</h3>
                  <p className="text-sm text-trello-gray-neutral">
                    {workspace.boards_count || 0} boards
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
