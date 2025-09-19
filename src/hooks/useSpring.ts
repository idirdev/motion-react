import { useState, useRef, useCallback, useEffect } from 'react';
import type { SpringConfig, UseSpringReturn } from '../types';

const DEFAULT_SPRING: Required<SpringConfig> = {
  stiffness: 170,
  damping: 26,
  mass: 1,
  velocity: 0,
  restThreshold: 0.01,
};

/**
 * Spring physics animation hook.
 * Simulates a damped spring for natural-feeling animations.
 *
 * The spring model uses:
 * - Stiffness: how tight the spring is (higher = snappier)
 * - Damping: how much friction (higher = less bouncy)
 * - Mass: weight of the object (higher = more inertia)
 *
 * @param initialValue - Starting value
 * @param config - Spring physics parameters
 * @returns Spring controls and current value
 *
 * @example
 * ```tsx
 * function SpringBox() {
 *   const { value, set } = useSpring(0, { stiffness: 200, damping: 20 });
 *
 *   return (
 *     <div
 *       style={{ transform: `translateX(${value}px)` }}
 *       onMouseEnter={() => set(100)}
 *       onMouseLeave={() => set(0)}
 *     />
 *   );
 * }
 * ```
 */
export function useSpring(
  initialValue: number = 0,
  config: SpringConfig = {}
): UseSpringReturn {
  const springConfig = { ...DEFAULT_SPRING, ...config };

  const [value, setValue] = useState(initialValue);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentRef = useRef(initialValue);
  const velocityRef = useRef(springConfig.velocity);
  const targetRef = useRef(initialValue);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const configRef = useRef(springConfig);

  // Keep config ref updated
  configRef.current = springConfig;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const tick = useCallback((timestamp: number) => {
    if (lastTimeRef.current === null) {
      lastTimeRef.current = timestamp;
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    // Calculate delta time in seconds, cap at 64ms to avoid spiral of death
    const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.064);
    lastTimeRef.current = timestamp;

    const { stiffness, damping, mass, restThreshold } = configRef.current;
    const target = targetRef.current;

    // Spring force: F = -k * displacement
    const displacement = currentRef.current - target;
    const springForce = -stiffness * displacement;

    // Damping force: F = -c * velocity
    const dampingForce = -damping * velocityRef.current;

    // Acceleration: a = F / m
    const acceleration = (springForce + dampingForce) / mass;

    // Semi-implicit Euler integration
    velocityRef.current += acceleration * dt;
    currentRef.current += velocityRef.current * dt;

    // Check if spring is at rest
    const isAtRest =
      Math.abs(velocityRef.current) < restThreshold &&
      Math.abs(displacement) < restThreshold;

    if (mountedRef.current) {
      if (isAtRest) {
        // Snap to target when at rest
        currentRef.current = target;
        velocityRef.current = 0;
        setValue(target);
        setIsAnimating(false);
        rafRef.current = null;
        lastTimeRef.current = null;
      } else {
        setValue(currentRef.current);
        rafRef.current = requestAnimationFrame(tick);
      }
    }
  }, []);

  const set = useCallback(
    (target: number) => {
      targetRef.current = target;

      // Cancel any running animation
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      lastTimeRef.current = null;
      setIsAnimating(true);
      rafRef.current = requestAnimationFrame(tick);
    },
    [tick]
  );

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    velocityRef.current = 0;
    lastTimeRef.current = null;
    setIsAnimating(false);
  }, []);

  return { value, isAnimating, set, stop };
}
