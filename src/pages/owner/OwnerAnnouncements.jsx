import React, { useState } from 'react';
import { Megaphone, Plus, Pin, Trash2, Calendar, User, Tag } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import AnnouncementModal from '../../components/modals/AnnouncementModal';
import ConfirmDialog from '../../components/ConfirmDialog';

export const OwnerAnnouncements = () => {
  const { announcements, togglePinAnnouncement, deleteAnnouncement } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const sortedAnnouncements = [...announcements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Company Communications & Noticeboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Broadcast official notices, roadmap updates, and policy memos across all workforce tiers
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          Publish Announcement
        </Button>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        {sortedAnnouncements.map((anc) => (
          <div
            key={anc.id}
            className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
              anc.pinned
                ? 'border-indigo-500/40 shadow-md ring-1 ring-indigo-500/10'
                : 'border-slate-200/80 dark:border-slate-800 shadow-sm'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                {anc.pinned && (
                  <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800/40">
                    <Pin className="w-3 h-3 rotate-45" /> Pinned
                  </span>
                )}
                <Badge
                  variant={anc.priority === 'Urgent' ? 'danger' : anc.priority === 'High' ? 'warning' : 'neutral'}
                  size="sm"
                >
                  {anc.priority} Priority
                </Badge>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Audience: <span className="text-slate-800 dark:text-slate-200">{anc.audience}</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  onClick={() => togglePinAnnouncement(anc.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    anc.pinned
                      ? 'text-indigo-600 bg-indigo-50 dark:bg-slate-800'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={anc.pinned ? 'Unpin' : 'Pin to top'}
                >
                  <Pin className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setItemToDelete(anc)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-3">
              {anc.title}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {anc.description}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {anc.author} ({anc.authorRole || 'Executive'})
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                {anc.date}
              </span>
            </div>
          </div>
        ))}
      </div>

      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        title="Delete Notice"
        message="Are you sure you want to retract and delete this announcement from the enterprise portal?"
        confirmText="Delete Notice"
        onConfirm={() => {
          if (itemToDelete) {
            deleteAnnouncement(itemToDelete.id);
            setItemToDelete(null);
          }
        }}
      />
    </div>
  );
};
export default OwnerAnnouncements;
