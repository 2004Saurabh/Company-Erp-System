import React from 'react';
import { Megaphone, Pin, CheckCircle2, Calendar, User } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

export const EmployeeAnnouncements = () => {
  const { announcements, markAnnouncementRead } = useERP();
  const { currentUser } = useAuth();

  const empId = currentUser?.id === 'USR-004' ? 'EMP-1004' : (currentUser?.id || 'EMP-1004');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Company Noticeboard & Broadcasts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Official corporate communications, town halls, benefits updates, and policy advisories
        </p>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((anc) => {
          const isRead = anc.readBy?.includes(empId);

          return (
            <div
              key={anc.id}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                anc.pinned
                  ? 'border-indigo-500/40 shadow-md ring-1 ring-indigo-500/10'
                  : 'border-slate-200/80 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {anc.pinned && (
                    <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800/40">
                      <Pin className="w-3 h-3 rotate-45" /> Pinned
                    </span>
                  )}
                  <Badge
                    variant={anc.priority === 'Urgent' ? 'danger' : anc.priority === 'High' ? 'warning' : 'neutral'}
                    size="sm"
                  >
                    {anc.priority}
                  </Badge>
                  <span className="text-xs text-slate-400">Audience: {anc.audience}</span>
                </div>

                {!isRead ? (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={CheckCircle2}
                    onClick={() => markAnnouncementRead(anc.id, empId)}
                  >
                    Mark as Read
                  </Button>
                ) : (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Read
                  </span>
                )}
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
                  {anc.author} ({anc.authorRole})
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  {anc.date}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default EmployeeAnnouncements;
