import { useDispatch } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, CheckSquare, MessageSquare, Paperclip } from 'lucide-react';
import { setOpenCardId } from '../../redux/slices/boardSlice';

const priorityBorder = {
  none: '',
  low: 'border-l-4 border-l-green-500',
  medium: 'border-l-4 border-l-[#F5CD47]',
  high: 'border-l-4 border-l-red-500',
};

export default function BoardCard({ card, listId, canEdit = true }) {
  const dispatch = useDispatch();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: 'card', card, listId },
    disabled: !canEdit,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = () => {
    dispatch(setOpenCardId(card.id));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const isOverdue = date < now && !card.is_completed;
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    return { text: `${month} ${day}`, isOverdue };
  };

  const dueDate = formatDate(card.due_date);

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        boxShadow: 'rgba(9, 30, 66, 0.13) 0px 1px 1px 0px',
      }}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`bg-white rounded-trello p-3 cursor-pointer border border-trello-gray-border hover:border-trello-blue-light transition-all group ${
        priorityBorder[card.priority] || ''
      }`}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'rgba(9, 30, 66, 0.25) 0px 4px 8px 0px';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'rgba(9, 30, 66, 0.13) 0px 1px 1px 0px';
      }}
    >
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.map((label) => (
            <span
              key={label.id}
              className="h-2 w-10 rounded-full"
              style={{ backgroundColor: label.color }}
              title={label.name}
            />
          ))}
        </div>
      )}

      <p className="text-sm text-trello-navy font-medium leading-snug">{card.title}</p>

      <div className="flex flex-wrap items-center gap-1.5 mt-2 text-xs text-trello-gray-neutral">
        {dueDate && (
          <span
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-trello font-medium ${
              card.is_completed
                ? 'bg-green-100 text-green-700'
                : dueDate.isOverdue
                ? 'bg-red-100 text-red-700'
                : 'bg-trello-gray-light text-trello-gray-dark'
            }`}
          >
            <Calendar size={11} />
            {dueDate.text}
          </span>
        )}

        {card.description && (
          <span className="flex items-center gap-1 text-trello-gray-medium" title="Has description">
            <MessageSquare size={11} />
          </span>
        )}

        {card.checklists_progress && (
          <span className={`flex items-center gap-1 ${
            card.checklists_progress.completed === card.checklists_progress.total && card.checklists_progress.total > 0
              ? 'text-green-600'
              : 'text-trello-gray-medium'
          }`}>
            <CheckSquare size={11} />
            {card.checklists_progress.completed}/{card.checklists_progress.total}
          </span>
        )}

        {card.attachments_count > 0 && (
          <span className="flex items-center gap-1 text-trello-gray-medium">
            <Paperclip size={11} />
            {card.attachments_count}
          </span>
        )}

        {card.assignee && (
          <span className="ml-auto">
            {card.assignee.avatar_url ? (
              <img
                src={card.assignee.avatar_url}
                alt={card.assignee.full_name}
                className="w-6 h-6 rounded-trello-pill border border-trello-gray-border"
              />
            ) : (
              <span className="flex items-center justify-center w-6 h-6 bg-trello-blue rounded-trello-pill text-white text-xs font-semibold">
                {card.assignee.full_name?.charAt(0).toUpperCase()}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
