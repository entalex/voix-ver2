# Goal

Add Ringba-inspired animated backgrounds behind each major section (Features/Product, Team, Use Cases, Contact), but in a **light palette** (soft cream, pale amber, faint navy tints, subtle white) — no dark blue / red / green like Ringba. Each section gets its own distinct backdrop so scrolling feels like moving through different "scenes".

# Visual concept (light version of Ringba)

Ringba uses: dark void + glowing particle orb + grid floor + colored planets.
Our light translation:
- **Base canvas:** off-white / cream (`hsl(40 30% 98%)`) instead of black.
- **Grid floor:** faint amber lines on cream, very low opacity, perspective-tilted.
- **Particle orb:** soft navy dots on light bg (already exists as `ProceduralVoiceWave` in hero).
- **Floating "planets":** soft pastel blurred circles (pale amber, pale navy, soft peach, mint-cream) drifting slowly.
- **Section dividers:** gentle gradient fades between sections so backgrounds blend.

# Per-section backgrounds

Each section gets a unique reusable `<SectionBackground variant="..." />` absolutely positioned behind content.

1. **Features (Product)** — variant `grid-orb`
   - Faint perspective grid + a small glowing dotted orb in the corner + 2 drifting pale circles.
2. **Team** — variant `soft-blobs`
   - 3–4 large blurred amber/cream blobs slowly morphing/drifting (CSS keyframes), no grid.
3. **Use Cases** — variant `dotted-field`
   - Subtle dot pattern (radial-gradient dots) + slow horizontal parallax + one pale glowing circle.
4. **Contact** — variant `aurora`
   - Soft cream→amber→white aurora gradient gently shifting (CSS conic-gradient animation) for a "calm" closing feel.

Hero already has the procedural wave, so we leave it. Keep `BackgroundOrbs` as the page-wide ambient layer.

# Implementation

## New file
- `src/components/motion/SectionBackground.tsx`
  - Props: `variant: "grid-orb" | "soft-blobs" | "dotted-field" | "aurora"`.
  - Renders an absolutely-positioned, `pointer-events-none`, `-z-10` div with the right SVG/CSS layers.
  - All animations are pure CSS (transform/opacity keyframes) — no scroll listeners, no heavy JS — so it stays smooth on mobile.
  - Respects `prefers-reduced-motion` via `motion-reduce:` Tailwind variants (animations disabled).

## Edits
- `src/components/landing/Features.tsx` — wrap section root with `relative overflow-hidden`, add `<SectionBackground variant="grid-orb" />`.
- `src/components/landing/Team.tsx` — same with `soft-blobs`.
- `src/components/landing/UseCases.tsx` — same with `dotted-field`.
- `src/components/landing/Contact.tsx` — same with `aurora`.
- `src/index.css` — add 4 keyframes (`drift-slow`, `blob-morph`, `aurora-shift`, `grid-pan`) used by the variants.

## Color tokens (light palette only)
All colors come from existing tokens or new HSL values added to `index.css`:
- `--bg-cream: 40 30% 98%`
- `--bg-amber-tint: 42 80% 92%`
- `--bg-navy-tint: 220 25% 94%`
- `--bg-peach-tint: 25 70% 94%`

No reds, no greens, no saturated blues — only soft tints of the existing brand (navy + amber) plus cream/peach.

# Out of scope
- No changes to hero, navbar, footer, How It Works, Why VOIX, CTA banner.
- No new dependencies.
- No scroll-driven JS — backgrounds animate ambiently with CSS only, so the recent "slow scroll" issue does not return.

# Notes
- Backgrounds sit behind content with `-z-10` and `pointer-events-none`, so card hover/click behavior is unaffected.
- Each section keeps its current padding and content; only the visual backdrop changes.
- Mobile: blurs are reduced (`md:blur-3xl` vs `blur-2xl`) and grid perspective hidden under `md:` breakpoint to keep performance.
