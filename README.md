# ทางรัฐ — Citizen Portal Prototype

A static-web prototype for the **ทางรัฐ (Thang Rat)** citizen digital-services platform, developed under **สำนักงานพัฒนารัฐบาลดิจิทัล (DGA)**. The prototype demonstrates two core service modules:

1. **ระบบใบสั่งจราจร** — Online traffic-ticket lookup, fine payment, and driving-point management
2. **ใบรับรองแพทย์ดิจิทัล** — Digital medical-certificate (หมอพร้อม) browsing and detail view

---

## Pages

### Application Pages

| File | Description |
|------|-------------|
| `loading.html` | Splash / connection screen shown before the main dashboard |
| `index.html` | Main dashboard — traffic-ticket list + driving-score gauge |
| `detail.html` | Traffic-ticket detail — offense info, evidence photos, fine payment (QR Code) |
| `points.html` | Driving score gauge + full deduction/restoration history |
| `med-index.html` | Digital medical-certificate list with filter chips (all / valid / expired) |
| `med-detail.html` | Medical-certificate detail — patient info, validity, verification status, usage history |
| `tutorial.html` | Onboarding guide explaining the digital medical-certificate service |

### Component Library

| File | Description |
|------|-------------|
| `components.html` | Hub page — card grid linking to all component demos |
| `components/alert.html` | ThaiAlert dialog variants |
| `components/color.html` | Interactive color palette — all 7 primitive scales + semantic tokens |
| `components/empty-state.html` | Empty-state patterns |
| `components/filter-chip.html` | Filter chip component |
| `components/form.html` | All form inputs and controls |
| `components/image.html` | Image helper classes (aspect ratio, circle, square) |
| `components/label.html` | Label / data-display patterns |
| `components/list-item.html` | List-item component |
| `components/progress.html` | Tutorial progress bar |
| `components/skeleton.html` | Skeleton loading placeholders |
| `components/spacing.html` | Spacing scale + radius scale + utility-class reference |
| `components/status-banner.html` | Status banner (valid / expiring / expired) |
| `components/table.html` | Responsive table |
| `components/tag.html` | Tag & badge variants |
| `components/timeline.html` | Timeline component |
| `components/welcome-banner.html` | Welcome banner variants |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (plain, no framework) |
| Styling | SCSS → compiled CSS (design-token based) |
| Scripting | Vanilla JavaScript (ES6+, no bundler) |
| State | `localStorage` via `db.js` |
| Icons | Google Material Symbols Outlined |
| Font | Anuphan (Google Fonts) |
| Build | Sass CLI (`npm run sass:build`) |
| Dev server | `npx serve` |

---

## Getting Started

### Prerequisites

- Node.js (for Sass compilation)
- `npx` available (comes with npm)

### Install

```bash
npm install
```

### Compile styles

One-time build:
```bash
npm run sass:build
```

Watch mode (auto-recompile on save):
```bash
npm run sass:watch
```

### Run locally

```bash
npx serve -l 3900 .
```

Then open [http://localhost:3900](http://localhost:3900) in your browser.

> **Important:** Always edit `styles.scss`, never `styles.css`. The CSS file is compiler output and will be overwritten.

---

## Project Structure

```
.
├── index.html              # Main dashboard (traffic tickets + driving score)
├── loading.html            # Splash screen
├── detail.html             # Traffic-ticket detail + QR payment
├── points.html             # Driving points history
├── med-index.html          # Digital medical-certificate list
├── med-detail.html         # Medical-certificate detail
├── tutorial.html           # Onboarding guide
│
├── components.html         # Component hub — card-grid landing page
├── components/             # 16 component demo pages (see table above)
│
├── styles.scss             # Source styles — design system + all components
├── styles.css              # Compiled output — DO NOT edit directly
├── styles.css.map          # Source map for browser DevTools
│
├── db.js                   # Mock database (localStorage) — traffic tickets + driving points
├── alert.js                # ThaiAlert IIFE — custom alert/confirm dialogs
├── med.js                  # Medical-certificate list logic (fetch + render)
├── med.json                # Mock data for digital medical certificates
│
├── _media/                 # SVG illustrations, OG image
├── favicon/                # Favicon assets (ico, 16×16, 32×32)
├── robots.txt              # Disallow all crawlers (prototype)
└── package.json
```

---

## Data Layer

### Traffic Tickets & Driving Points — `db.js`

Seeds `localStorage` on first load and exposes a global `DB` object:

```js
DB.getTickets()                              // returns all tickets
DB.getTicketById(id)                         // returns a single ticket
DB.updateTicketStatus(id, status, details)   // mark paid / warning
DB.getPoints()                               // returns points + log history
DB.reset()                                   // restore default seed data
```

**Ticket statuses:** `unpaid` · `paid` · `warning`

**Point log types:** `deduction` (ตัดคะแนน) · `restoration` (คืนคะแนน)

### Digital Medical Certificates — `med.json` + `med.js`

`med.json` is static JSON fetched at runtime by `med.js`. Structure:

```json
{
  "user": { "greeting": "...", "name": "..." },
  "certificates": [
    {
      "title": "...",
      "hospital": "...",
      "expiryDate": "...",
      "status": "valid | expiring | expired",
      "typeKey": "health | driving | covid | work"
    }
  ]
}
```

`med.js` exposes three functions called from `med-index.html`:

```js
initFilterDemo()     // fetch med.json → populate USER + ALL_CERTS → render
setFilter(filter)    // filter chips → re-render cert sections
toggleDemoState()    // toggle between data / no-data state (dev helper)
```

### ThaiAlert — `alert.js`

Promise-based custom dialog (replaces native `alert` / `confirm`):

```js
await ThaiAlert.alert({ title, message, type, buttonText })
// type: 'info' | 'success' | 'warning' | 'danger'

const confirmed = await ThaiAlert.confirm({ title, message, type, confirmText, cancelText })
```

---

## Design System

All design tokens (colors, spacing, typography, radius, shadows) are CSS custom properties defined in `styles.scss :root {}`. Key namespaces:

| Namespace | Description |
|-----------|-------------|
| `--primary-*` | Brand green scale (0 → 100) |
| `--secondary-*` | Brand blue scale |
| `--neutral-*` | Grey / surface scale |
| `--danger-*` | Destructive / error (red) |
| `--positive-*` | Success (green) |
| `--warning-*` | Warning (orange) |
| `--info-*` | Informational (sky blue) |
| `--background-*` | Semantic surface tokens |
| `--foreground-*` | Semantic text/icon tokens |
| `--stroke-*` | Semantic border tokens |
| `--button-*` | Button-specific tokens |
| `--spacing-*` | 4 px base spacing scale (`xxs` → `7xl`) |
| `--radius-*` | Border-radius scale (`none` → `full`) |
| `--font-size-*` | Type scale (`label-s` → `display-m`) |
| `--shadow-*` | Drop-shadow presets |

Responsive breakpoints: **480 px** (grid stack on mobile) · **1024 px** (desktop layout)

See `components/color.html` for the full interactive palette and `components/spacing.html` for the complete spacing/utility reference.

---

## SEO & Crawling

- All pages share unified Open Graph / Twitter Card meta (brand: **ทางรัฐ ติดต่อรัฐง่ายแค่ปลายนิ้ว**)
- `robots.txt` denies all crawlers — this prototype is not intended for public indexing

---

## Author

สำนักงานพัฒนารัฐบาลดิจิทัล (องค์การมหาชน) — Digital Government Development Agency (DGA)
