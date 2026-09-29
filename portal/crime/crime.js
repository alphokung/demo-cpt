/* ============================================================
   Crime Portal — shared helpers (ใช้ร่วมทุกหน้าใน portal/crime)
   ============================================================ */
(function () {
  var C = window.CRIME;
  var MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
                'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  var MONTHS_S = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

  // "วันนี้" ของ prototype — ตรึงไว้เพื่อให้สถานะใบสั่ง / นับวัน คงที่ทุกครั้งที่เปิด
  var TODAY = new Date('2026-09-29T09:00:00');

  function parse(iso) { return iso instanceof Date ? iso : new Date(iso.length === 10 ? iso + 'T00:00:00' : iso); }

  var CASE_TYPES = {
    criminal: { label: 'คดีอาญา', icon: 'gavel', tone: 'danger', page: 'cases.html#criminal' },
    traffic:  { label: 'คดีจราจร', icon: 'car_crash', tone: 'warning', page: 'cases.html#traffic' },
    online:   { label: 'คดีออนไลน์', icon: 'phishing', tone: 'info', page: 'cases.html#online' }
  };

  var CP = {
    today: TODAY,
    caseTypes: CASE_TYPES,

    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    },

    /** 12 กันยายน 2569 */
    dateLong: function (iso) { var d = parse(iso); return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + (d.getFullYear() + 543); },
    /** 12 ก.ย. 2569 */
    dateShort: function (iso) { var d = parse(iso); return d.getDate() + ' ' + MONTHS_S[d.getMonth()] + ' ' + (d.getFullYear() + 543); },
    /** 09:40 น. */
    time: function (iso) { var d = parse(iso); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ' น.'; },
    dateParts: function (iso) { var d = parse(iso); return { day: d.getDate(), mon: MONTHS_S[d.getMonth()], yr: d.getFullYear() + 543 }; },
    daysUntil: function (iso) { return Math.ceil((parse(iso) - TODAY) / 86400000); },

    /** 1,000 บาท */
    money: function (n) { return Number(n).toLocaleString('th-TH') + ' บาท'; },

    qs: function (name) { return new URLSearchParams(location.search).get(name); },

    /** ตัดทุกอย่างที่ไม่ใช่ตัวเลข — ใช้เทียบเบอร์โทร / เลขบัญชี / เลขบัตร */
    digits: function (s) { return String(s || '').replace(/\D/g, ''); },

    /** ข้อความสำหรับค้นหา: ตัวพิมพ์เล็ก ไม่มีช่องว่าง */
    norm: function (s) { return String(s || '').toLowerCase().replace(/\s+/g, ''); },

    /* ─── ใบสั่งจราจร ─── */
    ticketStatus: function (t) {
      if (t.status === 'paid') return { key: 'paid', label: 'ชำระแล้ว', tag: 'tag--success', tone: 'positive' };
      var d = CP.daysUntil(t.due);
      if (d < 0) return { key: 'overdue', label: 'เกินกำหนดชำระ', tag: 'tag--danger', tone: 'danger', days: d };
      return { key: 'unpaid', label: 'รอชำระ', tag: 'tag--warning', tone: 'warning', days: d };
    },
    unpaidTickets: function () { return C.tickets.filter(function (t) { return t.status !== 'paid'; }); },

    /* ─── คดี ─── */
    stagesOf: function (c) { return C.stages[c.type]; },
    isClosed: function (c) { return c.stage >= CP.stagesOf(c).length - 1; },
    caseStatus: function (c) {
      var st = CP.stagesOf(c);
      return CP.isClosed(c)
        ? { label: st[c.stage], tag: 'tag--success' }
        : { label: st[c.stage], tag: 'tag--info' };
    },

    /** แถบขั้นตอนคดี (stepper) */
    stepper: function (c, compact) {
      var st = CP.stagesOf(c);
      return '<ol class="cp-steps' + (compact ? ' cp-steps--compact' : '') + '" aria-label="ขั้นตอนคดี">' + st.map(function (s, i) {
        var cls = i < c.stage || CP.isClosed(c) ? 'is-done' : i === c.stage ? 'is-current' : '';
        return '<li class="cp-step ' + cls + '"' + (i === c.stage ? ' aria-current="step"' : '') + '>' +
          '<span class="cp-step-dot">' + (cls === 'is-done' ? '<span class="material-symbols-outlined">check</span>' : (i + 1)) + '</span>' +
          '<span class="cp-step-label">' + CP.esc(s) + '</span></li>';
      }).join('') + '</ol>';
    },

    /** แถวสรุปคดี ใช้ทั้งหน้า hub และหน้ารายการ */
    caseRow: function (c) {
      var t = CASE_TYPES[c.type], st = CP.caseStatus(c), e = CP.esc;
      return '<a class="hp-visit cp-case" href="case.html?id=' + c.id + '">' +
        '<span class="hp-icon tone-' + t.tone + '"><span class="material-symbols-outlined">' + t.icon + '</span></span>' +
        '<div class="hp-visit-body">' +
          '<div class="hp-row" style="gap:var(--spacing-xs)"><span class="tag ' + st.tag + ' tag--sm tag--dot">' + e(st.label) + '</span>' +
            '<span class="tag tag--sm">' + e(t.label) + '</span><span class="tag tag--sm">' + e(c.role) + '</span></div>' +
          '<span class="hp-visit-title">' + e(c.title) + '</span>' +
          '<span class="hp-visit-sub">' + e(c.caseNo) + ' · ' + e(c.station) + '</span>' +
          '<div class="cp-progress" aria-hidden="true"><span style="width:' + Math.round(c.stage / (CP.stagesOf(c).length - 1) * 100) + '%"></span></div>' +
        '</div>' +
        '<span class="material-symbols-outlined chevron">chevron_right</span></a>';
    },

    /* ─── คู่มือเตรียมตัว ─── */
    tagInfo: function (key) { return C.guideTags.filter(function (t) { return t.key === key; })[0]; },
    guideTagsHtml: function (g) {
      return g.tags.map(function (k) {
        var t = CP.tagInfo(k);
        return '<span class="tag ' + t.tag + ' tag--sm"><span class="material-symbols-outlined">' + t.icon + '</span>' + t.label + '</span>';
      }).join('');
    },
    searchGuides: function (q, tag) {
      var nq = CP.norm(q);
      return C.guides.filter(function (g) {
        if (tag && g.tags.indexOf(tag) < 0) return false;
        if (!nq) return true;
        var hay = [g.title, g.summary, g.keywords, g.highlight || '']
          .concat(g.tags.map(function (k) { return CP.tagInfo(k).label; }))
          .concat(g.steps.map(function (s) { return s.title + s.desc; }))
          .concat(g.documents).join(' ');
        return CP.norm(hay).indexOf(nq) >= 0;
      });
    },

    /** ปุ่มโทร */
    callBtn: function (h, cls) {
      return '<a class="cp-call ' + (cls || '') + '" href="tel:' + h.number + '">' +
        '<span class="material-symbols-outlined">call</span><span><strong>' + CP.esc(h.display || h.number) + '</strong>' +
        '<small>' + CP.esc(h.label) + '</small></span></a>';
    },

    sectionTitle: function (title, color) {
      return '<div class="section-title-container"><div class="section-bar" style="background-color:' +
        (color || 'var(--primary-40)') + '"></div><h3 class="section-title">' + title + '</h3></div>';
    },

    detailsItem: function (label, value, cls) {
      return '<div class="details-item"><span class="details-label">' + label + '</span>' +
        '<span class="details-value' + (cls ? ' ' + cls : '') + '">' + value + '</span></div>';
    },

    /* ─── Tabs / accordion (same behaviour as components/tabs.html, components/accordion.html) ─── */
    switchTab: function (tabsId, panelId, btn) {
      var tabs = document.getElementById(tabsId);
      tabs.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
      tabs.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById(panelId).classList.add('active');
      try { history.replaceState(null, '', location.search + '#' + panelId.replace(/^panel-/, '')); } catch (e) {}
    },
    toggleAccordion: function (header) {
      var item = header.closest('.accordion-item');
      var body = item.querySelector('.accordion-body');
      if (item.classList.contains('open')) { item.classList.remove('open'); body.style.maxHeight = null; }
      else { item.classList.add('open'); body.style.maxHeight = body.scrollHeight + 'px'; }
    },

    /* ─── Welcome card (same look as dashboard ctx-card) ─── */
    welcome: function (title, sub) {
      var name = C.user.fullName.replace(/^(นางสาว|นาย|นาง)/, '');
      return '<div class="ctx-card hp-welcome">' +
        '<div class="ctx-card__deco ctx-card__deco--top"></div><div class="ctx-card__deco ctx-card__deco--bottom"></div>' +
        '<div class="ctx-card__greeting mb-0">' +
          '<p class="ctx-card__greeting-label">สวัสดี คุณ' + CP.esc(name) + '</p>' +
          '<p class="ctx-card__greeting-name">' + CP.esc(title) + '</p>' +
          (sub ? '<div class="hp-welcome-sub">' + CP.esc(sub) + '</div>' : '') +
        '</div></div>';
    },
    mountWelcome: function (title, sub) {
      document.querySelector('.hp-main').insertAdjacentHTML('afterbegin', CP.welcome(title, sub));
    },

    /* ─── Toast (same markup as components/toast.html) ─── */
    toast: function (message, type, icon) {
      var c = document.getElementById('toast-container');
      if (!c) { c = document.createElement('div'); c.id = 'toast-container'; c.className = 'toast-container'; document.body.appendChild(c); }
      var el = document.createElement('div');
      el.className = 'toast' + (type && type !== 'default' ? ' toast--' + type : '');
      el.innerHTML = '<span class="material-symbols-outlined">' + (icon || 'notifications') + '</span>' +
        '<span class="toast__message">' + CP.esc(message) + '</span>' +
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

    service: function (key) { return C.services.filter(function (s) { return s.key === key; })[0]; },

    /** เปิดบริการภายนอก — ยืนยันก่อนออกจากทางรัฐ */
    openExternal: function (svc) {
      if (typeof svc === 'string') svc = CP.service(svc);
      var go = function () { window.open(svc.url, '_blank', 'noopener'); };
      if (!window.ThaiAlert) return go();
      ThaiAlert.confirm({
        title: 'กำลังออกจากทางรัฐ',
        message: 'ระบบจะเปิดเว็บไซต์ "' + svc.name + '" ของ' + svc.agency + ' ในแท็บใหม่ ต้องการดำเนินการต่อหรือไม่',
        type: 'info', confirmText: 'ไปที่เว็บไซต์', cancelText: 'ยกเลิก'
      }).then(function (ok) { if (ok) go(); });
    }
  };

  window.CP = CP;
  window.switchTab = CP.switchTab;
  window.toggleAccordion = CP.toggleAccordion;

  /* ─── Page chrome: back-to-top + source-note time + #hash tab + [data-ext] links ─── */
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.getElementById('back-to-top');
    if (b) window.addEventListener('scroll', function () { b.classList.toggle('visible', window.pageYOffset > 240); }, { passive: true });

    var now = new Date();
    var s = CP.dateLong(now) + ' เวลา ' + CP.time(now);
    document.querySelectorAll('.source-note-time').forEach(function (e) { e.textContent = s; });

    var hash = location.hash.replace('#', '');
    if (hash) {
      var btn = document.querySelector('.tab-btn[data-panel="panel-' + hash + '"]');
      if (btn) btn.click();
    }

    document.addEventListener('click', function (ev) {
      var a = ev.target.closest('[data-ext]');
      if (!a) return;
      ev.preventDefault();
      CP.openExternal(a.dataset.ext);
    });
  });
})();
