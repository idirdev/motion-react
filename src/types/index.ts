import { ReactNode, CSSProperties } from 'react';

// ─── Shared ──────────────────────────────────────────────
export type Direction = 'up' | 'down' | 'left' | 'right';

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: EasingFunction | string;
  fillMode?: 'forwards' | 'backwards' | 'both' | 'none';
}

export type EasingFunction =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'spring';

// ─── Component Props ─────────────────────────────────────
export interface FadeInProps extends AnimationConfig {
  children: ReactNode;
  direction?: Direction;
  distance?: number;
  triggerOnView?: boolean;
  viewThreshold?: number;
  className?: string;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

export interface SlideInProps extends AnimationConfig {
  children: ReactNode;
  from?: Direction;
  distance?: number | string;
  spring?: SpringConfig;
  triggerOnView?: boolean;
  viewThreshold?: number;
  className?: string;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

export interface ScaleInProps extends AnimationConfig {
  children: ReactNode;
  from?: number;
  to?: number;
  origin?: string;
  triggerOnView?: boolean;
  viewThreshold?: number;
  className?: string;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

export interface RotateProps extends AnimationConfig {
  children: ReactNode;
  degrees?: number;
  from?: number;
  origin?: string;
  triggerOnView?: boolean;
  viewThreshold?: number;
  className?: string;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

export interface StaggerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

export interface AnimatePresenceProps {
  children: ReactNode;
  show: boolean;
  enterDuration?: number;
  exitDuration?: number;
  enterAnimation?: 'fadeIn' | 'slideUp' | 'scaleIn' | 'slideDown';
  exitAnimation?: 'fadeOut' | 'slideDown' | 'scaleOut' | 'slideUp';
  className?: string;
  onExited?: () => void;
}

// ─── Spring Physics ──────────────────────────────────────
export interface SpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
  velocity?: number;
  restThreshold?: number;
}

// ─── Hook Return Types ───────────────────────────────────
export interface UseAnimationReturn {
  value: number;
  isAnimating: boolean;
  start: (config?: { from?: number; to?: number; duration?: number; easing?: EasingFunction }) => void;
  stop: () => void;
  reset: () => void;
}

export interface UseInViewReturn {
  ref: React.RefObject<Element | null>;
  inView: boolean;
  entry: IntersectionObserverEntry | null;
}

export interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  root?: Element | null;
}

export interface UseSpringReturn {
  value: number;
  isAnimating: boolean;
  set: (target: number) => void;
  stop: () => void;
}
