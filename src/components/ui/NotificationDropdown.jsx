import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, MessageSquare, User, AtSign, CreditCard, Calendar } from 'lucide-react';
import { fetchNotifications, markAsRead, markAllAsRead } from '../../redux/slices/notificationSlice';
import { setOpenCardId } from '../../redux/slices/boardSlice';

const notificationIcons = {
  mentioned: AtSign,
  comment_added: MessageSquare,
  comment_reply: MessageSquare,
  card_assigned: User,
  card_due_soon: Calendar,
  card_overdue: Calendar,
  board_invitation: CreditCard,
  member_added_to_board: User,
};

const notificationColors = {
  mentioned: 'bg-purple-100 text-purple-600',
  comment_added: 'bg-trello-blue-pale text-trello-blue',
  comment_reply: 'bg-trello-blue-pale text-trello-blue',
  card_assigned: 'bg-green-100 text-green-600',
  card_due_soon: 'bg-yellow-100 text-yellow-700',
  card_overdue: 'bg-red-100 text-red-600',
  board_invitation: 'bg-indigo-100 text-indigo-600',
  member_added_to_board: 'bg-teal-100 text-teal-600',
};

const formatCommentPreview = (text) => {
  if (!text) return '';
  return text.replace(/@\[([^\]]+)\]\([^)]+\)/g, '@$1');
};

export default function NotificationDropdown({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, isLoading } = useSelector((state) => state.notification);
  const { currentBoard } = useSelector((state) => state.board);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (e, id) => {
    e.stopPropagation();
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      dispatch(markAsRead(notification.id));
    }

    if (notification.card_id) {
      const navContext = {
        tab: ['mentioned', 'comment_added', 'comment_reply'].includes(notification.type) ? 'comments' : 'details',
        commentId: notification.metadata?.comment_id || null,
      };

      if (currentBoard?.id === notification.board_id) {
        dispatch(setOpenCardId({ cardId: notification.card_id, context: navContext }));
      } else {
        sessionStorage.setItem('openCardAfterNav', JSON.stringify({
          cardId: notification.card_id,
          context: navContext,
        }));
        navigate(`/app/board/${notification.board_id}`);
      }
      onClose();
    } else if (notification.board_id) {
      navigate(`/board/${notification.board_id}`);
      onClose();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getIcon = (type) => notificationIcons[type] || Bell;
  const getColorClass = (type) => notificationColors[type] || 'bg-trello-gray-light text-trello-gray-dark';

  return (
    <div
      className="absolute right-0 top-[calc(100%+8px)] w-96 bg-white rounded-trello border border-trello-gray-border z-50"
      style={{ boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px 0px' }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-trello-gray-border">
        <h3 className="font-semibold text-trello-navy text-sm">Notifications</h3>
        <button
          onClick={handleMarkAllAsRead}
          className="text-sm text-trello-blue hover:underline flex items-center gap-1 font-medium"
        >
          <CheckCheck className="w-4 h-4" />
          Mark all read
        </button>
      </div>

      <div className="max-h-[480px] overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-trello-gray-neutral text-sm">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 mx-auto text-trello-gray-border mb-3" />
            <p className="text-trello-gray-neutral text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = getIcon(notification.type);
            const colorClass = getColorClass(notification.type);
            const hasLink = notification.card_id || notification.board_id;

            return (
              <div
                key={notification.id}
                onClick={() => hasLink && handleNotificationClick(notification)}
                className={`px-4 py-3 border-b border-trello-gray-border transition-colors ${
                  !notification.is_read ? 'bg-trello-blue-pale' : 'bg-white'
                } ${hasLink ? 'cursor-pointer hover:bg-trello-gray-light' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-trello-pill flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-trello-navy">{notification.title}</p>
                    {notification.message && (
                      <p className="text-sm text-trello-gray-dark mt-0.5 line-clamp-2">{notification.message}</p>
                    )}
                    {notification.metadata?.comment_preview && (
                      <p className="text-xs text-trello-gray-neutral mt-1 italic line-clamp-1 bg-trello-gray-light px-2 py-1 rounded-trello">
                        &quot;{formatCommentPreview(notification.metadata.comment_preview)}&quot;
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-trello-gray-medium">{formatTime(notification.created_at)}</p>
                      {hasLink && (
                        <span className="text-xs text-trello-blue font-medium">Click to view</span>
                      )}
                    </div>
                  </div>
                  {!notification.is_read && (
                    <button
                      onClick={(e) => handleMarkAsRead(e, notification.id)}
                      className="p-1 text-trello-gray-medium hover:text-trello-blue flex-shrink-0 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
