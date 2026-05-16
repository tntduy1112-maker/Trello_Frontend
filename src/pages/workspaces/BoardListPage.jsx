import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, LayoutGrid, X } from 'lucide-react';
import { fetchWorkspace } from '../../redux/slices/workspaceSlice';
import { fetchBoards, createBoard } from '../../redux/slices/boardSlice';

const BOARD_COLORS = [
  '#0C66E4', '#172B4D', '#519839', '#b04632',
  '#89609e', '#cd5a91', '#4bbf6b', '#00aecc',
];

export default function BoardListPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const { boards, isLoading } = useSelector((state) => state.board);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardColor, setNewBoardColor] = useState('#0C66E4');

  useEffect(() => {
    dispatch(fetchWorkspace(slug));
    dispatch(fetchBoards(slug));
  }, [dispatch, slug]);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    const result = await dispatch(createBoard({
      workspaceSlug: slug,
      data: { title: newBoardTitle, background_color: newBoardColor },
    }));
    if (createBoard.fulfilled.match(result)) {
      setShowCreateModal(false);
      setNewBoardTitle('');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-trello-navy">
          {currentWorkspace?.name || 'Workspace'}
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Board
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trello-blue" />
        </div>
      ) : boards.length === 0 ? (
        <div className="text-center py-16">
          <LayoutGrid className="w-16 h-16 mx-auto text-trello-gray-border mb-4" />
          <h2 className="text-xl font-semibold text-trello-gray-dark mb-2">No boards yet</h2>
          <p className="text-trello-gray-neutral mb-6">Create your first board to start organizing</p>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
            Create Board
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {boards.map((board) => (
            <Link
              key={board.id}
              to={`/board/${board.id}`}
              className="h-24 rounded-trello p-4 text-white font-semibold hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: board.background_color || '#0C66E4',
                boxShadow: 'rgba(9, 30, 66, 0.13) 0px 1px 1px 0px',
              }}
            >
              {board.title}
            </Link>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-trello w-full max-w-md"
            style={{ boxShadow: 'rgba(9, 30, 66, 0.3) 0px 12px 24px 0px' }}
          >
            <div className="flex items-center justify-between p-6 border-b border-trello-gray-border">
              <h2 className="text-lg font-semibold text-trello-navy">Create Board</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-trello hover:bg-trello-gray-light text-trello-gray-neutral transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateBoard} className="p-6 space-y-4">
              <div>
                <label className="label">Board Title</label>
                <input
                  type="text"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  required
                  className="input"
                  placeholder="Enter board title"
                />
              </div>
              <div>
                <label className="label">Background Color</label>
                <div className="flex gap-2 flex-wrap">
                  {BOARD_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewBoardColor(color)}
                      className="w-8 h-8 rounded-trello transition-transform hover:scale-110"
                      style={{
                        backgroundColor: color,
                        outline: newBoardColor === color ? '2px solid #0C66E4' : 'none',
                        outlineOffset: '2px',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
