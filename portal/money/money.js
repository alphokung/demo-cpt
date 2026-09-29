/* ============================================================
   Money Portal — shared helpers (ใช้ร่วมทุกหน้าใน portal/money)
   ============================================================ */
(function () {
  var M = window.MONEY;
  var MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
                'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  var MONTHS_S = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

  // "วันนี้" ของ prototype — ตรึงไว้เพื่อให้สถานะค้างชำระ/ครบกำหนดคงที่ทุกครั้งที่เปิด
  var NOW = new Date('2026-09-29T09:00:00');

  function parse(iso) { return iso instanceof Date ? iso : new Date(iso.length === 7 ? iso + '-01T00:00:00' : iso.length === 10 ? iso + 'T00:00:00' : iso); }
  function byKey(list, key) { return list.filter(function (x) { return x.key === key; })[0]; }
  function days(iso) { var d = parse(iso); return Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate())) / 86400000); }

  var MP = {
    now: NOW,

    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    },

    dateLong: function (iso) { var d = parse(iso); return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + (d.getFullYear() + 543); },
    dateShort: function (iso) { var d = parse(iso); return d.getDate() + ' ' + MONTHS_S[d.getMonth()] + ' ' + (d.getFullYear() + 543); },
    time: function (iso) { var d = parse(iso); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ' น.'; },
    monthLong: function (iso) { var d = parse(iso); return MONTHS[d.getMonth()] + ' ' + (d.getFullYear() + 543); },
    monthShort: function (iso) { var d = parse(iso); return MONTHS_S[d.getMonth()] + ' ' + String(d.getFullYear() + 543).slice(2); },
    be: function (year) { return year + 543; },
    days: days,

    /** 1,234.50 บาท — ทศนิยมเฉพาะเมื่อมีสตางค์ */
    money: function (n, unit) {
      var s = Number(n).toLocaleString('th-TH', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
      return s + (unit === false ? '' : ' บาท');
    },
    num: function (n) { return Number(n).toLocaleString('th-TH'); },
    qs: function (name) { return new URLSearchParams(location.search).get(name); },

    property: function (key) { return byKey(M.properties, key); },
    meter: function (key) { return byKey(M.meters, key); },
    donationType: function (key) { return byKey(M.donationTypes, key); },
    service: function (key) { return byKey(M.services, key); },

    /* ─── ค่าน้ำ ค่าไฟ ─── */
    kind: function (k) {
      return k === 'electric'
        ? { label: 'ค่าไฟฟ้า', icon: 'bolt', tone: 'warning' }
        : { label: 'ค่าน้ำประปา', icon: 'water_drop', tone: 'info' };
    },
    currentBill: function (m) { return m.bills[m.bills.length - 1]; },
    usage: function (b) { return b.curr - b.prev; },
    billStatus: function (b) {
      if (b.paidAt) {
        var late = days(b.paidAt) > days(b.due);
        return { key: 'paid', label: late ? 'ชำระแล้ว (ล่าช้า)' : 'ชำระแล้ว', tag: late ? 'tag--warning' : 'tag--success', tone: 'positive' };
      }
      var d = days(b.due);
      if (d < 0) return { key: 'overdue', label: 'เลยกำหนด ' + (-d) + ' วัน', tag: 'tag--danger', tone: 'danger', days: d };
      if (d === 0) return { key: 'due', label: 'ครบกำหนดวันนี้', tag: 'tag--warning', tone: 'warning', days: d };
      return { key: 'due', label: 'ครบกำหนดในอีก ' + d + ' วัน', tag: d <= 7 ? 'tag--warning' : 'tag--info', tone: 'warning', days: d };
    },
    unpaidBills: function () {
      return M.meters.map(function (m) { return { meter: m, bill: MP.currentBill(m) }; })
        .filter(function (x) { return !x.bill.paidAt; });
    },

    /* ─── ใบสั่ง (อ่านจาก Crime Portal) ─── */
    unpaidTickets: function () {
      return (window.CRIME ? CRIME.tickets : []).filter(function (t) { return t.status !== 'paid'; });
    },

    /* ─── ภาษีที่ดิน ─── */
    landTaxTotal: function (t) { return t.tax + (t.penalty || 0) + (t.surcharge || 0); },
    landTaxStatus: function (t) {
      return {
        paid:    { label: 'ชำระแล้ว',     tag: 'tag--success', tone: 'positive' },
        exempt:  { label: 'ได้รับยกเว้น',  tag: 'tag--info',    tone: 'info' },
        overdue: { label: 'ค้างชำระ',      tag: 'tag--danger',  tone: 'danger' },
        unpaid:  { label: 'รอชำระ',        tag: 'tag--warning', tone: 'warning' }
      }[t.status];
    },
    landTaxDue: function () { return M.landTax.filter(function (t) { return t.status === 'overdue' || t.status === 'unpaid'; }); },

    /* ─── การบริจาค ─── */
    donationYears: function () {
      var y = NOW.getFullYear();
      return [y, y - 1, y - 2];          // ปีนี้ + ย้อนหลัง 2 ปี
    },
    donationsIn: function (year) {
      return M.donations.filter(function (d) { return parse(d.date).getFullYear() === year; })
        .sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    },
    /** ยอดที่นำไปลดหย่อนได้ (ก่อนคำนวณเพดาน 10% ของเงินได้) */
    deductible: function (d) {
      var t = MP.donationType(d.type);
      return t.deduct === 2 ? d.amount * 2 : d.amount;
    },
    deductLabel: function (t) { return t.deduct === 2 ? 'ลดหย่อนได้ 2 เท่า' : t.deduct === 'party' ? 'ลดหย่อนได้ไม่เกิน 10,000 บาท' : 'ลดหย่อนได้ตามจริง'; },

    /* ─── ส่วนประกอบ UI ─── */
    detailsItem: function (label, value, cls) {
      return '<div class="details-item"><span class="details-label">' + label + '</span><span class="details-value' + (cls ? ' ' + cls : '') + '">' + value + '</span></div>';
    },

    welcome: function (title, sub) {
      var name = M.user.fullName.replace(/^(นางสาว|นาย|นาง)/, '');
      return '<div class="ctx-card hp-welcome">' +
        '<div class="ctx-card__deco ctx-card__deco--top"></div><div class="ctx-card__deco ctx-card__deco--bottom"></div>' +
        '<div class="ctx-card__greeting mb-0">' +
          '<p class="ctx-card__greeting-label">สวัสดี คุณ' + MP.esc(name) + '</p>' +
          '<p class="ctx-card__greeting-name">' + MP.esc(title) + '</p>' +
          (sub ? '<div class="hp-welcome-sub">' + MP.esc(sub) + '</div>' : '') +
        '</div></div>';
    },
    mountWelcome: function (title, sub) {
      document.querySelector('.hp-main').insertAdjacentHTML('afterbegin', MP.welcome(title, sub));
    },

    toggleAccordion: function (header) {
      var item = header.closest('.accordion-item');
      var body = item.querySelector('.accordion-body');
      var open = !item.classList.contains('open');
      item.classList.toggle('open', open);
      header.setAttribute('aria-expanded', open);
      body.style.maxHeight = open ? body.scrollHeight + 'px' : null;
    },

    /**
     * กราฟแท่งการใช้งานรายเดือน (ซีรีส์เดียว) — แท่งล่าสุดเน้นสี, hover/focus แสดง tooltip
     * rows: [{ label, value, sub, current }]
     */
    barChart: function (rows, unit) {
      var max = Math.max.apply(null, rows.map(function (r) { return r.value; })) || 1;
      return '<div class="mp-chart" role="img" aria-label="' + MP.esc('ปริมาณการใช้ย้อนหลัง ' + rows.length + ' เดือน') + '">' +
        rows.map(function (r) {
          var h = Math.max(4, Math.round(r.value / max * 100));
          var tip = r.label + ': ' + MP.num(r.value) + ' ' + unit + (r.sub ? ' · ' + r.sub : '');
          return '<div class="mp-bar' + (r.current ? ' is-current' : '') + '" tabindex="0" aria-label="' + MP.esc(tip) + '">' +
            '<span class="mp-bar-tip" role="tooltip">' + MP.esc(tip) + '</span>' +
            '<span class="mp-bar-val">' + MP.num(r.value) + '</span>' +
            '<span class="mp-bar-track"><span class="mp-bar-fill" style="height:' + h + '%"></span></span>' +
            '<span class="mp-bar-label">' + MP.esc(r.label) + '</span>' +
          '</div>';
        }).join('') + '</div>';
    },

    /* ─── Toast (same markup as components/toast.html) ─── */
    toast: function (message, type, icon) {
      var c = document.getElementById('toast-container');
      if (!c) { c = document.createElement('div'); c.id = 'toast-container'; c.className = 'toast-container'; document.body.appendChild(c); }
      var el = document.createElement('div');
      el.className = 'toast' + (type && type !== 'default' ? ' toast--' + type : '');
      el.innerHTML = '<span class="material-symbols-outlined">' + (icon || 'notifications') + '</span>' +
        '<span class="toast__message">' + MP.esc(message) + '</span>' +
        '<button class="toast__close" aria-label="ปิด"><span class="material-symbols-outlined">close</span></button>';
      function dismiss() {
        if (el.classList.contains('toast-exit')) return;
        el.classList.add('toast-exit');
        el.addEventListener('animationend', function () { el.remove(); }, { once: true });
      }
      el.querySelector('.toast__close').onclick = dismiss;
      c.appendChild(el);
      setTimeout(dismiss, 3200);
    },

    /** เปิดบริการภายนอก — ยืนยันก่อนออกจากทางรัฐ */
    openExternal: function (svc) {
      if (typeof svc === 'string') svc = MP.service(svc);
      var go = function () { window.open(svc.url, '_blank', 'noopener'); };
      if (typeof ThaiAlert === 'undefined') return go();
      ThaiAlert.confirm({
        title: 'กำลังออกจากทางรัฐ',
        message: 'ระบบจะเปิดเว็บไซต์ "' + MP.esc(svc.name) + '" ของ' + MP.esc(svc.agency) + ' ในแท็บใหม่ ต้องการดำเนินการต่อหรือไม่',
        type: 'info', confirmText: 'ไปที่เว็บไซต์', cancelText: 'ยกเลิก'
      }).then(function (ok) { if (ok) go(); });
    },

    /** จำลองการชำระผ่านพร้อมเพย์ในทางรัฐ (prototype — ไม่ได้ตัดเงินจริง) */
    pay: function (title, amount) {
      if (typeof ThaiAlert === 'undefined') return;
      ThaiAlert.confirm({
        title: 'ชำระ ' + MP.money(amount),
        message: MP.esc(title) + ' — ระบบจะสร้าง QR พร้อมเพย์สำหรับชำระเงิน (ตัวอย่างสาธิต — ไม่มีการตัดเงินจริง)',
        type: 'info', confirmText: 'สร้าง QR ชำระเงิน', cancelText: 'ยกเลิก'
      }).then(function (ok) { if (ok) MP.toast('สร้าง QR สำหรับ ' + title + ' แล้ว (ตัวอย่าง)', 'success', 'qr_code_2'); });
    }
  };

  window.MP = MP;
  window.toggleAccordion = MP.toggleAccordion;

  /* ─── Page chrome: back-to-top + source-note time + [data-ext] / [data-pay] ─── */
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.getElementById('back-to-top');
    if (b) window.addEventListener('scroll', function () { b.classList.toggle('visible', window.pageYOffset > 240); }, { passive: true });
    var now = new Date(), s = MP.dateLong(now) + ' เวลา ' + MP.time(now);
    document.querySelectorAll('.source-note-time').forEach(function (e) { e.textContent = s; });

    document.addEventListener('click', function (ev) {
      var a = ev.target.closest('[data-ext]');
      if (a) { ev.preventDefault(); MP.openExternal(a.dataset.ext); return; }
      var p = ev.target.closest('[data-pay]');
      if (p) { ev.preventDefault(); ev.stopPropagation(); MP.pay(p.dataset.pay, Number(p.dataset.amount)); }
    });
  });
})();
