# ทางรัฐ — Citizen Portal Prototype

A static-web prototype for the **ทางรัฐ (Thang Rat)** citizen digital-services platform, developed under **สำนักงานพัฒนารัฐบาลดิจิทัล (DGA)**. The prototype demonstrates a suite of government mini-app screens, unified under a shared design system.

---

## Pages

### Application Pages

| File | Description |
|------|-------------|
| `loading.html` | Splash / connection screen shown before the main dashboard |
| `dashboard.html` | Personal data hub — documents, utilities, rights, assets |
| `index.html` | Traffic-ticket list + driving-score gauge |
| `detail.html` | Traffic-ticket detail — offense info, evidence photos, fine payment (QR) |
| `points.html` | Driving-score gauge + full deduction/restoration history |
| `med-index.html` | Digital medical-certificate list with filter chips |
| `med-detail.html` | Medical-certificate detail — patient info, validity, usage history |
| `tutorial.html` | Onboarding guide for the medical-certificate service |
| `civil-reg.html` | Civil registration data (กรมการปกครอง) |
| `elderly.html` | Elderly welfare allowance (เบี้ยยังชีพผู้สูงอายุ) |
| `elderly-empty.html` | Elderly welfare — no-data / not-registered state |
| `elderly-loading.html` | Elderly welfare — loading skeleton state |
| `vehicle-registration.html` | Vehicle registration detail with multi-vehicle picker |
| `vocational-cert.html` | Vocational qualifications (สถาบันคุณวุฒิวิชาชีพ) |
| `gpf.html` | Government pension fund (กบข.) member data |
| `mea-index.html` | MEA electricity bill index |
| `mea-detail.html` | MEA electricity meter detail |
| `ncb.html` | Credit bureau summary (NCB) |
| `edge-cases.html` | System-state edge cases — maintenance, high-traffic |

### Component Library

| File | Description |
|------|-------------|
| `components.html` | Hub page — card grid linking to all component demos and demo pages |
| `qa.html` | Minimum UI test-case checklist |
| `components/accordion.html` | Accordion / expand-collapse component |
| `components/alert.html` | ThaiAlert dialog variants |
| `components/card.html` | Card component patterns |
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
| Styling | CSS custom properties (design-token based), edited directly in `styles.css` |
| Scripting | Vanilla JavaScript (ES6+, no bundler) |
| State | `localStorage` via `db.js` |
| Icons | Google Material Symbols Outlined (variable font) |
| Font | Anuphan (Google Fonts) |
| Dev server | `npx serve` or any static file server |

---

## Getting Started

### Run locally

```bash
npx serve -l 3900 .
```

Then open [http://localhost:3900](http://localhost:3900) in your browser.

> **Note:** `styles.css` is edited directly — there is no Sass compilation step. Do not run `npm run sass:build` as it will overwrite hand-authored CSS.

---

## Project Structure

```
.
├── index.html                  # Traffic-ticket list
├── dashboard.html              # Personal data hub
├── loading.html                # Splash screen
├── detail.html                 # Traffic-ticket detail + QR payment
├── points.html                 # Driving-points history
├── med-index.html              # Medical-certificate list
├── med-detail.html             # Medical-certificate detail
├── tutorial.html               # Onboarding guide
├── civil-reg.html              # Civil registration
├── elderly.html                # Elderly welfare allowance
├── elderly-empty.html          # Elderly welfare — empty state
├── elderly-loading.html        # Elderly welfare — loading state
├── vehicle-registration.html   # Vehicle registration
├── vocational-cert.html        # Vocational qualifications
├── gpf.html                    # Government pension fund
├── mea-index.html              # MEA electricity bills
├── mea-detail.html             # MEA meter detail
├── ncb.html                    # Credit bureau (NCB)
├── edge-cases.html             # System-state edge cases
│
├── components.html             # Component hub
├── qa.html                     # UI test-case checklist
├── components/                 # Component demo pages
│
├── styles.css                  # ALL styles — edit this file directly
│
├── db.js                       # Mock database (localStorage) — tickets + points
├── alert.js                    # ThaiAlert IIFE — custom alert/confirm dialogs
├── med.js                      # Medical-certificate list logic
├── med.json                    # Mock data for digital medical certificates
│
├── _media/                     # Images, SVGs, logos, media assets
├── favicon/                    # Favicon assets (ico, 16×16, 32×32)
├── DESIGN.md                   # Design-system spec for AI assistants and developers
├── SKILL.md                    # Step-by-step guide for creating new pages
└── robots.txt                  # Disallow all crawlers (prototype)
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

`med.json` is static JSON fetched at runtime by `med.js`:

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

### ThaiAlert — `alert.js`

Promise-based custom dialog (replaces native `alert` / `confirm`):

```js
await ThaiAlert.alert({ title, message, type, buttonText })
// type: 'info' | 'success' | 'warning' | 'danger'

const confirmed = await ThaiAlert.confirm({ title, message, type, confirmText, cancelText })
```

---

## Design System

All design tokens (colors, spacing, typography, radius, shadows) are CSS custom properties defined in `styles.css :root {}`. Key namespaces:

| Namespace | Description |
|-----------|-------------|
| `--primary-*` | Brand green scale |
| `--secondary-*` | Brand blue scale |
| `--neutral-*` | Grey / surface scale |
| `--danger-*` | Error / destructive (red) |
| `--positive-*` | Success (green) |
| `--warning-*` | Warning (orange) |
| `--info-*` | Informational (sky blue) |
| `--background-*` | Semantic surface tokens |
| `--foreground-*` | Semantic text/icon tokens |
| `--stroke-*` | Semantic border tokens |
| `--spacing-*` | 4 px base spacing scale (`xxs` → `7xl`) |
| `--radius-*` | Border-radius scale (`none` → `full`) |
| `--font-size-*` | Type scale (`label-s` → `display-m`) |

See `DESIGN.md` for the full specification and `SKILL.md` for a step-by-step page-creation guide.

---

## Author

สำนักงานพัฒนารัฐบาลดิจิทัล (องค์การมหาชน) — Digital Government Development Agency (DGA)
