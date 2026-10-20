# 🪄 Framer Motion Handbook

> The definitive open-source collection of production-ready, copy-paste React animations, micro-interactions, layout transitions, gestures, and scroll effects ready to drop into any website.

![React 18 & 19](https://img.shields.io/badge/React-18%20%7C%2019-blue?style=flat-square)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11+-purple?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v3%20%7C%20v4-38bdf8?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ⚡ Quickstart

### 1. Install Dependencies in your React / Next.js project
```bash
npm install framer-motion clsx tailwind-merge
```

### 2. Copy the Mathematical Spring Tokens (`tokens/springs.ts`)
```typescript
import type { Transition } from 'framer-motion';

export const snappySpring: Transition = { type: 'spring', stiffness: 400, damping: 30, mass: 0.8 };
export const bouncySpring: Transition = { type: 'spring', stiffness: 300, damping: 15, mass: 0.8 };
export const gentleSpring: Transition = { type: 'spring', stiffness: 180, damping: 24, mass: 1.0 };
export const smoothSpring: Transition = { type: 'spring', stiffness: 120, damping: 20, mass: 1.2 };
export const crispSpring: Transition = { type: 'spring', stiffness: 500, damping: 35, mass: 0.5 };
```

### 3. Copy any Component Recipe from the Registry
Copy any component directly into your project's `components/motion/` directory!

---

## 📖 Pattern Book Taxonomy

| # | Category | Core Recipes | Performance Invariant |
| :--- | :--- | :--- | :--- |
| **01** | **Micro-Interactions** | Magnetic Button, Spring Toggle, Fluid Active Tabs, Hover Tilt Card | GPU Composite Transforms Only |
| **02** | **Layout & FLIP** | `layoutId` Shared Element Cards, Expandable List Items, Reorderable Grid | Zero-reflow FLIP calculations |
| **03** | **Scroll & Parallax** | `useScroll` Header, Sticky Reading Progress Scrubber, Timeline Scrub | Passive RAF-batched motion values |
| **04** | **Gestures & Physics** | Drag-to-Dismiss Card, Bottom Sheet Drawer, Pull-to-Refresh | Inertial momentum snapping |
| **05** | **Dialogs & Overlays** | Spring Scale Modal, Backdrop Blur Dimmer, Command Palette, Tooltip | Strict `AnimatePresence` keys |
| **06** | **Typography** | Split Character Stagger, Smooth Typewriter, Text Scramble Reveal | String escaping & XSS safe |
| **07** | **Heroes & Backgrounds**| Magnetic Floating Particles, Ambient Mesh Glow, Reactive Grid Mesh | Framerate throttled to 60/120 Hz |
| **08** | **Navigation** | Morphing Pill Navbar, Floating Mac Dock Bar, Hide-on-Scroll Header | Zero layout shift |
| **09** | **Feedback & Toasts** | Stacked Notification Queue, SVG Path Draw Checkmark, Error Shake | Auto-dismiss timer cleanup |
| **10** | **Loaders & Skeletons** | Morphing Geometric Spinner, Staggered Skeleton Pulse, Metric Counter | Infinite loop memory safe |

---

## ♿ Accessibility First

Every component in this handbook strictly respects the user's OS motion settings via `useReducedMotion()`. If `prefers-reduced-motion` is active:
- Physical displacement is clamped or replaced with clean opacity cross-fades.
- Complex spring oscillations are disabled.

---

## 📚 Complete Documentation

- 📋 [PRD.md](docs/PRD.md) — Product requirements, pattern specifications, and copy-paste recipes
- 🏗️ [ARCHITECTURE.md](docs/ARCHITECTURE.md) — System taxonomy, FLIP layout pipeline, and lifecycle sequence diagrams
- 🤖 [AGENTS.md](AGENTS.md) — Operational guidelines, build commands, and Framer Motion invariants
- 🎨 [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) — Spring physics constants, timing curves, and elevation tokens
- 🧪 [TESTING.md](docs/TESTING.md) — Vitest and React Testing Library animation mock patterns
- 🔒 [SECURITY.md](docs/SECURITY.md) — Client-side text sanitization and SVG path safety guidelines

---

## 📄 License
MIT © Nilkanth Desai
