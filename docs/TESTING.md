# TESTING.md — Framer Motion Testing Guidelines

> Unit, integration, and accessibility testing protocols for Framer Motion components using Vitest and React Testing Library.

---

## 🧪 1. Testing Philosophy for Animations

Testing animated React components presents unique challenges:
1. `framer-motion` relies on `requestAnimationFrame` and CSS transforms which are not fully rendered in standard headless JSDOM environments.
2. Timing-dependent tests frequently suffer from flakiness if waiting on real-time springs.
3. Tests should verify **behavior, accessibility (`useReducedMotion`), and DOM presence**, rather than testing Framer Motion's internal matrix math.

---

## 🛠️ 2. Vitest & JSDOM Setup Invariants

Create a setup file (`tests/setup.ts`) to mock browser APIs required by Framer Motion:

```typescript
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// 1. Mock window.matchMedia for useReducedMotion
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false, // Default to normal motion
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 2. Mock IntersectionObserver for whileInView
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// 3. Mock ResizeObserver for layout animations
class MockResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});
```

---

## 🔍 3. Testing Accessibility (`useReducedMotion`)

Always verify that components gracefully adapt when the user has enabled `prefers-reduced-motion`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MagneticButton } from '../components/motion/micro/MagneticButton';

describe('MagneticButton Accessibility', () => {
  it('respects prefers-reduced-motion media query', () => {
    // Override matchMedia to simulate reduced motion preference
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(<MagneticButton>Accessible Action</MagneticButton>);
    const button = screen.getByRole('button', { name: /accessible action/i });
    expect(button).toBeInTheDocument();
  });
});
```

---

## ⚡ 4. Testing Exit Animations with `AnimatePresence`

When testing unmount transitions, wrap assertions with `waitForElementToBeRemoved`:

```tsx
import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SpringModal } from '../components/motion/overlays/SpringModal';

describe('SpringModal Unmounting', () => {
  it('removes dialog from DOM when closed', async () => {
    const { rerender } = render(<SpringModal isOpen={true} title="Test Modal" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Trigger close
    rerender(<SpringModal isOpen={false} title="Test Modal" />);
    await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));
  });
});
```
