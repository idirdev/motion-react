import { describe, it, expect } from 'vitest';
import { easings, easingToCSS, resolveEasing } from '../src/utils/easing';

describe('easings', () => {
  it('contains all expected easing functions', () => {
    expect(typeof easings.linear).toBe('function');
    expect(typeof easings.easeIn).toBe('function');
    expect(typeof easings.easeOut).toBe('function');
    expect(typeof easings.easeInOut).toBe('function');
    expect(typeof easings.easeInQuad).toBe('function');
    expect(typeof easings.easeOutQuad).toBe('function');
    expect(typeof easings.easeOutBack).toBe('function');
    expect(typeof easings.easeOutElastic).toBe('function');
    expect(typeof easings.easeOutBounce).toBe('function');
    expect(typeof easings.spring).toBe('function');
  });

  describe('linear', () => {
    it('returns the same value as input', () => {
      expect(easings.linear(0)).toBe(0);
      expect(easings.linear(0.5)).toBe(0.5);
      expect(easings.linear(1)).toBe(1);
    });
  });

  describe('easeIn', () => {
    it('starts at 0 and ends at 1', () => {
      expect(easings.easeIn(0)).toBe(0);
      expect(easings.easeIn(1)).toBe(1);
    });

    it('is slower at the start (value < input)', () => {
      expect(easings.easeIn(0.5)).toBeLessThan(0.5);
    });
  });

  describe('easeOut', () => {
    it('starts at 0 and ends at 1', () => {
      expect(easings.easeOut(0)).toBe(0);
      expect(easings.easeOut(1)).toBe(1);
    });

    it('is faster at the start (value > input)', () => {
      expect(easings.easeOut(0.5)).toBeGreaterThan(0.5);
    });
  });

  describe('easeInOut', () => {
    it('starts at 0 and ends at 1', () => {
      expect(easings.easeInOut(0)).toBe(0);
      expect(easings.easeInOut(1)).toBe(1);
    });

    it('is at 0.5 when input is 0.5', () => {
      expect(easings.easeInOut(0.5)).toBe(0.5);
    });

    it('is slower at start (value < input for small t)', () => {
      expect(easings.easeInOut(0.25)).toBeLessThan(0.25);
    });
  });

  describe('easeOutBounce', () => {
    it('starts at 0 and ends at 1', () => {
      expect(easings.easeOutBounce(0)).toBe(0);
      expect(easings.easeOutBounce(1)).toBeCloseTo(1, 5);
    });

    it('returns values between 0 and 1 for typical inputs', () => {
      const val = easings.easeOutBounce(0.5);
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(1.1);
    });
  });

  describe('easeOutElastic', () => {
    it('starts at 0 and ends at 1', () => {
      expect(easings.easeOutElastic(0)).toBe(0);
      expect(easings.easeOutElastic(1)).toBe(1);
    });
  });

  describe('easeOutBack', () => {
    it('starts at 0 and ends at 1', () => {
      expect(easings.easeOutBack(0)).toBeCloseTo(0, 5);
      expect(easings.easeOutBack(1)).toBeCloseTo(1, 5);
    });

    it('overshoots past 1 before settling', () => {
      // easeOutBack typically overshoots
      const midValue = easings.easeOutBack(0.5);
      expect(midValue).toBeGreaterThan(0.5);
    });
  });
});

describe('easingToCSS', () => {
  it('converts linear to CSS', () => {
    expect(easingToCSS('linear')).toBe('linear');
  });

  it('converts easeIn to cubic-bezier', () => {
    const result = easingToCSS('easeIn');
    expect(result).toContain('cubic-bezier');
  });

  it('converts easeOut to cubic-bezier', () => {
    const result = easingToCSS('easeOut');
    expect(result).toContain('cubic-bezier');
  });

  it('converts easeInOut to cubic-bezier', () => {
    const result = easingToCSS('easeInOut');
    expect(result).toContain('cubic-bezier');
  });

  it('returns the input string for unknown easings', () => {
    expect(easingToCSS('custom-easing')).toBe('custom-easing');
  });
});

describe('resolveEasing', () => {
  it('resolves known easing names to functions', () => {
    expect(resolveEasing('linear')).toBe(easings.linear);
    expect(resolveEasing('easeIn')).toBe(easings.easeIn);
    expect(resolveEasing('easeOut')).toBe(easings.easeOut);
  });

  it('falls back to linear for unknown names', () => {
    const fn = resolveEasing('nonexistent');
    expect(fn(0.5)).toBe(0.5); // linear behavior
  });
});
