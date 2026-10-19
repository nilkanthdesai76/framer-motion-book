'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { gentleSpring } from '../../../tokens/springs.ts';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

export interface ExpandableCardListProps {
  items: AccordionItem[];
  className?: string;
}

/**
 * ExpandableCardList: Smooth accordion list using Framer Motion's FLIP layout engine.
 */
export function ExpandableCardList({
  items,
  className = ''
}: ExpandableCardListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const toggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const isOpen = item.id === expandedId;
        return (
          <motion.div
            key={item.id}
            layout
            transition={gentleSpring}
            className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 shadow-sm"
          >
            <button
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between p-5 text-left text-base font-semibold text-white transition hover:text-sky-400"
            >
              <span>{item.question}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={gentleSpring}
                className="ml-4 text-slate-400"
              >
                ▼
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : gentleSpring}
                >
                  <div className="border-t border-slate-800/60 p-5 text-sm leading-relaxed text-slate-300">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
