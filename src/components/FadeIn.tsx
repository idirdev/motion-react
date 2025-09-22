import React, { useMemo } from 'react';
import { useInView } from '../hooks/useInView';
import { easingToCSS } from '../utils/easing';
import type { FadeInProps, Direction } from '../types';

const directionOffsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
};

/**
 * FadeIn - Fade in with optional directional slide.
 *
 * Fades an element from transparent to opaque, optionally sliding from a direction.
 * Can trigger on mount or when scrolled into view.
 *
 * @example
 * ```tsx
 * <FadeIn direction="up" duration={600} delay={200}>
 *   <h1>Hello World</h1>
 * </FadeIn>
 * ```
 */
export function FadeIn({
  children,
  direction,
  distance = 24,
  duration = 500,
  delay = 0,
  easing = 'easeOut',
  fillMode = 'both',
  triggerOnView = false,
  viewThreshold = 0.1,
  className = '',
  style = {},
  as: Tag = 'div',
}: FadeInProps) {
  const { ref, inView } = useInView({
    threshold: viewThreshold,
    triggerOnce: true,
  });

  const shouldAnimate = triggerOnView ? inView : true;

  const offset = direction ? directionOffsets[direction] : null;

  const initialTransform = offset
    ? `translate(${offset.x * distance}px, ${offset.y * distance}px)`
    : 'translate(0, 0)';

  const animationStyles = useMemo(
    () => ({
      opacity: shouldAnimate ? 1 : 0,
      transform: shouldAnimate ? 'translate(0, 0)' : initialTransform,
      transition: [
        `opacity ${duration}ms ${easingToCSS(easing)} ${delay}ms`,
        `transform ${duration}ms ${easingToCSS(easing)} ${delay}ms`,
      ].join(', '),
      willChange: 'opacity, transform' as const,
      ...style,
    }),
    [shouldAnimate, initialTransform, duration, easing, delay, style]
  );

  return React.createElement(
    Tag,
    {
      ref: triggerOnView ? ref : undefined,
      className,
      style: animationStyles,
    },
    children
  );
}

FadeIn.displayName = 'FadeIn';
