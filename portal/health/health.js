/* ============================================================
   Health Portal — shared helpers (ใช้ร่วมทุกหน้าใน portal/health)
   ============================================================ */
(function () {
  var H = window.HEALTH;
  var MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
                'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  var MONTHS_S = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

  // "วันนี้" ของ prototype — ตรึงไว้เพื่อให้สถานะใบรับรอง / อายุ คงที่ทุกครั้งที่เปิด
  var TODAY = new Date('2026-09-29T09:00:00');

  function parse(iso) { return iso instanceof Date ? iso : new Date(iso.length === 10 ? iso + 'T00:00:00' : iso); }

  var HP = {
    today: TODAY,

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

    age: function () {
      var b = parse(H.user.birthDate), a = TODAY.getFullYear() - b.getFullYear();
      if (TODAY < new Date(TODAY.getFullYear(), b.getMonth(), b.getDate())) a--;
      return a;
    },

    qs: function (name) { return new URLSearchParams(location.search).get(name); },

    /** สิทธิที่แสดง — ใช้สิทธิจริงเป็นค่าเริ่มต้น แต่เลือกดูตัวอย่างสิทธิอื่นได้ (เก็บใน localStorage) */
    currentRightKey: function () {
      try { var k = localStorage.getItem('hp.rightDemo'); if (k && H.rights.schemes[k]) return k; } catch (e) {}
      return H.rights.current;
    },
    setRightKey: function (k) { try { localStorage.setItem('hp.rightDemo', k); } catch (e) {} },
    currentRight: function () { return H.rights.schemes[HP.currentRightKey()]; },

    /** สถานะใบรับรองแพทย์ → valid | expiring | expired | none */
    certStatus: function (c) {
      if (!c.expires) return { key: 'none', label: 'ไม่ระบุวันหมดอายุ', tag: 'tag--info', banner: 'valid' };
      var d = HP.daysUntil(c.expires);
      if (d < 0) return { key: 'expired', label: 'หมดอายุ', tag: 'tag--danger', banner: 'expired', days: d };
      if (d <= 30) return { key: 'expiring', label: 'ใกล้หมดอายุ', tag: 'tag--warning', banner: 'expiring', days: d };
      return { key: 'valid', label: 'ใช้งานได้', tag: 'tag--success', banner: 'valid', days: d };
    },

    bmi: function (w, h) { return (w / Math.pow(h / 100, 2)).toFixed(1); },

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
      try { history.replaceState(null, '', '#' + panelId.replace(/^panel-/, '')); } catch (e) {}
    },
    toggleAccordion: function (header) {
      var item = header.closest('.accordion-item');
      var body = item.querySelector('.accordion-body');
      if (item.classList.contains('open')) { item.classList.remove('open'); body.style.maxHeight = null; }
      else { item.classList.add('open'); body.style.maxHeight = body.scrollHeight + 'px'; }
    },

    /* ─── Welcome card (same look as dashboard ctx-card) ─── */
    welcome: function (title, sub) {
      var name = HEALTH.user.fullName.replace(/^(นางสาว|นาย|นาง)/, '');
      return '<div class="ctx-card hp-welcome">' +
        '<div class="ctx-card__deco ctx-card__deco--top"></div><div class="ctx-card__deco ctx-card__deco--bottom"></div>' +
        '<div class="ctx-card__greeting mb-0">' +
          '<p class="ctx-card__greeting-label">สวัสดี คุณ' + HP.esc(name) + '</p>' +
          '<p class="ctx-card__greeting-name">' + HP.esc(title) + '</p>' +
          (sub ? '<div class="hp-welcome-sub">' + HP.esc(sub) + '</div>' : '') +
        '</div></div>';
    },
    mountWelcome: function (title, sub) {
      document.querySelector('.hp-main').insertAdjacentHTML('afterbegin', HP.welcome(title, sub));
    },

    /* ─── Service icon: image URL → logo, otherwise Material Symbol ─── */
    svcIcon: function (s, size) {
      var cls = 'hp-icon' + (size ? ' hp-icon--' + size : '');
      if (/^https?:\/\//.test(s.icon)) {
        return '<span class="' + cls + ' hp-icon--img"><img src="' + HP.esc(s.icon) + '" alt="" loading="lazy"></span>';
      }
      return '<span class="' + cls + ' tone-' + s.tone + '"><span class="material-symbols-outlined">' + s.icon + '</span></span>';
    },

    /* ─── Toast (same markup as components/toast.html) ─── */
    toast: function (message, type, icon) {
      var c = document.getElementById('toast-container');
      if (!c) { c = document.createElement('div'); c.id = 'toast-container'; c.className = 'toast-container'; document.body.appendChild(c); }
      var el = document.createElement('div');
      el.className = 'toast' + (type && type !== 'default' ? ' toast--' + type : '');
      el.innerHTML = '<span class="material-symbols-outlined">' + (icon || 'notifications') + '</span>' +
        '<span class="toast__message">' + HP.esc(message) + '</span>' +
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
      var go = function () { window.open(svc.url, '_blank', 'noopener'); };
      if (!window.ThaiAlert) return go();
      ThaiAlert.confirm({
        title: 'กำลังออกจากทางรัฐ',
        message: 'ระบบจะเปิดเว็บไซต์ "' + svc.name + '" ของ' + svc.agency + ' ในแท็บใหม่ ต้องการดำเนินการต่อหรือไม่',
        type: 'info', confirmText: 'ไปที่เว็บไซต์', cancelText: 'ยกเลิก'
      }).then(function (ok) { if (ok) go(); });
    }
  };

  window.HP = HP;
  window.switchTab = HP.switchTab;
  window.toggleAccordion = HP.toggleAccordion;

  /* ─── Page chrome: back-to-top + source-note time ─── */
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.getElementById('back-to-top');
    if (b) window.addEventListener('scroll', function () { b.classList.toggle('visible', window.pageYOffset > 240); }, { passive: true });

    var now = new Date();
    var s = HP.dateLong(now) + ' เวลา ' + HP.time(now);
    document.querySelectorAll('.source-note-time').forEach(function (e) { e.textContent = s; });

    // เปิดแท็บตาม #hash (เช่น records.html#allergy)
    var hash = location.hash.replace('#', '');
    if (hash) {
      var btn = document.querySelector('.tab-btn[data-panel="panel-' + hash + '"]');
      if (btn) btn.click();
    }
  });
})();
