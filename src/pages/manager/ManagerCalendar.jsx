import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, FolderKanban, CheckSquare } from 'lucide-react';
import Badge from '../../components/Badge';

export const ManagerCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState('October 2026');

  const events = [
    { date: '2026-10-01', title: 'Q4 2026 Strategy Kickoff Townhall', type: 'meeting', time: '10:00 AM' },
    { date: '2026-10-04', title: 'Release Sprint RC1 Cypress E2E Tests Due', type: 'deadline', time: '05:00 PM' },
    { date: '2026-10-05', title: 'Dark Mode & Contrast Verification Due', type: 'task', time: '11:59 PM' },
    { date: '2026-10-08', title: 'Redis Multi-AZ Infrastructure Cutover', type: 'task', time: '02:00 PM' },
    { date: '2026-10-14', title: 'Elena Rostova: Approved PTO Absence', type: 'leave', time: 'All Day' },
    { date: '2026-10-15', title: 'Enterprise SOC2 Compliance Audit Milestone', type: 'deadline', time: '04:00 PM' },
    { date: '2026-10-20', title: 'Engineering Career Matrix Review', type: 'meeting', time: '11:00 AM' },
  ];

  const getEventBadge = (type) => {
    switch (type) {
      case 'deadline': return <Badge variant="danger" size="sm">Deadline</Badge>;
      case 'meeting': return <Badge variant="info" size="sm">Meeting</Badge>;
      case 'task': return <Badge variant="purple" size="sm">Task Due</Badge>;
      case 'leave': return <Badge variant="warning" size="sm">Absence</Badge>;
      default: return <Badge variant="neutral" size="sm">Event</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Engineering Team Delivery Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sprint milestone cutoffs, scheduled employee PTO, and infrastructure release windows
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-xs">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold">{currentMonth}</span>
        </div>
      </div>

      {/* Events Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Scheduled Milestones & Deliverables ({events.length})
        </h3>

        <div className="space-y-3">
          {events.map((ev, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-200 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold font-mono text-xs flex-shrink-0">
                  {ev.date.split('-')[2]} Oct
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ev.title}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5" /> {ev.time} · {ev.date}
                  </p>
                </div>
              </div>

              <div>
                {getEventBadge(ev.type)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ManagerCalendar;
