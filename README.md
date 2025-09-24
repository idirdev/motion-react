# Motion React

[![npm version](https://img.shields.io/npm/v/@idirdev/motion-react.svg)](https://www.npmjs.com/package/@idirdev/motion-react)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-green.svg)]()

Lightweight React animation utility library. No external dependencies, just React and the Web Animations API.

## Installation

```bash
npm install @idirdev/motion-react
```

## Animation Components

### FadeIn

Fade in with optional directional slide.

```tsx
import { FadeIn } from '@idirdev/motion-react';

// Simple fade
<FadeIn duration={500}>
  <p>Hello World</p>
</FadeIn>

// Fade up on scroll
<FadeIn direction="up" distance={30} triggerOnView duration={600}>
  <Card />
</FadeIn>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | - | Slide direction |
| `distance` | `number` | `24` | Slide distance in pixels |
| `duration` | `number` | `500` | Animation duration in ms |
| `delay` | `number` | `0` | Delay before animation starts |
| `easing` | `string` | `'easeOut'` | Easing function name |
| `triggerOnView` | `boolean` | `false` | Animate when scrolled into view |

### SlideIn

Slide in from any direction with optional spring physics.

```tsx
import { SlideIn } from '@idirdev/motion-react';

<SlideIn from="left" distance="100%" duration={700}>
  <Sidebar />
</SlideIn>
```

### ScaleIn

Scale animation with configurable from/to values.

```tsx
import { ScaleIn } from '@idirdev/motion-react';

<ScaleIn from={0.9} to={1} duration={200} easing="easeOutBack">
  <Tooltip>Hover content</Tooltip>
</ScaleIn>
```

### Rotate

Rotation animation for icons and decorative elements.

```tsx
import { Rotate } from '@idirdev/motion-react';

<Rotate degrees={180} duration={300}>
  <ChevronIcon />
</Rotate>
```

### Stagger

Stagger children animations with configurable delay between each.

```tsx
import { Stagger, FadeIn } from '@idirdev/motion-react';

<Stagger staggerDelay={100}>
  {items.map(item => (
    <FadeIn key={item.id} direction="up">
      <ListItem>{item.name}</ListItem>
    </FadeIn>
  ))}
</Stagger>
```

### AnimatePresence

Mount/unmount animations -- plays exit animation before removing from DOM.

```tsx
import { AnimatePresence } from '@idirdev/motion-react';

<AnimatePresence
  show={isVisible}
  enterAnimation="slideUp"
  exitAnimation="slideDown"
  enterDuration={300}
  exitDuration={200}
>
  <Modal />
</AnimatePresence>
```

## Hooks

### useAnimation

Core animation hook using requestAnimationFrame.

```tsx
import { useAnimation } from '@idirdev/motion-react';

const { value, start, isAnimating } = useAnimation(0);

start({ from: 0, to: 100, duration: 500, easing: 'easeOut' });
// value smoothly transitions from 0 to 100
```

### useInView

Intersection Observer hook for scroll-triggered animations.

```tsx
import { useInView } from '@idirdev/motion-react';

const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

<div ref={ref} style={{ opacity: inView ? 1 : 0 }}>
  Fades in on scroll
</div>
```

### useSpring

Spring physics animation hook for natural motion.

```tsx
import { useSpring } from '@idirdev/motion-react';

const { value, set } = useSpring(0, { stiffness: 200, damping: 20 });

<div
  style={{ transform: `translateX(${value}px)` }}
  onMouseEnter={() => set(100)}
  onMouseLeave={() => set(0)}
/>
```

## Easing Functions

Available easings: `linear`, `easeIn`, `easeOut`, `easeInOut`, `easeInQuad`, `easeOutQuad`, `easeOutBack`, `easeOutElastic`, `easeOutBounce`, `spring`.

```tsx
import { easings } from '@idirdev/motion-react';

const value = easings.easeOutBounce(0.5); // Returns eased value
```

## License

MIT
