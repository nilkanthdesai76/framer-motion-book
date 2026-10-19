'use client';

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { snappySpring } from '../../../tokens/springs.ts';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
}

export interface StackedToastQueueProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  className?: string;
}

/**
 * StackedToastQueue: Dynamic stacked notification toast queue (Mac OS / Sonner style).
 */
export function StackedToastQueue({
  toasts,
  onDismiss,
  className = ''
}: StackedToastQueueProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 pointer-events-none ${className}`}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast, index) => {
          const isTop = index === toasts.length - 1;
          const bgColors = {
            success: 'border-emerald-500/30 bg-emerald-950/90 text-emerald-200',
            error: 'border-rose-500/30 bg-rose-950/90 text-rose-200',
            info: 'border-sky-500/30 bg-slate-900/90 text-sky-200'
          };
          const style = bgColors[toast.type || 'info'];

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 20,
                scale: shouldReduceMotion ? 1 : 0.9
              }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                scale: shouldReduceMotion ? 1 : 0.85,
                transition: { duration: 0.15 }
              }}
              transition={snappySpring}
              className={`pointer-events-auto flex min-w-[300px] max-w-sm items-center justify-between rounded-xl border p-4 shadow-xl backdrop-blur-md ${style}`}
            >
              <div>
                <h4 className="text-sm font-semibold text-white">{toast.title}</h4>
                {toast.description && (
                  <p className="mt-0.5 text-xs opacity-80">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="ml-3 rounded-md p-1 opacity-70 hover:opacity-100"
              >
                ✕
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
