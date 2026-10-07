import React from 'react';
import { AlertCircle, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

export const TaskStatusBadge = ({ status, size = 'md' }) => {
  const normStatus = status || 'Pending';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2'
  }[size] || 'px-2.5 py-1 text-xs gap-1.5';

  const config = {
    'Completed': {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      icon: CheckCircle2,
      label: 'Completed'
    },
    'In Progress': {
      bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      icon: PlayCircle,
      label: 'In Progress'
    },
    'Pending': {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: Clock,
      label: 'Pending'
    },
    'Overdue': {
      bg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 animate-pulse',
      icon: AlertCircle,
      label: 'Overdue'
    }
  }[normStatus] || {
    bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    icon: Clock,
    label: normStatus
  };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${config.bg} ${sizeClasses}`}>
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};

export default TaskStatusBadge;
