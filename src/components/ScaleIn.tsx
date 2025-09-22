import React, { useMemo } from 'react';
import { useInView } from '../hooks/useInView';
import { easingToCSS } from '../utils/easing';
import type { ScaleInProps } from '../types';

/**
 * ScaleIn - Scale animation with configurable from/to values.
 *
 * Scales an element from one size to another with smooth easing.
 * Pairs well with opacity transitions for natural-feeling reveals.
 *
 * @example
 * ```tsx
 * // Scale up from nothing
 * <ScaleIn from={0} to={1} duration={400}>
 *   <Modal />
 * </ScaleIn>
 *
 * // Subtle pop-in effect
 * <ScaleIn from={0.9} to={1} duration={200} easing="easeOutBack">
 *   <Tooltip />
 * </ScaleIn>
 *
 * // Scale from center
 * <ScaleIn from={0.5} origin="center center">
 *   <Avatar />
 * </ScaleIn>
 * ```
 */
export function ScaleIn({
  children,
  from = 0.8,
  to = 1,
  duration = 400,
  delay = 0,
  easing = 'easeOut',
  fillMode = 'both',
  origin = 'center center',
  triggerOnView = false,
  viewThreshold = 0.1,
  className = '',
  style = {},
  as: Tag = 'div',
}: ScaleInProps) {
  const { ref, inView } = useInView({
    threshold: viewThreshold,
    triggerOnce: true,
  });

  const shouldAnimate = triggerOnView ? inView : true;

  const animationStyles = useMemo(
    () => ({
      transform: shouldAnimate ? `scale(${to})` : `scale(${from})`,
      opacity: shouldAnimate ? 1 : 0,
      transformOrigin: origin,
      transition: [
        `transform ${duration}ms ${easingToCSS(easing)} ${delay}ms`,
        `opacity ${Math.min(duration * 0.7, 250)}ms ${easingToCSS('easeOut')} ${delay}ms`,
      ].join(', '),
      willChange: 'transform, opacity' as const,
      ...style,
    }),
    [shouldAnimate, from, to, origin, duration, easing, delay, style]
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

ScaleIn.displayName = 'ScaleIn';
