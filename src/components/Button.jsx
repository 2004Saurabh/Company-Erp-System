import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all rounded-xl select-none focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap';

  const sizeClasses = {
    xs: 'text-xs px-2.5 py-1 gap-1 leading-normal',
    sm: 'text-xs px-3 py-1.5 gap-1.5 leading-normal',
    md: 'text-sm px-4 py-2 gap-2 leading-normal',
    lg: 'text-base px-5 py-2.5 gap-2.5 leading-normal',
    icon: 'p-2 shrink-0'
  };

  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-indigo-500/25 focus:ring-indigo-500',
    secondary: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-slate-500',
    outline: 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 focus:ring-indigo-500',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-rose-500/25 focus:ring-rose-500',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-emerald-500/25 focus:ring-emerald-500',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow-amber-500/25 focus:ring-amber-500',
    ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
  };

  return (
    <motion.button
      whileHover={{ y: disabled || loading ? 0 : -1 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5 shrink-0" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className={`${size === 'xs' || size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} shrink-0`} />
      ) : null}

      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">{children}</span>

      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={`${size === 'xs' || size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} shrink-0`} />
      )}
    </motion.button>
  );
};
export default Button;
