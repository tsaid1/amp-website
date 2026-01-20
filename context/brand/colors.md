# Amp Brand Colors

## Primary Palette

### Teal (Primary Brand Color)
- **Primary Teal**: `#1DB9A0` — Used for logo background, CTAs, accents
- **Dark Teal**: `#0D5C63` — Used for wordmark "AMP" text
- **Light Mint**: `#B8E8DC` — Used for backgrounds, subtle accents

### Blue (Secondary)
- **Bright Blue**: `#0066FF` — Used in presentations, headers
- **Deep Blue**: `#1A237E` — Alternative for dark sections

### Neutrals
- **White**: `#FFFFFF` — Backgrounds, text on dark
- **Off-White**: `#F8FAF9` — Section backgrounds
- **Dark Gray**: `#1A1A1A` — Body text
- **Medium Gray**: `#6B7280` — Secondary text

## Usage Guidelines

### Backgrounds
- Light sections: White or Off-White
- Dark sections: Dark Teal or Bright Blue
- Accent sections: Light Mint

### Text
- On light backgrounds: Dark Gray for body, Dark Teal for headings
- On dark backgrounds: White

### Interactive Elements
- Primary buttons: Primary Teal with white text
- Secondary buttons: White with Primary Teal border
- Hover states: Darken by 10%

### Data Visualization
- Primary data: Primary Teal
- Secondary data: Bright Blue
- Tertiary data: Light Mint
- Alerts/warnings: Use standard semantic colors

## CSS Variables

```css
:root {
  --color-primary: #1DB9A0;
  --color-primary-dark: #0D5C63;
  --color-primary-light: #B8E8DC;
  --color-secondary: #0066FF;
  --color-white: #FFFFFF;
  --color-off-white: #F8FAF9;
  --color-dark: #1A1A1A;
  --color-gray: #6B7280;
}
```

## Accessibility Notes
- Primary Teal on white: 3.5:1 contrast (use for large text/icons only)
- Dark Teal on white: 7.2:1 contrast (safe for body text)
- White on Primary Teal: 3.5:1 contrast (use for large text/buttons)
- White on Bright Blue: 4.5:1 contrast (safe for all text)
