/**
 * Collection of easing functions for animations.
 * Each function takes a progress value (0-1) and returns the eased value (0-1).
 */

export type EasingFn = (t: number) => number;

/**
 * Linear - no easing, constant speed
 */
function linear(t: number): number {
  return t;
}

/**
 * Ease In - starts slow, accelerates
 * Uses cubic curve for smooth acceleration
 */
function easeIn(t: number): number {
  return t * t * t;
}

/**
 * Ease Out - starts fast, decelerates
 * Inverse of easeIn for natural deceleration
 */
function easeOut(t: number): number {
  const p = 1 - t;
  return 1 - p * p * p;
}

/**
 * Ease In Out - starts slow, speeds up, then slows down
 * Combines easeIn and easeOut for symmetric curve
 */
function easeInOut(t: number): number {
  if (t < 0.5) {
    return 4 * t * t * t;
  }
  const p = -2 * t + 2;
  return 1 - (p * p * p) / 2;
}

/**
 * Ease In Quad - quadratic ease in
 */
function easeInQuad(t: number): number {
  return t * t;
}

/**
 * Ease Out Quad - quadratic ease out
 */
function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

/**
 * Ease Out Back - slight overshoot at the end
 */
function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/**
 * Ease Out Elastic - elastic bounce at the end
 */
function easeOutElastic(t: number): number {
  if (t === 0 || t === 1) return t;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

/**
 * Ease Out Bounce - bouncing ball effect
 */
function easeOutBounce(t: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
}

/**
 * Spring - attempt to model damped spring oscillation via easing curve
 * For true spring physics, use the useSpring hook instead
 */
function spring(t: number): number {
  const c4 = (2 * Math.PI) / 3;
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

/**
 * Named easing function map
 */
export const easings = {
  linear,
  easeIn,
  easeOut,
  easeInOut,
  easeInQuad,
  easeOutQuad,
  easeOutBack,
  easeOutElastic,
  easeOutBounce,
  spring,
} as const;

/**
 * Convert a named easing to a CSS-compatible string
 */
export function easingToCSS(easing: string): string {
  const cssMap: Record<string, string> = {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    easeOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    easeInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  };
  return cssMap[easing] || easing;
}

/**
 * Resolve easing name to function
 */
export function resolveEasing(easing: string): EasingFn {
  if (easing in easings) {
    return easings[easing as keyof typeof easings];
  }
  return linear;
}
