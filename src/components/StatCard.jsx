import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StatCard = ({
  title,
  value,
  change,
  isPositive = true,
  comparisonText = 'vs last month',
  icon: Icon,
  iconColor = 'text-indigo-600 dark:text-indigo-400',
  iconBg = 'bg-indigo-50 dark:bg-indigo-950/60',
  linkTo,
  onClick,
  prefix = '',
  suffix = ''
}) => {
  const navigate = useNavigate();

  const changeValue = typeof change === 'object' && change !== null ? change.value : change;
  const changePositive = typeof change === 'object' && change !== null && change.isPositive !== undefined
    ? change.isPositive
    : isPositive;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (linkTo) {
      navigate(linkTo);
    }
  };

  const isClickable = Boolean(onClick || linkTo);

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      onClick={isClickable ? handleClick : undefined}
      className={`relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all ${
        isClickable ? 'cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700/60 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
            {title}
          </p>
          <h4 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
            {prefix}{value}{suffix}
          </h4>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl flex-shrink-0 ${iconBg} ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {changeValue !== undefined && changeValue !== null && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          <span
            className={`inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded-md ${
              changePositive
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
            }`}
          >
            {changePositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {typeof changeValue === 'number' ? `${changeValue}%` : changeValue}
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">{comparisonText}</span>
        </div>
      )}
    </motion.div>
  );
};
export default StatCard;
