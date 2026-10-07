import React from 'react';

export const Avatar = ({
  src,
  name = 'User',
  size = 'md',
  status,
  className = ''
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const statusIndicatorClasses = {
    xs: 'w-1.5 h-1.5 bottom-0 right-0',
    sm: 'w-2 h-2 bottom-0 right-0',
    md: 'w-2.5 h-2.5 bottom-0 right-0',
    lg: 'w-3 h-3 bottom-0.5 right-0.5',
    xl: 'w-3.5 h-3.5 bottom-1 right-1'
  };

  const getInitials = (text) => {
    if (!text) return 'U';
    const parts = text.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return text.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-flex flex-shrink-0 select-none ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClasses[size] || sizeClasses.md} rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm`}
        />
      ) : (
        <div
          className={`${sizeClasses[size] || sizeClasses.md} rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-semibold flex items-center justify-center ring-2 ring-white dark:ring-slate-800 shadow-sm`}
        >
          {getInitials(name)}
        </div>
      )}

      {status && (
        <span
          className={`absolute rounded-full ring-2 ring-white dark:ring-slate-900 ${
            statusIndicatorClasses[size] || statusIndicatorClasses.md
          } ${
            status === 'online'
              ? 'bg-emerald-500'
              : status === 'away'
              ? 'bg-amber-500'
              : status === 'busy'
              ? 'bg-rose-500'
              : 'bg-slate-400'
          }`}
        />
      )}
    </div>
  );
};
export default Avatar;
