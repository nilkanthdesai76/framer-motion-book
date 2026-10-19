'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { snappySpring } from '../../../tokens/springs.ts';

export interface SpringToggleProps {
  isOn: boolean;
  onToggle: (newState: boolean) => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * SpringToggle: iOS / Raycast style physics toggle switch with spring-animated thumb.
 */
export function SpringToggle({
  isOn,
  onToggle,
  className = '',
  ariaLabel = 'Toggle setting'
}: SpringToggleProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <button
      role="switch"
      aria-checked={isOn}
      aria-label={ariaLabel}
      onClick={() => onToggle(!isOn)}
      className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
        isOn ? 'bg-sky-600' : 'bg-slate-700'
      } ${className}`}
    >
      <motion.span
        layout={!shouldReduceMotion}
        transition={snappySpring}
        className={`pointer-events-none block h-6 w-6 rounded-full bg-white shadow-md ${
          isOn ? 'ml-auto' : 'mr-auto'
        }`}
      />
    </button>
  );
}
