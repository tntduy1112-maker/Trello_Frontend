import { Navigate, Outlet, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Kanban, Users, LayoutGrid, FileText, Settings, ChevronRight } from 'lucide-react';

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || 'tntduy1112@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase());

const NAV = [
  { to: '/admin/workspaces', icon: LayoutGrid, label: 'Workspaces & Boards' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/submissions', icon: FileText, label: 'Survey Submissions' },
  { to: '/admin/settings', icon: Settings, label: 'Site Settings' },
];

export function useIsAdmin() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (!isAuthenticated || !user) return false;
  return ADMIN_EMAILS.includes(user.email?.toLowerCase());
}

export default function AdminLayout() {
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);
  const isAdmin = useIsAdmin();

  // Wait for token validation to complete before making auth decisions.
  // isLoading starts true when a token exists in localStorage (see authSlice initialState).
  const tokenPending = isLoading || (!!localStorage.getItem('accessToken') && !user && !isAuthenticated);
  if (tokenPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-trello-blue" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/app/home" replace />;

  return (
    <div className="min-h-screen flex bg-trello-gray-light">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-trello-navy flex flex-col">
        {/* Brand */}
        <div className="h-navbar flex items-center gap-2.5 px-4 border-b border-white/10">
          <div className="w-6 h-6 bg-trello-blue rounded flex items-center justify-center">
            <Kanban className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="text-white text-xs font-bold leading-none">Productcon Lab</div>
            <div className="text-white/40 text-[10px] font-medium leading-none mt-0.5">Admin</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-trello text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Back to app */}
        <div className="p-3 border-t border-white/10">
          <NavLink
            to="/app/home"
            className="flex items-center justify-between px-3 py-2 text-xs text-white/40 hover:text-white/70 transition-colors rounded-trello hover:bg-white/5"
          >
            Back to app
            <ChevronRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
