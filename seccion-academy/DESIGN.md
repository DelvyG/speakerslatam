---
name: Premium LatAm Marketplace
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#43474d'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#74777e'
  outline-variant: '#c4c6ce'
  surface-tint: '#49607e'
  primary: '#000f22'
  on-primary: '#ffffff'
  primary-container: '#0a2540'
  on-primary-container: '#768dad'
  inverse-primary: '#b0c8eb'
  secondary: '#ae3115'
  on-secondary: '#ffffff'
  secondary-container: '#fd6a49'
  on-secondary-container: '#640f00'
  tertiary: '#0e0f0c'
  on-tertiary: '#ffffff'
  tertiary-container: '#242421'
  on-tertiary-container: '#8c8b87'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#b0c8eb'
  on-primary-fixed: '#001c37'
  on-primary-fixed-variant: '#314865'
  secondary-fixed: '#ffdad2'
  secondary-fixed-dim: '#ffb4a3'
  on-secondary-fixed: '#3d0600'
  on-secondary-fixed-variant: '#8c1900'
  tertiary-fixed: '#e5e2dd'
  tertiary-fixed-dim: '#c8c6c2'
  on-tertiary-fixed: '#1c1c19'
  on-tertiary-fixed-variant: '#474743'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is engineered to bridge the gap between high-level intellectual inspiration and grounded professional networking. It targets a Latin American audience that values both sophistication and human connection. The visual language is defined as **Corporate Modern with a Minimalist lean**, emphasizing clarity and trust.

The brand personality is authoritative yet approachable. It utilizes expansive white space to allow high-quality professional imagery to breathe, mimicking the editorial feel of a high-end magazine. The "Latin American touch" is expressed through the warmth of the color palette and the vibrancy of the accent usage, ensuring the interface feels energetic and alive rather than cold or institutional.

## Colors

This design system utilizes a sophisticated four-tone palette. **Deep Navy (#0A2540)** serves as the primary anchor, providing a sense of stability and institutional depth. **Warm Coral (#FF6B4A)** is the vibrant catalyst, used sparingly for calls-to-action and key highlights to inject energy and urgency.

The canvas is built upon **Soft Cream (#FAF7F2)**, which softens the overall aesthetic compared to a harsh pure white, creating a "premium paper" feel. **Charcoal (#1A1A1A)** is reserved for typography to ensure maximum legibility and a modern, high-contrast finish. Gradient usage should be subtle, typically transitioning from the Deep Navy to a slightly lighter tint to add dimension to headers and primary buttons.

## Typography

The typographic hierarchy prioritizes a "robust-meets-clean" aesthetic. **Manrope** is the chosen headline face, selected for its modern geometric construction and professional weight, which commands attention in a marketplace environment. Headings should utilize tighter letter spacing and bold weights to establish a clear information hierarchy.

**Inter** handles all body and functional text. Its neutral, utilitarian design ensures that even dense marketplace descriptions remain highly readable across all device sizes. For labels and micro-copy, Inter’s medium and semi-bold weights provide the necessary contrast against the background without requiring excessive scale.

## Layout & Spacing

This design system employs a **Fixed Grid** model to maintain a disciplined, professional structure. A 12-column grid is standard for desktop layouts, with a maximum container width of 1280px to ensure line lengths for text remain optimal for reading. 

Spacing follows a strict 8px rhythmic scale. Generous vertical padding (64px+) is encouraged between major page sections to evoke the "TED-like" sense of space and importance. Card-based layouts should use a 24px gutter to maintain a clean separation of concerns while allowing the Soft Cream background to act as a natural divider.

## Elevation & Depth

Hierarchy is conveyed through **Ambient Shadows** and tonal layering. Surfaces do not use harsh borders; instead, they rely on soft, extra-diffused shadows with a slight Navy tint (`rgba(10, 37, 64, 0.08)`) to lift cards off the Soft Cream background.

Three levels of depth are defined:
1.  **Base:** The Soft Cream background.
2.  **Flat:** Elements with a 1px border of a slightly darker cream tint for subtle definition.
3.  **Raised:** Cards and interactive elements using a large blur radius (20px-40px) and low opacity to create a sophisticated, hovering effect.
Backdrop blurs (10px-15px) are used on navigation bars and modals to maintain context while providing a premium, modern feel.

## Shapes

The shape language is consistently **Rounded**, using a 10px (0.625rem) base radius for standard components like buttons, input fields, and small cards. This specific radius strikes a balance between the precision of professional software and the approachability of a community-focused marketplace. 

Large-scale containers and featured imagery should utilize the `rounded-xl` (1.5rem) setting to emphasize the "friendly premium" aesthetic. Icons should follow a consistent stroke-based style with slightly rounded terminals to match the corner radius of the UI components.

## Components

### Buttons
Primary buttons utilize the Deep Navy background with white text, or the Warm Coral background for high-priority conversions. They feature 16px horizontal padding and a medium font weight. Subtle scaling transforms (scale: 0.98) should be applied on click/active states.

### Cards
Cards are the primary container for marketplace listings. They must feature a white background (contrasting against the Soft Cream page background), 24px internal padding, and the standard 10px rounded corners. Imagery within cards should always be top-aligned and bleed to the edges of the top and sides.

### Input Fields
Inputs use a white background with a subtle 1px border in a muted navy. On focus, the border transitions to the primary Deep Navy with a soft outer glow. Labels are positioned above the field using the `label-md` typographic style.

### Chips & Tags
Used for categories and skill sets, chips use a semi-transparent Deep Navy or Warm Coral background (10% opacity) with the full-color text to provide a "tinted" look that is legible but secondary to main actions.

### Professional Imagery
All imagery should feel "editorial." Portraits should have clean backgrounds and natural lighting. Marketplace hero sections should use large-scale photography with subtle Deep Navy overlays to ensure headline legibility.