# Amp Website Specification

> Complete technical specification for building the Amp marketing website.
> Any developer should be able to build each page from this document without asking questions.

**UI Guidelines (MUST FOLLOW):**
1. [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines)
2. [/rams Accessibility Standards](https://rams.ai)
3. [UI Skills Constraints](https://ui-skills.com)

**Sources:**
- `AGENTS.md` — Company info, products, team
- `context/brand/colors.md` — Color palette
- `context/brand/typography.md` — Type scale
- `context/messaging/boilerplate.md` — Approved copy

---

## 1. Site Architecture

### 1.1 Complete Sitemap

```
/                       → Home (conversion: demo booking)
├── /product            → Product (conversion: demo booking)
├── /about              → About (conversion: contact)
├── /blog               → Blog Index (conversion: engagement)
│   └── /blog/[slug]    → Blog Post Detail
├── /contact            → Contact (conversion: demo booking, form submission)
└── /privacy            → Privacy Policy
```

### 1.2 Navigation Structure

**Header (Desktop)**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo]          Product   About   Blog   Contact   [Book Demo]  │
└─────────────────────────────────────────────────────────────────┘
```

**Header (Mobile)**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo]                                              [☰ Menu]    │
└─────────────────────────────────────────────────────────────────┘

Mobile Menu (Radix Dialog):
┌─────────────────────────────────────────────────────────────────┐
│ [Logo]                                              [✕ Close]   │
├─────────────────────────────────────────────────────────────────┤
│ Product                                                         │
│ About                                                           │
│ Blog                                                            │
│ Contact                                                         │
├─────────────────────────────────────────────────────────────────┤
│ [          Book a Demo          ]                               │
└─────────────────────────────────────────────────────────────────┘
```

**Footer**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo]                                                          │
│                                                                 │
│ Navigation        Company         Contact                       │
│ ──────────        ───────         ───────                       │
│ Product           About           hello@ampenergy.ae            │
│ Pricing           Blog            Floor 8, Tower 4              │
│ API Docs          Careers         One Central, DWTC             │
│                   Privacy         Dubai, UAE                    │
│                                                                 │
│ [LinkedIn]                                                      │
│                                                                 │
│ © 2025 Amp Energy. All rights reserved.                        │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 URL Naming Conventions

- Lowercase, hyphen-separated: `/blog/energy-savings-guide`
- No trailing slashes
- No file extensions
- Descriptive, keyword-rich slugs

### 1.4 Deep-Link Strategy (URL as State)

| Feature | URL Pattern | Example |
|---------|-------------|---------|
| Blog pagination | `/blog?page=2` | `/blog?page=2` |
| Blog category | `/blog?category=case-study` | `/blog?category=case-study` |
| Product tab | `/product?tab=platform` | `/product?tab=platform` |
| FAQ expanded | `/contact?faq=pricing` | `/contact?faq=pricing` |

**Requirements:**
- All filters, tabs, pagination must be reflected in URL
- Shareable URLs that restore exact state
- Browser back/forward must work correctly
- Use `useSearchParams` with `shallow` routing

---

## 2. Design Tokens

### 2.1 Colors

> Source: `context/brand/colors.md`

```css
:root {
  /* ═══════════════════════════════════════════════════════════════
     BRAND COLORS
     ═══════════════════════════════════════════════════════════════ */

  /* Primary Teal */
  --color-primary: #1DB9A0;
  --color-primary-hover: #17A08A;        /* 10% darker */
  --color-primary-active: #149178;       /* 20% darker */
  --color-primary-dark: #0D5C63;         /* Wordmark, headings */
  --color-primary-light: #B8E8DC;        /* Backgrounds, accents */

  /* Secondary Blue */
  --color-secondary: #0066FF;
  --color-secondary-hover: #0052CC;
  --color-secondary-dark: #1A237E;

  /* ═══════════════════════════════════════════════════════════════
     SEMANTIC COLORS
     ═══════════════════════════════════════════════════════════════ */

  /* Backgrounds */
  --color-bg: #FFFFFF;
  --color-bg-subtle: #F8FAF9;            /* Off-white sections */
  --color-bg-muted: #F4F4F5;
  --color-bg-accent: #B8E8DC;            /* Light mint sections */
  --color-bg-inverse: #0D5C63;           /* Dark teal sections */

  /* Text */
  --color-text: #1A1A1A;                 /* Body text */
  --color-text-heading: #0D5C63;         /* Headings on light bg */
  --color-text-muted: #6B7280;           /* Secondary text */
  --color-text-subtle: #9CA3AF;          /* Tertiary text */
  --color-text-inverse: #FFFFFF;         /* Text on dark bg */
  --color-text-link: #1DB9A0;            /* Links */
  --color-text-link-hover: #17A08A;

  /* Borders */
  --color-border: #E5E7EB;
  --color-border-muted: #F3F4F6;
  --color-border-focus: #1DB9A0;

  /* Status */
  --color-success: #10B981;
  --color-success-bg: #D1FAE5;
  --color-warning: #F59E0B;
  --color-warning-bg: #FEF3C7;
  --color-error: #EF4444;
  --color-error-bg: #FEE2E2;

  /* ═══════════════════════════════════════════════════════════════
     INTERACTIVE STATES
     ═══════════════════════════════════════════════════════════════ */

  --color-focus-ring: #1DB9A0;
  --color-focus-ring-offset: #FFFFFF;
}

/* ═══════════════════════════════════════════════════════════════
   DARK MODE
   ═══════════════════════════════════════════════════════════════ */

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0A0A0A;
    --color-bg-subtle: #141414;
    --color-bg-muted: #1F1F1F;
    --color-bg-accent: #0D3D3F;
    --color-bg-inverse: #FFFFFF;

    --color-text: #FAFAFA;
    --color-text-heading: #FAFAFA;
    --color-text-muted: #A1A1AA;
    --color-text-subtle: #71717A;
    --color-text-inverse: #0A0A0A;

    --color-border: #27272A;
    --color-border-muted: #1F1F1F;

    --color-focus-ring-offset: #0A0A0A;
  }
}
```

**Accessibility Contrast Ratios:**
| Combination | Ratio | Usage |
|-------------|-------|-------|
| `--color-text` on `--color-bg` | 17.4:1 | Body text ✓ |
| `--color-text-heading` on `--color-bg` | 7.2:1 | Headings ✓ |
| `--color-text-muted` on `--color-bg` | 5.0:1 | Secondary text ✓ |
| White on `--color-primary` | 3.5:1 | Large text/buttons only |
| White on `--color-secondary` | 4.5:1 | All text ✓ |

### 2.2 Typography

> Source: `context/brand/typography.md`

```css
:root {
  /* ═══════════════════════════════════════════════════════════════
     FONT FAMILIES
     ═══════════════════════════════════════════════════════════════ */

  --font-sans: 'Inter', 'Geist', -apple-system, BlinkMacSystemFont,
               'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'Geist Mono', 'SF Mono', 'Fira Code', Consolas,
               'Liberation Mono', Menlo, monospace;

  /* ═══════════════════════════════════════════════════════════════
     TYPE SCALE
     ═══════════════════════════════════════════════════════════════ */

  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 2.25rem;     /* 36px */
  --text-4xl: 3rem;        /* 48px */
  --text-5xl: 4rem;        /* 64px - Display */

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.1;
  --leading-snug: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.6;
  --leading-loose: 1.75;

  /* Letter Spacing */
  --tracking-tighter: -0.02em;
  --tracking-tight: -0.01em;
  --tracking-normal: 0;
  --tracking-wide: 0.01em;
}
```

**Type Scale Reference:**

| Element | Desktop | Tablet | Mobile | Weight | Line Height | Letter Spacing |
|---------|---------|--------|--------|--------|-------------|----------------|
| Display | 64px | 52px | 40px | 700 | 1.1 | -0.02em |
| H1 | 48px | 40px | 32px | 700 | 1.2 | -0.02em |
| H2 | 36px | 32px | 28px | 600 | 1.25 | -0.01em |
| H3 | 24px | 24px | 22px | 600 | 1.3 | 0 |
| H4 | 20px | 20px | 18px | 600 | 1.4 | 0 |
| Body Large | 18px | 18px | 18px | 400 | 1.6 | 0 |
| Body | 16px | 16px | 16px | 400 | 1.6 | 0 |
| Body Small | 14px | 14px | 14px | 400 | 1.5 | 0 |
| Caption | 12px | 12px | 12px | 500 | 1.4 | 0.01em |

**Typography Rules:**
- Use typographic quotes (" ") not straight quotes (" ")
- Use ellipsis character (…) not three periods (...)
- Use `font-variant-numeric: tabular-nums` for data displays
- Max line width: 65-75 characters (use `max-w-prose`)
- Minimum body text: 16px (prevents iOS zoom on inputs)

### 2.3 Spacing Scale

Base unit: **4px**

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
}
```

**Usage Guidelines:**
| Context | Token | Value |
|---------|-------|-------|
| Icon gap | `--space-2` | 8px |
| Button padding X | `--space-4` to `--space-6` | 16-24px |
| Card padding | `--space-6` | 24px |
| Section padding Y (mobile) | `--space-12` | 48px |
| Section padding Y (desktop) | `--space-24` | 96px |
| Page max-width | — | 1280px |
| Content max-width | — | 768px (prose) |

### 2.4 Borders & Shadows

```css
:root {
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;

  /* Border Width */
  --border-width: 1px;
  --border-width-2: 2px;

  /* Shadows (ambient + direct light) */
  --shadow-sm:
    0 1px 2px 0 rgb(0 0 0 / 0.03),
    0 1px 3px 0 rgb(0 0 0 / 0.05);

  --shadow-md:
    0 2px 4px 0 rgb(0 0 0 / 0.03),
    0 4px 8px 0 rgb(0 0 0 / 0.06);

  --shadow-lg:
    0 4px 8px 0 rgb(0 0 0 / 0.04),
    0 8px 24px 0 rgb(0 0 0 / 0.08);

  --shadow-xl:
    0 8px 16px 0 rgb(0 0 0 / 0.04),
    0 16px 48px 0 rgb(0 0 0 / 0.1);

  /* Focus Ring */
  --ring-width: 2px;
  --ring-offset: 2px;
}
```

**Concentric Radii Rule:**
When nesting rounded elements, inner radius = outer radius - padding.
```
Outer card: radius-lg (12px), padding 8px
Inner element: radius-md (4px) ← 12px - 8px = 4px
```

### 2.5 Breakpoints

```css
/* Mobile-first breakpoints */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

| Breakpoint | Range | Columns | Gutter | Margin |
|------------|-------|---------|--------|--------|
| Mobile | < 640px | 4 | 16px | 16px |
| Tablet | 640-1024px | 8 | 24px | 24px |
| Desktop | > 1024px | 12 | 32px | auto (centered) |

---

## 3. Component Library

> **CONSTRAINT:** Use Radix UI primitives for all interactive components.
> Never mix with other primitive systems (React Aria, Headless UI, etc.).

### 3.1 Button

**Radix:** None (native button)

**Props:**
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}
```

**Sizes:**
| Size | Height | Padding X | Font Size | Icon Size |
|------|--------|-----------|-----------|-----------|
| `sm` | 32px | 12px | 14px | 16px |
| `md` | 40px | 16px | 14px | 18px |
| `lg` | 48px | 24px | 16px | 20px |

**Variants:**

| Variant | Default | Hover | Active | Disabled |
|---------|---------|-------|--------|----------|
| `primary` | bg: `--color-primary`, text: white | bg: `--color-primary-hover` | bg: `--color-primary-active` | opacity: 0.5 |
| `secondary` | bg: white, border: `--color-border`, text: `--color-text` | bg: `--color-bg-muted` | bg: `--color-bg-subtle` | opacity: 0.5 |
| `ghost` | bg: transparent, text: `--color-text-muted` | bg: `--color-bg-muted` | bg: `--color-bg-subtle` | opacity: 0.5 |

**States:**
- **Focus:** `outline: 2px solid var(--color-focus-ring); outline-offset: 2px;` (`:focus-visible` only)
- **Loading:** Show spinner left of label, keep label visible, disable pointer events
- **Disabled:** `cursor: not-allowed; opacity: 0.5;`

**Accessibility:**
- Use `<button>` element (never `<div>` or `<span>`)
- `aria-disabled="true"` when disabled
- `aria-busy="true"` when loading
- Icon-only buttons must have `aria-label`

### 3.2 Link

**Radix:** None (native anchor or Next.js Link)

**Rules:**
- ALWAYS use `<a>` or `<Link>` for navigation
- NEVER use `<button>`, `<div>`, or `<span>` with onClick for navigation
- Standard browser behaviors MUST work:
  - Cmd/Ctrl+Click → new tab
  - Middle-click → new tab
  - Right-click → context menu
  - Hover → show URL in status bar

**Styling:**
- Color: `--color-text-link`
- Hover: underline, color: `--color-text-link-hover`
- Focus: visible focus ring (`:focus-visible`)
- External links: show icon, `target="_blank"`, `rel="noopener noreferrer"`

### 3.3 Input / Textarea

**Radix:** None (native input)

**Specs:**
```css
.input {
  height: 40px;                           /* 48px for lg */
  padding: 0 12px;
  font-size: 16px;                        /* Prevents iOS zoom */
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
}

.input:focus {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
  border-color: var(--color-focus-ring);
}

.input:invalid:not(:placeholder-shown),
.input[aria-invalid="true"] {
  border-color: var(--color-error);
}

.input::placeholder {
  color: var(--color-text-subtle);
}
```

**Accessibility Requirements:**
- MUST have associated `<label>` (visible or `aria-label`)
- Set `autocomplete` attribute appropriately
- NEVER block paste
- Error messages use `aria-describedby`

**Textarea-specific:**
- Enter = new line
- Cmd/Ctrl+Enter = submit (if in form)
- Auto-resize option using `field-sizing: content`

### 3.4 Select

**Radix:** `@radix-ui/react-select`

**Features:**
- Keyboard: Arrow keys navigate, Enter/Space select, Type to search
- Touch: Native-like feel on mobile
- Accessibility: Full ARIA combobox pattern

### 3.5 Card

**Radix:** None

**Specs:**
```css
.card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);        /* 12px */
  padding: var(--space-6);                /* 24px */
}

.card--elevated {
  border: none;
  box-shadow: var(--shadow-md);
}

.card--interactive:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
  transition: all 200ms ease;
}
```

**Hit Target Rule:**
If card is clickable, the ENTIRE card must be the hit target. No dead zones.
Use `<a>` wrapper or CSS `::after` pseudo-element for full coverage.

### 3.6 Dialog / Modal

**Radix:** `@radix-ui/react-dialog`

**Requirements:**
- Focus trap: Tab cycles within dialog
- Return focus: On close, focus returns to trigger element
- Escape to close: Always
- Click overlay to close: Optional
- Scroll lock: `overscroll-behavior: contain` on body
- Animation: Fade in/out with scale

**Accessibility:**
- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby` pointing to title
- `aria-describedby` pointing to description (if present)

### 3.7 Accordion

**Radix:** `@radix-ui/react-accordion`

**Usage:** FAQ sections

**Keyboard:**
- Enter/Space: Toggle item
- Arrow Up/Down: Move between triggers
- Home/End: First/last item

**Animation:**
```css
[data-state="open"] .accordion-content {
  animation: slideDown 200ms ease-out;
}

[data-state="closed"] .accordion-content {
  animation: slideUp 200ms ease-out;
}

@keyframes slideDown {
  from { height: 0; opacity: 0; }
  to { height: var(--radix-accordion-content-height); opacity: 1; }
}
```

### 3.8 Navigation Menu

**Desktop:** Horizontal nav with links
**Mobile:** Radix Dialog with hamburger trigger

**Skip Link (REQUIRED):**
```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<style>
.skip-link {
  position: absolute;
  left: -9999px;
  z-index: 999;
}
.skip-link:focus {
  position: fixed;
  top: 8px;
  left: 8px;
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
}
</style>
```

### 3.9 Tooltip

**Radix:** `@radix-ui/react-tooltip`

**Behavior:**
- First tooltip: 700ms delay
- Subsequent tooltips (within 300ms): No delay
- Touch: Long-press to show

**Accessibility:**
- Triggered by focus and hover
- Content announced by screen readers

---

## 4. Interaction Patterns

> Per [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines)

### 4.1 Keyboard Navigation

**All flows must be keyboard-operable.**

| Component | Keys |
|-----------|------|
| Button | Enter, Space → activate |
| Link | Enter → navigate |
| Dialog | Tab → cycle, Escape → close |
| Accordion | Enter/Space → toggle, Arrows → navigate |
| Tabs | Arrows → switch, Enter → activate |
| Menu | Arrows → navigate, Enter → select, Escape → close |
| Select | Arrows → navigate, Enter → select, Type → filter |

**Focus Ring:**
```css
:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}
```

NEVER use `outline: none` without `:focus-visible` replacement.

### 4.2 Hit Targets

| Context | Minimum Size |
|---------|--------------|
| Desktop | 24×24px (expand padding if visual is smaller) |
| Mobile | 44×44px |

```css
/* Expand hit target while keeping visual size */
.icon-button {
  position: relative;
  width: 24px;
  height: 24px;
}

.icon-button::before {
  content: '';
  position: absolute;
  inset: -10px; /* Expands to 44×44px */
}
```

### 4.3 Loading States

**Timing:**
| Phase | Duration | Description |
|-------|----------|-------------|
| Show delay | 150-300ms | Don't show loader for fast operations |
| Minimum visible | 300-500ms | Prevent flicker |
| Skeleton | — | Use for content loading |
| Spinner | — | Use for actions (button, form submit) |

**Button Loading:**
```tsx
<Button loading>
  <Spinner /> {/* 16px, left of text */}
  <span>Submitting</span> {/* Keep label visible */}
</Button>
```

### 4.4 Form Patterns

**Validation:**
- Show errors on submit, NOT on blur
- Focus first error field after submit
- Error message directly below input
- Use `aria-invalid="true"` and `aria-describedby`

**Submit Behavior:**
- Single-input forms: Enter submits
- Multi-input forms: Enter in last field or explicit button
- Keep submit button enabled until submission starts
- Disable form during submission

**Error Display:**
```tsx
<div className="form-field">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    aria-invalid={!!error}
    aria-describedby={error ? "email-error" : undefined}
  />
  {error && (
    <p id="email-error" className="error-message" role="alert">
      {error}
    </p>
  )}
</div>
```

### 4.5 URL as State

**Persist in URL:**
- Filters
- Tab selection
- Pagination
- Sort order
- Search query

**Implementation:**
```tsx
'use client';
import { useSearchParams, useRouter } from 'next/navigation';

function Tabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get('tab') || 'hardware';

  const setTab = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (/* ... */);
}
```

---

## 5. Animation Principles

> Per [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines)

### 5.1 Core Rules

1. **Honor `prefers-reduced-motion`**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

2. **Prefer CSS over JavaScript**
```css
/* Good */
.card { transition: transform 200ms ease, box-shadow 200ms ease; }
.card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }

/* Avoid JS for simple hover effects */
```

3. **GPU-accelerated properties only**
```css
/* Good - GPU accelerated */
transform: translateY(-2px);
opacity: 0.5;

/* Avoid - triggers layout/paint */
top: -2px;
margin-top: -2px;
width: 100px;
```

4. **Never use `transition: all`**
```css
/* Bad */
transition: all 200ms ease;

/* Good - explicit properties */
transition: transform 200ms ease, opacity 200ms ease;
```

5. **Animations must be interruptible**
```css
.element {
  transition: transform 200ms ease;
}
/* User can hover/unhover mid-animation */
```

6. **Input-driven, not autoplay**
- Animations respond to user actions
- No autoplaying carousels or slideshows
- Progress indicators for async operations only

### 5.2 Timing Reference

| Animation | Duration | Easing |
|-----------|----------|--------|
| Micro (hover, focus) | 150ms | ease |
| Small (accordion, dropdown) | 200ms | ease-out |
| Medium (modal, drawer) | 300ms | ease-out |
| Large (page transition) | 400ms | ease-in-out |

### 5.3 Standard Animations

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up (for modals, dropdowns) */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale In (for modals) */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 6. Page Specifications

### 6.1 HOME PAGE (`/`)

**Conversion Goal:** Book a Demo

---

#### Section 1: Hero

**Layout:** Full-width, min-height 90vh, centered content

**Grid (Desktop):**
```
┌──────────────────────────────────────────────────────────────────┐
│                          (96px padding)                           │
│  ┌────────────────────────────┐  ┌────────────────────────────┐  │
│  │                            │  │                            │  │
│  │   [Headline]               │  │   [Dashboard Image]        │  │
│  │   [Subheadline]            │  │                            │  │
│  │                            │  │                            │  │
│  │   [Book a Demo] [Learn →]  │  │                            │  │
│  │                            │  │                            │  │
│  └────────────────────────────┘  └────────────────────────────┘  │
│         (50%)                           (50%)                     │
│                          (96px padding)                           │
└──────────────────────────────────────────────────────────────────┘
```

**Copy:**
- **Headline:** "See Where Your Energy Actually Goes"
- **Subheadline:** "Equipment-level visibility for your building. No BMS required. Data online in 24 hours."
- **Primary CTA:** "Book a Demo" → `calendly.com/tariq-amp/intro-call`
- **Secondary CTA:** "Learn More" → `/product`

**Responsive:**
- Mobile: Stack vertically, image below text
- Headline: 40px mobile, 64px desktop

---

#### Section 2: Trusted By (Logo Cloud)

**Layout:** Full-width, bg: `--color-bg-subtle`, padding: 48px 0

```
┌──────────────────────────────────────────────────────────────────┐
│  Trusted by leading organizations                                 │
│                                                                   │
│  [Chalhoub]    [Amazon]    [IKEA]    [Buro Happold]              │
└──────────────────────────────────────────────────────────────────┘
```

**Copy:** "Trusted by leading organizations"

**Logos:** Grayscale, 32px height, 32px gap

---

#### Section 3: Value Propositions

**Layout:** 4-column grid, padding: 96px 0

**Copy (from boilerplate.md):**

| Card | Title | Body |
|------|-------|------|
| 1 | Plug & Play Hardware | Install in hours, not months. Our devices mount on existing panels with zero shutdown or disruption. No BMS integration, no third-party contractors, no IT headaches. |
| 2 | Equipment-Level Insight | Stop guessing. See exactly what each piece of equipment is consuming in real-time. From chillers to FCUs to lighting—know where every kWh goes. |
| 3 | No Prerequisites | Old building? No BMS? No problem. Amp works with buildings of any age, any system, any complexity. We bring our own comms network so you don't need IT approval. |
| 4 | Open Data, No Silos | Your data works for you. Full API access lets you pipe energy and sensor data into BI tools, CAFM systems, ESG platforms, and custom dashboards. |

**Card Specs:**
- bg: `--color-bg`
- border: 1px `--color-border`
- radius: 12px
- padding: 24px
- Icon: 48px, `--color-primary`

**Responsive:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 4 columns

---

#### Section 4: How It Works

**Layout:** 3 steps horizontal, padding: 96px 0, bg: `--color-bg-subtle`

```
┌──────────────────────────────────────────────────────────────────┐
│                      How It Works                                 │
│                                                                   │
│     [1]                 [2]                  [3]                  │
│   Install            Connect             Optimize                 │
│   Our plug &         Devices sync        See real-time           │
│   play hardware      to cloud            data and AI             │
│   installs in        automatically.      recommendations.        │
│   hours.                                                          │
│                                                                   │
│     ─────────────────→─────────────────→                         │
└──────────────────────────────────────────────────────────────────┘
```

**Copy:**
1. **Install** — "Our plug & play hardware installs on existing panels in hours—no shutdown, no electrician downtime."
2. **Connect** — "Devices automatically sync to our cloud over our own network. No IT approvals needed."
3. **Optimize** — "See real-time data and AI-powered recommendations to cut waste and save money."

**Responsive:** Stack vertically on mobile with connector line

---

#### Section 5: Features Grid

**Layout:** 3×2 grid, padding: 96px 0

**Copy (from boilerplate.md):**

| Feature | Description |
|---------|-------------|
| Circuit-Level Monitoring | Capture data from every asset in your building across your portfolio. Eliminate guesswork in energy management with visibility down to the breaker level. |
| Savings Engine | Find and verify energy savings projects without manual analysis. Our AI identifies anomalous behavior and recommends opportunities to improve efficiency and reduce your footprint. |
| Building Energy Rating | Benchmark your performance against industry standards. Track your Building Energy Efficiency Rating (A-F scale) and compare assets across your portfolio. |
| Real-Time Alerts | Receive alerts and anomaly detection via email, SMS, or the platform. Parameters built by our analytics engine based on baseline performance and best practices. |
| Monthly Reports | Summary reports delivered to your inbox with equipment breakdowns, efficiency metrics, savings tracking, and actionable recommendations. |
| Full API | A fully documented API lets you pipe Amp's energy and sensor data into your existing BI tools, CAFM, and custom dashboards for a unified view of performance. |

---

#### Section 6: Stats

**Layout:** 4-column stats bar, bg: `--color-primary-dark`, text: white, padding: 64px 0

| Stat | Value |
|------|-------|
| Energy Savings | 10–20%+ |
| ROI Timeline | < 1 Year |
| Data Accuracy | 0.2% |
| Time to Data | 24 Hours |

**Typography:**
- Value: `--text-4xl`, `--font-bold`
- Label: `--text-sm`, `--font-medium`, `--color-text-inverse` with 70% opacity

**Use `tabular-nums` for numbers.**

---

#### Section 7: Final CTA

**Layout:** Full-width, bg: `--color-bg-accent`, padding: 96px 0, centered

**Copy:**
- **Headline:** "Ready to See Your Building's Energy Data?"
- **Subheadline:** "Book a 15-minute demo and discover how much you could save."
- **CTA:** "Book a Demo" → `calendly.com/tariq-amp/intro-call`

---

### 6.2 PRODUCT PAGE (`/product`)

**Conversion Goal:** Book a Demo

---

#### Section 1: Hero

**Headline:** "The Complete Energy Intelligence Platform"
**Subheadline:** "Proprietary hardware meets powerful analytics. Everything you need to understand and optimize your building's energy."

---

#### Section 2: Hardware

**Tabs (URL-persisted):** `?tab=hub` | `?tab=meters`

**Tab 1: Amp Hub**
- Image: Product photo
- **Copy:** "The gateway device connecting all sensors to the cloud."
- **Specs Table:**

| Spec | Value |
|------|-------|
| Size | 70 × 57 × 35mm |
| Weight | 165g |
| Connectivity | WiFi, LAN, GSM, Bluetooth, ZigBee, NB-IOT |
| Range | ~150m |
| Accuracy | Class 0.5 |

**Tab 2: Energy Meters**
- Image: Product photo
- **Copy:** "Circuit-level monitoring devices for granular insight."
- **Specs Table:**

| Spec | Value |
|------|-------|
| Current | Up to 50A |
| Voltage | 120V–240V |
| CT Ports | 12 per device |
| Sample Rate | 8,000 samples/sec |
| Mounting | Din-rail |
| Measures | kWh, current, voltage, power, reactive energy, power factor, frequency |

---

#### Section 3: Platform Features

**Layout:** Alternating image/text rows

Features (see Section 6.1 Features Grid for copy).

---

#### Section 4: Pricing Tiers

**Layout:** 2-column comparison table

| Feature | PowerlinkGO | Enterprise |
|---------|-------------|------------|
| Equipment | Up to 12 | Unlimited |
| Scope | Single location | Portfolio-wide |
| Analytics | Premium | Advanced |
| Recommendations | ✓ | Project-level |
| API Access | Limited | Full |
| Support | Email | Dedicated |

**CTA:** "Talk to Us" → `/contact`

---

### 6.3 ABOUT PAGE (`/about`)

**Conversion Goal:** Build trust, drive to Contact

---

#### Section 1: Mission

**Headline:** "Building the Data Layer for the Built Environment"

**Copy (Long - 100 words from boilerplate.md):**
> "Most buildings run on guesswork. Energy waste, faults, and savings opportunities stay hidden in a single monthly utility bill. Amp changes that. Our proprietary plug & play hardware captures data from every circuit and piece of equipment in your building—without requiring BMS, network changes, or operational shutdown. The Amp platform turns that data into real-time, equipment-level insight, helping facility teams identify inefficiencies, prioritize actions, and track measurable savings. Trusted by Amazon, IKEA, and leading commercial real estate operators, Amp is the fastest and most affordable path to energy visibility for buildings of any age."

---

#### Section 2: Team

**Layout:** 3-column grid

| Name | Role | Bio |
|------|------|-----|
| Tariq | CEO & Founder | Building the data layer for the built environment. Obsessed with making energy visible. |
| Darko | CTO & Co-founder | Engineering simplicity into complex systems. Making plug & play actually mean plug & play. |
| Ali | Head of IoT | Designing hardware that installs in minutes and runs for years. |

**Card Specs:**
- Photo: 200×200px, rounded-full
- Name: `--text-xl`, `--font-semibold`
- Role: `--text-sm`, `--color-primary`
- Bio: `--text-base`, `--color-text-muted`

---

#### Section 3: CTA

**Copy:** "Want to learn more or join the team?"
**CTA:** "Get in Touch" → `/contact`

---

### 6.4 CONTACT PAGE (`/contact`)

**Conversion Goal:** Form submission, Demo booking

---

#### Section 1: Header

**Headline:** "Let's Talk"
**Subheadline:** "Book a demo, ask a question, or just say hello."

---

#### Section 2: Two-Column Layout

**Left: Contact Form**

| Field | Type | Required | Autocomplete | Validation |
|-------|------|----------|--------------|------------|
| Name | text | Yes | `name` | Min 2 chars |
| Email | email | Yes | `email` | Valid email format |
| Company | text | No | `organization` | — |
| Message | textarea | Yes | — | Min 10 chars |

**Submit:** "Send Message"

**Right: Contact Info + Calendly**

**Contact:**
- Email: hello@ampenergy.ae
- Address: Floor 8, Tower 4, One Central, DWTC, Dubai, UAE
- LinkedIn: linkedin.com/company/amp-ai/

**Demo Booking:**
Embed Calendly widget or prominent button:
"Book a Demo" → `calendly.com/tariq-amp/intro-call`

---

#### Section 3: FAQ Accordion

**Use Radix Accordion. Persist expanded item in URL: `?faq=pricing`**

| Question | Answer |
|----------|--------|
| How do I know if Amp is for me? | Every building, irrespective of its age or design, can benefit from smarter energy management. If you're aiming for net-zero, Amp provides intricate insights and actionable steps. Even without net-zero goals, Amp helps optimize utility bills and enhance operational efficiency. |
| Do I need BMS or BAS? | Not at all. Amp was designed with no prerequisite systems or software. |
| How much can I expect to save? | On average, we identify 5% to 20% of energy waste on customers' annual consumption. |
| How accurate is the data? | Incredibly precise, with ~0.2% margin of error. |
| How long does installation take? | Data is available online within 24 hours of integration. |

---

### 6.5 BLOG PAGE (`/blog`)

---

#### Blog Index

**Layout:** 3-column grid (2 tablet, 1 mobile)

**URL State:**
- Pagination: `?page=2`
- Category: `?category=case-study`

**Blog Card:**
```
┌─────────────────────────────┐
│ [Featured Image]            │
├─────────────────────────────┤
│ [Category Badge]            │
│ [Title - 2 lines max]       │
│ [Excerpt - 2 lines max]     │
│ [Date] · [Read time]        │
└─────────────────────────────┘
```

**Card Specs:**
- Image: 16:9 aspect ratio
- Category: `--text-xs`, `--color-primary`, uppercase
- Title: `--text-lg`, `--font-semibold`
- Excerpt: `--text-sm`, `--color-text-muted`
- Meta: `--text-xs`, `--color-text-subtle`

---

#### Blog Post Detail (`/blog/[slug]`)

**Layout:** Single column, max-width 720px, centered

**Structure:**
1. Back link: "← Back to Blog"
2. Category badge
3. Title (h1)
4. Meta: Date · Read time · Author
5. Featured image (full width)
6. Article body (MDX)
7. Author card
8. Related posts (3 cards)
9. CTA: "Book a Demo"

---

## 7. Accessibility Checklist

> Per [/rams](https://rams.ai) and WCAG 2.1 AA

### Critical (Must Fix)

- [ ] All `<img>` have `alt` text (or `alt=""` for decorative)
- [ ] Icon-only buttons have `aria-label`
- [ ] All form inputs have associated `<label>` or `aria-label`
- [ ] No `<div>` or `<span>` with `onClick` (use `<button>` or `<a>`)
- [ ] All `<a>` have `href` attribute
- [ ] Color contrast ≥ 4.5:1 for text, ≥ 3:1 for large text
- [ ] Focus indicators visible on all interactive elements
- [ ] No `outline: none` without `:focus-visible` replacement

### Serious

- [ ] Keyboard navigation works for all flows
- [ ] Tab order is logical
- [ ] No keyboard traps
- [ ] Touch targets ≥ 44px on mobile
- [ ] Form errors are announced (use `aria-live` or `role="alert"`)
- [ ] Modals trap focus and return focus on close

### Content

- [ ] Heading hierarchy is correct (h1 → h2 → h3, no skips)
- [ ] Skip link to main content as first focusable element
- [ ] `<html lang="en">` is set
- [ ] Page has exactly one `<h1>`
- [ ] Color is not the sole indicator of meaning
- [ ] Links have descriptive text (not "click here")

### Motion

- [ ] `prefers-reduced-motion` is respected
- [ ] No auto-playing animations or carousels

---

## 8. SEO Requirements

### Meta Tags

**Title Formula:** `[Page Name] | Amp Energy`

| Page | Title | Description |
|------|-------|-------------|
| Home | Amp Energy \| Equipment-Level Energy Data for Buildings | The fastest way to get energy data from your building. Real-time, equipment-level visibility. No BMS required. |
| Product | Product \| Amp Energy | Plug & play hardware and powerful analytics platform. Everything you need to understand your building's energy. |
| About | About \| Amp Energy | Building the data layer for the built environment. Meet the team behind Amp. |
| Contact | Contact \| Amp Energy | Book a demo or get in touch. We'd love to hear from you. |
| Blog | Blog \| Amp Energy | Insights, case studies, and guides on energy management and building efficiency. |

### Open Graph

```html
<meta property="og:title" content="Amp Energy | Equipment-Level Energy Data" />
<meta property="og:description" content="The fastest way to get energy data from your building." />
<meta property="og:image" content="https://ampenergy.ae/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://ampenergy.ae" />
```

### Structured Data

**Organization:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Amp Energy",
  "url": "https://ampenergy.ae",
  "logo": "https://ampenergy.ae/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hello@ampenergy.ae",
    "contactType": "sales"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Floor 8, Tower 4, One Central, DWTC",
    "addressLocality": "Dubai",
    "addressCountry": "AE"
  },
  "sameAs": ["https://linkedin.com/company/amp-ai/"]
}
```

### Technical

- [ ] Canonical URLs on all pages
- [ ] `sitemap.xml` generated (Next.js built-in)
- [ ] `robots.txt` configured
- [ ] No duplicate H1s
- [ ] Images have descriptive filenames

---

## 9. Performance Targets

### Core Web Vitals

| Metric | Target | Description |
|--------|--------|-------------|
| LCP | < 2.5s | Largest Contentful Paint |
| FID/INP | < 100ms | First Input Delay / Interaction to Next Paint |
| CLS | < 0.1 | Cumulative Layout Shift |

### Optimization Strategies

**Fonts:**
```tsx
// next.config.ts
import { Geist } from 'next/font/google';

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
});
```

**Images:**
- Use `next/image` for all images
- WebP format with fallbacks
- `priority` for above-fold hero images
- `loading="lazy"` for below-fold
- Always specify `width` and `height` (prevents CLS)

**External Resources:**
```html
<!-- Preconnect to Calendly -->
<link rel="preconnect" href="https://calendly.com" />
<link rel="dns-prefetch" href="https://calendly.com" />
```

**JavaScript:**
- Target < 100KB initial JS (gzipped)
- Code-split per route
- Lazy load modals and below-fold components

---

## 10. Technical Architecture

### File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with Header/Footer
│   ├── page.tsx                # Home page
│   ├── product/
│   │   └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── blog/
│   │   ├── page.tsx            # Blog index
│   │   └── [slug]/
│   │       └── page.tsx        # Blog post detail
│   ├── contact/
│   │   └── page.tsx
│   ├── privacy/
│   │   └── page.tsx
│   ├── globals.css             # Design tokens + base styles
│   ├── sitemap.ts              # Dynamic sitemap
│   └── robots.ts               # Robots.txt
│
├── components/
│   ├── ui/                     # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx          # Radix Dialog wrapper
│   │   ├── accordion.tsx       # Radix Accordion wrapper
│   │   ├── tooltip.tsx         # Radix Tooltip wrapper
│   │   └── tabs.tsx            # Radix Tabs wrapper
│   │
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── mobile-menu.tsx
│   │   └── container.tsx
│   │
│   └── sections/               # Page-specific sections
│       ├── hero.tsx
│       ├── logo-cloud.tsx
│       ├── value-props.tsx
│       ├── how-it-works.tsx
│       ├── features-grid.tsx
│       ├── stats-bar.tsx
│       ├── cta-section.tsx
│       ├── team-grid.tsx
│       ├── faq-accordion.tsx
│       ├── contact-form.tsx
│       └── blog-card.tsx
│
├── lib/
│   ├── utils.ts                # cn(), formatDate(), etc.
│   └── constants.ts            # NAV_LINKS, SOCIAL_LINKS, etc.
│
├── content/
│   └── blog/                   # MDX blog posts
│       ├── getting-started.mdx
│       └── case-study-ikea.mdx
│
└── public/
    ├── images/
    │   ├── amp-logo.svg
    │   ├── amp-logo-white.svg
    │   └── og-image.jpg
    └── favicon.ico
```

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_SITE_URL=https://ampenergy.ae
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/tariq-amp/intro-call

# Email (if using form submission)
RESEND_API_KEY=re_xxx
CONTACT_EMAIL=hello@ampenergy.ae
```

### Form Handling

**Option 1: Server Action (Recommended)**
```tsx
// app/contact/actions.ts
'use server';

import { Resend } from 'resend';

export async function submitContactForm(formData: FormData) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'Amp Website <noreply@ampenergy.ae>',
    to: process.env.CONTACT_EMAIL,
    subject: `Contact: ${formData.get('name')}`,
    text: `...`,
  });

  return { success: true };
}
```

---

## 11. Build Order

**Phase 1: Foundation**
1. Design tokens (`globals.css`)
2. Core UI components (Button, Card, Input, Textarea)
3. Layout components (Header, Footer, Container)
4. Mobile menu (Radix Dialog)

**Phase 2: Home Page**
5. Hero section
6. Logo cloud
7. Value propositions grid
8. How it works
9. Features grid
10. Stats bar
11. Final CTA section

**Phase 3: Secondary Pages**
12. Product page (with tabs)
13. About page (team grid)
14. Contact page (form + FAQ accordion)
15. Privacy page

**Phase 4: Blog (Optional Phase)**
16. Blog index
17. Blog post detail (MDX setup)

**Phase 5: Polish**
18. SEO (meta tags, structured data, sitemap)
19. Performance audit (Lighthouse)
20. Accessibility audit (/rams, axe)
21. Cross-browser testing

---

## Appendix: Copy Reference

All approved copy is in `context/messaging/boilerplate.md`.

**Key phrases to use:**
- "No BMS? No problem."
- "Equipment-level visibility"
- "Install in hours, not months"
- "Data online in 24 hours"
- "10-20% energy savings"
- "ROI in under 1 year"

**Words to avoid:**
- Revolutionary, Game-changing, World-class, Cutting-edge
- Hyperbolic marketing fluff
- Unnecessary technical jargon
