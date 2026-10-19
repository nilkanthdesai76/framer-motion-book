'use client';

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { gentleSpring } from '../../../tokens/springs.ts';

export interface SpringModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * SpringModal: Accessible modal dialog with spring physics entrance and exit.
 */
export function SpringModal({
  isOpen,
  onClose,
  title,
  children,
  className = ''
}: SpringModalProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.95,
              y: shouldReduceMotion ? 0 : 20
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 0.95,
              y: shouldReduceMotion ? 0 : 15
            }}
            transition={gentleSpring}
            className={`relative z-10 w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl ${className}`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 id="modal-title" className="text-xl font-bold">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="mt-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
