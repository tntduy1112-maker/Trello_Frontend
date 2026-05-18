import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Kanban, Bell, Search, Plus, LogOut, Settings, ChevronDown, HelpCircle, Menu, Shield } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import NotificationDropdown from '../ui/NotificationDropdown';
import HelpModal from '../ui/HelpModal';
import { useIsAdmin } from '../../pages/admin/AdminLayout';

export default function Navbar({ onMenuClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notification);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const avatarInitial = user?.full_name?.charAt(0).toUpperCase() || '?';
  const isAdmin = useIsAdmin();

  return (
    <nav className="bg-white border-b border-trello-gray-border h-navbar flex items-center px-4 justify-between flex-shrink-0">
      {/* Left section */}
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-trello-gray-neutral hover:bg-trello-gray-light rounded-trello transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link
          to="/app/home"
          className="flex items-center gap-2 text-trello-blue font-bold text-lg"
        >
          <Kanban className="w-6 h-6" />
          <span className="hidden sm:inline">TaskFlow</span>
        </Link>

        <button className="hidden sm:flex items-center gap-1.5 btn btn-primary py-1.5 min-h-0 text-sm px-3">
          <Plus className="w-4 h-4" />
          <span>Create</span>
        </button>
      </div>

      {/* Center section - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-trello-gray-medium" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-trello-gray-light border border-trello-gray-border rounded-trello-btn text-sm text-trello-navy placeholder-trello-gray-medium focus:outline-none focus:border-trello-blue focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-trello-gray-neutral hover:bg-trello-gray-light rounded-trello transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-trello-pill w-4 h-4 flex items-center justify-center font-semibold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
        </div>

        {/* Help */}
        <button
          onClick={() => setShowHelp(true)}
          className="p-2 text-trello-gray-neutral hover:bg-trello-gray-light rounded-trello transition-colors"
          title="Help"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* User menu */}
        <div className="relative ml-1" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-1.5 p-1 hover:bg-trello-gray-light rounded-trello transition-colors"
          >
            <div className="w-8 h-8 rounded-trello-pill bg-trello-blue flex items-center justify-center overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-sm font-semibold">{avatarInitial}</span>
              )}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-trello-gray-neutral hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-trello border border-trello-gray-border py-2 z-50"
              style={{ boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px 0px' }}>
              <div className="px-4 py-3 border-b border-trello-gray-border">
                <p className="font-semibold text-trello-navy text-sm">{user?.full_name}</p>
                <p className="text-xs text-trello-gray-neutral mt-0.5">{user?.email}</p>
              </div>
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-2 text-sm text-trello-navy-2 hover:bg-trello-gray-light transition-colors"
                onClick={() => setShowUserMenu(false)}
              >
                <Settings className="w-4 h-4 text-trello-gray-neutral" />
                <span>Profile & Settings</span>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-trello-navy-2 hover:bg-trello-gray-light transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Shield className="w-4 h-4 text-trello-blue" />
                  <span>Admin portal</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-trello-navy-2 hover:bg-trello-gray-light transition-colors"
              >
                <LogOut className="w-4 h-4 text-trello-gray-neutral" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </nav>
  );
}
