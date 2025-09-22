import React, { useMemo } from 'react';
import { useInView } from '../hooks/useInView';
import { easingToCSS } from '../utils/easing';
import type { SlideInProps, Direction } from '../types';

const directionTransforms: Record<Direction, (distance: string) => string> = {
  up: (d) => `translateY(${d})`,
  down: (d) => `translateY(-${d})`,
  left: (d) => `translateX(${d})`,
  right: (d) => `translateX(-${d})`,
};

function normalizeDistance(distance: number | string): string {
  if (typeof distance === 'number') return `${distance}px`;
  return distance;
}

/**
 * SlideIn - Slide an element in from any direction.
 *
 * Supports pixel and percentage distances, with optional spring physics
 * via the easing parameter. Great for page transitions and reveals.
 *
 * @example
 * ```tsx
 * <SlideIn from="left" distance="100%" duration={700}>
 *   <nav>Sidebar</nav>
 * </SlideIn>
 *
 * <SlideIn from="up" distance={50} easing="spring">
 *   <Card />
 * </SlideIn>
 * ```
 */
export function SlideIn({
  children,
  from = 'left',
  distance = 100,
  duration = 500,
  delay = 0,
  easing = 'easeOut',
  fillMode = 'both',
  spring,
  triggerOnView = false,
  viewThreshold = 0.1,
  className = '',
  style = {},
  as: Tag = 'div',
}: SlideInProps) {
  const { ref, inView } = useInView({
    threshold: viewThreshold,
    triggerOnce: true,
  });

  const shouldAnimate = triggerOnView ? inView : true;
  const dist = normalizeDistance(distance);
  const getTransform = directionTransforms[from];
  const initialTransform = getTransform(dist);

  // When spring config is provided, use a spring-like easing
  const resolvedEasing = spring ? 'spring' : easing;
  // Adjust duration for spring feel
  const resolvedDuration = spring ? Math.max(duration, 600) : duration;

  const animationStyles = useMemo(
    () => ({
      transform: shouldAnimate ? 'translate(0, 0)' : initialTransform,
      opacity: shouldAnimate ? 1 : 0,
      transition: [
        `transform ${resolvedDuration}ms ${easingToCSS(resolvedEasing)} ${delay}ms`,
        `opacity ${Math.min(resolvedDuration * 0.6, 300)}ms ${easingToCSS('easeOut')} ${delay}ms`,
      ].join(', '),
      willChange: 'transform, opacity' as const,
      ...style,
    }),
    [shouldAnimate, initialTransform, resolvedDuration, resolvedEasing, delay, style]
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

SlideIn.displayName = 'SlideIn';
