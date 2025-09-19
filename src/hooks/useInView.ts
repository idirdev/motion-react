import { useState, useRef, useEffect, useCallback } from 'react';
import type { UseInViewReturn, UseInViewOptions } from '../types';

/**
 * Intersection Observer hook for scroll-triggered animations.
 * Detects when an element enters or exits the viewport.
 *
 * @param options - Intersection Observer configuration
 * @returns Ref to attach, visibility state, and observer entry
 *
 * @example
 * ```tsx
 * function FadeOnScroll({ children }) {
 *   const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
 *
 *   return (
 *     <div
 *       ref={ref}
 *       style={{
 *         opacity: inView ? 1 : 0,
 *         transform: inView ? 'translateY(0)' : 'translateY(20px)',
 *         transition: 'all 0.6s ease-out',
 *       }}
 *     >
 *       {children}
 *     </div>
 *   );
 * }
 * ```
 */
export function useInView(options: UseInViewOptions = {}): UseInViewReturn {
  const {
    threshold = 0,
    rootMargin = '0px',
    triggerOnce = false,
    root = null,
  } = options;

  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const ref = useRef<Element | null>(null);
  const hasTriggeredRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If triggerOnce and already triggered, skip
    if (triggerOnce && hasTriggeredRef.current) return;

    // Clean up previous observer
    cleanup();

    const observer = new IntersectionObserver(
      (entries) => {
        const [observerEntry] = entries;
        const isIntersecting = observerEntry.isIntersecting;

        setInView(isIntersecting);
        setEntry(observerEntry);

        if (isIntersecting && triggerOnce) {
          hasTriggeredRef.current = true;
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    observer.observe(element);
    observerRef.current = observer;

    return cleanup;
  }, [threshold, rootMargin, triggerOnce, root, cleanup]);

  return { ref, inView, entry };
}
