import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  X,
  CreditCard,
  AlignLeft,
  Tag,
  User,
  Calendar,
  CheckSquare,
  Paperclip,
  Archive,
  MessageSquare,
  Activity,
} from 'lucide-react';
import { setOpenCardId, updateCard, deleteCard, clearCardNavContext } from '../../redux/slices/boardSlice';
import cardService from '../../services/card.service';
import LabelPicker from './LabelPicker';
import CommentSection from './CommentSection';
import ChecklistSection from './ChecklistSection';
import AttachmentSection from './AttachmentSection';
import ActivitySection from './ActivitySection';

const priorityOptions = [
  { value: 'none', label: 'None', color: 'bg-gray-200' },
  { value: 'low', label: 'Low', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-red-500' },
];

export default function CardDetailModal() {
  const dispatch = useDispatch();
  const { openCardId, lists, labels: boardLabels, members, currentBoard, cardNavContext } = useSelector((state) => state.board);
  const [card, setCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Use ref to capture cardNavContext so we can use it when openCardId changes
  const navContextRef = useRef(null);

  // Keep ref updated with latest cardNavContext
  useEffect(() => {
    if (cardNavContext) {
      navContextRef.current = cardNavContext;
    }
  }, [cardNavContext]);

  const myRole = currentBoard?.my_role;
  const canEdit = myRole === 'owner' || myRole === 'admin' || myRole === 'member';

  useEffect(() => {
    if (openCardId) {
      setIsLoading(true);

      // Use navigation context from ref (set by notification click)
      const ctx = navContextRef.current;

      if (ctx) {
        setActiveTab(ctx.tab || 'details');
        if (ctx.commentId) {
          sessionStorage.setItem('scrollToCommentId', ctx.commentId);
        }
        navContextRef.current = null;
        dispatch(clearCardNavContext());
      } else {
        setActiveTab('details');
      }

      cardService
        .getById(openCardId)
        .then((res) => {
          setCard(res.data);
          setTitle(res.data.title);
          setDescription(res.data.description || '');
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [openCardId, dispatch]);

  if (!openCardId) return null;

  const handleClose = () => {
    dispatch(setOpenCardId(null));
    setCard(null);
  };

  const handleTitleBlur = () => {
    if (title.trim() && title !== card.title) {
      dispatch(updateCard({ cardId: card.id, data: { title: title.trim() } }));
      setCard({ ...card, title: title.trim() });
    }
  };

  const handleDescriptionSave = () => {
    if (description !== card.description) {
      dispatch(updateCard({ cardId: card.id, data: { description } }));
      setCard({ ...card, description });
    }
    setIsEditingDesc(false);
  };

  const handlePriorityChange = (priority) => {
    dispatch(updateCard({ cardId: card.id, data: { priority } }));
    setCard({ ...card, priority });
  };

  const handleToggleComplete = async () => {
    try {
      if (card.is_completed) {
        await cardService.markIncomplete(card.id);
      } else {
        await cardService.markComplete(card.id);
      }
      setCard({ ...card, is_completed: !card.is_completed });
    } catch (error) {
      console.error('Failed to toggle complete:', error);
    }
  };

  const handleAssign = async (userId) => {
    try {
      await cardService.assign(card.id, userId);
      const member = members.find((m) => m.user.id === userId);
      setCard({ ...card, assignee: member?.user });
      setShowMemberPicker(false);
    } catch (error) {
      console.error('Failed to assign:', error);
    }
  };

  const handleUnassign = async () => {
    try {
      await cardService.unassign(card.id);
      setCard({ ...card, assignee: null });
    } catch (error) {
      console.error('Failed to unassign:', error);
    }
  };

  const handleDueDateChange = async (e) => {
    const dueDate = e.target.value ? new Date(e.target.value).toISOString() : null;
    dispatch(updateCard({ cardId: card.id, data: { due_date: dueDate } }));
    setCard({ ...card, due_date: dueDate });
    setShowDatePicker(false);
  };

  const handleArchive = () => {
    if (confirm('Are you sure you want to archive this card?')) {
      dispatch(deleteCard(card.id));
      handleClose();
    }
  };

  const handleLabelToggle = async (labelId, isAssigned) => {
    try {
      if (isAssigned) {
        await cardService.removeLabel(card.id, labelId);
        setCard({
          ...card,
          labels: card.labels.filter((l) => l.id !== labelId),
        });
      } else {
        await cardService.addLabel(card.id, labelId);
        const label = boardLabels.find((l) => l.id === labelId);
        setCard({
          ...card,
          labels: [...(card.labels || []), label],
        });
      }
    } catch (error) {
      console.error('Failed to toggle label:', error);
    }
  };

  const currentList = lists.find(
    (l) => l.id === card?.list?.id || l.cards?.some((c) => c.id === card?.id)
  );

  const tabs = [
    { id: 'details', label: 'Details', icon: CreditCard },
    { id: 'checklists', label: 'Checklists', icon: CheckSquare },
    { id: 'attachments', label: 'Attachments', icon: Paperclip },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-start justify-center p-4 pt-16">
        <div className="fixed inset-0 bg-black/50" onClick={handleClose} />

        <div
          className="relative bg-white rounded-trello w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
          style={{ boxShadow: 'rgba(9, 30, 66, 0.3) 0px 12px 24px 0px' }}
        >
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-1 rounded-trello hover:bg-trello-gray-light text-trello-gray-neutral z-10 transition-colors"
          >
            <X size={20} />
          </button>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trello-blue mx-auto" />
            </div>
          ) : card ? (
            <>
              <div className="p-6 pb-0">
                <div className="flex items-start gap-3 mb-4">
                  <CreditCard size={24} className="text-gray-500 mt-1" />
                  <div className="flex-1">
                    {canEdit ? (
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleTitleBlur}
                        className="text-xl font-semibold bg-transparent w-full focus:bg-trello-gray-light focus:px-2 focus:py-1 rounded-trello focus:outline-none focus:border focus:border-trello-blue text-trello-navy"
                      />
                    ) : (
                      <h2 className="text-xl font-semibold">{title}</h2>
                    )}
                    <p className="text-sm text-trello-gray-neutral mt-1">
                      in list <span className="underline">{currentList?.title || card.list?.title}</span>
                    </p>
                  </div>
                </div>

                <div className="flex border-b border-trello-gray-border -mx-6 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                        activeTab === tab.id
                          ? 'border-trello-blue text-trello-blue'
                          : 'border-transparent text-trello-gray-neutral hover:text-trello-navy'
                      }`}
                    >
                      <tab.icon size={16} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'details' && (
                  <div className="flex gap-6">
                    <div className="flex-1 space-y-6">
                      {card.labels && card.labels.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-trello-gray-neutral uppercase mb-2">
                            Labels
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {card.labels.map((label) => (
                              <span
                                key={label.id}
                                className="px-3 py-1 rounded text-sm text-white font-medium"
                                style={{ backgroundColor: label.color }}
                              >
                                {label.name || ' '}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {card.assignee && (
                        <div>
                          <h4 className="text-xs font-semibold text-trello-gray-neutral uppercase mb-2">
                            Assignee
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 bg-trello-blue rounded-trello-pill flex items-center justify-center text-white text-sm font-semibold">
                              {card.assignee.full_name?.charAt(0).toUpperCase() || '?'}
                            </span>
                            <span className="text-sm font-medium text-trello-navy">{card.assignee.full_name}</span>
                            {canEdit && (
                              <button
                                onClick={handleUnassign}
                                className="ml-auto text-xs text-trello-gray-neutral hover:text-red-500 transition-colors"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {card.reporter && (
                        <div>
                          <h4 className="text-xs font-semibold text-trello-gray-neutral uppercase mb-2">
                            Reporter
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 bg-green-600 rounded-trello-pill flex items-center justify-center text-white text-sm font-semibold">
                              {card.reporter.full_name?.charAt(0).toUpperCase() || '?'}
                            </span>
                            <div>
                              <span className="text-sm font-medium text-trello-navy">{card.reporter.full_name}</span>
                              <p className="text-xs text-trello-gray-neutral">
                                Created {new Date(card.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {card.due_date && (
                        <div>
                          <h4 className="text-xs font-semibold text-trello-gray-neutral uppercase mb-2">
                            Due date
                          </h4>
                          <div
                            onClick={canEdit ? handleToggleComplete : undefined}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-trello text-sm font-medium ${
                              card.is_completed
                                ? 'bg-green-500 text-white'
                                : new Date(card.due_date) < new Date()
                                ? 'bg-red-500 text-white'
                                : 'bg-trello-gray-light text-trello-navy'
                            } ${canEdit ? 'cursor-pointer' : ''}`}
                          >
                            {canEdit && (
                              <input
                                type="checkbox"
                                checked={card.is_completed}
                                onChange={() => {}}
                                className="rounded"
                              />
                            )}
                            {new Date(card.due_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                            {card.is_completed && <span className="ml-1">complete</span>}
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <AlignLeft size={20} className="text-trello-gray-neutral" />
                          <h4 className="font-semibold">Description</h4>
                        </div>
                        {isEditingDesc && canEdit ? (
                          <div>
                            <textarea
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              className="w-full p-3 border border-trello-gray-border rounded-trello resize-none text-trello-navy placeholder-trello-gray-medium focus:outline-none focus:border-trello-blue text-sm"
                              onFocus={(e) => { e.target.style.boxShadow = '0px 0px 0px 2px rgba(12, 102, 228, 0.2)'; }}
                              onBlur={(e) => { e.target.style.boxShadow = 'none'; }}
                              rows={4}
                              placeholder="Add a more detailed description..."
                              autoFocus
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={handleDescriptionSave}
                                className="px-3 py-1.5 bg-trello-blue text-white text-sm font-semibold rounded-trello-btn hover:bg-trello-blue-hover transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setDescription(card.description || '');
                                  setIsEditingDesc(false);
                                }}
                                className="px-3 py-1.5 text-trello-gray-dark hover:bg-trello-gray-light rounded-trello text-sm transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => canEdit && setIsEditingDesc(true)}
                            className={`p-3 bg-trello-gray-light rounded-trello min-h-[80px] text-sm text-trello-navy ${canEdit ? 'cursor-pointer hover:bg-trello-gray-border' : ''}`}
                          >
                            {description || (
                              <span className="text-trello-gray-neutral">
                                {canEdit ? 'Add a more detailed description...' : 'No description'}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {canEdit && (
                      <div className="w-48 space-y-2">
                        <h4 className="text-xs font-semibold text-trello-gray-neutral uppercase mb-3">
                          Add to card
                        </h4>

                        <div className="relative">
                          <button
                            onClick={() => setShowMemberPicker(!showMemberPicker)}
                            className="btn-action"
                          >
                            <User size={16} />
                            Members
                          </button>
                          {showMemberPicker && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setShowMemberPicker(false)} />
                              <div
                                className="absolute left-0 top-full mt-1 bg-white rounded-trello border border-trello-gray-border p-2 z-20 w-64"
                                style={{ boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px 0px' }}
                              >
                                <h5 className="font-semibold text-sm mb-2 px-2 text-trello-navy">Board members</h5>
                                {members.map((member) => (
                                  <button
                                    key={member.user.id}
                                    onClick={() => handleAssign(member.user.id)}
                                    className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-trello-gray-light rounded-trello text-sm text-trello-navy transition-colors"
                                  >
                                    <span className="w-6 h-6 bg-trello-blue rounded-trello-pill flex items-center justify-center text-white text-xs font-semibold">
                                      {member.user.full_name?.charAt(0).toUpperCase()}
                                    </span>
                                    {member.user.full_name}
                                    {card.assignee?.id === member.user.id && (
                                      <span className="ml-auto text-trello-blue font-bold">✓</span>
                                    )}
                                  </button>
                                ))}
                                {card.assignee && (
                                  <button
                                    onClick={handleUnassign}
                                    className="w-full px-2 py-1.5 mt-1 text-sm text-red-600 hover:bg-red-50 rounded-trello transition-colors"
                                  >
                                    Remove assignee
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>

                        <div className="relative">
                          <button
                            onClick={() => setShowLabelPicker(!showLabelPicker)}
                            className="btn-action"
                          >
                            <Tag size={16} />
                            Labels
                          </button>
                          {showLabelPicker && (
                            <LabelPicker
                              boardLabels={boardLabels}
                              cardLabels={card.labels || []}
                              onToggle={handleLabelToggle}
                              onClose={() => setShowLabelPicker(false)}
                            />
                          )}
                        </div>

                        <div className="relative">
                          <button
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            className="btn-action"
                          >
                            <Calendar size={16} />
                            Dates
                          </button>
                          {showDatePicker && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setShowDatePicker(false)} />
                              <div
                                className="absolute left-0 top-full mt-1 bg-white rounded-trello border border-trello-gray-border p-3 z-20"
                                style={{ boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px 0px' }}
                              >
                                <input
                                  type="datetime-local"
                                  value={card.due_date ? new Date(card.due_date).toISOString().slice(0, 16) : ''}
                                  onChange={handleDueDateChange}
                                  className="px-3 py-2 border border-trello-gray-border rounded-trello text-sm text-trello-navy focus:outline-none focus:border-trello-blue"
                                />
                              </div>
                            </>
                          )}
                        </div>

                        <div className="pt-4">
                          <h4 className="text-xs font-semibold text-trello-gray-neutral uppercase mb-3">
                            Actions
                          </h4>

                          <div className="space-y-1">
                            <select
                              value={card.priority}
                              onChange={(e) => handlePriorityChange(e.target.value)}
                              className="w-full px-3 py-2 bg-trello-gray-light border border-trello-gray-border rounded-trello-btn text-sm text-trello-navy focus:outline-none focus:border-trello-blue"
                            >
                              {priorityOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  Priority: {opt.label}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={handleArchive}
                              className="flex items-center gap-2 w-full px-3 py-2 bg-trello-gray-light rounded-trello-btn hover:bg-red-50 hover:text-red-600 text-sm text-trello-navy transition-colors"
                            >
                              <Archive size={16} />
                              Archive
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'checklists' && <ChecklistSection cardId={card.id} canEdit={canEdit} />}

                {activeTab === 'attachments' && <AttachmentSection cardId={card.id} canEdit={canEdit} />}

                {activeTab === 'comments' && <CommentSection cardId={card.id} canEdit={canEdit} members={members} />}

                {activeTab === 'activity' && <ActivitySection cardId={card.id} />}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-trello-gray-neutral">Card not found</div>
          )}
        </div>
      </div>
    </div>
  );
}
