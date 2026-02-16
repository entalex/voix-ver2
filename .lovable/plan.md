

# VOIX — Modern B2B SaaS Landing Page

## Design System
- **Primary:** #41506C (deep navy) — backgrounds, headers, text
- **Secondary:** #F1A900 (amber/gold) — CTAs, icons, highlights
- **Font:** Inter
- **Layout:** Single-page scroll

## Technical Architecture
- Create `src/data/landingData.ts` constants file containing all section data arrays: `features`, `teamMembers`, `howItWorks`, `useCases`
- All dynamic sections use `.map()` over these arrays — ready for future admin dashboard integration

## Sections

### 1. Fixed Navbar
- VOIX text logo in primary color
- Nav links: Features, How It Works, Team, Use Cases
- Pill-shaped "Request Demo" button in #F1A900

### 2. Hero Section
- White/light grey background
- Bold headline: **"Unlock the Power of Voice AI"** in #41506C
- Subheadline with product description
- #F1A900 pill "Request Demo" button
- Centered hero image placeholder

### 3. Features Grid (data-driven)
- Maps through `features[]` array from constants
- Each card: icon, title, description
- Icons highlighted in #F1A900

### 4. How It Works (data-driven)
- Maps through `howItWorks[]` array
- Numbered 3-step visual flow with icons and descriptions

### 5. Use Cases (data-driven)
- Maps through `useCases[]` array
- Cards or tiles showing industry/scenario applications

### 6. Team Grid (data-driven)
- Maps through `teamMembers[]` array
- Each card: photo placeholder, name, role

### 7. CTA Banner
- #41506C background, white text, #F1A900 "Request Demo" button

### 8. Footer
- Minimal: VOIX logo, copyright, placeholder links

## File Structure
- `src/data/landingData.ts` — all content arrays
- `src/components/landing/Navbar.tsx`
- `src/components/landing/Hero.tsx`
- `src/components/landing/Features.tsx`
- `src/components/landing/HowItWorks.tsx`
- `src/components/landing/UseCases.tsx`
- `src/components/landing/Team.tsx`
- `src/components/landing/CTABanner.tsx`
- `src/components/landing/Footer.tsx`
- `src/pages/Index.tsx` — composes all sections

