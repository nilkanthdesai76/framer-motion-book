'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { gentleSpring } from '../../../tokens/springs.ts';

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  bgGradient: string;
}

export interface SharedElementGalleryProps {
  items: GalleryItem[];
  className?: string;
}

/**
 * SharedElementGallery: Fluid shared layout expansion between thumbnail cards and full dialog view.
 */
export function SharedElementGallery({
  items,
  className = ''
}: SharedElementGalleryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const selectedItem = items.find((i) => i.id === selectedId);

  return (
    <div className={`relative ${className}`}>
      {/* Grid of thumbnail cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layoutId={shouldReduceMotion ? undefined : `card-${item.id}`}
            onClick={() => setSelectedId(item.id)}
            whileHover={shouldReduceMotion ? {} : { y: -4, transition: { duration: 0.2 } }}
            className={`cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br ${item.bgGradient} p-6 text-white shadow-lg`}
          >
            <motion.span
              layoutId={shouldReduceMotion ? undefined : `cat-${item.id}`}
              className="text-xs font-semibold uppercase tracking-wider opacity-75"
            >
              {item.category}
            </motion.span>
            <motion.h3
              layoutId={shouldReduceMotion ? undefined : `title-${item.id}`}
              className="mt-2 text-xl font-bold"
            >
              {item.title}
            </motion.h3>
          </motion.div>
        ))}
      </div>

      {/* Expanded Modal Overlay */}
      <AnimatePresence>
        {selectedId && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              layoutId={shouldReduceMotion ? undefined : `card-${selectedItem.id}`}
              transition={gentleSpring}
              className={`relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-gradient-to-br ${selectedItem.bgGradient} p-8 text-white shadow-2xl`}
            >
              <motion.span
                layoutId={shouldReduceMotion ? undefined : `cat-${selectedItem.id}`}
                className="text-sm font-semibold uppercase tracking-wider opacity-80"
              >
                {selectedItem.category}
              </motion.span>
              <motion.h2
                layoutId={shouldReduceMotion ? undefined : `title-${selectedItem.id}`}
                className="mt-2 text-3xl font-extrabold"
              >
                {selectedItem.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.1 }}
                className="mt-4 text-base leading-relaxed opacity-90"
              >
                {selectedItem.description}
              </motion.p>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setSelectedId(null)}
                  className="rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/30"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
