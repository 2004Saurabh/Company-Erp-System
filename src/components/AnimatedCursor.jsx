import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const AnimatedCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect mobile / touch devices
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      const target = e.target;
      const isButton = target.closest('button') || target.tagName === 'BUTTON';
      const isClickable = target.closest('a, button, input, select, textarea, [role="button"], .interactive-card');

      setIsHoveringButton(Boolean(isButton));
      setIsHoveringClickable(Boolean(isClickable));
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Central Sharp Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full pointer-events-none z-[9999]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHoveringClickable ? 0 : 1,
          opacity: mousePosition.x < 0 ? 0 : 1
        }}
        transition={{ type: 'spring', damping: 40, stiffness: 450, mass: 0.1 }}
      />

      {/* Outer Smooth Trailing Circle */}
      <motion.div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9998] border transition-colors ${
          isHoveringButton
            ? 'border-indigo-500 bg-indigo-500/20'
            : isHoveringClickable
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-indigo-400/50 dark:border-indigo-300/40 bg-transparent'
        }`}
        animate={{
          x: mousePosition.x - (isHoveringClickable ? 22 : 14),
          y: mousePosition.y - (isHoveringClickable ? 22 : 14),
          width: isHoveringClickable ? 44 : 28,
          height: isHoveringClickable ? 44 : 28,
          opacity: mousePosition.x < 0 ? 0 : 1
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 220, mass: 0.2 }}
      />
    </>
  );
};
export default AnimatedCursor;
