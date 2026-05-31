# SKILL.md — How to Create a New Page

> Step-by-step recipe for building a new HTML page in the ทางรัฐ design system.  
> Read `DESIGN.md` for the full component reference and token catalogue.

---

## 1. Copy the Page Shell

Start from this boilerplate. Replace `TITLE` with your page name.

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TITLE — ทางรัฐ</title>
  <meta name="description" content="ติดต่อรัฐง่ายแค่ปลายนิ้ว, ทางลัดถึงรัฐ ช่องทางเดียว ง่าย จบ ครบทุกช่วงวัย">
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

      <!-- STEP 2: Top Nav Bar goes here -->

      <main>

        <!-- STEP 3: Welcome Card (data pages only) -->
        <!-- STEP 4: Content cards -->
        <!-- STEP 5: Source note (data pages only) -->

      </main>
    </div>
  </div>

  <!-- STEP 6: Back-to-top FAB -->
  <button class="back-to-top" id="back-to-top" aria-label="กลับขึ้นด้านบน"
          onclick="window.scrollTo({top:0,behavior:'smooth'})">
    <span class="material-symbols-outlined">arrow_upward</span>
  </button>

  <!-- STEP 7: Scripts -->
  <script>
    (function(){
      var b=document.getElementById('back-to-top');
      window.addEventListener('scroll',function(){
        b.classList.toggle('visible',window.pageYOffset>240);
      },{passive:true});
    })();
  </script>
  <script>
    (function() {
      var m=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
             'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
      var d=new Date();
      var s=d.getDate()+' '+m[d.getMonth()]+' '+(d.getFullYear()+543)+
            ' เวลา '+String(d.getHours()).padStart(2,'0')+':'+
            String(d.getMinutes()).padStart(2,'0')+' น.';
      document.querySelectorAll('.source-note-time').forEach(function(e){e.textContent=s;});
    })();
  </script>
</body>
</html>
```

---

## 2. Add the Top Nav Bar

Place this **inside `.main-layout`, before `<main>`**. It spans 100% of the viewport width; the inner `.top-nav-bar-content` aligns with the page content.

### Without back button

```html
<div class="top-nav-bar">
  <div class="top-nav-bar-content">
    <div class="top-nav-bar-icon">
      <span class="material-symbols-outlined">ICON</span>
    </div>
    <p class="top-nav-bar-title">ชื่อหน้า</p>
  </div>
</div>
```

### With back button (detail / sub-pages)

```html
<div class="top-nav-bar">
  <div class="top-nav-bar-content">
    <a href="parent.html" class="btn-back-circle" title="ย้อนกลับ">
      <span class="material-symbols-outlined">arrow_back</span>
    </a>
    <div class="top-nav-bar-icon">
      <span class="material-symbols-outlined">ICON</span>
    </div>
    <p class="top-nav-bar-title">ชื่อหน้า</p>
  </div>
</div>
```

### Icon reference

| Page subject | Icon |
|---|---|
| Traffic / police | `local_police` |
| Document / ID | `badge` |
| Vehicle | `directions_car` |
| Medical | `medical_information` |
| Electricity | `bolt` |
| Pension / fund | `account_balance` |
| Credit / finance | `credit_score` |
| Disability welfare | `accessible` |
| Elderly welfare | `accessible` |
| Driving score | `speed` |
| Personal dashboard | `person` |
| QA / checklist | `fact_check` |
| Qualifications | `workspace_premium` |
| Edge cases / warning | `warning` |
| Design system | `design_services` |

---

## 3. Add the Welcome Card (data pages only)

Pages that show personal government data get a green welcome card as the **first element inside `<main>`**.

```html
<div class="card welcome-card welcome-card--green mb-xl">
  <h2>สวัสดีคุณสมชาย</h2>
  <p>เลขประจำตัวประชาชน 1-1002-00345-67-8</p>
  <p>{{หน่วยงาน หรือ บริบทของหน้า}}</p>
</div>
```

**Rules:**
- Greeting: `สวัสดีคุณ{ชื่อ}` — no title prefix (นาย/นาง)
- Line 1: reference number (ID / member number)
- Line 2: agency name or short context
- Always use `welcome-card--green`

---

## 4. Add Content Cards

Use `.card` as the primary content block. Each section inside a card gets a coloured section bar.

### Basic card with section title

```html
<div class="card mb-xl">
  <div class="section-title-container">
    <div class="section-bar" style="background-color: var(--primary-40);"></div>
    <h3 class="section-title">ชื่อหัวข้อ</h3>
  </div>

  <!-- details-list for label/value pairs -->
  <div class="details-list">
    <div class="details-item">
      <span class="details-label">ชื่อฟิลด์</span>
      <span class="details-value">ข้อมูล</span>
    </div>
    <div class="details-item">
      <span class="details-label">ฟิลด์สอง</span>
      <span class="details-value">ข้อมูล</span>
      <span class="details-subvalue">ข้อมูลย่อย</span>
    </div>
  </div>
</div>
```

### Section bar colours

| Use | Token |
|---|---|
| Primary action | `var(--primary-40)` |
| Secondary / blue | `var(--secondary-40-main)` |
| Warning | `var(--warning-40)` |
| Danger / expired | `var(--danger-40)` |
| Info / blue | `var(--info-40)` |
| Neutral / misc | `var(--neutral-70)` |

### Coloured details-value

```html
<span class="details-value details-value-paid">ชำระแล้ว</span>      <!-- green -->
<span class="details-value details-value-warning">ค้างชำระ</span>    <!-- red -->
```

### Card with action button

```html
<div class="card mb-xl">
  <!-- ... section content ... -->
  <button class="btn btn-primary" onclick="...">
    <span class="material-symbols-outlined">ICON</span>
    ดำเนินการ
  </button>
</div>
```

### Responsive table

```html
<div class="data-table-wrap">
  <table class="data-table">
    <thead>
      <tr><th>คอลัมน์ 1</th><th>คอลัมน์ 2</th></tr>
    </thead>
    <tbody>
      <tr>
        <td data-label="คอลัมน์ 1">ข้อมูล</td>
        <td data-label="คอลัมน์ 2">ข้อมูล</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Legal / warning notice inside a card

```html
<div style="background: var(--background-warning-lighter); border-radius: var(--radius-lg); padding: var(--spacing-lg);">
  <p style="font-size: var(--font-size-body-s); color: var(--foreground-neutral-default); line-height: 1.7; margin: 0;">
    ข้อความแจ้งเตือนหรือข้อกฎหมาย...
  </p>
</div>
```

---

## 5. Add the Source Note (data pages only)

Must be the **last element inside `<main>`**.

```html
<div class="source-note">
  <p class="source-note-text">
    <span class="material-symbols-outlined source-note-icon">verified</span>
    ข้อมูลจาก{{หน่วยงาน}}<br>
    อัปเดตล่าสุด: <span class="source-note-time"></span>
  </p>
</div>
```

The `.source-note-time` span is filled automatically by the date script included in the shell (Step 1).

---

## 6. Back-to-Top FAB

Already in the shell template. If the page has a **sticky footer**, use the raised variant:

```html
<!-- Standard (no sticky footer) -->
<button class="back-to-top" id="back-to-top" ...>

<!-- Raised (page has sticky footer) -->
<button class="back-to-top back-to-top--raised" id="back-to-top" ...>
```

---

## 7. Optional: Sticky Footer

For pages with a primary action that must always be visible:

```html
<!-- Place outside <main>, inside .main-layout -->
<div class="sticky-footer">
  <button class="btn btn-primary">ดำเนินการหลัก</button>
</div>
```

Multiple buttons:

```html
<div class="sticky-footer">
  <div class="footer-row">
    <button class="btn btn-tertiary-outline flex-center" style="gap:var(--spacing-md)">
      <span class="material-symbols-outlined" style="font-size:20px">icon</span>
      รายละเอียด
    </button>
  </div>
</div>
```

---

## 8. List-Item Cards (dashboard pattern)

When the page is a list of items (documents, bills, assets), use the passport-style hierarchy inside each `.list-item`:

```html
<a href="detail.html" class="list-item loaded-item" style="display:none;">
  <!-- Optional corner badge -->
  <span class="list-badge valid list-badge--corner">ใช้งานได้</span>

  <!-- Icon box -->
  <div class="list-icon driving">
    <span class="material-symbols-outlined">directions_car</span>
  </div>

  <!-- Text content — passport hierarchy -->
  <div class="list-body">
    <p class="list-item-label">ประเภทเอกสาร</p>          <!-- small, muted -->
    <p class="list-item-hero">A1234567</p>                <!-- bold hero number -->
    <div class="list-meta">
      <div class="list-meta-item">
        <span class="material-symbols-outlined list-meta-icon">calendar_today</span>
        <span>หมดอายุ: 27 มิ.ย. 2569</span>
      </div>
      <!-- ข้อมูล ณ วันที่ must always be last -->
      <div class="list-meta-item">
        <span class="material-symbols-outlined list-meta-icon">update</span>
        <span>ข้อมูล ณ 29 พ.ค. 2569</span>
      </div>
    </div>
  </div>

  <span class="material-symbols-outlined chevron">chevron_right</span>
</a>
```

**Hero colour modifiers:**

```html
<p class="list-item-hero list-item-hero--positive">ใช้งานได้</p>   <!-- green -->
<p class="list-item-hero list-item-hero--negative">1,000.00 บาท</p> <!-- red -->
```

### Loading wrapper pattern

Wrap every list item in a `.loading-wrapper` to get auto-skeleton → loaded animation:

```html
<div class="loading-wrapper">
  <!-- Skeleton state -->
  <div class="list-item skeleton-item" style="pointer-events:none;">
    <span class="list-badge skeleton-loading list-badge--corner skeleton-badge-sm"></span>
    <div class="skeleton-loading skeleton-icon-md"></div>
    <div class="list-body skeleton-body-gap">
      <div class="skeleton-loading skeleton-text medium" style="margin-bottom:0;"></div>
      <div class="skeleton-loading skeleton-text short" style="margin-bottom:0;height:12px;"></div>
    </div>
    <div class="skeleton-loading skeleton-circle skeleton-dot-sm"></div>
  </div>

  <!-- Loaded state (hidden until JS reveals it) -->
  <a href="detail.html" class="list-item loaded-item" style="display:none;">
    <!-- ... list item content ... -->
  </a>
</div>
```

Then add this JS to auto-reveal loaded states:

```js
function initLoading() {
  document.querySelectorAll('.loading-wrapper').forEach(wrapper => {
    const skeleton = wrapper.querySelector('.skeleton-item');
    const loaded   = wrapper.querySelector('.loaded-item');
    if (skeleton) skeleton.style.display = '';
    if (loaded)   loaded.style.display = 'none';
    setTimeout(() => {
      if (skeleton) skeleton.style.display = 'none';
      if (loaded)   loaded.style.display = '';
    }, 400 + Math.random() * 1600);
  });
}
window.addEventListener('pageshow', initLoading);
```

---

## 9. Status Banners

Place **inside `.main-layout` before `<main>`** (or inside `<main>` for non-sticky banners). Group multiple banners in one container:

```html
<div id="status-banners" style="display:none; flex-direction:column; gap:var(--spacing-sm); margin-bottom:var(--spacing-xl);">
  <div class="status-banner expiring">
    <span class="material-symbols-outlined">warning</span>
    <div class="status-banner-text">
      <p class="status-banner-title">หัวข้อการแจ้งเตือน</p>
      <p class="status-banner-subtitle">รายละเอียดเพิ่มเติม</p>
    </div>
  </div>
</div>
```

**Variants:** `.valid` · `.expiring` · `.expired`

Show the group after loading completes (works with loading-wrapper counter pattern above).

---

## 10. Edge-Case / System-State Screens

For maintenance, high-traffic, or error states, use the full-page card pattern:

```html
<div class="card mb-xl">
  <div class="section-title-container">
    <div class="section-bar" style="background-color: var(--warning-40);"></div>
    <h3 class="section-title">ปิดปรับปรุงระบบ</h3>
  </div>

  <div class="state-card">
    <div class="state-icon-wrap state-icon-wrap--warning">
      <span class="material-symbols-outlined anim-spin-slow">settings</span>
    </div>
    <h3 class="state-title">ปิดปรับปรุงระบบชั่วคราว</h3>
    <p class="state-desc">ขออภัยในความไม่สะดวก กรุณากลับมาใหม่ในภายหลัง</p>
    <button class="btn btn-secondary" style="max-width:240px;" onclick="window.history.back()">
      <span class="material-symbols-outlined">arrow_back</span>
      กลับหน้าก่อนหน้า
    </button>
  </div>
</div>
```

See `edge-cases.html` for all three variants (maintenance, timed maintenance, high traffic).

---

## 11. Register the New Page

After creating the file, add a card to `components.html`:

```html
<a href="your-page.html" class="comp-card" target="_blank" rel="noopener noreferrer">
  <div class="comp-card-icon" style="background:var(--background-primary-lighter);color:var(--foreground-primary-default)">
    <span class="material-symbols-outlined">ICON</span>
  </div>
  <p class="comp-card-title">ชื่อหน้า</p>
  <p class="comp-card-desc">คำอธิบายสั้น ๆ ว่าหน้านี้แสดงอะไร และมาจากหน่วยงานใด</p>
  <div class="comp-card-arrow">
    ดูหน้าจริง
    <span class="material-symbols-outlined">arrow_forward</span>
  </div>
</a>
```

---

## 12. Design Rules — Quick Reference

| Rule | What to do |
|---|---|
| Colors | Use `var(--foreground-*)` / `var(--background-*)` tokens — never hex |
| Spacing | Use `var(--spacing-*)` — never `px` values |
| Typography | Use `var(--font-size-*)` and `var(--font-weight-*)` |
| New CSS | Add to end of `styles.css`, not inline or in `<style>` blocks |
| Page-level CSS | OK for `@keyframes` animations only |
| Icons | `<span class="material-symbols-outlined">icon_name</span>` |
| `ข้อมูล ณ วันที่` | Always the last `list-meta-item` in every card |
| Source note | Always the last element inside `<main>` |
| Welcome card | Always first element inside `<main>` on data pages |
| Top nav bar | Always outside `<main>`, inside `.main-layout` |
| Back to top | All content pages get `.back-to-top` FAB |
| Sticky footer pages | Use `.back-to-top--raised` |

---

## 13. Complete Minimal Example

A simple one-card data page from scratch:

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ข้อมูลตัวอย่าง — ทางรัฐ</title>
  <meta name="description" content="ติดต่อรัฐง่ายแค่ปลายนิ้ว">
  <meta name="author" content="สำนักงานพัฒนารัฐบาลดิจิทัล (องค์การมหาชน)">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://thangrath.apps.go.th/th">
  <meta property="og:title" content="ทางรัฐ ติดต่อรัฐง่ายแค่ปลายนิ้ว">
  <meta property="og:description" content="ติดต่อรัฐง่ายแค่ปลายนิ้ว">
  <meta property="og:image" content="_media/og-image.png">
  <meta property="og:site_name" content="ทางรัฐ ติดต่อรัฐง่ายแค่ปลายนิ้ว">
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://thangrath.apps.go.th/th">
  <meta property="twitter:title" content="ทางรัฐ ติดต่อรัฐง่ายแค่ปลายนิ้ว">
  <meta property="twitter:description" content="ติดต่อรัฐง่ายแค่ปลายนิ้ว">
  <meta property="twitter:image" content="_media/og-image.png">
  <link rel="icon" type="image/x-icon" href="favicon/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="favicon/favicon-16x16.png">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="app-container">
    <div class="main-layout">

      <div class="top-nav-bar">
        <div class="top-nav-bar-content">
          <div class="top-nav-bar-icon">
            <span class="material-symbols-outlined">badge</span>
          </div>
          <p class="top-nav-bar-title">ข้อมูลตัวอย่าง</p>
        </div>
      </div>

      <main>

        <div class="card welcome-card welcome-card--green mb-xl">
          <h2>สวัสดีคุณสมชาย</h2>
          <p>เลขประจำตัวประชาชน 1-1002-00345-67-8</p>
          <p>หน่วยงานตัวอย่าง</p>
        </div>

        <div class="card mb-xl">
          <div class="section-title-container">
            <div class="section-bar" style="background-color: var(--primary-40);"></div>
            <h3 class="section-title">ข้อมูลหลัก</h3>
          </div>
          <div class="details-list">
            <div class="details-item">
              <span class="details-label">ฟิลด์ที่ 1</span>
              <span class="details-value">ข้อมูล</span>
            </div>
            <div class="details-item">
              <span class="details-label">ฟิลด์ที่ 2</span>
              <span class="details-value">ข้อมูล</span>
            </div>
          </div>
        </div>

        <div class="source-note">
          <p class="source-note-text">
            <span class="material-symbols-outlined source-note-icon">verified</span>
            ข้อมูลจากหน่วยงานตัวอย่าง<br>
            อัปเดตล่าสุด: <span class="source-note-time"></span>
          </p>
        </div>

      </main>
    </div>
  </div>

  <button class="back-to-top" id="back-to-top" aria-label="กลับขึ้นด้านบน"
          onclick="window.scrollTo({top:0,behavior:'smooth'})">
    <span class="material-symbols-outlined">arrow_upward</span>
  </button>

  <script>
    (function(){var b=document.getElementById('back-to-top');window.addEventListener('scroll',function(){b.classList.toggle('visible',window.pageYOffset>240);},{passive:true});})();
  </script>
  <script>
    (function() {
      var m=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
             'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
      var d=new Date();
      var s=d.getDate()+' '+m[d.getMonth()]+' '+(d.getFullYear()+543)+
            ' เวลา '+String(d.getHours()).padStart(2,'0')+':'+
            String(d.getMinutes()).padStart(2,'0')+' น.';
      document.querySelectorAll('.source-note-time').forEach(function(e){e.textContent=s;});
    })();
  </script>
</body>
</html>
```
