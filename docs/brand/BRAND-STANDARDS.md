# Northbridge Venture Group — Brand Standards

**Status:** Active  
**Owner:** Northbridge Venture Group  
**Applies to:** Public website, marketing materials, partner communications, and internal templates

This document defines the official Northbridge Venture Group visual identity. Source assets live in `public/brand/`.

---

## Brand essence

Northbridge Venture Group is a professional venture and advisory brand. Visual identity should feel **enterprise, restrained, and confident** — never gimmicky, overly promotional, or consumer-playful.

The mark represents a **bridge**: connection between ventures, industries, and operational improvement. The red accent line is a fixed brand signature and must not be omitted from the icon mark.

---

## Official colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Northbridge Black** | `#000000` | 0, 0, 0 | Primary backgrounds, logo on light surfaces, header |
| **Northbridge White** | `#FFFFFF` | 255, 255, 255 | Primary text on dark backgrounds, logo on dark surfaces |
| **Northbridge Red** | `#B11226` | 177, 18, 38 | Accent line in mark, CTAs, links, focus states, emphasis |
| **Charcoal** | `#141414` | 20, 20, 20 | Footer, elevated surfaces |
| **Surface** | `#1A1A1A` | 26, 26, 26 | Cards, panels |
| **Red Dark** | `#8E0E1E` | 142, 14, 30 | Hover states on red elements |
| **Muted** | `#A3A3A3` | 163, 163, 163 | Secondary text, captions |
| **Foreground** | `#FAFAFA` | 250, 250, 250 | Body text on dark UI |
| **Background** | `#0A0A0A` | 10, 10, 10 | Page background (web) |

### Color rules

- Use **black or near-black** backgrounds for primary brand presentation.
- **Northbridge Red** is an accent — not a dominant fill color for large areas.
- Do not introduce additional primary brand colors without approval.
- Maintain sufficient contrast for accessibility (WCAG AA minimum for text).

---

## Typography

### Primary typeface

**Inter** — loaded via Next.js Google Fonts in the web application.

| Role | Weight | Size (web reference) | Tracking |
|------|--------|----------------------|----------|
| Display / H1 | 600 (Semibold) | 2.75–3.25rem | Tight (`-0.02em`) |
| Section heading | 600 | 1.5–2rem | Tight |
| Body | 400 (Regular) | 1rem (16px) | Normal |
| UI / buttons | 500–600 | 0.875–1rem | Normal |
| Eyebrow / label | 600 | 0.65–0.75rem | Wide uppercase (`0.12–0.14em`) |
| Wordmark “Northbridge” | 600 | Per logo file | Tight |
| Wordmark “VENTURE GROUP” | 500 | Per logo file | Wide uppercase |

### Fallback stack

```text
Inter, system-ui, -apple-system, Segoe UI, sans-serif
```

### Typography rules

- Prefer **semibold** for headings; avoid ultra-light or decorative weights.
- Use sentence case for body copy and headings unless the layout calls for uppercase labels.
- Do not substitute serif, script, or display fonts in Northbridge Venture Group materials.
- **Northbridge Digital** sub-brand may use the same type system with red eyebrow labels — do not create a separate typeface.

---

## Logo system

### Asset inventory (`public/brand/`)

| File | Purpose |
|------|---------|
| `logo.svg` | Default stacked logo (dark text on transparent) |
| `logo-horizontal.svg` | Horizontal lockup for headers, documents, wide layouts |
| `logo-icon.svg` | Icon mark only |
| `logo-white.svg` | Stacked logo for dark backgrounds |
| `logo-black.svg` | Stacked logo for light backgrounds |
| `favicon.svg` | Browser favicon source (mark on black) |
| `favicon-32.png` | Standard favicon |
| `favicon-16.png` | Small favicon |
| `apple-touch-icon.png` | iOS home screen (180×180) |
| `og-image.png` | Open Graph / social sharing (1200×630) |

### Approved variations

Use only the provided files. Approved combinations:

1. **Stacked logo** (`logo.svg`, `logo-white.svg`, `logo-black.svg`) — presentations, hero blocks, splash screens.
2. **Horizontal logo** (`logo-horizontal.svg`) — navigation bars, letterhead, email signatures, partner decks.
3. **Icon only** (`logo-icon.svg`, `favicon.svg`) — favicons, app icons, avatars, compact UI — only when the full name appears elsewhere on the same surface.

### Background pairing

| Background | Logo file |
|------------|-----------|
| Black, charcoal, dark photography | `logo-white.svg` or `logo-icon.svg` (white strokes) |
| White, light gray, print on white | `logo-black.svg` or `logo.svg` |
| Favicon / app icon | `favicon.svg` (black field with white mark) |

The **red accent bar** in the mark remains `#B11226` in all approved variations.

---

## Clear space

Maintain clear space around the logo equal to **the height of the icon mark** (the bridge symbol above the wordmark, or the full icon in horizontal lockups).

```
        ┌─ 1× mark height ─┐
        │                 │
   1×   │    [ LOGO ]     │   1×
        │                 │
        └─────────────────┘
              1×
```

No text, imagery, or UI elements may enter this zone.

---

## Minimum size

| Asset | Minimum digital size | Notes |
|-------|----------------------|-------|
| Icon mark | **24×24 px** | Below this, use `favicon.svg` only |
| Horizontal lockup | **120 px** width | “VENTURE GROUP” must remain legible |
| Stacked logo | **140 px** width | Do not use stacked below header height constraints |
| Print (icon) | **0.375 in / 10 mm** | Minimum reproducing the accent bar |
| Print (horizontal) | **1.25 in / 32 mm** width | |

If space is insufficient, use the **icon mark** and set “Northbridge Venture Group” in Inter separately — do not scale the full lockup until illegible.

---

## Incorrect usage

Do **not**:

| Violation | Why |
|-----------|-----|
| Stretch, skew, or rotate the logo | Distorts the bridge metaphor and wordmark |
| Change logo colors outside approved files | Breaks brand consistency |
| Remove or recolor the red accent bar | The accent is a fixed brand signature |
| Apply drop shadows, glows, gradients, or outlines to the logo | Conflicts with restrained enterprise identity |
| Place the dark logo on busy or low-contrast photography | Use `logo-white.svg` on dark/busy backgrounds |
| Place the white logo on light backgrounds | Fails contrast and brand pairing rules |
| Rearrange mark and wordmark | Only stacked and horizontal lockups are approved |
| Substitute text-only “Northbridge” without the mark in primary brand placements | Weakens recognition; mark required in header-class placements |
| Use the venture-group logo for **Northbridge Digital** client deliverables as if it were a product logo | Digital is a service line under the group brand |
| Enclose the logo in unapproved shapes (badges, circles, shields) | Creates unofficial lockups |
| Animate the logo excessively | Subtle fades only; no bounce, spin, or morph |

---

## Web implementation reference

- Colors and utilities: `tailwind.config.ts`, `app/globals.css`
- Typography: `app/layout.tsx` (Inter)
- Dynamic OG image (legacy): `app/opengraph-image.tsx` — replace with `/brand/og-image.png` when wired in metadata
- Favicon: wire `public/brand/favicon.svg` and PNG fallbacks in `app/layout.tsx` metadata when adopting these assets sitewide

---

## File maintenance

- Edit **SVG source files** first; regenerate PNG exports (`favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `og-image.png`) from SVG using `@resvg/resvg-js-cli` or equivalent.
- Do not hand-edit PNG rasters for logo changes.
- Keep `og-image.png` at **1200×630** for Open Graph compatibility.
- Keep `apple-touch-icon.png` at **180×180**.

---

## Related documents

- `AGENTS.md` — Brand and design palette for development
- `docs/infrastructure/analytics.md` — Public site instrumentation (no brand impact)
