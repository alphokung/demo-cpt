# DESIGN.md — ทางรัฐ Citizen Portal Design System

> **Purpose:** Machine-readable specification for AI assistants and developers implementing new pages or components within this project. Read this before touching any file.

---

## 1. Project Identity

| Property | Value |
|----------|-------|
| Product name | ทางรัฐ (Thang Rat) |
| Organisation | สำนักงานพัฒนารัฐบาลดิจิทัล (DGA) |
| Platform | Static web prototype — mobile-first |
| Primary language | Thai (th) |
| Stack | HTML5 · SCSS (compiled) · Vanilla JS (no bundler, no framework) |
| Entry point | `index.html` |
| Style source | `styles.scss` → `styles.css` (compiled, DO NOT edit the CSS) |
| Icons | Material Symbols Outlined (Google CDN, variable font) |
| Font | Anuphan (Google Fonts, weights 100–800) |

---

## 2. File Structure

```
.
├── index.html              # Dashboard — ticket list + driving score
├── loading.html            # Splash / connection screen
├── detail.html             # Traffic-ticket detail + QR payment
├── points.html             # Driving-points history
├── med-index.html          # Medical-certificate list
├── med-detail.html         # Medical-certificate detail
├── tutorial.html           # Onboarding guide
│
├── components.html         # Component hub (card-grid index)
├── components/             # One demo page per component
│   ├── alert.html
│   ├── color.html
│   ├── empty-state.html
│   ├── filter-chip.html
│   ├── form.html
│   ├── image.html
│   ├── label.html
│   ├── list-item.html
│   ├── progress.html
│   ├── skeleton.html
│   ├── spacing.html
│   ├── status-banner.html
│   ├── table.html
│   ├── tag.html
│   ├── timeline.html
│   └── welcome-banner.html
│
├── styles.scss             # ALL styles live here — edit this, not styles.css
├── styles.css              # Compiled output — auto-generated
├── db.js                   # Mock DB (localStorage) — tickets + points
├── alert.js                # ThaiAlert — custom dialog module
├── med.js                  # Medical cert list logic
├── med.json                # Medical cert mock data
├── _media/                 # SVG illustrations
├── favicon/                # Favicon assets
└── package.json
```

---

## 3. Page Shell — Required HTML Wrapper

Every page must use this exact shell. Do not omit any element.

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ชื่อหน้า — ทางรัฐ</title>
  <meta name="description" content="คำอธิบายหน้า — ทางรัฐ">
  <meta name="author" content="สำนักงานพัฒนารัฐบาลดิจิทัล (องค์การมหาชน)">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://thangrath.apps.go.th/th">
  <meta property="og:title" content="ทางรัฐ ติดต่อรัฐง่ายแค่ปลายนิ้ว">
  <meta property="og:description" content="ติดต่อรัฐง่ายแค่ปลายนิ้ว, ทางลัดถึงรัฐ ช่องทางเดียว ง่าย จบ ครบทุกช่วงวัย">
  <meta property="og:image" content="_media/og-image.png">
  <meta property="og:site_name" content="ทางรัฐ ติดต่อรัฐง่ายแค่ปลายนิ้ว">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://thangrath.apps.go.th/th">
  <meta property="twitter:title" content="ทางรัฐ ติดต่อรัฐง่ายแค่ปลายนิ้ว">
  <meta property="twitter:description" content="ติดต่อรัฐง่ายแค่ปลายนิ้ว, ทางลัดถึงรัฐ ช่องทางเดียว ง่าย จบ ครบทุกช่วงวัย">
  <meta property="twitter:image" content="_media/og-image.png">

  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="favicon/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">

  <!-- Single stylesheet -->
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="app-container">
    <div class="main-layout">
      <main>

        <!-- page content goes here -->

      </main>
    </div>

    <!-- Optional sticky footer -->
    <div class="sticky-footer">
      <!-- action buttons -->
    </div>
  </div>
</body>
</html>
```

For **component demo pages** (inside `components/`), adjust the stylesheet path to `../styles.css` and favicon paths to `../favicon/`.

---

## 4. Layout System

### Mobile-first container

```
body
└── .app-container          max-width:100%, flex-direction:column
    └── .main-layout        flex:1, min-height:100vh
        └── main            padding:16px (mobile) → 32px (desktop), max-width:1100px (desktop)
```

### Breakpoints

| Token | Value | Usage |
|-------|-------|-------|
| Mobile | < 480px | Single column, stacked grids |
| Tablet+ | ≥ 480px | Grid starts side-by-side |
| Desktop | ≥ 1024px | `main` gets `padding:32px`, `max-width:1100px`, centered |

### Dashboard 2-column grid

```html
<div class="dashboard-grid">
  <div><!-- 2fr column (welcome + tickets) --></div>
  <div><!-- 1fr column (score gauge) --></div>
</div>
```

```scss
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;  /* 6:3 ratio */
  gap: 16px;
}
@media (max-width: 480px) {
  .dashboard-grid { grid-template-columns: 1fr; }
}
```

### Card

The fundamental content container. Use `.card` for any grouped section.

```html
<div class="card">
  <!-- card-header (optional) -->
  <div class="card-header">
    <img class="img-helper-frame circle size-md" src="..." alt="">
    <div class="summary-info">
      <span class="list-title">Title</span>
      <span class="fine-title">Sub-line</span>
    </div>
  </div>

  <!-- card-body (optional) -->
  <div class="card-body">
    <div class="card-body-item">
      <span class="card-label">Label</span>
      <span class="card-value">Value</span>
    </div>
  </div>

  <!-- action button (optional) -->
  <button class="btn btn-secondary" style="width:100%">Action</button>
</div>
```

### Page header with back button

```html
<div class="page-header">
  <a href="../components.html" class="btn-back-circle" title="ย้อนกลับ">
    <span class="material-symbols-outlined">arrow_back</span>
  </a>
  <div class="title-block">
    <h2 class="text-header">Page Title</h2>
    <p class="text-subheader">Sub-description</p>
  </div>
</div>
```

### Title block (no back button)

```html
<div class="title-block">
  <h2 class="text-header">Title</h2>
  <p class="text-subheader">Sub-description</p>
</div>
```

---

## 5. Design Tokens

### Color Scales (Primitive)

Seven scales, each running `0` (darkest) → `100` (white). Key stops used in components:

| Scale | Variable prefix | Base color |
|-------|----------------|------------|
| Primary | `--primary-*` | Green (`#008858` at `30-base`) |
| Secondary | `--secondary-*` | Blue (`#325fb4` at `40-main`) |
| Neutral | `--neutral-*` | Grey (`#ffffff` at `100`) |
| Danger | `--danger-*` | Red (`#d92d20` at `40`) |
| Positive | `--positive-*` | Green success (`#079455` at `40`) |
| Warning | `--warning-*` | Orange (`#dc6803` at `40`) |
| Info | `--info-*` | Sky blue (`#0086c9` at `40`) |

**Most used stops:**

```css
--primary-20        /* dark green — active/dark text */
--primary-30-base   /* brand green — default buttons */
--primary-40        /* medium green */
--primary-80        /* light green — hover borders */
--primary-95        /* very light green — subtle backgrounds */

--neutral-20        /* near-black body text */
--neutral-60        /* muted/hint text */
--neutral-90        /* light borders */
--neutral-94        /* lighter borders */
--neutral-98        /* page canvas */
--neutral-100       /* white — card surface */
```

### Semantic Tokens

Always prefer semantic tokens over raw primitives in component CSS.

**Background:**

```css
--background-primary-dark        /* var(--primary-30-base) */
--background-primary-lighter     /* var(--primary-95) */
--background-neutral-lighter     /* var(--neutral-100) */
--background-neutral-light       /* var(--neutral-98) */
--background-neutral-medium      /* var(--neutral-96) */
--background-negative-light      /* var(--danger-95) */
--background-positive-light      /* var(--positive-95) */
--background-warning-light       /* var(--warning-95) */
--background-info-light          /* var(--info-95) */
```

**Foreground (text/icon):**

```css
--foreground-neutral-default     /* var(--neutral-20) — primary body text */
--foreground-neutral-light       /* var(--neutral-40) — secondary text */
--foreground-neutral-lighter     /* var(--neutral-60) — hint/meta text */
--foreground-primary-default     /* var(--primary-30-base) — brand text */
--foreground-negative-default    /* var(--danger-40) — error text */
--foreground-positive-default    /* var(--positive-40) — success text */
--foreground-warning-default     /* var(--warning-40) — warning text */
```

**Stroke (borders):**

```css
--stroke-neutral-default         /* var(--neutral-90) — standard border */
--stroke-neutral-lighter         /* var(--neutral-94) — subtle border */
--stroke-primary-default         /* var(--primary-30-base) — active border */
--stroke-primary-lighter         /* var(--primary-60) — hover border */
```

### Spacing Scale

Base unit = 4 px.

| Token | Value | Use |
|-------|-------|-----|
| `--spacing-none` | 0 px | — |
| `--spacing-xxs` | 2 px | Tightest nudge |
| `--spacing-xs` | 4 px | Icon padding, tiny gap |
| `--spacing-sm` | 6 px | Badge padding |
| `--spacing-md` | 8 px | Default inner padding |
| `--spacing-lg` | 12 px | Card row gap |
| `--spacing-xl` | 16 px | Section padding (mobile) |
| `--spacing-2xl` | 20 px | — |
| `--spacing-3xl` | 24 px | — |
| `--spacing-4xl` | 32 px | Section padding (desktop) |
| `--spacing-5xl` | 40 px | — |
| `--spacing-6xl` | 48 px | — |
| `--spacing-7xl` | 64 px | Largest gap |

### Radius Scale

| Token | Value |
|-------|-------|
| `--radius-none` | 0 px |
| `--radius-xxs` | 2 px |
| `--radius-xs` | 4 px |
| `--radius-sm` | 6 px |
| `--radius-md` | 8 px |
| `--radius-lg` | 10 px |
| `--radius-xl` | 12 px |
| `--radius-2xl` | 16 px |
| `--radius-3xl` | 20 px |
| `--radius-4xl` | 24 px |
| `--radius-full` | 1000 px (pill / circle) |

### Typography Scale

Font family: **Anuphan** (weights 100–800).

| Token | Size / Line-height | Use |
|-------|--------------------|-----|
| `--font-size-label-s` / `--line-height-label-s` | 11 / 16 px | Tiny label, badge text |
| `--font-size-body-s` / `--line-height-body-s` | 12 / 16 px | Caption |
| `--font-size-label-m` / `--line-height-label-m` | 12 / 18 px | Small label |
| `--font-size-title-s` / `--line-height-title-s` | 14 / 20 px | Small title |
| `--font-size-body-m` / `--line-height-body-m` | 14 / 20 px | Default body text |
| `--font-size-title-m` / `--line-height-title-m` | 16 / 24 px | Section title |
| `--font-size-body-l` / `--line-height-body-l` | 16 / 24 px | Large body |
| `--font-size-title-l` / `--line-height-title-l` | 18 / 26 px | Page sub-title |
| `--font-size-headline-s` | 24 / 32 px | Section headline |
| `--font-size-display-m` | 46 / 52 px | Score / large number |

Font-weight tokens: `--font-weight-400` (regular) · `--font-weight-500` (medium) · `--font-weight-600` (semi-bold) · `--font-weight-700` (bold).

### Shadow

```css
--shadow-custom     /* subtle card shadow */
--shadow-custom-lg  /* elevated panel */
--shadow-custom-xl  /* modal/overlay */
```

### Canvas

```css
--canvas-white   /* var(--neutral-100) — card surface */
--canvas-default /* var(--neutral-98) — page background */
```

---

## 6. Component Reference

### 6.1 Button

All buttons use the `.btn` base class plus one variant modifier.

```html
<!-- Primary — filled green -->
<button class="btn btn-primary">ดำเนินการ</button>

<!-- Secondary — outlined green -->
<button class="btn btn-secondary">ยกเลิก</button>

<!-- Tertiary — ghost (no border) -->
<button class="btn btn-tertiary">ข้ามไปก่อน</button>

<!-- Tertiary outlined -->
<button class="btn btn-tertiary-outline">รายละเอียด</button>

<!-- Destructive — danger red -->
<button class="btn btn-destructive">ลบ</button>

<!-- Loading state (shows spinner) -->
<button class="btn btn-primary is-loading" disabled>กำลังโหลด</button>

<!-- With icon -->
<button class="btn btn-primary">
  <span class="material-symbols-outlined">check</span>
  ยืนยัน
</button>
```

Buttons are `width:100%` by default. Override with `style="width:auto"` for inline/auto-width buttons.

### 6.2 Welcome Banner

Dark-green gradient banner at the top of a page.

```html
<div class="welcome-banner">
  <p class="welcome-banner-greeting">ยินดีต้อนรับ</p>
  <p class="welcome-banner-name" id="welcome-banner-name">ชื่อผู้ใช้</p>
  <p class="welcome-banner-sub" id="welcome-banner-sub">ข้อมูลสรุป</p>
</div>
```

**With score panel (dashboard variant):**

```html
<div class="welcome-banner">
  <div class="welcome-content">
    <p class="welcome-banner-greeting">ยินดีต้อนรับ</p>
    <p class="welcome-banner-name">ชื่อผู้ใช้</p>
    <p class="welcome-banner-sub">ข้อมูลสรุป</p>
  </div>
  <div class="score-panel">
    <p class="score-value">7</p>
    <p class="score-label">คะแนนคงเหลือ</p>
  </div>
</div>
```

**With notification strip:**

```html
<div class="welcome-banner">
  <p class="welcome-banner-name">ชื่อผู้ใช้</p>
  <div class="notification-strip">
    <span class="material-symbols-outlined">notifications</span>
    <span>มี 3 รายการใหม่</span>
  </div>
</div>
```

**Skeleton on dark background** (use rgba instead of grey):

```html
<span class="skeleton-loading"
  style="background:rgba(255,255,255,0.25)!important; width:160px; height:22px; display:block">
</span>
```

### 6.3 Status Banner

Contextual banner strip below the page header.

```html
<!-- Valid -->
<div class="status-banner valid">
  <span class="material-symbols-outlined">check_circle</span>
  <div>
    <p class="status-banner-title">ใช้งานได้</p>
    <p class="status-banner-sub">หมดอายุ 31 ธ.ค. 2569</p>
  </div>
</div>

<!-- Expiring -->
<div class="status-banner expiring"> ... </div>

<!-- Expired -->
<div class="status-banner expired"> ... </div>
```

### 6.4 Tag & Badge

```html
<!-- Default neutral -->
<span class="tag">ค่าเริ่มต้น</span>

<!-- Colour variants -->
<span class="tag tag--primary">Primary</span>
<span class="tag tag--success">Success</span>
<span class="tag tag--warning">Warning</span>
<span class="tag tag--danger">Danger</span>
<span class="tag tag--info">Info</span>

<!-- Size variants -->
<span class="tag tag--sm">เล็ก</span>
<span class="tag tag--lg">ใหญ่</span>

<!-- With dot indicator -->
<span class="tag tag--success tag--dot">ใช้งานได้</span>

<!-- List badge (inside list-item) -->
<span class="list-badge valid">ใช้งานได้</span>
<span class="list-badge expiring">ใกล้หมดอายุ</span>
<span class="list-badge expired">หมดอายุแล้ว</span>

<!-- Corner badge (positioned top-right on list-item) -->
<span class="list-badge valid list-badge--corner">ใช้งานได้</span>

<!-- Status badge mini (icon-only circle) -->
<span class="status-badge-mini paid">
  <span class="material-symbols-outlined">check</span>
</span>
```

### 6.5 List Item

Used in medical cert lists, history lists, navigation lists.

```html
<a href="med-detail.html" class="list-item">
  <!-- Optional corner badge -->
  <span class="list-badge valid list-badge--corner">ใช้งานได้</span>

  <!-- Icon box — type controls colour: health | driving | covid | work -->
  <div class="list-icon health">
    <span class="material-symbols-outlined">ecg_heart</span>
  </div>

  <!-- Text content -->
  <div class="list-body">
    <p class="list-title">ใบรับรองแพทย์ตรวจสุขภาพ</p>
    <div class="list-meta">
      <span class="list-meta-item">
        <span class="material-symbols-outlined list-meta-icon">domain</span>
        <span>โรงพยาบาลกรุงเทพ</span>
      </span>
      <span class="list-meta-item">
        <span class="material-symbols-outlined list-meta-icon">calendar_today</span>
        <span>หมดอายุ 31 ธ.ค. 2569</span>
      </span>
    </div>
  </div>

  <!-- Chevron -->
  <span class="material-symbols-outlined chevron">chevron_right</span>
</a>

<!-- Expired state — greyed out -->
<a href="#" class="list-item is-expired"> ... </a>
```

**Icon type classes and their colors:**

| Class | Icon | Color |
|-------|------|-------|
| `.list-icon.health` | `ecg_heart` | Green (primary) |
| `.list-icon.driving` | `directions_car` | Blue (secondary) |
| `.list-icon.covid` | `biotech` | Purple |
| `.list-icon.work` | `work` | Orange |

### 6.6 Filter Chip

```html
<div class="filter-row">
  <button class="filter-chip active" data-filter="all" onclick="setFilter('all')">
    ทั้งหมด
  </button>
  <button class="filter-chip" data-filter="health" onclick="setFilter('health')">
    <span class="filter-dot dot-health"></span>
    ตรวจสุขภาพ
  </button>
  <button class="filter-chip" data-filter="driving" onclick="setFilter('driving')">
    <span class="filter-dot dot-driving"></span>
    ใบขับขี่
  </button>
  <button class="filter-chip" data-filter="covid" onclick="setFilter('covid')">
    <span class="filter-dot dot-covid"></span>
    โควิด-19
  </button>
  <button class="filter-chip" data-filter="work" onclick="setFilter('work')">
    <span class="filter-dot dot-work"></span>
    การทำงาน
  </button>
</div>
```

Active chip has the `.active` class. Toggle it via JS:

```js
function setFilter(filter) {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.filter === filter);
  });
}
```

### 6.7 Empty State

```html
<div class="empty-state">
  <div class="empty-icon">
    <span class="material-symbols-outlined" style="font-size:28px">search</span>
  </div>
  <p class="empty-title">ไม่พบข้อมูล</p>
  <p class="empty-desc">คำอธิบายเพิ่มเติมว่าทำไมถึงว่างเปล่า<br>และผู้ใช้ควรทำอะไรต่อ</p>
  <!-- Optional action button -->
  <button class="btn btn-primary" style="width:auto; margin-top:var(--spacing-xl)">ดำเนินการ</button>
</div>
```

### 6.8 Tutorial Progress Bar

```html
<div class="tutorial-progress">
  <div class="tutorial-progress-bar passed"></div>
  <div class="tutorial-progress-bar passed"></div>
  <div class="tutorial-progress-bar active"></div>
  <div class="tutorial-progress-bar"></div>
  <div class="tutorial-progress-bar"></div>
</div>
```

States: `.passed` (completed step) · `.active` (current step) · (none) (future step).

### 6.9 Skeleton Loading

Add `.skeleton-loading` to any element for the pulse animation.

```html
<!-- Preset shapes -->
<div class="skeleton-loading skeleton-text"></div>          <!-- 100% width text line -->
<div class="skeleton-loading skeleton-text medium"></div>   <!-- 70% width -->
<div class="skeleton-loading skeleton-text short"></div>    <!-- 40% width -->
<div class="skeleton-loading skeleton-title"></div>         <!-- Larger title height -->
<div class="skeleton-loading skeleton-circle skeleton-avatar"></div>  <!-- Avatar circle -->
<div class="skeleton-loading skeleton-button"></div>        <!-- Button shape -->

<!-- Custom size -->
<div class="skeleton-loading" style="height:16px; width:80%; border-radius:var(--radius-sm)"></div>

<!-- Dark background (welcome banner) — use rgba instead of grey -->
<span class="skeleton-loading"
  style="background:rgba(255,255,255,0.25)!important; width:160px; height:22px; display:block">
</span>
```

Toggle skeleton ↔ loaded via JS:

```js
function setLoaded(isLoaded) {
  document.getElementById('view-skeleton').style.display = isLoaded ? 'none' : 'block';
  document.getElementById('view-loaded').style.display  = isLoaded ? 'block' : 'none';
}
```

### 6.10 Form Inputs

```html
<!-- Text input -->
<div class="form-group">
  <label class="form-label" for="field-id">ชื่อ</label>
  <input class="form-control" type="text" id="field-id" placeholder="กรอกชื่อ">
  <p class="form-hint">คำอธิบายเพิ่มเติม</p>
</div>

<!-- Error state -->
<div class="form-group">
  <label class="form-label" for="field-err">อีเมล</label>
  <input class="form-control is-error" type="email" id="field-err">
  <p class="form-error">รูปแบบอีเมลไม่ถูกต้อง</p>
</div>

<!-- Select -->
<select class="form-control">
  <option>เลือก...</option>
</select>

<!-- Textarea -->
<textarea class="form-control" rows="4" placeholder="ข้อความ"></textarea>

<!-- Checkbox -->
<label class="form-check">
  <input type="checkbox" class="form-check-input">
  <span class="form-check-label">ยอมรับเงื่อนไข</span>
</label>

<!-- Radio -->
<label class="form-radio">
  <input type="radio" name="group" class="form-radio-input">
  <span class="form-radio-label">ตัวเลือกที่ 1</span>
</label>

<!-- Toggle switch -->
<label class="form-toggle">
  <input type="checkbox" class="form-toggle-input">
  <span class="form-toggle-slider"></span>
  <span class="form-toggle-label">เปิดใช้งาน</span>
</label>
```

### 6.11 Responsive Table

Add `data-table` to `<table>` and `data-label` to each `<td>` for mobile card layout (≤767px).

```html
<table class="table" data-table>
  <thead>
    <tr>
      <th>หัวข้อ 1</th>
      <th>หัวข้อ 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="หัวข้อ 1">ค่า 1</td>
      <td data-label="หัวข้อ 2">ค่า 2</td>
    </tr>
  </tbody>
</table>
```

### 6.12 Timeline

```html
<div class="timeline">
  <div class="timeline-item">
    <div class="timeline-dot active"></div>
    <div class="timeline-content">
      <p class="timeline-title">ขั้นตอนปัจจุบัน</p>
      <p class="timeline-date">10 ม.ค. 2569</p>
    </div>
  </div>
  <div class="timeline-item">
    <div class="timeline-dot"></div>
    <div class="timeline-content">
      <p class="timeline-title">ขั้นตอนถัดไป</p>
    </div>
  </div>
</div>
```

### 6.13 Image Helpers

```html
<!-- Aspect ratio wrappers -->
<div class="img-helper-frame ratio-16x9">
  <img src="..." alt="">
</div>
<div class="img-helper-frame ratio-1x1">
  <img src="..." alt="">
</div>

<!-- Shape + size -->
<img src="..." alt="" class="img-helper-frame circle size-sm">   <!-- 32px circle -->
<img src="..." alt="" class="img-helper-frame circle size-md">   <!-- 44px circle -->
<img src="..." alt="" class="img-helper-frame circle size-lg">   <!-- 64px circle -->
<img src="..." alt="" class="img-helper-frame square size-md">   <!-- 44px square -->
```

### 6.14 Alert Dialog (ThaiAlert)

Include `alert.js` in the page, then call:

```html
<script src="alert.js"></script>
```

```js
// Simple alert
await ThaiAlert.alert({
  title: 'แจ้งเตือน',
  message: 'รายละเอียด...',
  type: 'info',        // 'info' | 'success' | 'warning' | 'danger'
  buttonText: 'ตกลง'  // optional, default 'ตกลง'
});

// Confirm dialog
const confirmed = await ThaiAlert.confirm({
  title: 'ยืนยันการลบ',
  message: 'คุณต้องการลบรายการนี้หรือไม่?',
  type: 'danger',
  confirmText: 'ลบ',    // optional
  cancelText: 'ยกเลิก'  // optional
});
if (confirmed) { /* user pressed confirm */ }
```

### 6.15 Section Title (inside card)

```html
<div class="section-title-container">
  <div class="section-bar"></div>
  <h3 class="section-title">ชื่อหัวข้อ</h3>
</div>
```

### 6.16 Sticky Footer

Full-width footer pinned to the bottom of the screen. Place after `.main-layout` inside `.app-container`.

```html
<div class="sticky-footer">
  <button class="btn btn-primary">ดำเนินการหลัก</button>
</div>
```

For multiple buttons:

```html
<div class="sticky-footer">
  <div style="display:flex; gap:var(--spacing-md)">
    <button class="btn btn-secondary" style="flex:1">ยกเลิก</button>
    <button class="btn btn-primary" style="flex:2">ยืนยัน</button>
  </div>
</div>
```

### 6.17 Welcome Card (Green) — Mini-app Header

Used at the top of every mini-app / data-detail page, **after** `page-header` and **before** the first content card. Provides a personal greeting and context for what data the page is showing.

**Classes:** `card welcome-card welcome-card--green mb-xl`

```html
<!-- After page-header, before first content card -->
<div class="card welcome-card welcome-card--green mb-xl">
  <h2>สวัสดีคุณสมชาย</h2>
  <p>เลขประจำตัวประชาชน 1-1002-00345-67-8</p>
  <p>{{บริบทของหน้า เช่น หน่วยงาน หรือจำนวนรายการ}}</p>
</div>
```

**Rules:**

| Rule | Detail |
|------|--------|
| Greeting format | `สวัสดีคุณ{ชื่อ}` — no title prefix (นาย/นาง) |
| Line 1 (p) | เลขประจำตัวประชาชน หรือ เลขสมาชิก/เลขอ้างอิงหลัก |
| Line 2 (p) | ชื่อหน่วยงาน หรือ สรุปสั้น เช่น "หนังสือรับรอง 3 ฉบับ" |
| Position | ต้องอยู่หลัง `page-header` เสมอ — ก่อน card แรก |
| Colour | ใช้ `welcome-card--green` เสมอสำหรับหน้า mini-app |
| ห้ามใช้ | ห้ามใช้ `id-card-banner` แทน welcome-card |

**CSS gradient** (defined in `styles.css`, do not override):

```css
.welcome-card--green {
  background: radial-gradient(...), linear-gradient(135deg, #003d28, #006643) !important;
}
```

---

### 6.18 Source Note — Data Attribution Footer

**Required on every page that displays government data.** Must be the **last element inside `<main>`**, immediately before `</main>`.

```html
<!-- Source note — last element inside <main> -->
<div class="source-note">
  <p class="source-note-text">
    <span class="material-symbols-outlined source-note-icon">verified</span>
    ข้อมูลจาก{{หน่วยงาน}}<br>
    อัปเดตล่าสุด: <span class="source-note-time"></span>
  </p>
</div>
```

The `.source-note-time` span is filled at runtime. Add this script **once per page, just before `</body>`**:

```html
<script>
  (function() {
    var m = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
             'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
    var d = new Date();
    var s = d.getDate()+' '+m[d.getMonth()]+' '+(d.getFullYear()+543)+
            ' เวลา '+String(d.getHours()).padStart(2,'0')+':'+
            String(d.getMinutes()).padStart(2,'0')+' น.';
    document.querySelectorAll('.source-note-time').forEach(function(e){ e.textContent = s; });
  })();
</script>
```

**Output example:**

```
✓ ข้อมูลจากกรมการปกครอง กระทรวงมหาดไทย
  อัปเดตล่าสุด: 28 พฤษภาคม 2569 เวลา 14:35 น.
```

**Rules:**

| Rule | Detail |
|------|--------|
| ตำแหน่ง | element สุดท้ายใน `<main>` เสมอ |
| ห้ามใช้ inline style | ใช้ class `source-note`, `source-note-text`, `source-note-icon` เท่านั้น |
| วันที่ | ต้องเป็น dynamic (JS) — ห้าม hardcode |
| รูปแบบวันที่ | พุทธศักราช (ปีคริสต์ + 543), เวลา 24 ชั่วโมง, ลงท้าย " น." |
| icon | ใช้ `verified` (Material Symbols Outlined) เสมอ |

**CSS tokens (defined in `styles.css`):**

```css
.source-note        { text-align: center; padding: var(--spacing-md) 0 var(--spacing-4xl); }
.source-note-text   { font-size: var(--font-size-body-s); color: var(--foreground-neutral-lighter); line-height: 1.6; }
.source-note-icon   { font-size: 14px; vertical-align: -3px; }
```

---

## 7. Utility Classes

### Spacing helpers

```
mt-lg  mt-xl  mt-2xl  mt-3xl  mt-4xl  mt-5xl
mb-lg  mb-xl  mb-2xl  mb-3xl  mb-4xl  mb-5xl
mb-0   (zero margin-bottom)

p-none  p-xs  p-sm  p-md  p-lg  p-xl  p-2xl  p-3xl  p-4xl
pt-xs  pt-sm  pt-md  pt-lg  pt-xl  pt-2xl  pt-3xl
pb-xs  pb-sm  pb-md  pb-lg  pb-xl  pb-2xl  pb-3xl
px-xs  px-sm  px-md  px-lg  px-xl  px-2xl  px-3xl   (left + right)
py-xs  py-sm  py-md  py-lg  py-xl  py-2xl  py-3xl   (top + bottom)

gap-xs  gap-sm  gap-md  gap-lg  gap-xl  gap-2xl  gap-3xl  gap-4xl
```

### Display / flex helpers

```
.flex-center      { display:flex; align-items:center; justify-content:center }
.flex-between     { display:flex; align-items:center; justify-content:space-between }
.flex-col         { display:flex; flex-direction:column }
```

### Text helpers

```
.text-header      { font-size: title-l, font-weight-700 }
.text-subheader   { font-size: body-m, color: foreground-neutral-lighter }
.text-center      { text-align:center }
```

### Code display

```html
<pre class="code-block">code here</pre>
```

---

## 8. Material Icons Usage

All icons use the **Material Symbols Outlined** variable font. Basic usage:

```html
<span class="material-symbols-outlined">icon_name</span>
```

Control weight/fill via CSS font-variation-settings:

```css
/* Filled icon, medium weight */
font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;

/* Outlined icon, light weight */
font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
```

Common icons used in this project:

| Purpose | Icon name |
|---------|-----------|
| Back navigation | `arrow_back` |
| Chevron right | `chevron_right` |
| Check / success | `check_circle` |
| Error / danger | `error` |
| Warning | `warning` |
| Info | `info` |
| Download | `downloading` |
| Calendar | `calendar_today` |
| Location | `location_on` |
| Hospital | `domain` |
| Health cert | `ecg_heart` |
| Driving cert | `directions_car` |
| Work cert | `work` |
| COVID cert | `biotech` |
| QR code | `qr_code_2` |
| Payment | `payments` |
| Search | `search` |
| Notification | `notifications` |

---

## 9. Data Layer

### 9.1 Traffic Tickets — `db.js`

Loaded via `<script src="db.js"></script>`. Seeds `localStorage` on first call and exposes a global `DB`:

```js
DB.getTickets()                                 // → ticket[]
DB.getTicketById(id)                            // → ticket | undefined
DB.updateTicketStatus(id, status, details)      // status: 'unpaid' | 'paid' | 'warning'
DB.getPoints()                                  // → { remainingPoints, maxPoints, logs[] }
DB.reset()                                      // restore seed data
```

**Ticket object shape:**

```js
{
  id: "ticket-1",
  ticketNumber: "0265125960711",
  fine: 500,
  dueDate: "31 มกราคม 2569",
  status: "unpaid",               // unpaid | paid | warning
  issueDate: "...",
  ownerName: "...",
  licensePlate: "...",
  offenseDate: "...",
  offenseLocation: "...",
  issuedBy: "...",
  offenses: [{ name: "...", price: 500 }],
  paymentDetails: "..."           // present when status === 'paid'
}
```

**Points object shape:**

```js
{
  remainingPoints: 7,
  maxPoints: 12,
  logs: [
    { id: "...", type: "deduction",   points: 2, reason: "...", date: "..." },
    { id: "...", type: "restoration", points: 1, reason: "...", date: "..." }
  ]
}
```

### 9.2 Medical Certificates — `med.json` + `med.js`

`med.js` is loaded via `<script src="med.js"></script>`. It fetches `med.json` and exposes:

```js
initFilterDemo()       // call on DOMContentLoaded — fetches data and renders
setFilter(filter)      // 'all' | 'health' | 'driving' | 'covid' | 'work'
toggleDemoState()      // toggle hasData flag (floating dev helper button)
```

**med.json shape:**

```json
{
  "user": {
    "greeting": "สวัสดี คุณ",
    "name": "ชื่อผู้ใช้"
  },
  "certificates": [
    {
      "title": "ใบรับรองแพทย์ตรวจสุขภาพ",
      "hospital": "โรงพยาบาลกรุงเทพ",
      "expiryDate": "31 ธ.ค. 2569",
      "status": "valid",
      "typeKey": "health"
    }
  ]
}
```

Certificate `status`: `valid` · `expiring` · `expired`

Certificate `typeKey`: `health` · `driving` · `covid` · `work`

---

## 10. Creating a New Page

### Step 1 — Copy the page shell (with meta tags)

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ชื่อหน้า — ทางรัฐ</title>
  <meta name="description" content="คำอธิบายหน้า — ทางรัฐ">
  <meta name="author" content="สำนักงานพัฒนารัฐบาลดิจิทัล (องค์การมหาชน)">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://thangrath.apps.go.th/th">
  <meta property="og:title" content="ทางรัฐ ติดต่อรัฐง่ายแค่ปลายนิ้ว">
  <meta property="og:description" content="ติดต่อรัฐง่ายแค่ปลายนิ้ว, ทางลัดถึงรัฐ ช่องทางเดียว ง่าย จบ ครบทุกช่วงวัย">
  <meta property="og:image" content="_media/og-image.png">
  <meta property="og:site_name" content="ทางรัฐ ติดต่อรัฐง่ายแค่ปลายนิ้ว">
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://thangrath.apps.go.th/th">
  <meta property="twitter:title" content="ทางรัฐ ติดต่อรัฐง่ายแค่ปลายนิ้ว">
  <meta property="twitter:description" content="ติดต่อรัฐง่ายแค่ปลายนิ้ว, ทางลัดถึงรัฐ ช่องทางเดียว ง่าย จบ ครบทุกช่วงวัย">
  <meta property="twitter:image" content="_media/og-image.png">
  <link rel="icon" type="image/x-icon" href="favicon/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="app-container">
    <div class="main-layout">
      <main>
        <!-- content here -->
      </main>
    </div>
  </div>
  <script>
    (function() {
      var m = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
               'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
      var d = new Date();
      var s = d.getDate()+' '+m[d.getMonth()]+' '+(d.getFullYear()+543)+
              ' เวลา '+String(d.getHours()).padStart(2,'0')+':'+
              String(d.getMinutes()).padStart(2,'0')+' น.';
      document.querySelectorAll('.source-note-time').forEach(function(e){ e.textContent = s; });
    })();
  </script>
</body>
</html>
```

### Step 2 — Add page header

```html
<div class="page-header">
  <a href="index.html" class="btn-back-circle" title="ย้อนกลับ">
    <span class="material-symbols-outlined">arrow_back</span>
  </a>
  <div class="title-block">
    <h2 class="text-header">ชื่อหน้า</h2>
    <p class="text-subheader">คำอธิบายสั้น ๆ</p>
  </div>
</div>
```

### Step 2b — Add welcome card (data pages only)

If the page shows personal government data, add a green welcome card **immediately after `page-header`**:

```html
<div class="card welcome-card welcome-card--green mb-xl">
  <h2>สวัสดีคุณสมชาย</h2>
  <p>เลขประจำตัวประชาชน 1-1002-00345-67-8</p>
  <p>{{หน่วยงานหรือบริบทของหน้า}}</p>
</div>
```

See **§ 6.17** for full rules.

### Step 3 — Add content using `.card` blocks

```html
<div class="card">
  <div class="section-title-container">
    <div class="section-bar"></div>
    <h3 class="section-title">หัวข้อส่วนที่ 1</h3>
  </div>
  <!-- content -->
</div>
```

### Step 4 — Use design tokens, not raw values

```css
/* ✅ Correct */
color: var(--foreground-neutral-default);
padding: var(--spacing-xl);
border-radius: var(--radius-xl);

/* ❌ Wrong */
color: #25272a;
padding: 16px;
border-radius: 12px;
```

### Step 5 — Add scripts only when needed

```html
<script src="db.js"></script>    <!-- tickets + points data -->
<script src="alert.js"></script> <!-- dialog module -->
<script src="med.js"></script>   <!-- medical cert module -->

<script>
  window.addEventListener('DOMContentLoaded', function () {
    // page-specific init
  });
</script>
```

### Step 6 — Add source note (data pages only)

If the page displays government data, add a source note as the **last element inside `<main>`**:

```html
<div class="source-note">
  <p class="source-note-text">
    <span class="material-symbols-outlined source-note-icon">verified</span>
    ข้อมูลจาก{{หน่วยงาน}}<br>
    อัปเดตล่าสุด: <span class="source-note-time"></span>
  </p>
</div>
```

The date script is already included in the page shell (Step 1) — no extra work needed. See **§ 6.18** for full rules.

### Step 7 — Register the new page

Add a card entry to the appropriate section in `components.html` (for component demos) or link from the navigation flow for app pages.

---

## 11. Creating a New Component Demo Page

Component demo pages live in `components/` and follow this stricter template:

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ชื่อ Component — Components</title>
  <meta name="description" content="ตัวอย่าง [Component] — คำอธิบายสั้น">
  <meta name="author" content="สำนักงานพัฒนารัฐบาลดิจิทัล (องค์การมหาชน)">
  <link rel="icon" type="image/x-icon" href="../favicon/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="../favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="../favicon/favicon-16x16.png">
  <link rel="stylesheet" href="../styles.css">
</head>
<body>
  <div class="app-container">
    <div class="main-layout">
      <main>

        <div class="page-header">
          <a href="../components.html" class="btn-back-circle" title="ย้อนกลับ">
            <span class="material-symbols-outlined">arrow_back</span>
          </a>
          <div class="title-block">
            <h2 class="text-header">Component Name</h2>
            <p class="text-subheader">คำอธิบาย component</p>
          </div>
        </div>

        <div class="components-layout">

          <!-- Each variant in its own .card -->
          <div class="card">
            <div class="section-title-container">
              <div class="section-bar"></div>
              <h3 class="section-title">Variant Name</h3>
            </div>
            <div class="components-section">
              <!-- live demo -->
            </div>
          </div>

          <!-- Usage code card — always last -->
          <div class="card">
            <div class="section-title-container">
              <div class="section-bar"></div>
              <h3 class="section-title">วิธีใช้งาน</h3>
            </div>
            <div class="components-section">
              <div class="form-group">
                <p class="form-label">HTML</p>
                <pre class="code-block">&lt;!-- example code --&gt;</pre>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
</body>
</html>
```

After creating the file, add a card to the Components grid in `components.html`.

---

## 12. Adding New Styles

1. Open `styles.scss` — never `styles.css`
2. Find the relevant component section (search by component name comment)
3. Use existing design tokens only
4. Run `npm run sass:build` to compile
5. Verify in the browser at 375px width first

**SCSS nesting is supported:**

```scss
.my-component {
  background: var(--background-neutral-lighter);
  border-radius: var(--radius-xl);

  &__title {
    font-size: var(--font-size-title-m);
    font-weight: var(--font-weight-600);
  }

  &--active {
    border-color: var(--stroke-primary-default);
  }
}
```

---

## 13. Navigation Flow

```
loading.html
    └─► index.html  (main dashboard)
            ├─► detail.html    (tap a ticket card)
            │       └─► index.html (back)
            └─► points.html    (tap score panel / "ดูประวัติ")
                    └─► index.html (back)

med-index.html  (linked from index or menu)
    ├─► med-detail.html  (tap a cert card)
    │       └─► med-index.html (back)
    └─► tutorial.html  ("วิธีขอใบรับรองแพทย์" sticky footer button)

components.html  (dev hub — card grid)
    └─► components/*.html  (each has a back link → components.html)
```

---

## 14. Do's and Don'ts

### Do

- Use `.app-container > .main-layout > main` for every page
- Use design tokens for all color, spacing, radius, and typography values
- Use `.card` as the primary content block container
- Use `.btn.btn-primary` / `.btn.btn-secondary` / `.btn.btn-destructive` for all buttons
- Use `ThaiAlert` instead of native `alert()` / `confirm()`
- Add `data-label` to all table `<td>` elements for mobile responsiveness
- Use `material-symbols-outlined` for all icons
- Compile SCSS after every style change (`npm run sass:build`)
- Test at 375px width first — mobile-first

### Don't

- Edit `styles.css` directly — it is overwritten on every compile
- Use hardcoded hex colors in inline styles or new SCSS
- Use native `alert()`, `confirm()`, or `prompt()` — use `ThaiAlert` instead
- Skip the `.app-container > .main-layout` wrapper — layout will break
- Add external CSS libraries or JS frameworks — this project is intentionally vanilla
- Add `max-width` to `.app-container` — `main` already handles the desktop constraint
- Create files with spaces in the name

---

## 15. Quick Reference — Common Patterns

### Show / hide an element

```js
el.style.display = 'none';   // hide
el.style.display = 'block';  // show
el.style.display = 'flex';   // show as flex row
```

### Render a list dynamically

```js
const container = document.getElementById('list-content');
container.innerHTML = items.map(item =>
  `<a href="detail.html" class="list-item">
    <div class="list-icon health">
      <span class="material-symbols-outlined">ecg_heart</span>
    </div>
    <div class="list-body">
      <p class="list-title">${item.title}</p>
    </div>
    <span class="material-symbols-outlined chevron">chevron_right</span>
  </a>`
).join('');
```

### Toggle active filter chip

```js
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.classList.toggle('active', chip.dataset.filter === activeFilter);
});
```

### Swap skeleton ↔ loaded content

```html
<div id="view-skeleton"> <!-- skeleton placeholders --> </div>
<div id="view-loaded" style="display:none"> <!-- real content --> </div>
```

```js
function setLoaded(isLoaded) {
  document.getElementById('view-skeleton').style.display = isLoaded ? 'none' : 'flex';
  document.getElementById('view-loaded').style.display  = isLoaded ? 'flex' : 'none';
}
// After fetch:
fetchData().then(data => { render(data); setLoaded(true); });
```

### Auto-fill responsive card grid

```html
<div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:var(--spacing-lg)">
  <div class="card">...</div>
  <div class="card">...</div>
</div>
```

### Empty state when list is empty

```js
if (items.length === 0) {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">
        <span class="material-symbols-outlined" style="font-size:28px">search</span>
      </div>
      <p class="empty-title">ไม่พบข้อมูล</p>
      <p class="empty-desc">ยังไม่มีรายการในขณะนี้</p>
    </div>`;
  return;
}
```
