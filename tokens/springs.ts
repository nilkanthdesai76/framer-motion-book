/**
 * Mathematical Spring Physics Presets & Timing Curves for Framer Motion.
 */

export interface SpringConfig {
  type: 'spring';
  stiffness: number;
  damping: number;
  mass: number;
  restDelta?: number;
}

/**
 * 1. Snappy: High tension, quick settle with virtually zero bounce.
 * Best for: Buttons, toggles, tab active indicators.
 */
export const snappySpring: SpringConfig = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
  mass: 0.8,
  restDelta: 0.001
};

/**
 * 2. Bouncy: Noticeable playful overshoot and secondary rebound.
 * Best for: Notification badges, reaction icons, celebration banners.
 */
export const bouncySpring: SpringConfig = {
  type: 'spring',
  stiffness: 300,
  damping: 15,
  mass: 0.8,
  restDelta: 0.001
};

/**
 * 3. Gentle: Soft, organic, perfectly damped motion with zero overshoot.
 * Best for: Dialog presentation, sliding drawers, expanding cards.
 */
export const gentleSpring: SpringConfig = {
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
export const smoothSpring: SpringConfig = {
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
export const crispSpring: SpringConfig = {
  type: 'spring',
  stiffness: 500,
  damping: 35,
  mass: 0.5,
  restDelta: 0.001
};

export const easings = {
  easeOutCubic: [0.215, 0.61, 0.355, 1.0],
  anticipate: [0.36, 0, 0.66, -0.56],
  easeInOutSine: [0.37, 0, 0.63, 1.0],
  easeOutExpo: [0.16, 1, 0.3, 1]
} as const;
