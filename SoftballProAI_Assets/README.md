# SoftballProAI Design System

This design system provides consistent colors, gradients, and typography for the SoftballProAI platform.

## Colors

Use Tailwind classes for colors:

```html
<!-- Background colors -->
<div class="bg-electricPink">Electric Pink Background</div>
<div class="bg-cyberBlue">Cyber Blue Background</div>
<div class="bg-limePop">Lime Pop Background</div>
<div class="bg-solarOrange">Solar Orange Background</div>
<div class="bg-laserYellow">Laser Yellow Background</div>
<div class="bg-ultraviolet">Ultraviolet Background</div>
<div class="bg-blacklightBase">Blacklight Base Background</div>
<div class="bg-charcoal2">Charcoal Background</div>
<div class="bg-whiteGlow">White Glow Background</div>

<!-- Text colors -->
<div class="text-electricPink">Electric Pink Text</div>
<div class="text-cyberBlue">Cyber Blue Text</div>
```

## Gradients

Use CSS classes for gradients:

```html
<div class="bg-gradient-brand">Brand Gradient Background</div>
<div class="bg-gradient-circuit">Circuit Gradient Background</div>
<div class="bg-gradient-motion">Motion Gradient Background</div>
```

## Typography

Use utility classes for consistent typography:

```html
<h1 class="text-heading-xl">Heading XL</h1>
<h2 class="text-heading-l">Heading Large</h2>
<h3 class="text-subheading">Subheading</h3>
<p class="text-body">Body text</p>
<label class="text-label">Label text</label>
```

## Files

- `design-tokens.json`: Raw design tokens
- `design-system.css`: CSS custom properties and utility classes
- `tailwind.config.ts`: Extended with brand colors

## Usage in Components

```tsx
import designTokens from '@/assets/design-tokens.json';

// Access tokens programmatically
const brandColor = designTokens.colors.electricPink;
```