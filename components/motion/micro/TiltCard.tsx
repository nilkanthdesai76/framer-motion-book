'use client';

import React, { useRef, useState } from 'react';
import { motion, useSpring, useReducedMotion } from 'framer-motion';
import { gentleSpring } from '../../../tokens/springs.ts';

export interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTiltAngle?: number;
}

/**
 * TiltCard: 3D perspective mouse hover tilt card with dynamic spotlight glow reflection.
 */
export function TiltCard({
  children,
  className = '',
  maxTiltAngle = 12
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useSpring(0, gentleSpring);
  const rotateY = useSpring(0, gentleSpring);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;

    setMousePosition({ x: xPos, y: yPos });

    const xRatio = (xPos / rect.width - 0.5) * 2;
    const yRatio = (yPos / rect.height - 0.5) * 2;

    rotateX.set(-yRatio * maxTiltAngle);
    rotateY.set(xRatio * maxTiltAngle);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="inline-block">
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl transition-shadow duration-300 hover:shadow-sky-500/10 ${className}`}
      >
        {/* Dynamic Spotlight Glow */}
        {isHovered && !shouldReduceMotion && (
          <div
            className="pointer-events-none absolute -inset-px opacity-40 transition-opacity duration-300"
            style={{
              background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(56, 189, 248, 0.25), transparent 80%)`
            }}
          />
        )}
        <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
      </motion.div>
    </div>
  );
}
