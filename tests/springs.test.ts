import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  snappySpring,
  bouncySpring,
  gentleSpring,
  smoothSpring,
  crispSpring,
  easings
} from '../tokens/springs.ts';

describe('Spring Physics Tokens Verification', () => {
  test('verifies mathematical spring constants', () => {
    assert.strictEqual(snappySpring.stiffness, 400);
    assert.strictEqual(snappySpring.damping, 30);
    assert.strictEqual(snappySpring.mass, 0.8);

    assert.strictEqual(bouncySpring.stiffness, 300);
    assert.strictEqual(bouncySpring.damping, 15);

    assert.strictEqual(gentleSpring.stiffness, 180);
    assert.strictEqual(gentleSpring.damping, 24);

    assert.strictEqual(smoothSpring.stiffness, 120);
    assert.strictEqual(smoothSpring.damping, 20);

    assert.strictEqual(crispSpring.stiffness, 500);
    assert.strictEqual(crispSpring.damping, 35);
  });

  test('verifies cubic-bezier easing definitions', () => {
    assert.strictEqual(easings.easeOutCubic.length, 4);
    assert.strictEqual(easings.anticipate.length, 4);
    assert.strictEqual(easings.easeInOutSine.length, 4);
    assert.strictEqual(easings.easeOutExpo.length, 4);
  });
});
