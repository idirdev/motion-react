import React, { Children, cloneElement, isValidElement, useMemo } from 'react';
import type { StaggerProps } from '../types';

/**
 * Stagger - Stagger children animations with configurable delay.
 *
 * Wraps each child with a CSS custom property `--stagger-delay` that
 * increments based on child index. Children animation components should
 * use this variable for their transition-delay.
 *
 * Alternatively, directly applies inline `transitionDelay` to each child.
 *
 * @example
 * ```tsx
 * <Stagger staggerDelay={100}>
 *   <FadeIn direction="up"><Card title="First" /></FadeIn>
 *   <FadeIn direction="up"><Card title="Second" /></FadeIn>
 *   <FadeIn direction="up"><Card title="Third" /></FadeIn>
 * </Stagger>
 * ```
 *
 * @example
 * ```tsx
 * // With raw elements
 * <Stagger staggerDelay={80} as="ul">
 *   {items.map(item => (
 *     <li key={item.id} style={{
 *       opacity: 0,
 *       animation: 'fadeIn 0.4s ease-out forwards',
 *       animationDelay: 'var(--stagger-delay, 0ms)',
 *     }}>
 *       {item.name}
 *     </li>
 *   ))}
 * </Stagger>
 * ```
 */
export function Stagger({
  children,
  staggerDelay = 100,
  className = '',
  style = {},
  as: Tag = 'div',
}: StaggerProps) {
  const staggeredChildren = useMemo(() => {
    const childArray = Children.toArray(children);

    return childArray.map((child, index) => {
      if (!isValidElement(child)) return child;

      const delay = index * staggerDelay;

      // Merge styles: add transitionDelay and CSS variable
      const childStyle = (child.props as Record<string, unknown>).style as
        | React.CSSProperties
        | undefined;

      const mergedStyle: React.CSSProperties = {
        ...childStyle,
        transitionDelay: `${delay}ms`,
        animationDelay: `${delay}ms`,
        '--stagger-delay': `${delay}ms`,
        '--stagger-index': index,
      } as React.CSSProperties;

      return cloneElement(child as React.ReactElement<{ style?: React.CSSProperties }>, {
        style: mergedStyle,
      });
    });
  }, [children, staggerDelay]);

  return React.createElement(
    Tag,
    { className, style },
    staggeredChildren
  );
}

Stagger.displayName = 'Stagger';
