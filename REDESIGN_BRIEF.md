# Amp Website — Redesign Brief (v2)

> **Purpose:** Move the site away from its current "AI-template" aesthetic toward something that feels as considered as Stripe, Linear, and noda.ai. This brief supersedes the visual direction in `WEBSITE_SPEC.md` where they conflict. Structure, copy, routing, and accessibility requirements from the original spec **still apply**.

---

## 1. The Problem (what we're fixing)

An audit of the current site identified six specific "AI-template" tells. Every change in this brief maps back to one of them.

| # | Tell | Fix |
|---|---|---|
| 1 | Dark teal used as environment, not accent | Shift to light-dominant palette; one dark moment max |
| 2 | Radial glow on every dark section | Remove glows entirely; replace with real content |
| 3 | Every section centered, same vertical rhythm | Introduce asymmetry, full-bleed, and varied rhythm |
| 4 | Hero product shot floating in a void | Anchor it (browser chrome, device frame, or layered depth) |
| 5 | Same "one-word-in-blue" gradient heading on every section | Use once (hero only), vary heading treatments elsewhere |
| 6 | Generic mint-rounded-square icon containers | Replace with custom or borderless icon treatment |

**Non-goals for this pass:**
- Do not change copy. Headlines, body, CTAs, and section content stay as specified in `WEBSITE_SPEC.md`.
- Do not change routing, page structure, or the sitemap.
- Do not change accessibility requirements (WCAG 2.1 AA, keyboard nav, focus rings, skip links — all stay).
- Do not introduce new dependencies beyond what's already in the stack.

---

## 2. Working Order (ship in phases, don't boil the ocean)

Build in this order. **Stop after each phase and get approval before proceeding.** The hero alone should prove the direction works before touching the rest.

1. **Phase A — Tokens.** Update `globals.css` design tokens only. No component changes yet. Commit. Deploy preview.
2. **Phase B — Hero + Header.** Rebuild `sections/hero.tsx` and `layout/header.tsx` against new tokens. Commit. Deploy preview. **Review checkpoint.**
3. **Phase C — Home page remaining sections.** Rebuild in order: logo-cloud → value-props → how-it-works → features-grid → stats-bar → cta-section. Commit. Deploy preview. **Review checkpoint.**
4. **Phase D — Product page.** Hero + hardware tabs + platform features + pricing. **Review checkpoint.**
5. **Phase E — About, Contact, Footer.** Apply the same system.
6. **Phase F — Polish pass.** Focus rings, hover states, dark-mode pass, Lighthouse audit, /rams audit.

Do not skip ahead. If Phase B reads wrong in review, Phases C–F shouldn't exist yet.

---

## 3. Design Tokens (replace these in `globals.css`)

### 3.1 Color — new palette

```css
:root {
  /* ─── SURFACES (light-dominant) ─── */
  --color-bg:            #FBFAF8;  /* warm off-white — page background, replaces cool mint tint */
  --color-bg-raised:     #FFFFFF;  /* cards, floating elements on bg */
  --color-bg-subtle:     #F4F2EE;  /* subtle section contrast — use sparingly */
  --color-bg-inverse:    #0A0A0A;  /* the ONE dark moment — near-black, NOT teal */

  /* ─── BRAND (accent only — NOT environment) ─── */
  --color-brand:         #1DB9A0;  /* teal — buttons, key accents, data viz primary */
  --color-brand-hover:   #17A08A;
  --color-brand-ink:     #0D5C63;  /* dark teal — wordmark, reserved for logo/heading accents */
  --color-brand-wash:    #E6F5F1;  /* very subtle teal tint — use rarely, only where mint belongs */
  --color-accent:        #0066FF;  /* bright blue — single-word hero accent, links when inside prose */

  /* ─── INK (text) ─── */
  --color-ink:           #0A0A0A;  /* primary text */
  --color-ink-secondary: #44463F;  /* warm dark gray — body on light */
  --color-ink-muted:     #6B6F66;  /* meta, captions */
  --color-ink-subtle:    #9AA096;  /* tertiary */
  --color-ink-inverse:   #FBFAF8;  /* text on the dark moment */

  /* ─── LINES ─── */
  --color-line:          #E8E5DF;  /* borders, dividers on light */
  --color-line-strong:   #D6D2CA;  /* emphasized borders */
  --color-line-inverse:  rgba(255,255,255,0.08);

  /* ─── FOCUS ─── */
  --color-focus-ring:    #1DB9A0;
}
```

**Why the change:** The old `#F8FAF9` had a green tint that turned large surfaces slightly sickly. `#FBFAF8` is a warm neutral — it lets the teal actually *pop* against it instead of muddying with it. Ink colors are warm grays, not pure cool grays, so the page reads as considered rather than corporate.

**Dark mode:** Keep the existing `@media (prefers-color-scheme: dark)` block in place, but update it to use `#0A0A0A` as base (not dark teal). Dark teal is no longer a surface color — anywhere in the old CSS where `--color-bg-inverse: #0D5C63` appeared, it must now be `#0A0A0A`.

### 3.2 Spacing — break the uniform rhythm

Current site uses `96px` vertical padding on every section. That's the template tell. Replace with a rhythm system:

```css
:root {
  --section-pad-sm: 4rem;   /* 64px  — tight sections (logo cloud, stats) */
  --section-pad-md: 6rem;   /* 96px  — standard */
  --section-pad-lg: 9rem;   /* 144px — flagship sections (hero, final CTA) */
  --section-pad-xl: 12rem;  /* 192px — the one dark moment, gives it weight */
}
```

Mobile: halve each (`section-pad-sm: 3rem`, `md: 4rem`, `lg: 5.5rem`, `xl: 7rem`).

Apply variably per section (see §4). Never use the same padding on two adjacent sections.

### 3.3 Typography — vary heading treatments

Keep Space Grotesk (display) + Inter (body). Keep the existing type scale. **Change the heading rendering rules:**

- Hero `h1`: Space Grotesk, weight 500 (not 700 — the current bold + tight tracking is part of the AI-template tell). Tracking -0.02em. Size clamp(2.75rem, 6vw, 5rem).
- Section `h2`: Space Grotesk, weight 500, tracking -0.015em. Size clamp(2rem, 4vw, 3rem).
- Eyebrow / kicker: Inter, weight 500, uppercase, letter-spacing 0.08em, size 0.75rem, color `--color-ink-muted`. Use above h2 on most sections — gives hierarchy without a giant heading.
- Body: Inter, weight 400, line-height 1.6. Measure cap at 65ch.

**Gradient accent word rule:** Allowed on the hero `h1` **only**. One word, one time, using `--color-accent` as solid color (not a gradient fill — the current gradient is part of what makes it feel AI). Every other heading stays single-color.

### 3.4 Radius, shadow, border — anti-template details

```css
:root {
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  /* Replace the soft "teal glow" shadow with real elevation */
  --shadow-sm: 0 1px 2px rgba(10,10,10,0.04), 0 1px 1px rgba(10,10,10,0.03);
  --shadow-md: 0 4px 12px rgba(10,10,10,0.06), 0 2px 4px rgba(10,10,10,0.04);
  --shadow-lg: 0 16px 40px rgba(10,10,10,0.08), 0 4px 12px rgba(10,10,10,0.05);

  /* Borders-first: prefer 1px lines to shadows for flat cards */
  --border-card: 1px solid var(--color-line);
}
```

**Do not use:** `box-shadow` with any teal or colored tint. `filter: blur()` on a div as a "glow." Radial gradients behind headings. Animated aurora backgrounds.

---

## 4. Section-by-Section Spec

For each home page section: **current problem → what to change → acceptance criteria**.

### 4.1 Hero (`sections/hero.tsx`)

**Current problem:** Dark teal environment + floating dashboard + gradient one-word blue. Reads as AI template.

**What to change:**
- Background: `--color-bg` (warm off-white). No gradients. No grid overlay.
- Layout: Keep 50/50 split but shift to 55/45 (text wider), and let the dashboard image bleed off the right edge of the viewport — clipped by `overflow-hidden` on the section, not contained. This one asymmetric move does most of the work.
- Eyebrow: Remove the "No BMS required" pill. Replace with a small inline line above the h1: text "NO BMS · NO SHUTDOWN · 24H TO DATA" — eyebrow style (§3.3), separated by middle dots, `--color-ink-muted`. More concrete, less branded.
- Headline: "See where your energy **actually** goes." — "actually" in `--color-accent` (solid, not gradient), weight stays 500, everything else `--color-ink`.
- Subhead: keep copy. Set in `--color-ink-secondary` at 1.125rem, measure ~52ch.
- CTAs: Primary "Book a Demo" (filled teal, `--color-brand`, white text). Secondary "See how it works" as a text link with a `→` arrow — not an outlined pill. Less button noise.
- Product shot: Render it inside a realistic browser chrome frame (simple — a thin top bar with three dots, a rounded URL pill showing `app.ampenergy.ae`). Apply `--shadow-lg`. Optional subtle perspective tilt (2–3deg on Y-axis) but only if it doesn't hurt legibility. **No glow.**
- Below the product shot on the right, add a second layered element: a small "live" card floating slightly offset — e.g., a notification-style card saying "Chiller #3 · 12% above baseline" with a tiny sparkline. Gives depth without being gimmicky.

**Acceptance criteria:**
- No teal background anywhere in the hero.
- Dashboard image has a container (browser chrome or similar) — not floating on gradient.
- Exactly one word in `--color-accent`; no gradient fills on text.
- Hero visually reads as light, warm, and asymmetric at first glance.

### 4.2 Header (`layout/header.tsx`)

**Current problem:** Sits on a mint-tinted band that looks glued on. Logo AMP treatment with teal square fights the rest of the nav.

**What to change:**
- Header: transparent over hero, switches to `--color-bg` with `border-bottom: 1px solid var(--color-line)` after scroll (use `IntersectionObserver` on a sentinel, not a scroll event listener).
- Logo: use the wordmark version — drop the teal-square lockup in the header. Keep the square lockup only for favicon and footer.
- Nav links: Inter 14px, `--color-ink-secondary`, no uppercase. Hover: `--color-ink`.
- CTA "Book a Demo": solid teal pill, same as hero primary.
- Height: 64px. Container max-width 1200px.

### 4.3 Logo Cloud (`sections/logo-cloud.tsx`)

**Current problem:** Fine, just busy. Seven logos at full saturation compete for attention.

**What to change:**
- Desaturate logos to `--color-ink-muted` (use `filter: grayscale(100%) opacity(0.6)` with hover restoring color — `grayscale(0%) opacity(1)` at 200ms ease).
- Reduce from 7 to 5–6 strongest logos (prioritize: Amazon, IKEA, Masdar, Buro Happold, Musanadah). Keeps the row tight.
- Eyebrow reads "Trusted by teams operating over X million sq ft" — more specific than "Trusted by industry leaders" if the number is real. If not, stay with current copy.
- Padding: `--section-pad-sm`. Border-top + border-bottom `--color-line` — frames it as a divider rather than its own section.

### 4.4 Value Props (current "Stop guessing. Start knowing.")

**Current problem:** Three identical centered cards with mint-rounded-square icons. Pure template.

**What to change:**
- **Layout: asymmetric.** One large card (spans 2 columns) + two smaller stacked cards on the right, in a 12-col grid: large card cols 1–7, small cards cols 8–12 stacked. On mobile, stacks vertically.
- **Large card content:** "Plug & Play Hardware" — keep copy, but pair with a real or rendered image of the Amp Hub installed in an electrical panel. If photography isn't available yet, use the existing hub 3D render against `--color-bg-subtle` and we flag this as "needs real photo in Phase 2."
- **Small cards:** "See Every Piece of Equipment" and "Works With Any Building" — text-only, no icons. Just an eyebrow + heading + 2-line description. Restraint is the design.
- **Cards:** `--color-bg-raised`, `--border-card`, `--radius-lg`, `--shadow-sm`. No mint icon containers. If icons are kept, render them as 1px-stroke line icons in `--color-ink-secondary` at 24px — borderless, inline with the heading, not in a tinted square.
- Section padding: `--section-pad-lg`.

### 4.5 How It Works (current "01 / 02 / 03")

**Current problem:** Glowing teal numerals on dark teal with grid pattern. Peak AI-template.

**What to change:**
- **Kill the dark background.** Section uses `--color-bg-subtle` (warm very-light gray).
- **Kill the glowing numerals.** Replace with a horizontal timeline: three steps connected by a thin line (`--color-line-strong`), each step anchored by a small circle with the number in `--color-ink-secondary` (not teal, not glowing).
- Each step has a small supporting visual beneath — for "Install," use a hardware photo or an SVG cross-section of a panel. For "Connect," use a minimal SVG diagram of the Amp Hub → Cloud. For "Optimize," use a tiny dashboard crop.
- Typography: eyebrow "How it works," h2 "From install to insight in 24 hours," then the three-step row below.
- Section padding: `--section-pad-md`.

### 4.6 Features Grid ("Everything you need")

**Current problem:** 3×2 grid of centered icon-over-text blocks. AI default.

**What to change:**
- **Use a Bento layout.** 12-col, 2 rows. One feature is the hero of the grid (larger tile, spans 2 cols × 2 rows), the other 4 are smaller (each 1 × 1 ... or better, a mix of 1×1 and 2×1). Example arrangement:
  - Row 1: `[Circuit-Level Monitoring — 2×2]` `[Savings Engine — 2×1]` `[Real-Time Alerts — 2×1]`
  - Row 2: (same col 1–4 occupied by Circuit-Level) `[Monthly Reports — 1×1]` `[Building Energy Rating — 1×1]` `[Full API — 2×1]`
- Hero tile gets a real visual (chart, screenshot, or diagram). Small tiles get text + a single line icon.
- Cards: `--color-bg-raised`, `--border-card`, `--radius-lg`. Hover: lift slightly (`translateY(-2px)`) and border strengthens to `--color-line-strong`.
- No card has a colored background. No card has a glow. The variance comes from **size**, not from visual noise.

### 4.7 Stats Bar

**Current problem:** Dark teal band, white text, same rhythm as everything else.

**What to change:** **This is the one dark moment.**
- Background `--color-bg-inverse` (near-black `#0A0A0A`, not teal).
- Section padding: `--section-pad-xl` — give it weight. It should feel like a deliberate punctuation mark.
- 4 stats, but vary the sizes: first stat (10–20%) is the hero, set at clamp(4rem, 9vw, 7rem), weight 500. Other three are smaller, clamp(2.5rem, 4vw, 3.5rem). Labels in `--color-ink-muted` below each.
- Numbers use `font-variant-numeric: tabular-nums`.
- Single thin line (`--color-line-inverse`) separating the first hero stat from the other three. Not a grid of boxes.
- Eyebrow above: "In production."

### 4.8 Final CTA

**Current problem:** Generic centered "Ready to see your building's data?" on mint background.

**What to change:**
- Background: `--color-bg-raised` (white). Surrounded by `--color-bg` page background.
- Layout: asymmetric. Text left (cols 1–7), single Book a Demo button right (cols 9–12, visually anchored). Not centered.
- Typography: h2 stays, but set ink-primary. Subhead smaller.
- Below the CTA row, add a single line of micro-copy: "15-minute call · No slides · We'll show you your building first." Small text, `--color-ink-muted`. Removes friction better than any button copy.
- Section padding: `--section-pad-lg`.

### 4.9 Footer

**Current problem:** Near-black footer with teal column headers — inconsistent with new system.

**What to change:**
- Background `--color-bg-subtle` (light, not dark). Footer is not where the "dark moment" lives.
- Column headers `--color-ink-muted`, uppercase eyebrow style.
- Links `--color-ink-secondary`, hover `--color-ink`.
- Logo at top-left uses the wordmark-only variant.
- Thin 1px top border `--color-line`. No card, no shadow.

---

## 5. Product Page Changes

Same palette + typography rules apply. Specific notes:

- **Hero:** Same asymmetric light treatment as home hero. Drop the "Full-Stack Solution" pill; replace with the eyebrow pattern.
- **Hardware tabs:** Keep the Radix Tabs component. But the tab-switching copy currently uses the same "just works" one-word-blue trick — remove it. Static heading.
- **Hardware diagrams:** **These are the best visuals on the site. Keep them. Do not redesign them.** Only change: their background containers should be `--color-bg-raised` (white) with `--border-card`, not the current tinted mint.
- **Spec cards:** The 4 info boxes (Connectivity / Protocols / Storage / Updates) currently use teal text for values. Change values to `--color-ink` (near-black); keep labels in `--color-ink-muted`. Teal goes on the card-border accent or single active data point only.
- **Platform features section:** Currently the dark-with-glow treatment. Rebuild exactly like the home page Bento grid (§4.6).

---

## 6. Photography — what we need, what to use as placeholder

You have product renders. You don't yet have install photography. For this redesign:

**Where photography would change the outcome most (in priority order):**
1. Hero secondary visual — a real hand plugging in / mounting the Amp Hub on a panel. This is the single shot that would make the site feel real instead of rendered.
2. Value Props large card — Amp Hub installed inside an actual electrical panel, panel door open, cables visible.
3. About page — team photos (candid, at the office, not corporate headshots against gray).
4. Case study / social proof band — one wide shot of an actual customer site (warehouse, hotel mechanical room).

**Interim (before photography exists):**
- Use existing 3D renders where they already exist (hub, PowerlinkGO).
- For photo slots, use a neutral warm-gray placeholder (`--color-bg-subtle`) with the overlay text "Installation photo — [describe]." Don't use stock photography. Don't use AI-generated imagery. A clean placeholder signals intent; stock undermines it.

Mark each placeholder in code with a `{/* TODO: real photo — [description] */}` comment so we can batch-replace later.

---

## 7. Motion

Current site is mostly static. That's fine — we're not adding framer-motion back. But a small amount of restraint-first motion goes a long way:

- **Use `useInView` hook** (already in the stack) to fade + translateY(8px → 0) each section as it enters viewport. Duration 400ms, ease-out, once per session.
- **No scroll-jacking.** No parallax. No pinned sections.
- **Hover states**: 150ms on buttons and cards. Lift is 2px max. No scale transforms.
- **Reduced motion:** Wrap all motion in `@media (prefers-reduced-motion: no-preference)`.

---

## 8. What "Done" Looks Like (per-phase acceptance)

### Phase A (Tokens)
- `globals.css` updated. No other files changed.
- Deploy preview loads; site looks *broken-ish* because components still reference old tokens — that's expected.
- All color values in `globals.css` match §3.1 exactly.

### Phase B (Hero + Header)
- Hero has no dark background, no glow, no gradient text.
- Hero dashboard shot has a container (browser chrome or device frame).
- Exactly one accent-colored word in the h1.
- Header is transparent on hero, solid-light on scroll.
- Lighthouse Performance ≥ 90, Accessibility = 100 for `/`.

### Phase C (Home page rest)
- Zero sections use radial glows, teal backgrounds, or gradient text.
- No two adjacent sections share identical vertical padding.
- At least 2 sections use asymmetric layouts (value props + final CTA, minimum).
- Features grid is a Bento, not a 3×2.
- Exactly one dark-background section on the home page (stats bar).

### Phase D (Product)
- Hardware diagrams preserved but re-contained.
- Tab switching has no gradient text tic.
- Platform features uses Bento layout.

### Phase E (About, Contact, Footer)
- Footer is light, not dark.
- All pages pass a visual consistency check against the home page.

### Phase F (Polish)
- `/rams` accessibility audit passes on all pages.
- Lighthouse ≥ 90 across all categories on `/`, `/product`, `/about`, `/contact`.
- Reduced-motion preference respected.
- Dark mode is coherent (not just inverted).

---

## 9. Things to Explicitly **Not** Do

- Do not add any new color to the palette. Five ink shades + teal + one accent blue is the system.
- Do not reintroduce gradient text except the one accent word in the hero h1.
- Do not use `backdrop-filter: blur()` on cards. It's a Glassmorphism tell.
- Do not add a marquee of logos. Static row only.
- Do not add a "dark/light toggle" button — respect `prefers-color-scheme` only.
- Do not add testimonial carousels. If testimonials appear, they're static and quoted.
- Do not introduce Lottie, WebGL, or canvas animations.
- Do not add noise textures to backgrounds. One recent trend we're not chasing.

---

## 10. Open Questions for the Human Before Starting Phase B

Claude Code should pause and ask before starting Phase B if any of these are unresolved:

1. Is the existing dashboard screenshot the final asset, or will a higher-fidelity / up-to-date version be provided?
2. For the hero's secondary "live card" visual — do we have real alert copy / real equipment names we should use, or invent plausible ones?
3. Footer social links: the current footer shows only LinkedIn. Confirm whether to add others (X, YouTube).
4. Which of the current blog categories are real and have content? (Affects whether we build `/blog` in this pass.)

---

## Summary for Claude Code (TL;DR)

You are updating an existing Next.js 14 / TypeScript / Tailwind site. The visual direction is being revised — away from dark-teal environments, radial glows, centered card grids, and gradient one-word headings; toward a warm-light neutral palette, asymmetric layouts, one-dark-moment rhythm, and restrained typography. Ship in six phases, one at a time, with deploy previews for review between each. Start with Phase A (tokens only). Don't touch Phase B components until a human confirms Phase A looks right.
