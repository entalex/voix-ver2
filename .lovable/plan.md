
# Goal

Make the VOIX landing page feel alive on scroll — like Ringba — without changing the existing color palette. Each section should reveal, animate, and react to scroll position with parallax, pinned scenes, staggered fade-ins, sticky tab-switching, and floating decorative elements.

# What Ringba actually does (so we copy the right things)

- **Pinned hero scene** — the orb + planets stay fixed while text/scroll progresses, with parallax depth on background grid.
- **Reveal-on-scroll** — every block fades + slides in (staggered children, different directions per row).
- **Sticky tab section** — one section "pins" while a tab list (AI / Insights / Compliance) auto-advances as you scroll, swapping the visual on the right.
- **Floating particles** — dots/shines drift in the background, subtle parallax on mouse + scroll.
- **Number/stat counters** — count up when scrolled into view.
- **Sphere/feature cards** — each product card has its own animated illustration that scales up when entering viewport.
- **Smooth global scroll** with momentum (Lenis-style easing).

# Implementation plan

## 1. Install motion stack

- Add `framer-motion` (declarative reveals + variants) and `lenis` (smooth/momentum scroll). Both are lightweight and well-supported in React + Vite.

## 2. Smooth scroll wrapper

- Wrap `App.tsx` (or `pages/Index.tsx`) with a `SmoothScroll` provider that initializes Lenis on mount and drives `requestAnimationFrame`. Respect `prefers-reduced-motion` and disable on touch if it conflicts with native momentum.

## 3. Reusable reveal primitives

Create `src/components/motion/`:
- `Reveal.tsx` — wraps children, uses `useInView` + `motion.div` to fade/slide on enter (configurable direction, delay, distance).
- `StaggerGroup.tsx` + `StaggerItem.tsx` — for grids/lists (Features cards, How It Works steps, Use Cases, Team).
- `Parallax.tsx` — wraps an element and translates Y based on scroll progress (`useScroll` + `useTransform`).
- `CountUp.tsx` — animates a number from 0 to target when in view (used in Hero stat chips).

Replace the current `animate-fade-up` CSS class on sections with these components for finer, scroll-tied control.

## 4. Hero — pinned cinematic intro

- Make the Hero ~150vh tall.
- Pin the headline + animation canvas while user scrolls the first viewport.
- Headline: words fade/blur-in one by one on mount.
- "Powered by AI" chip + CTA button slide up with stagger.
- `ProceduralVoiceWave` canvas: scale from 0.85 → 1 and add subtle Y parallax tied to scroll progress.
- Add floating decorative dots (absolute-positioned divs) drifting with mouse parallax.

## 5. How It Works — sticky step reveal

- Convert the 3-step grid into a **sticky scene**: left column pins the section title; right column scrolls through the 3 steps, each step's icon scales up + number counter animates when active.
- Active step gets a highlighted ring; previous steps dim.

## 6. Features — alternating slide-in rows

- Keep the existing zigzag layout but animate each row: image slides in from its side (left/right), text fades up with 0.15s stagger on title → description.
- Add a subtle parallax: image translates Y opposite to scroll direction (~20px range).

## 7. Use Cases — stagger grid + hover lift

- On enter, cards stagger in (0.08s between cards) with scale 0.95 → 1.
- On hover, card lifts + icon does a small bounce.

## 8. Why VOIX — sticky tab switcher (the Ringba "AI / Insights / Compliance" pattern)

- Pin the section for ~3 viewport heights.
- Left side shows the active tab's headline + description; right side shows a swapping illustration.
- Scroll progress (0–1) maps to tab index (0, 1, 2). Tabs are also clickable.
- Animated underline slides between tabs.

## 9. Team — masonry reveal

- Cards reveal with a stagger pattern (diagonal wave).
- Avatar images scale from 0.9 → 1 and add a soft glow on enter.

## 10. CTA Banner — parallax background

- Background gradient pans slowly on scroll.
- Headline does a "split-text" reveal (each word fades/translates in sequence) when entering viewport.

## 11. Floating background decorations

- Add a global `BackgroundOrbs` component with 3–4 absolutely positioned blurred circles that drift with mouse + scroll parallax (very subtle, low opacity, behind content).

## 12. Reduced motion

- All motion components check `useReducedMotion()` from framer-motion and fall back to instant fade/no transform.

# Files to add

- `src/components/motion/SmoothScroll.tsx`
- `src/components/motion/Reveal.tsx`
- `src/components/motion/StaggerGroup.tsx`
- `src/components/motion/Parallax.tsx`
- `src/components/motion/CountUp.tsx`
- `src/components/motion/BackgroundOrbs.tsx`

# Files to edit

- `src/App.tsx` — wrap with `SmoothScroll`
- `src/pages/Index.tsx` — add `BackgroundOrbs`
- `src/components/landing/Hero.tsx` — pinned scene + word-stagger headline + CountUp stats
- `src/components/landing/HowItWorks.tsx` — sticky stepper
- `src/components/landing/Features.tsx` — slide-in rows + image parallax
- `src/components/landing/UseCases.tsx` — stagger grid
- `src/components/landing/WhyVoix.tsx` — sticky tab switcher
- `src/components/landing/Team.tsx` — diagonal stagger reveal
- `src/components/landing/CTABanner.tsx` — parallax bg + split-text headline
- `src/index.css` — remove the old `animate-fade-up` calls where superseded; add `prefers-reduced-motion` safeguards

# Notes / trade-offs

- Pinned sections add page height — total scroll length will roughly double. That's the intended Ringba feel.
- Lenis + framer-motion together stay under ~30KB gzipped.
- No color/brand changes; this is purely motion + layout pacing.
- Mobile: pinned sections are kept but shortened (1× viewport instead of 2–3×) to avoid long forced scrolls.
