import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  FolderKanban,
  Building2,
  CheckCircle2,
  PlayCircle,
  AlertCircle,
  FileText,
  Send,
  History,
  MessageSquare,
  Paperclip,
  TrendingUp,
  X,
  ExternalLink
} from 'lucide-react';
import Modal from '../Modal';
import Button from '../Button';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityBadge from './TaskPriorityBadge';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';

export const TaskDetailsModal = ({ isOpen, onClose, task }) => {
  const { updateTaskStatus, addTaskComment, updateTaskHours, getEffectiveStatus } = useERP();
  const { currentUser } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [loggedHours, setLoggedHours] = useState(task?.actualHours || 0);

  if (!task) return null;

  const effectiveStatus = getEffectiveStatus(task);
  const isOverdue = effectiveStatus === 'Overdue';
  const hoursProgress = task.estimatedHours > 0
    ? Math.min(100, Math.round(((task.actualHours || 0) / task.estimatedHours) * 100))
    : 0;

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addTaskComment(task.id, commentText);
    setCommentText('');
  };

  const handleUpdateHours = (e) => {
    e.preventDefault();
    updateTaskHours(task.id, loggedHours);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {task.id}
          </span>
          <span className="truncate">{task.title}</span>
        </div>
      }
      subtitle={`${task.project} • ${task.department}`}
      maxWidth="max-w-4xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Quick Status:</span>
            <Button
              size="sm"
              variant={task.status === 'Pending' ? 'primary' : 'secondary'}
              onClick={() => updateTaskStatus(task.id, 'Pending')}
            >
              Pending
            </Button>
            <Button
              size="sm"
              variant={task.status === 'In Progress' ? 'primary' : 'secondary'}
              onClick={() => updateTaskStatus(task.id, 'In Progress')}
            >
              In Progress
            </Button>
            <Button
              size="sm"
              variant={task.status === 'Completed' ? 'primary' : 'secondary'}
              className={task.status === 'Completed' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
              onClick={() => updateTaskStatus(task.id, 'Completed')}
            >
              Mark Completed
            </Button>
          </div>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-6 max-h-[72vh] overflow-y-auto pr-1">
        {/* Overdue Banner if applicable */}
        {isOverdue && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0 animate-bounce" />
            <div className="text-xs">
              <span className="font-bold">Overdue Deadline Alert:</span> This deliverable was due on{' '}
              <span className="font-mono font-bold underline">{task.dueDate}</span> and has not been marked completed.
            </div>
          </div>
        )}

        {/* Top Badges & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2.5">
            <TaskStatusBadge status={effectiveStatus} size="lg" />
            <TaskPriorityBadge priority={task.priority} size="lg" />
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {task.department}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div>
              Created by <span className="font-semibold text-slate-800 dark:text-slate-200">{task.createdBy}</span>
            </div>
            <span>•</span>
            <div>{task.createdDate}</div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description & Deliverables</h4>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            {task.description || 'No detailed description provided.'}
          </p>
        </div>

        {/* Two-Column Grid: Metadata & Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* People & Assignments */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-400">Assignment Details</h4>

            <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Assigned Employee:</span>
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                  {task.assignedTo?.charAt(0) || 'E'}
                </div>
                <span>{task.assignedTo} ({task.assignedToId})</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Assigned Manager:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {task.assignedManager} ({task.assignedManagerId})
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Project:</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {task.project} ({task.projectId})
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Department:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{task.department}</span>
            </div>
          </div>

          {/* Timeline & Effort Tracking */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-400">Schedule & Effort</h4>

            <div className="grid grid-cols-3 gap-2 text-center py-1 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="block text-[11px] text-slate-400">Start Date</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{task.startDate}</span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-400">Due Date</span>
                <span className={`font-mono font-bold ${isOverdue ? 'text-rose-600 underline' : 'text-slate-800 dark:text-slate-200'}`}>
                  {task.dueDate}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-400">Completed On</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {task.completionDate || '—'}
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-500 font-medium">Logged Hours vs Estimated</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {task.actualHours || 0} hrs / {task.estimatedHours || 0} hrs ({hoursProgress}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    hoursProgress > 100 ? 'bg-rose-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${Math.min(100, hoursProgress)}%` }}
                />
              </div>
            </div>

            {/* Quick update logged hours */}
            <form onSubmit={handleUpdateHours} className="flex items-center gap-2 pt-1">
              <input
                type="number"
                min="0"
                step="0.5"
                value={loggedHours}
                onChange={(e) => setLoggedHours(e.target.value)}
                className="w-24 text-xs py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Hours"
              />
              <Button size="sm" variant="secondary" type="submit">
                Update Actual Hours
              </Button>
            </form>
          </div>
        </div>

        {/* Attachments Section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Paperclip className="w-3.5 h-3.5" /> Attachments ({task.attachments?.length || 0})
          </h4>
          {task.attachments && task.attachments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {task.attachments.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs hover:border-indigo-400 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</span>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">({file.size})</span>
                  </div>
                  <button
                    onClick={() => alert(`Downloading attachment: ${file.name}`)}
                    className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="Download attachment"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              No files attached to this task.
            </div>
          )}
        </div>

        {/* Two-Column Tabs: Comments & Activity Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Comments Thread */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Discussion & Updates ({task.comments?.length || 0})
            </h4>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {task.comments && task.comments.length > 0 ? (
                task.comments.map((cmt) => (
                  <div
                    key={cmt.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={cmt.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={cmt.author}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-900 dark:text-white">{cmt.author}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {cmt.authorRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{cmt.timestamp}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 pl-7 leading-relaxed">{cmt.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic p-3 text-center">No comments yet. Start the conversation below!</div>
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment or progress update..."
                className="flex-1 text-xs py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button size="sm" type="submit" variant="primary">
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" /> Activity Timeline
            </h4>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {task.activityTimeline && task.activityTimeline.length > 0 ? (
                task.activityTimeline.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start gap-2.5 text-xs p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40"
                  >
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">{act.action}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>by {act.user}</span>
                        <span>•</span>
                        <span>{act.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic p-3 text-center">No activity history recorded yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailsModal;
