# Amp Typography Guidelines

## Font Stack

### Primary Font
**Inter** or **Geist** (Vercel's font)

Fallback stack:
```css
font-family: 'Inter', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Monospace (for data/code)
**Geist Mono** or system monospace

```css
font-family: 'Geist Mono', 'SF Mono', 'Fira Code', Consolas, monospace;
```

---

## Type Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| Display | 64px / 4rem | 700 | 1.1 | -0.02em |
| H1 | 48px / 3rem | 700 | 1.2 | -0.02em |
| H2 | 36px / 2.25rem | 600 | 1.25 | -0.01em |
| H3 | 24px / 1.5rem | 600 | 1.3 | 0 |
| H4 | 20px / 1.25rem | 600 | 1.4 | 0 |
| Body Large | 18px / 1.125rem | 400 | 1.6 | 0 |
| Body | 16px / 1rem | 400 | 1.6 | 0 |
| Body Small | 14px / 0.875rem | 400 | 1.5 | 0 |
| Caption | 12px / 0.75rem | 500 | 1.4 | 0.01em |

---

## Usage Guidelines

### Headings
- Use **Title Case** for main headings (H1, H2)
- Use **Sentence case** for subheadings and UI labels
- Keep headlines short and impactful
- Avoid widows (single words on last line)

### Body Text
- Max line width: 65-75 characters for readability
- Use 1.6 line height for comfortable reading
- Paragraphs: 2-3 sentences max
- Use `font-variant-numeric: tabular-nums` for data tables

### Emphasis
- **Bold** for important terms (sparingly)
- Avoid italic for emphasis (use bold instead)
- Links: Primary Teal color, underline on hover

### Data & Numbers
- Use tabular figures for columns of numbers
- Use monospace for technical values (kWh, percentages)
- Format numbers with locale-appropriate separators

---

## Responsive Scaling

### Mobile (< 640px)
- Display: 40px
- H1: 32px
- H2: 28px
- H3: 22px
- Body: 16px (minimum for inputs to prevent iOS zoom)

### Tablet (640px - 1024px)
- Display: 52px
- H1: 40px
- H2: 32px
- H3: 24px

### Desktop (> 1024px)
- Use full scale as defined above

---

## Accessibility

- Minimum body text size: 16px
- Minimum contrast ratio: 4.5:1 for body text
- Minimum contrast ratio: 3:1 for large text (24px+)
- Don't rely on color alone for emphasis
- Ensure text scales properly with browser zoom
