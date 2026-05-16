import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MoreHorizontal, Plus, X } from 'lucide-react';
import { updateList, deleteList, createCard } from '../../redux/slices/boardSlice';
import BoardCard from './BoardCard';

export default function BoardList({ list, cards = [], canEdit = true, canManage = false }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: { type: 'list', list },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleTitleSubmit = () => {
    if (title.trim() && title !== list.title) {
      dispatch(updateList({ listId: list.id, data: { title: title.trim() } }));
    }
    setIsEditing(false);
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (newCardTitle.trim()) {
      dispatch(createCard({ listId: list.id, title: newCardTitle.trim() }));
      setNewCardTitle('');
      setShowAddCard(false);
    }
  };

  const handleArchiveList = () => {
    if (confirm('Are you sure you want to archive this list?')) {
      dispatch(deleteList(list.id));
    }
    setShowMenu(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-trello-gray-light rounded-trello w-64 md:w-72 flex-shrink-0 flex flex-col max-h-[calc(100vh-140px)]"
    >
      {/* List header */}
      <div
        {...attributes}
        {...listeners}
        className="px-3 pt-3 pb-1 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center justify-between gap-2">
          {isEditing && canManage ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              className="flex-1 px-2 py-1 text-sm font-semibold bg-white border-2 border-trello-blue rounded-trello focus:outline-none"
              autoFocus
            />
          ) : (
            <h3
              onClick={() => canManage && setIsEditing(true)}
              className={`font-semibold text-trello-navy text-sm px-2 py-1 rounded-trello flex-1 ${
                canManage ? 'cursor-pointer hover:bg-trello-gray-border' : ''
              }`}
            >
              {list.title}
            </h3>
          )}
          {canManage && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-trello hover:bg-trello-gray-border text-trello-gray-neutral transition-colors"
              >
                <MoreHorizontal size={16} />
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div
                    className="absolute right-0 top-8 bg-white rounded-trello border border-trello-gray-border py-1 z-20 w-48"
                    style={{ boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px 0px' }}
                  >
                    <button
                      onClick={handleArchiveList}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-trello-gray-light text-red-600 transition-colors"
                    >
                      Archive list
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-3 space-y-2 py-1">
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <BoardCard key={card.id} card={card} listId={list.id} canEdit={canEdit} />
          ))}
        </SortableContext>
      </div>

      {/* Add card */}
      {canEdit && (
        <div className="p-3">
          {showAddCard ? (
            <form onSubmit={handleAddCard}>
              <textarea
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                placeholder="Enter a title for this card..."
                className="w-full p-2 text-sm border border-trello-gray-border rounded-trello resize-none bg-white text-trello-navy placeholder-trello-gray-medium focus:outline-none focus:border-trello-blue"
                style={{ boxShadow: 'none' }}
                onFocus={(e) => { e.target.style.boxShadow = '0px 0px 0px 2px rgba(12, 102, 228, 0.2)'; }}
                onBlur={(e) => { e.target.style.boxShadow = 'none'; }}
                rows={3}
                autoFocus
              />
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-trello-blue text-white text-sm font-semibold rounded-trello-btn hover:bg-trello-blue-hover transition-colors"
                >
                  Add card
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddCard(false); setNewCardTitle(''); }}
                  className="p-1.5 text-trello-gray-neutral hover:text-trello-navy transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddCard(true)}
              className="flex items-center gap-1.5 w-full px-2 py-1.5 text-sm text-trello-gray-dark hover:bg-trello-gray-border rounded-trello transition-colors font-medium"
            >
              <Plus size={16} />
              Add a card
            </button>
          )}
        </div>
      )}
    </div>
  );
}
