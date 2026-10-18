# PRD.md — Framer Motion Template Book & Cookbook

> Product Requirements Document for **Framer Motion Handbook**: The definitive open-source collection of production-ready, copy-paste React animations, micro-interactions, layout transitions, gestures, and scroll effects ready to drop into any modern website.

---

## 🎯 1. Objective & Problem Statement

### The Problem
Building fluid, high-end web animations in modern React/Next.js applications is notoriously difficult:
- **Jank & Layout Thrashing**: Developers frequently animate non-composite CSS properties (`width`, `height`, `top`, `left`, `margin`), triggering expensive browser layout reflows and dropping framerates below 60 FPS.
- **Copy-Paste Friction**: Existing animation libraries either require heavy wrapper dependencies, bundle bloat, or lock developers into rigid UI frameworks that conflict with Tailwind CSS.
- **Accessibility Neglect**: Over 90% of web animation examples ignore the `prefers-reduced-motion` media query, triggering motion sickness or vestibular disorientation for sensitive users.
- **Exit Animation Failures**: Developers struggle with `AnimatePresence`, missing unique keys, or triggering unmount glitches during routing transitions.
- **Fragmented Code**: Teams waste dozens of hours reinventing basic patterns: magnetic buttons, smooth accordion reveals, sticky scroll scrubbers, and shared element layout cards.

### The Solution
**Framer Motion Handbook** is a zero-dependency, copy-paste pattern book and component registry:
- **Drop-in Anywhere**: Copy component code directly into any React, Next.js (App Router / Pages), Remix, Vite, or Astro project styled with Tailwind CSS.
- **100% Zero-Jank Guarantee**: Every animation strictly animates GPU composite properties (`transform: translate3d/scale/rotate`, `opacity`) or utilizes hardware-accelerated SVG paths and Framer Motion's FLIP layout engine (`layout`, `layoutId`).
- **First-Class Accessibility**: Every recipe includes built-in `useReducedMotion()` fallbacks, ensuring compliant accessibility without sacrificing visual flair.
- **Physics-First Spring Presets**: Eliminates arbitrary cubic-bezier trial-and-error by providing mathematically balanced spring configurations (Snappy, Bouncy, Gentle, Smooth, Crisp).

---

## 📚 2. Comprehensive Animation Category Taxonomy

The Template Book is organized into 10 primary categories containing 50+ copy-paste recipes:

```
framer-motion-book/
├── 1. micro-interactions/      # Magnetic buttons, springy switches, bouncy tabs, hover tilts
├── 2. layout-transitions/      # layoutId shared element, expanding cards, list re-ordering
├── 3. scroll-driven/           # useScroll parallax, sticky progress scrubbers, timeline cards
├── 4. gestures-physics/        # Drag-to-dismiss, swipable bottom sheet, pull-to-refresh
├── 5. dialogs-overlays/        # Spring modals, nested dropdowns, tooltips, command palettes
├── 6. text-typography/         # Split-text reveal, typewriter, scramble, word staggers
├── 7. heroes-backgrounds/      # Floating magnetic particles, ambient glow spheres, mesh cards
├── 8. navigation-menus/        # Morphing pill nav, floating dock bar, hide-on-scroll navbar
├── 9. feedback-toasts/         # Dynamic stacked toast queue, SVG checkmark draw, shake alert
└── 10. data-loaders/           # Morphing SVG spinners, staggered skeleton bars, metric counters
```

---

## 🔬 3. Detailed Pattern Specifications & Copy-Paste Recipes

### 3.1 Micro-Interactions: Magnetic Button with Fluid Cursor Following
Attracts the button element toward the user's cursor within a defined bounding box using spring physics:

```tsx
'use client';

import React, { useRef, useState } from 'react';
import { motion, useSpring, useReducedMotion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number; // 0.1 to 0.5 recommended
  className?: string;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  strength = 0.35,
  className = '',
  onClick
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const springConfig = { stiffness: 250, damping: 20, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

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
      className={`relative inline-flex items-center justify-center px-6 py-3 font-medium rounded-xl bg-slate-900 text-white shadow-lg transition-colors hover:bg-slate-800 ${className}`}
    >
      {children}
    </motion.button>
  );
}
```

---

### 3.2 Layout Animations: Shared Element Card Expansion (`layoutId`)
Expands a thumbnail card into a full modal view seamlessly without calculating manual bounding rect coordinates:

```tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CardItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
}

export function SharedElementGallery({ items }: { items: CardItem[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedItem = items.find(i => i.id === selectedId);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(item => (
          <motion.div
            key={item.id}
            layoutId={`card-${item.id}`}
            onClick={() => setSelectedId(item.id)}
            whileHover={{ y: -4 }}
            className={`cursor-pointer p-6 rounded-2xl ${item.color} text-white shadow-md`}
          >
            <motion.h3 layoutId={`title-${item.id}`} className="text-xl font-bold">
              {item.title}
            </motion.h3>
            <motion.p layoutId={`sub-${item.id}`} className="text-sm opacity-80 mt-1">
              {item.subtitle}
            </motion.p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              layoutId={`card-${selectedItem.id}`}
              className={`relative z-10 w-full max-w-lg p-8 rounded-3xl ${selectedItem.color} text-white shadow-2xl`}
            >
              <motion.h3 layoutId={`title-${selectedItem.id}`} className="text-3xl font-extrabold">
                {selectedItem.title}
              </motion.h3>
              <motion.p layoutId={`sub-${selectedItem.id}`} className="text-lg opacity-90 mt-2">
                {selectedItem.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.15 }}
                className="mt-6 text-sm leading-relaxed opacity-95"
              >
                {selectedItem.description}
              </motion.div>
              <button
                onClick={() => setSelectedId(null)}
                className="mt-6 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

### 3.3 Scroll-Driven Animations: Parallax Header & Scrubbed Reading Progress

```tsx
'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export function ParallaxHero({ title, imageUrl }: { title: string; imageUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  // Background moves slower than foreground scroll (Parallax factor)
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Smooth progress bar
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 200, damping: 25 });

  return (
    <>
      {/* Top sticky reading progress bar */}
      <motion.div
        style={{ scaleX: smoothProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 origin-left z-50"
      />

      <div ref={containerRef} className="relative h-[80vh] overflow-hidden bg-slate-950 flex items-center justify-center">
        <motion.div
          style={{ y: imageY }}
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
          css={{ backgroundImage: `url(${imageUrl})` }}
        />
        <motion.div style={{ y: textY, opacity }} className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
            {title}
          </h1>
        </motion.div>
      </div>
    </>
  );
}
```

---

### 3.4 Text & Typography: Split Character Stagger Reveal

```tsx
'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface SplitTextRevealProps {
  text: string;
  className?: string;
  delayOffset?: number;
}

export function SplitTextReveal({ text, className = '', delayOffset = 0 }: SplitTextRevealProps) {
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
```

---

## ⚡ 4. Spring Physics Design Token Engine

Framer Motion Handbook specifies 5 standardized spring archetypes. Developers choose an archetype based on emotional intent:

| Archetype | Stiffness ($k$) | Damping ($c$) | Mass ($m$) | Rebound Feel | Ideal Use Cases |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Snappy** | `400` | `30` | `0.8` | Ultra-fast with crisp, immediate settle | Button clicks, toggles, tab active indicators |
| **Bouncy** | `300` | `15` | `0.8` | Playful, noticeable overshoot and rebound | Badges, reaction icons, gamified reward banners |
| **Gentle** | `180` | `24` | `1.0` | Natural, soft, zero mechanical bounce | Modal presentation, drawer slide-overs |
| **Smooth** | `120` | `20` | `1.2` | Elegant, cinematic deceleration | Parallax layers, background glow repositioning |
| **Crisp** | `500` | `35` | `0.5` | Instantaneous, tactile feedback | Keystroke reactions, dropdown menu popovers |

---

## ♿ 5. Accessibility (a11y) & Performance Non-Negotiables

1. **`useReducedMotion` Rule**:
   Every animated component MUST import `useReducedMotion`. If active:
   - Transforms (`x`, `y`, `scale`, `rotate`) are neutralized or capped at $< 2\text{px}$.
   - Complex spring delays and staggers collapse to instant transitions or simple opacity cross-fades.
2. **GPU Composite Properties Only**:
   - Strictly animate `transform`, `opacity`, `filter: blur()`, and `clip-path`.
   - Never animate `width`, `height`, `margin`, `padding`, `top`, `left`, `bottom`, `right`.
3. **`layoutId` Containment**:
   - Shared layout transitions must be scoped within isolated containers to prevent full-page layout re-calculations.
4. **`will-change` Management**:
   - Framer Motion automatically manages `will-change: transform`. Do not hardcode static `will-change: transform` in Tailwind classes as it exhausts GPU memory on mobile devices.

---

## 🎯 6. Target Developer Experience (DX)

- **Copy-Paste Registry**: Users can copy individual `.tsx` files directly into their `components/motion/` directory.
- **Tailwind Native**: Styled with standard Tailwind utility classes; zero CSS-in-JS runtime overhead.
- **TypeScript First**: Full type safety with autocomplete for variants and animation props.
- **Zero Third-Party Vendor Lock-in**: Only requires `framer-motion` (v11+) and `react` (v18/19).
