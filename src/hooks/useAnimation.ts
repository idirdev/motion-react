import { useState, useRef, useCallback, useEffect } from 'react';
import { resolveEasing } from '../utils/easing';
import type { EasingFunction, UseAnimationReturn } from '../types';

interface AnimationState {
  from: number;
  to: number;
  duration: number;
  easing: EasingFunction;
  startTime: number | null;
}

/**
 * Core animation hook using requestAnimationFrame.
 * Animates a numeric value from one value to another with configurable easing.
 *
 * @param initialValue - Starting value (default: 0)
 * @returns Animation controls and current value
 *
 * @example
 * ```tsx
 * const { value, start, isAnimating } = useAnimation(0);
 *
 * useEffect(() => {
 *   start({ from: 0, to: 100, duration: 500, easing: 'easeOut' });
 * }, []);
 *
 * return <div style={{ opacity: value / 100 }} />;
 * ```
 */
export function useAnimation(initialValue: number = 0): UseAnimationReturn {
  const [value, setValue] = useState(initialValue);
  const [isAnimating, setIsAnimating] = useState(false);

  const stateRef = useRef<AnimationState>({
    from: initialValue,
    to: initialValue,
    duration: 300,
    easing: 'easeOut',
    startTime: null,
  });

  const rafRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

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
    const state = stateRef.current;

    if (state.startTime === null) {
      state.startTime = timestamp;
    }

    const elapsed = timestamp - state.startTime;
    const rawProgress = Math.min(elapsed / state.duration, 1);
    const easingFn = resolveEasing(state.easing);
    const easedProgress = easingFn(rawProgress);

    const currentValue = state.from + (state.to - state.from) * easedProgress;

    if (mountedRef.current) {
      setValue(currentValue);
    }

    if (rawProgress < 1) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (mountedRef.current) {
        setValue(state.to);
        setIsAnimating(false);
      }
      rafRef.current = null;
    }
  }, []);

  const start = useCallback(
    (config?: {
      from?: number;
      to?: number;
      duration?: number;
      easing?: EasingFunction;
    }) => {
      // Cancel any running animation
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      stateRef.current = {
        from: config?.from ?? value,
        to: config?.to ?? 1,
        duration: config?.duration ?? 300,
        easing: config?.easing ?? 'easeOut',
        startTime: null,
      };

      setIsAnimating(true);
      rafRef.current = requestAnimationFrame(tick);
    },
    [tick, value]
  );

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsAnimating(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    setValue(initialValue);
  }, [stop, initialValue]);

  return { value, isAnimating, start, stop, reset };
}
