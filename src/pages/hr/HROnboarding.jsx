import React, { useState } from 'react';
import { UserPlus, CheckCircle2, Clock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Avatar from '../../components/Avatar';
import { useToast } from '../../context/ToastContext';

export const HROnboarding = () => {
  const { employees } = useERP();
  const { addToast } = useToast();

  const [tasks, setTasks] = useState([
    { id: 'ONB-01', text: 'Issue Google Workspace & Okta Enterprise Identity', done: true, assignee: 'IT Operations' },
    { id: 'ONB-02', text: 'Sign Employee Confidentiality (NDA) & Code of Conduct', done: true, assignee: 'Legal' },
    { id: 'ONB-03', text: 'Deliver MacBook Pro M3 Max & Hardware Welcome Kit', done: true, assignee: 'Logistics' },
    { id: 'ONB-04', text: 'Enroll in Medical, Dental & 401(k) Matching Benefits', done: false, assignee: 'HR Benefits' },
    { id: 'ONB-05', text: 'Schedule 1-on-1 Coffee Chat with VP and Peer Buddy', done: false, assignee: 'Department Lead' },
    { id: 'ONB-06', text: 'Complete SOC2 Security Awareness Compliance Quiz', done: false, assignee: 'InfoSec' },
  ]);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    addToast('Onboarding milestone status updated.', 'info');
  };

  const newHires = employees.slice(0, 3); // recent hires

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Employee Onboarding & Day-1 Enablement
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Streamline equipment provisioning, legal agreements, and corporate cultural integration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: New Hires Queue */}
        <div className="lg:col-span-1 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Recent Onboarding Cohort
          </h3>
          <div className="space-y-3">
            {newHires.map(nh => (
              <div key={nh.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <Avatar src={nh.avatar} name={nh.fullName} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{nh.fullName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{nh.designation}</p>
                  <span className="text-[10px] text-indigo-500 font-medium">Joined {nh.joiningDate}</span>
                </div>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Master Onboarding Checklist */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Standard Onboarding Pipeline Checklist
              </h3>
              <p className="text-xs text-slate-500">
                {tasks.filter(t => t.done).length} of {tasks.length} milestones fulfilled (
                {Math.round((tasks.filter(t => t.done).length / tasks.length) * 100)}%)
              </p>
            </div>
            <Badge variant="info" size="sm">Standard Operating Procedure</Badge>
          </div>

          <div className="space-y-2.5">
            {tasks.map(t => (
              <div
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  t.done
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-emerald-600 cursor-pointer pointer-events-none"
                  />
                  <span className={`text-xs sm:text-sm font-medium ${t.done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {t.text}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 flex-shrink-0">
                  {t.assignee}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HROnboarding;
