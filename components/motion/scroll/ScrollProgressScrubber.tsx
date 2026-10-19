'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export interface ScrollProgressScrubberProps {
  colorGradient?: string;
  heightPx?: number;
  className?: string;
}

/**
 * ScrollProgressScrubber: High-performance reading progress bar pinned to the viewport top.
 * Driven by passive RAF-batched useScroll and useSpring.
 */
export function ScrollProgressScrubber({
  colorGradient = 'from-sky-400 via-indigo-500 to-purple-500',
  heightPx = 3,
  className = ''
}: ScrollProgressScrubberProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 250,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{ scaleX }}
      className={`fixed top-0 left-0 right-0 z-50 origin-left bg-gradient-to-r ${colorGradient} ${className}`}
      css={{ height: `${heightPx}px` }}
    />
  );
}
