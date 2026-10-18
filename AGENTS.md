# AGENTS.md — Framer Motion Handbook Operational Manual

> Operational manual, ground-truth invariants, and execution commands for AI coding assistants working on or using components from the Framer Motion Handbook.

---

## 1. Project Overview

- **Name**: Framer Motion Handbook (`framer-motion-book`)
- **Category**: Interactive React Motion & Animation Design System
- **Ecosystem**: React 18 / 19, Framer Motion v11+, Tailwind CSS v3 / v4, Next.js App Router, Vite
- **Architecture**: Modular, zero-dependency copy-paste registry (shadcn/ui philosophy)

---

## 2. Verified Execution Commands

```bash
# 1. Install dependencies for host project
npm install framer-motion clsx tailwind-merge

# 2. Run documentation / preview dev server
npm run dev

# 3. Run unit & component test suite
npm test

# 4. Run lint and formatting check
npm run lint
```

---

## 3. Critical Technical Invariants for Agents

### Rule 1: Always Enforce `'use client'`
Any file that imports from `framer-motion` (`motion`, `AnimatePresence`, `useScroll`, `useSpring`, `useReducedMotion`) MUST have `'use client';` at line 1 when used in Next.js App Router environments.

### Rule 2: Strictly Animate Composite Properties
**NEVER** animate layout-triggering properties:
- ❌ **Forbidden**: `animate={{ width: 300, height: 200, top: 50, left: 20, margin: 10 }}`
- ✅ **Permitted**: `animate={{ x: 50, y: 20, scale: 1.1, rotate: 5, opacity: 1 }}`
- For size and layout changes, ALWAYS use Framer Motion's FLIP engine: `layout` or `layoutId`.

### Rule 3: Always Respect `useReducedMotion()`
Every single animation recipe MUST query `useReducedMotion()`. If active, disable or damp physics transforms to maintain accessibility compliance for users with vestibular disorders:
```tsx
const shouldReduceMotion = useReducedMotion();
const variants = {
  hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
  visible: { opacity: 1, y: 0 }
};
```

### Rule 4: Mandatory Keys with `AnimatePresence`
When rendering dynamic lists or toggling elements inside `<AnimatePresence>`, every immediate child MUST have a unique, stable `key` prop. Without a unique key, Framer Motion cannot track which component is unmounting, completely breaking exit transitions.

### Rule 5: Avoid Global `will-change: transform`
Do not add static `will-change-transform` via Tailwind. Framer Motion dynamically attaches and cleans up `will-change` on animated nodes during active playback. Hardcoding it causes unnecessary GPU VRAM pressure on mobile Safari.

---

## 4. Standard Component Recipe Anatomy

Every component file in this book follows this standardized pattern:

```tsx
'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { snappySpring } from '@/tokens/springs';

interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
}

export function MotionComponent({ children, className = '' }: ComponentProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
      transition={snappySpring}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
}
```
