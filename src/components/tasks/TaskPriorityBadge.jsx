import React from 'react';
import { Flame, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

export const TaskPriorityBadge = ({ priority, size = 'md' }) => {
  const norm = priority || 'Medium';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2'
  }[size] || 'px-2.5 py-1 text-xs gap-1.5';

  const config = {
    'Critical': {
      bg: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
      icon: Flame,
      label: 'Critical'
    },
    'High': {
      bg: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30',
      icon: AlertTriangle,
      label: 'High'
    },
    'Medium': {
      bg: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
      icon: ArrowUp,
      label: 'Medium'
    },
    'Low': {
      bg: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
      icon: ArrowDown,
      label: 'Low'
    }
  }[norm] || {
    bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    icon: ArrowUp,
    label: norm
  };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center font-bold rounded-full border ${config.bg} ${sizeClasses}`}>
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};

export default TaskPriorityBadge;
