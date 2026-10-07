import React from 'react';
import { Calendar as CalendarIcon, Clock, Award, Briefcase } from 'lucide-react';
import Badge from '../../components/Badge';

export const EmployeeCalendar = () => {
  const events = [
    { date: '2026-10-01', title: 'Q4 Strategy Townhall Broadcast', time: '10:00 AM', type: 'company' },
    { date: '2026-10-05', title: 'Task Due: Dark Mode & Contrast Verification', time: '11:59 PM', type: 'task' },
    { date: '2026-10-12', title: 'Task Due: Web Vitals LCP Optimization', time: '05:00 PM', type: 'task' },
    { date: '2026-10-14', title: 'Approved Casual Leave (Family Trip)', time: 'All Day', type: 'leave' },
    { date: '2026-10-15', title: 'Annual Benefits Open Enrollment Launch', time: '09:00 AM', type: 'company' },
    { date: '2026-10-31', title: 'Payroll Disbursement Processing', time: '05:00 PM', type: 'payroll' }
  ];

  const getBadge = (t) => {
    switch (t) {
      case 'task': return <Badge variant="purple" size="sm">Task Due</Badge>;
      case 'leave': return <Badge variant="warning" size="sm">Vacation</Badge>;
      case 'payroll': return <Badge variant="success" size="sm">Payroll</Badge>;
      default: return <Badge variant="info" size="sm">Company Event</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Company & Sprint Calendar
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Corporate holidays, team sprint deadlines, and personal approved PTO schedule
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Upcoming Schedule (October 2026)
        </h3>

        <div className="space-y-3">
          {events.map((ev, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-xs">
                  {ev.date.split('-')[2]} Oct
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ev.title}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5" /> {ev.time}
                  </p>
                </div>
              </div>
              <div>{getBadge(ev.type)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default EmployeeCalendar;
