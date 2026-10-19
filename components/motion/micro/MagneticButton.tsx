'use client';

import React, { useRef } from 'react';
import { motion, useSpring, useReducedMotion } from 'framer-motion';
import { snappySpring } from '../../../tokens/springs.ts';

export interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number; // 0.1 to 0.5 recommended
  className?: string;
  onClick?: () => void;
}

/**
 * MagneticButton: Attracts toward the user's cursor within a defined bounding box.
 * Respects prefers-reduced-motion for complete accessibility.
 */
export function MagneticButton({
  children,
  strength = 0.35,
  className = '',
  onClick
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const x = useSpring(0, snappySpring);
  const y = useSpring(0, snappySpring);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * strength);
    y.set((clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
      whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
      transition={snappySpring}
      className={`relative inline-flex items-center justify-center px-6 py-3 font-medium rounded-xl bg-slate-900 text-white shadow-lg transition-colors hover:bg-slate-800 ${className}`}
    >
      {children}
    </motion.button>
  );
}
