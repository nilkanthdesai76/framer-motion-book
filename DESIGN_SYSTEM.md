# DESIGN_SYSTEM.md — Framer Motion Animation Design Tokens

> Mathematical spring physics, timing curves, duration scales, and surface elevation design tokens for Framer Motion Handbook.

---

## 🧮 1. The 5 Mathematical Spring Presets

Framer Motion utilizes a harmonic damped oscillator model governed by the differential equation:
$$m \frac{d^2x}{dt^2} + c \frac{dx}{dt} + k x = 0$$

Where:
- $m$ = Mass (inertia)
- $c$ = Damping (friction resistance)
- $k$ = Stiffness (spring tension)

### Token Definitions (`tokens/springs.ts`):

```typescript
import type { Transition } from 'framer-motion';

/**
 * 1. Snappy: High tension, quick settle with virtually zero bounce.
 * Best for: Buttons, toggles, tab active indicators, quick feedback.
 */
export const snappySpring: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
  mass: 0.8,
  restDelta: 0.001
};

/**
 * 2. Bouncy: Noticeable playful overshoot and secondary rebound.
 * Best for: Notification badges, reaction icons, gamified celebration banners.
 */
export const bouncySpring: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 15,
  mass: 0.8,
  restDelta: 0.001
};

/**
 * 3. Gentle: Soft, organic, perfectly damped motion with zero overshoot.
 * Best for: Dialog presentation, sliding drawers, expanding accordion cards.
 */
export const gentleSpring: Transition = {
  type: 'spring',
  stiffness: 180,
  damping: 24,
  mass: 1.0,
  restDelta: 0.001
};

/**
 * 4. Smooth: Cinematic, slow-tail deceleration.
 * Best for: Parallax layers, background glow movement, hero section reveals.
 */
export const smoothSpring: Transition = {
  type: 'spring',
  stiffness: 120,
  damping: 20,
  mass: 1.2,
  restDelta: 0.001
};

/**
 * 5. Crisp: Instantaneous tactile response.
 * Best for: Keyboard shortcuts, dropdown menu popovers, tooltip hover.
 */
export const crispSpring: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 35,
  mass: 0.5,
  restDelta: 0.001
};
```

---

## ⏱️ 2. Cubic-Bezier Timing Curves (When Springs Aren't Desired)

For predictable, deterministic timeline transitions where fixed durations are strictly required:

```typescript
export const easings = {
  // Apple-style ease-out: starts fast, lands very gently
  easeOutCubic: [0.215, 0.61, 0.355, 1.0],
  
  // Anticipate: pulls back slightly before launching forward
  anticipate: [0.36, 0, 0.66, -0.56],
  
  // Clean ease-in-out for loops and ambient pulses
  easeInOutSine: [0.37, 0, 0.63, 1.0],
  
  // Snappy exponential ease-out
  easeOutExpo: [0.16, 1, 0.3, 1]
} as const;
```

---

## 📏 3. Duration & Delay Scales

| Token | Duration | Intent & Application |
| :--- | :--- | :--- |
| `duration-instant` | $100\text{ms}$ | Micro-clicks, active toggle states, checkbox checks |
| `duration-quick` | $200\text{ms}$ | Tooltip fades, dropdown reveals, simple button hovers |
| `duration-standard` | $350\text{ms}$ | Dialog appearances, drawer slide-ins, tab transitions |
| `duration-deliberate`| $500\text{ms}$ | Page routing transitions, accordion height expansions |
| `duration-dramatic` | $800\text{ms}$ | Hero section entrance staggers, milestone celebration modals |

### Stagger Scales:
- **Tight Stagger**: `staggerChildren: 0.03` (Split character animations)
- **Standard Stagger**: `staggerChildren: 0.08` (List item entrances, grid cards)
- **Relaxed Stagger**: `staggerChildren: 0.15` (Multi-step onboarding wizards)

---

## 🎨 4. Surface & Glow Elevation Tokens

Tailwind classes commonly paired with Framer Motion hover & focus micro-interactions:

```css
/* Ambient glow for hoverable cards */
.glow-card-ambient {
  box-shadow: 0 0 50px -10px rgba(56, 189, 248, 0.15);
}

/* Focused glow for active modal views */
.glow-modal-elevated {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 80px -20px rgba(99, 102, 241, 0.25);
}
```
