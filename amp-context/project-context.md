# Amp Energy - Project Context

## Overview

Amp is a B2B SaaS company providing energy monitoring solutions for commercial buildings in the UAE. This is the marketing website built with Next.js.

## Tech Stack

- **Framework**: Next.js 16.1.3 (App Router)
- **React**: 19.2.3
- **Styling**: Tailwind CSS 4 with CSS custom properties
- **UI Components**: Radix UI (Accordion, Dialog, Tabs, Tooltip)
- **Font**: Geist (sans + mono)
- **Email**: Resend API
- **Language**: TypeScript

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── product/page.tsx   # Product page (features, hardware, pricing)
│   ├── about/page.tsx     # About page
│   ├── contact/           # Contact page + server actions
│   ├── privacy/page.tsx   # Privacy policy
│   ├── globals.css        # Global styles + CSS animations
│   ├── layout.tsx         # Root layout
│   └── sitemap.ts         # Dynamic sitemap
├── components/
│   ├── Header.tsx         # Site header with navigation
│   ├── Footer.tsx         # Site footer
│   ├── icons/index.tsx    # Shared SVG icon components
│   └── ui/                # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── FadeIn.tsx     # Scroll-triggered animations
│       └── AnimatedCounter.tsx
```

## Design System

### CSS Custom Properties

All colors and spacing use CSS variables defined in `globals.css`:

```css
--color-primary: #1DB9A0;        /* Teal/green brand color */
--color-primary-dark: #0D9B82;
--foreground: ...
--background: ...
--muted: ...
--border: ...
```

### Dark Sections

Footer and some sections use dark theme variables:
```css
--section-dark-bg
--section-dark-heading
--section-dark-text-muted
--section-dark-border
```

### Key Patterns

1. **Use design tokens**: Always use `var(--color-name)` instead of hardcoded colors
2. **Static values for SSR**: Avoid `Math.random()`, `Date.now()`, or dynamic calculations that differ between server/client
3. **Radix UI**: Use Radix primitives for accessible interactive components
4. **FadeIn animations**: Wrap sections in `<FadeIn>` for scroll-triggered entrance animations

## Key Pages

### Homepage (`/`)
- Hero section with animated stats
- Feature highlights
- Social proof / testimonials
- CTA sections

### Product (`/product`)
- **Platform tab**: Bento grid of features with animated visualizations
- **Hardware tab**: Amp Hub and PowerlinkGO product cards with specs
- **Pricing section**: Three tiers (Starter, PowerlinkGO, Enterprise)

### Contact (`/contact`)
- Contact form with validation (uses Resend API)
- FAQ accordion
- Demo booking CTA

## Animations

CSS animations are defined in `globals.css`:

- `flowToCenter` - Data flow dots along paths
- `devicePulse` - Pulsing rings
- `radialPulse` - Radial gradient pulse effect
- `iconPulse` - Subtle icon brightness animation
- `circuit-line-flow` - Dashed line animation

All animations respect `prefers-reduced-motion`.

## Important Conventions

1. **No hydration errors**: Use static hardcoded values for SVG paths and positions
2. **Accessibility**: All interactive elements need proper ARIA labels
3. **Responsive**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints
4. **Images**: Use Next.js `<Image>` component with explicit dimensions
5. **Icons**: Import from `@/components/icons` (shared icon library)

## Commands

```bash
npm run dev    # Start development server
npm run build  # Production build
npm run lint   # Run ESLint
```

## External Services

- **Resend**: Email delivery for contact form (API key in env)
- **Calendly**: Demo booking (external link)
- **LinkedIn**: Company page link in footer
