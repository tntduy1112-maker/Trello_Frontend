import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './redux/slices/authSlice';

import AuthLayout from './components/layout/AuthLayout';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/landing/LandingPage';
import PricingPage from './pages/landing/PricingPage';
import AboutPage from './pages/landing/AboutPage';
import SolutionPage from './pages/solutions/SolutionPage';
import BlogPage from './pages/resources/BlogPage';
import ChangelogPage from './pages/resources/ChangelogPage';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

import WorkspacesPage from './pages/workspaces/WorkspacesPage';
import CreateWorkspacePage from './pages/workspaces/CreateWorkspacePage';
import BoardListPage from './pages/workspaces/BoardListPage';
import WorkspaceSettingsPage from './pages/workspaces/WorkspaceSettingsPage';

import BoardPage from './pages/boards/BoardPage';
import ProfilePage from './pages/profile/ProfilePage';
import AcceptInvitePage from './pages/invitations/AcceptInvitePage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminWorkspacesPage from './pages/admin/AdminWorkspacesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSubmissionsPage from './pages/admin/AdminSubmissionsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trello-blue"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/app/home" replace />;
  }

  return children;
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(getCurrentUser()).unwrap().catch(() => {
        localStorage.removeItem('accessToken');
      });
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <AuthLayout>
                <RegisterPage />
              </AuthLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <AuthLayout>
              <VerifyEmailPage />
            </AuthLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <AuthLayout>
                <ForgotPasswordPage />
              </AuthLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <AuthLayout>
                <ResetPasswordPage />
              </AuthLayout>
            </PublicRoute>
          }
        />

        {/* Accept Invite (can be public or protected) */}
        <Route path="/invite/:token" element={<AcceptInvitePage />} />

        {/* Protected Routes — all under /app */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/home" replace />} />
          <Route path="home" element={<WorkspacesPage />} />
          <Route path="workspaces/create" element={<CreateWorkspacePage />} />
          <Route path="workspaces/:slug" element={<BoardListPage />} />
          <Route path="workspaces/:slug/settings" element={<WorkspaceSettingsPage />} />
          <Route path="board/:boardId" element={<BoardPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Admin portal */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/workspaces" replace />} />
          <Route path="workspaces" element={<AdminWorkspacesPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="submissions" element={<AdminSubmissionsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Landing pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/solutions/:slug" element={<SolutionPage />} />
        <Route path="/resources/blog" element={<BlogPage />} />
        <Route path="/resources/changelog" element={<ChangelogPage />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
