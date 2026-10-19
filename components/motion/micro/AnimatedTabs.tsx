'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { snappySpring } from '../../../tokens/springs.ts';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface AnimatedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

/**
 * AnimatedTabs: Floating pill active indicator gliding between tab choices using layoutId.
 */
export function AnimatedTabs({
  tabs,
  activeTab,
  onChange,
  className = ''
}: AnimatedTabsProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`inline-flex items-center gap-1 rounded-2xl bg-slate-800/80 p-1.5 backdrop-blur-md ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative z-10 flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 ${
              isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                transition={shouldReduceMotion ? { duration: 0 } : snappySpring}
                className="absolute inset-0 -z-10 rounded-xl bg-sky-600 shadow-md"
              />
            )}
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
