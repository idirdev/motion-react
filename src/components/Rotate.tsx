import React, { useMemo } from 'react';
import { useInView } from '../hooks/useInView';
import { easingToCSS } from '../utils/easing';
import type { RotateProps } from '../types';

/**
 * Rotate - Rotation animation component.
 *
 * Rotates an element from one angle to another. Useful for icons,
 * loading indicators, and decorative transitions.
 *
 * @example
 * ```tsx
 * // Rotate icon on hover (control with state)
 * <Rotate degrees={180} duration={300}>
 *   <ChevronIcon />
 * </Rotate>
 *
 * // Full rotation entrance
 * <Rotate from={-180} degrees={0} duration={600} easing="easeOutBack">
 *   <StarIcon />
 * </Rotate>
 *
 * // Scroll-triggered rotation
 * <Rotate degrees={360} triggerOnView duration={1000}>
 *   <GearIcon />
 * </Rotate>
 * ```
 */
export function Rotate({
  children,
  degrees = 360,
  from = 0,
  duration = 600,
  delay = 0,
  easing = 'easeOut',
  fillMode = 'both',
  origin = 'center center',
  triggerOnView = false,
  viewThreshold = 0.1,
  className = '',
  style = {},
  as: Tag = 'div',
}: RotateProps) {
  const { ref, inView } = useInView({
    threshold: viewThreshold,
    triggerOnce: true,
  });

  const shouldAnimate = triggerOnView ? inView : true;

  const animationStyles = useMemo(
    () => ({
      transform: shouldAnimate ? `rotate(${degrees}deg)` : `rotate(${from}deg)`,
      opacity: shouldAnimate ? 1 : 0,
      transformOrigin: origin,
      transition: [
        `transform ${duration}ms ${easingToCSS(easing)} ${delay}ms`,
        `opacity ${Math.min(duration * 0.5, 200)}ms ${easingToCSS('easeOut')} ${delay}ms`,
      ].join(', '),
      willChange: 'transform, opacity' as const,
      display: 'inline-flex',
      ...style,
    }),
    [shouldAnimate, degrees, from, origin, duration, easing, delay, style]
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

Rotate.displayName = 'Rotate';
