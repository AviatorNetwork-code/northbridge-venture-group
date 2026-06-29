# Responsive QA Checklist

**Status:** Active  
**Applies to:** Northbridge Venture Group public site  
**Related:** `npm run smoke:public` (route availability only — not layout)

Use this checklist before major releases and after UX changes.

---

## Required breakpoints

Test in Chrome DevTools device mode **and** at least one real phone.

| Category | Widths (px) |
|----------|-------------|
| Mobile (small) | 320, 375, 390, 430 |
| Tablet | 768, 820, 1024 |
| Desktop | 1280, 1440, 1920 |

---

## Routes to audit

| Route | Focus |
|-------|--------|
| `/` | Hero, trust strip, venture grid, Digital hub, footer CTA |
| `/about` | Hero readability |
| `/ventures` | Venture cards stack |
| `/services` | Knowledge hub grid, index lists |
| `/services/industries` | Industry cards |
| `/services/expertise` | Expertise cards |
| `/services/industries/aviation` | Long-form content, related links |
| `/services/industries/hvac` | Same |
| `/services/expertise/customer-acquisition` | Same |
| `/digital` | Hub cards, focus areas |
| `/digital/assessment` | Multi-step form, selection cards, nav buttons |
| `/contact` | Sidebar + form layout, email wrap |
| `/case-studies` | Single real case study link only |

---

## Manual test flow

### 1. Global (every breakpoint)

- [ ] No horizontal scroll / overflow on body
- [ ] Header logo and menu button visible; no clipped text
- [ ] Skip link works (Tab from top of page)
- [ ] Focus ring visible on links and buttons (`:focus-visible`)
- [ ] Footer complete: nav, Digital links, copyright, email
- [ ] Sticky header does not cover focused content awkwardly

### 2. Mobile (320–430px)

- [ ] Open mobile nav → all primary links tappable (44px min height)
- [ ] Close menu with Escape key
- [ ] Business Diagnostic CTA full-width in mobile drawer
- [ ] Hero headlines wrap cleanly (`text-pretty` / `text-balance`)
- [ ] Primary buttons full-width where stacked (`nb-cta-group`)
- [ ] Digital sub-nav scrolls horizontally without breaking layout
- [ ] Assessment: step label readable; Continue/Submit full-width
- [ ] Assessment selection cards easy to tap
- [ ] Contact form inputs do not trigger iOS zoom (16px base font)
- [ ] Email addresses wrap (`break-all`) without overflow

### 3. Tablet (768–1024px)

- [ ] Two-column grids activate without cramped cards
- [ ] Contact page: sidebar stacks above form or splits cleanly at `lg`
- [ ] Section spacing feels intentional (not too tight, not empty)
- [ ] Digital sub-nav shows future links at `md+`

### 4. Desktop (1280px+)

- [ ] Content max-width ~1152px (`max-w-6xl`) — lines not too long
- [ ] Prose blocks use comfortable measure where applied (`max-w-prose`)
- [ ] Hub cards equal height in grids (`h-full`)
- [ ] CTA bands aligned; secondary actions beside primary

### 5. Trust & credibility

- [ ] No fake metrics, testimonials, or invented case studies
- [ ] Placeholder pages (Insights, Results, `/services/case-studies`) state content is not published
- [ ] `/case-studies` lists only documented engagements
- [ ] Copy avoids agency-style hype; CTAs are specific (Business Diagnostic, Contact)

### 6. Motion & performance

- [ ] With `prefers-reduced-motion: reduce`, hover lifts and fade-ins disabled
- [ ] No layout shift when header/sub-nav stick
- [ ] First Load JS unchanged materially (`npm run build` compare)

---

## Automated checks (CI-local)

```bash
npm run lint
npm run build
npm run start          # separate terminal
npm run smoke:public   # HTTP 200 on core routes
```

Smoke tests do **not** validate layout. Always complete the manual flow above for responsive releases.

---

## Known patterns in this codebase

| Pattern | Location |
|---------|----------|
| Page horizontal padding | `components/ui/Container.tsx` |
| Section spacing | `app/globals.css` — `nb-section*` |
| Mobile CTA stack | `nb-cta-group`, `nb-form-actions` |
| Overflow guard | `html, body { overflow-x: clip }` |
| Touch targets | Buttons `min-h-[2.75rem]` (44px) |

---

## Sign-off template

```
Date:
Tester:
Commit / deploy:
Breakpoints tested: 320, 375, 768, 1280, 1440
Routes spot-checked: /
Issues found: none | listed in ticket
Approved for production: yes / no
```
