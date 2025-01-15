// Components
export { FadeIn } from './components/FadeIn';
export { SlideIn } from './components/SlideIn';
export { ScaleIn } from './components/ScaleIn';
export { Rotate } from './components/Rotate';
export { Stagger } from './components/Stagger';
export { AnimatePresence } from './components/AnimatePresence';

// Hooks
export { useAnimation } from './hooks/useAnimation';
export { useInView } from './hooks/useInView';
export { useSpring } from './hooks/useSpring';

// Utilities
export { easings, easingToCSS } from './utils/easing';

// Types
export type {
  Direction,
  AnimationConfig,
  EasingFunction,
  FadeInProps,
  SlideInProps,
  ScaleInProps,
  RotateProps,
  StaggerProps,
  AnimatePresenceProps,
  SpringConfig,
  UseAnimationReturn,
  UseInViewReturn,
  UseInViewOptions,
  UseSpringReturn,
} from './types';
