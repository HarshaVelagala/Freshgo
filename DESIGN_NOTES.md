# Design Notes & Visual System

## 1. Design Philosophy: Clean, Farm-Fresh & Tactile

FreshGo is designed around the tactile experience of an organic farmers market translated into a high-speed digital delivery platform. 

### Key Visual Principles:
- **Calibrated Color Palette**:
  - Primary: Emerald Greens (`#047857`, `#059669`, `#10b981`) conveying vitality, freshness, and sustainable farming.
  - Secondary/Accents: Warm Amber (`#f59e0b`, `#d97706`) for deals, ratings, and bakery highlights; Rose (`#e11d48`) for discounts and alerts.
  - Neutrals: Warm Slate (`#0f172a`, `#334155`, `#64748b`, `#f8fafc`) with subtle saturation to avoid sterile grays.
- **Micro-Interactions & Tactility**:
  - 12–16px container corner radii with mathematically nested inner corners.
  - Scale effects (`active:scale-95`) on buttons and tap targets.
  - Subtle borders (`border-slate-100` / `border-slate-200`) instead of heavy, muddy box shadows.

---

## 2. Responsive Adaptation: Mobile-First to Thoughtful Desktop Layout

Rather than stretching mobile views into unreadable full-width banners, desktop viewports thoughtfully transform the information density:

| Viewport | Mobile (< 768px) | Tablet (768px – 1024px) | Desktop (>= 1024px) |
| :--- | :--- | :--- | :--- |
| **Navigation** | Fixed bottom tab bar + sticky search header | Compact top bar | Full header with live delivery selector, search bar, and basket overlay |
| **Product Grid** | 2 columns with touch-optimized stepper controls | 3 columns | 4 columns (`md:grid-cols-4`) with hover card elevates |
| **Catalog Browsing** | Bottom modal drawer filters | Collapsible filter bar | Fixed 1-column sticky sidebar + 3-column product list |
| **Cart Experience** | Full-width slide-over drawer | Slide-over drawer | Multi-column checkout view with sticky order summary |
| **Product Detail** | Stacked image + scrolling details | 2-column balanced split | 2-column layout + high-res thumbnail gallery & nutrition cards |

---

## 3. Typography & Hierarchy

- **Font Hierarchy**:
  - Headings: Heavyweight display styles (`font-black`, `tracking-tight`) with high visual contrast.
  - Body Text: Clean geometric sans (`text-xs`, `text-sm`, `leading-relaxed`) capped at 65–75 character line lengths for rapid scanning.
  - Badges & Pills: Single-line non-wrapping labels (`whitespace-nowrap`, `font-bold`).

---

## 4. Accessibility & Touch Optimization

- **Touch Targets**: Minimum 44x44px bounding boxes for all interactive elements on mobile devices.
- **Focus Rings**: Distinct emerald rings (`focus:ring-2 focus:ring-emerald-500 focus:outline-hidden`) for keyboard navigation.
- **Color Contrast**: WCAG AA compliant text contrast across dark badges, light cards, and alerts.
- **Semantic HTML**: `<header>`, `<main>`, `<nav>`, `<footer>`, `<section>`, and `<article>` tags throughout with ARIA labels on icon buttons.
