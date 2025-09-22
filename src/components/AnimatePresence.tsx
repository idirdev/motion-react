import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { AnimatePresenceProps } from '../types';

type AnimationName = 'fadeIn' | 'fadeOut' | 'slideUp' | 'slideDown' | 'scaleIn' | 'scaleOut';

const keyframes: Record<AnimationName, string> = {
  fadeIn: `
    @keyframes mr-fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  fadeOut: `
    @keyframes mr-fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,
  slideUp: `
    @keyframes mr-slideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  slideDown: `
    @keyframes mr-slideDown {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(16px); }
    }
  `,
  scaleIn: `
    @keyframes mr-scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
  `,
  scaleOut: `
    @keyframes mr-scaleOut {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.9); }
    }
  `,
};

const animationNameMap: Record<string, string> = {
  fadeIn: 'mr-fadeIn',
  fadeOut: 'mr-fadeOut',
  slideUp: 'mr-slideUp',
  slideDown: 'mr-slideDown',
  scaleIn: 'mr-scaleIn',
  scaleOut: 'mr-scaleOut',
};

/**
 * AnimatePresence - Mount/unmount animations.
 *
 * Animates children entering and exiting the DOM. When `show` transitions
 * to false, the exit animation plays before the element is unmounted.
 *
 * @example
 * ```tsx
 * function App() {
 *   const [visible, setVisible] = useState(true);
 *
 *   return (
 *     <>
 *       <button onClick={() => setVisible(!visible)}>Toggle</button>
 *       <AnimatePresence
 *         show={visible}
 *         enterAnimation="slideUp"
 *         exitAnimation="slideDown"
 *         enterDuration={300}
 *         exitDuration={200}
 *       >
 *         <div className="modal">Content here</div>
 *       </AnimatePresence>
 *     </>
 *   );
 * }
 * ```
 */
export function AnimatePresence({
  children,
  show,
  enterDuration = 300,
  exitDuration = 200,
  enterAnimation = 'fadeIn',
  exitAnimation = 'fadeOut',
  className = '',
  onExited,
}: AnimatePresenceProps) {
  const [mounted, setMounted] = useState(show);
  const [phase, setPhase] = useState<'enter' | 'exit' | 'idle'>(show ? 'enter' : 'idle');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Inject keyframes stylesheet
  useEffect(() => {
    const styleId = 'motion-react-animate-presence';
    if (document.getElementById(styleId)) return;

    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = Object.values(keyframes).join('\n');
    document.head.appendChild(styleEl);

    return () => {
      // Don't remove on unmount since other instances may use it
    };
  }, []);

  // Handle show changes
  useEffect(() => {
    if (show) {
      // Mount and enter
      setMounted(true);
      setPhase('enter');
    } else if (mounted) {
      // Start exit animation
      setPhase('exit');

      // Unmount after exit duration
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = setTimeout(() => {
        setMounted(false);
        setPhase('idle');
        onExited?.();
      }, exitDuration);
    }

    return () => {
      clearTimeout(exitTimeoutRef.current);
    };
  }, [show]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return null;

  const isEntering = phase === 'enter';
  const isExiting = phase === 'exit';

  const currentAnimation = isEntering
    ? animationNameMap[enterAnimation]
    : isExiting
    ? animationNameMap[exitAnimation]
    : undefined;

  const currentDuration = isEntering ? enterDuration : exitDuration;

  const animationStyle: React.CSSProperties = currentAnimation
    ? {
        animation: `${currentAnimation} ${currentDuration}ms ease-out`,
        animationFillMode: 'both',
      }
    : {};

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        ...animationStyle,
        display: 'contents',
      }}
    >
      {children}
    </div>
  );
}

AnimatePresence.displayName = 'AnimatePresence';
