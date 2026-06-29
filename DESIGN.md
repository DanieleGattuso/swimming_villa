# DESIGN.md — The Swimming Villa

## Color strategy: Committed
Deep Mediterranean sea-petrol carries the brand (hero, footer, key surfaces) on
a clean limestone-light body. Terracotta sunset is the *single* CTA accent. The
"Mediterranean" reading comes from imagery + type + copy — not from a touristy
rainbow. All values OKLCH.

| Role            | Token            | OKLCH                       | Use |
|-----------------|------------------|-----------------------------|-----|
| Body background | `--bg`           | `oklch(0.984 0.004 210)`    | page background (cool limestone-white, not cream) |
| Surface         | `--surface`      | `oklch(0.965 0.006 208)`    | raised sections / cards |
| Ink             | `--ink`          | `oklch(0.235 0.022 235)`    | primary text (AA on bg) |
| Ink-muted       | `--ink-muted`    | `oklch(0.470 0.020 228)`    | secondary text (≥4.5:1 on bg) |
| Sea (primary)   | `--sea`          | `oklch(0.470 0.085 218)`    | brand primary |
| Sea-deep        | `--sea-deep`     | `oklch(0.330 0.060 224)`    | dark surfaces, footer, hero scrim |
| Sea-light       | `--sea-light`    | `oklch(0.880 0.034 210)`    | tints, borders, hover wash |
| Sunset (accent) | `--sunset`       | `oklch(0.700 0.150 47)`     | primary CTA, focus, highlights |
| Sunset-deep     | `--sunset-deep`  | `oklch(0.620 0.165 38)`     | CTA hover / pressed |
| Stone           | `--stone`        | `oklch(0.905 0.014 78)`     | warm neutral, used sparingly |

Contrast checked: `--ink`/`--ink-muted` on `--bg` ≥ 4.5:1; white on `--sea` and
`--sea-deep` ≥ 4.5:1; `--ink` on `--sunset` ≥ 4.5:1 for CTA label.

## Typography
Contrast-axis pairing (serif display + humanist sans), both off the Impeccable
reflex-reject list.
- **Display:** `Marcellus` — Roman capitals; nods to Cefalù's Greco-Roman /
  Norman heritage. Headings, hero, section titles. `letter-spacing` ≥ -0.02em.
- **Body / UI:** `Mulish` — clean humanist sans, elegant at small sizes.
- Scale: fluid `clamp()`, ratio ≥ 1.25. Hero display max ≤ 6rem.
- `text-wrap: balance` on h1–h3; `text-wrap: pretty` on prose. Body ≤ 70ch.

## Motion
- Lenis-free, framer-motion `whileInView` reveals — content visible by default,
  motion enhances (no visibility gating). Ease-out-expo curves, no bounce.
- Per-section choreography, not one uniform fade. Staggered children in lists.
- Full `prefers-reduced-motion` fallbacks (instant / crossfade).

## Layout
- Full-bleed hero, overlaid nav + centered headline (canonical image-led move).
- Fluid `clamp()` spacing; vary rhythm. Avoid identical card grids — gallery is
  an asymmetric mosaic, amenities are a typographic list with icons, not cards.
- Semantic z-index scale (see globals.css).

## Imagery
All sources centralized in `lib/content.ts`. Unsplash placeholders marked TODO;
swap for the villa's own photography. Alt text is part of the voice.
