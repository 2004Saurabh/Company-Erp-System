import React from 'react';

export const LoadingSkeleton = ({ count = 3, height = 'h-16', className = '' }) => {
  return (
    <div className={`w-full flex flex-col gap-3 animate-pulse ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-xl ${height}`}
        />
      ))}
    </div>
  );
};
export default LoadingSkeleton;
