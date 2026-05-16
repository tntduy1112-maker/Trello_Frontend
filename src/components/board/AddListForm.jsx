import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Plus, X } from 'lucide-react';
import { createList } from '../../redux/slices/boardSlice';

export default function AddListForm({ boardId }) {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      dispatch(createList({ boardId, title: title.trim() }));
      setTitle('');
      setIsAdding(false);
    }
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-trello p-3 w-64 md:w-72 flex-shrink-0 text-white font-semibold text-sm transition-colors"
      >
        <Plus size={18} />
        Add another list
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-trello-gray-light rounded-trello p-3 w-64 md:w-72 flex-shrink-0"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter list title..."
        className="w-full px-3 py-2 text-sm border border-trello-gray-border rounded-trello bg-white text-trello-navy placeholder-trello-gray-medium focus:outline-none focus:border-trello-blue"
        style={{ height: '40px' }}
        onFocus={(e) => { e.target.style.boxShadow = '0px 0px 0px 2px rgba(12, 102, 228, 0.2)'; }}
        onBlur={(e) => { e.target.style.boxShadow = 'none'; }}
        autoFocus
      />
      <div className="flex items-center gap-2 mt-2">
        <button
          type="submit"
          className="px-3 py-1.5 bg-trello-blue text-white text-sm font-semibold rounded-trello-btn hover:bg-trello-blue-hover transition-colors"
        >
          Add list
        </button>
        <button
          type="button"
          onClick={() => { setIsAdding(false); setTitle(''); }}
          className="p-1.5 text-trello-gray-neutral hover:text-trello-navy transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </form>
  );
}
