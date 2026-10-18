# ARCHITECTURE.md — Framer Motion Handbook Architecture

> Structural architecture, component registry design, lifecycle state machines, and hardware acceleration pipelines for the Framer Motion Handbook.

---

## 🏗️ 1. Registry & Component Taxonomy

The codebase is structured as a modular, self-contained component registry where each animation recipe is completely decoupled and immediately copy-pasteable:

```
framer-motion-book/
├── components/
│   └── motion/
│       ├── micro/                  # Micro-interactions (buttons, switches, tabs)
│       │   ├── MagneticButton.tsx
│       │   ├── SpringToggle.tsx
│       │   ├── AnimatedTabs.tsx
│       │   └── TiltCard.tsx
│       ├── layout/                 # FLIP layout and shared element transitions
│       │   ├── SharedElementModal.tsx
│       │   ├── ExpandableCardList.tsx
│       │   └── ReorderableList.tsx
│       ├── scroll/                 # Scroll-linked & parallax animations
│       │   ├── ParallaxHero.tsx
│       │   ├── ScrollProgressScrubber.tsx
│       │   └── StickyTimelineCards.tsx
│       ├── gestures/               # Drag, swipe, and physics sheets
│       │   ├── SwipeableBottomSheet.tsx
│       │   ├── DragToDismissCard.tsx
│       │   └── PullToRefreshIndicator.tsx
│       ├── overlays/               # Modals, command palettes, and popovers
│       │   ├── SpringModal.tsx
│       │   ├── CommandPalette.tsx
│       │   └── NestedDropdownMenu.tsx
│       ├── typography/             # Text reveals and typographic staggers
│       │   ├── SplitTextReveal.tsx
│       │   ├── TypewriterEffect.tsx
│       │   └── ScrambleText.tsx
│       ├── feedback/               # Notifications, toasts, and alerts
│       │   ├── StackedToastQueue.tsx
│       │   ├── SvgSuccessCheckmark.tsx
│       │   └── ShakeAlertBanner.tsx
│       └── loaders/                # Progress indicators and skeleton bars
│           ├── MorphingSvgLoader.tsx
│           ├── StaggeredSkeletonPulse.tsx
│           └── MetricCounter.tsx
├── hooks/                          # Reusable animation utility hooks
│   ├── useMagneticCursor.ts
│   ├── useScrollDirection.ts
│   └── useMeasureElement.ts
├── tokens/                         # Standardized spring physics & easing tokens
│   ├── springs.ts
│   └── easings.ts
├── registry.json                   # Machine-readable component catalog schema
├── AGENTS.md                       # Operational manual for AI coding assistants
├── ARCHITECTURE.md                 # System taxonomy and lifecycle flow
├── PRD.md                          # Product requirements and pattern specs
├── TESTING.md                      # Vitest and React Testing Library guidelines
├── DESIGN_SYSTEM.md                # Spring presets, timing curves, and tokens
├── SECURITY.md                     # Client-side XSS safety & sanitization
└── README.md                       # Catalog overview and live examples
```

---

## 🔄 2. AnimatePresence & Component Lifecycle Flow

Framer Motion orchestrates element removal from the React virtual DOM using `AnimatePresence`. Below is the exact lifecycle state machine:

```mermaid
sequenceDiagram
    autonumber
    actor User as User Action
    participant React as React Reconciliation
    participant AP as AnimatePresence
    participant Motion as motion.div
    participant DOM as Browser DOM

    User->>React: Trigger state update (show = false)
    React->>AP: Re-render with missing child key
    AP->>Motion: Intercept unmount! (Hold component in tree)
    Motion->>Motion: Execute exit variant (opacity: 0, y: 15)
    Note over Motion: Animate using GPU transform/opacity
    Motion->>DOM: Continuous requestAnimationFrame updates
    Motion-->>AP: onAnimationComplete (Exit animation finished)
    AP->>DOM: Safe to unmount! Remove element from DOM
```

---

## 📐 3. The FLIP Layout Animation Pipeline (`layout` & `layoutId`)

Framer Motion calculates layout transitions using the high-performance **FLIP** technique (**F**irst, **L**ast, **I**nvert, **P**lay):

```mermaid
flowchart TD
    subgraph Step1["1. First (Measure Initial State)"]
        A["Element renders at original position\n(x1, y1, width1, height1)"]
        B["DOMRect cached in memory via getBoundingClientRect()"]
    end

    subgraph Step2["2. Last (Measure Target State)"]
        C["React state changes\n(e.g., expanded modal state)"]
        D["Element laid out at new position\n(x2, y2, width2, height2)"]
    end

    subgraph Step3["3. Invert (Apply Inverse Transform)"]
        E["Delta computed:\nΔx = x1 - x2, Δy = y1 - y2\nscaleX = width1 / width2, scaleY = height1 / height2"]
        F["Immediate CSS transform applied:\ntransform: translate(Δx, Δy) scale(scaleX, scaleY)"]
    end

    subgraph Step4["4. Play (Animate Transform to Identity)"]
        G["Spring physics animates transform to:\ntranslate(0, 0) scale(1, 1)"]
        H["Result: 60 FPS GPU-accelerated transition without reflow!"]
    end

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
```

---

## 📜 4. Scroll-Driven Animation Subscription Model

Traditional scroll event listeners run on the main browser thread and cause substantial lag. Framer Motion's `useScroll` uses passive, RAF-batched scroll observers:

```mermaid
flowchart LR
    ScrollEvent["Native Window Scroll\n(Passive Event Listener)"]
    RAFBatcher["Window RAF Batcher\n(1 frame throttle @ 60/120Hz)"]
    MotionValue["MotionValue scrollYProgress\n(0.0 -> 1.0)"]
    SpringTransform["useTransform & useSpring\n(Map progress to pixel values)"]
    StyleAttribute["Direct DOM style update\n(Bypasses React Virtual DOM!)"]

    ScrollEvent --> RAFBatcher
    RAFBatcher --> MotionValue
    MotionValue --> SpringTransform
    SpringTransform --> StyleAttribute
```

### Key Architectural Invariant:
Updates to `MotionValue` (`useTransform`, `useSpring`) mutate the element's inline style directly via requestAnimationFrame, **bypassing React re-renders completely**. This ensures flawless 120 FPS performance even on low-powered mobile devices.

---

## 🛡️ 5. Next.js App Router & Server Component Boundary

Because Framer Motion relies on browser DOM events, `window`, and React hooks (`useRef`, `useState`, `useEffect`), all motion components must sit across the Client Component boundary:

```
Server Component (Page / Layout)
  │ (Data fetching, SEO tags, static HTML)
  ▼
Client Component Boundary ('use client')
  │
  ├── <MagneticButton /> (Client interactivity)
  ├── <SharedElementModal /> (Local state & AnimatePresence)
  └── <ParallaxHero /> (Scroll subscription)
```

**Rule**: Keep Server Components as close to the root as possible. Only mark individual interactive/animated components with `'use client'`.
