'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface SplitTextRevealProps {
  text: string;
  className?: string;
  delayOffset?: number;
}

/**
 * SplitTextReveal: Staggered letter and word entrance reveal triggered on viewport intersection.
 */
export function SplitTextReveal({
  text,
  className = '',
  delayOffset = 0
}: SplitTextRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.04,
        delayChildren: delayOffset
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 15, stiffness: 200 }
    }
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`inline-block ${className}`}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
          {Array.from(word).map((char, charIndex) => (
            <motion.span
              key={charIndex}
              variants={letterVariants}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
}
