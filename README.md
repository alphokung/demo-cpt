# ทางรัฐ — Citizen Portal Prototype

A static-web prototype for the **ทางรัฐ (Thang Rat)** citizen digital services platform, developed under **สำนักงานพัฒนารัฐบาลดิจิทัล (DGA)**. The prototype demonstrates two core service modules:

1. **ระบบใบสั่งจราจร** — Online traffic ticket lookup, fine payment, and driving-point management
2. **ใบรับรองแพทย์ดิจิทัล** — Digital medical certificate (หมอพร้อม) browsing and detail view

---

## Pages

| File | Route | Description |
|------|-------|-------------|
| `loading.html` | `/loading` | Splash/connection screen shown before the main dashboard |
| `index.html` | `/` | Main dashboard — ticket list + driving score gauge |
| `detail.html` | `/detail?id=` | Traffic ticket detail — offense info, evidence photos, and fine payment (QR Code) |
| `points.html` | `/points` | Driving score gauge + full deduction/restoration history |
| `filter-demo.html` | `/filter-demo` | Digital medical certificate list with filter chips (all / valid / expired) |
| `cert-detail.html` | `/cert-detail` | Medical certificate detail — patient info, validity, verification status, usage history |
| `tutorial.html` | `/tutorial` | Onboarding guide explaining the digital medical certificate service |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (plain, no framework) |
| Styling | SCSS → compiled CSS (design-token based) |
| Scripting | Vanilla JavaScript (ES6+) |
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

---

## Project Structure

```
.
├── index.html              # Main dashboard
├── loading.html            # Splash screen
├── detail.html             # Traffic ticket detail
├── points.html             # Driving points page
├── filter-demo.html        # Digital medical certificate list
├── cert-detail.html        # Medical certificate detail
├── tutorial.html           # Onboarding / tutorial
│
├── styles.scss             # Source styles (design system + all components)
├── styles.css              # Compiled output — DO NOT edit directly
│
├── db.js                   # Mock database using localStorage (tickets + driving points)
├── demo.js                 # Filter/render logic for medical certificate list
├── demo.json               # Mock data for digital medical certificates
│
├── _media/                 # SVG illustrations, icons, OG image
├── favicon/                # Favicon assets
├── robots.txt              # Disallow all crawlers
└── package.json
```

---

## Data Layer

### Traffic Tickets & Driving Points — `db.js`

`db.js` seeds `localStorage` on first load and exposes a global `DB` object:

```js
DB.getTickets()                              // returns all tickets
DB.getTicketById(id)                         // returns a single ticket
DB.updateTicketStatus(id, status, details)   // mark paid / warning
DB.getPoints()                               // returns points + log history
DB.reset()                                   // restore default seed data
```

**Ticket statuses:** `unpaid` · `paid` · `warning`

**Point log types:** `deduction` (ตัดคะแนน) · `restoration` (คืนคะแนน)

### Digital Medical Certificates — `demo.json`

Static JSON read by `demo.js` at runtime. Contains a `user` object and a `certificates` array.

**Certificate statuses:** `valid` · `expiring` · `expired`

**Certificate types:** `health` · `driving` · `covid` · `work`

---

## Design System

All design tokens (colors, spacing, typography, radius, shadows) are defined as CSS custom properties at the top of `styles.scss` and are consumed throughout. Key namespaces:

| Namespace | Purpose |
|-----------|---------|
| `--primary-*` | Brand blue |
| `--neutral-*` | Greys and surface colors |
| `--danger-*` / `--warning-*` / `--success-*` | Semantic status colors |
| `--spacing-*` | 4px base spacing scale |
| `--font-size-*` | Type scale (body-s → display) |
| `--radius-*` | Border radius scale |

Responsive breakpoint: **1024px** (`@media (min-width: 1024px)`) for desktop two-column layouts.

---

## SEO & Crawling

- All pages share unified Open Graph / Twitter Card meta (brand: **ทางรัฐ ติดต่อรัฐง่ายแค่ปลายนิ้ว**)
- `robots.txt` denies all crawlers — this prototype is not intended for public indexing

---

## Author

สำนักงานพัฒนารัฐบาลดิจิทัล (องค์การมหาชน) — Digital Government Development Agency (DGA)
