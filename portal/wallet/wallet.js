/* ============================================================
   Document Wallet — shared helpers (ใช้ร่วมทุกหน้าใน portal/wallet)
   ============================================================ */
(function () {
  var W = window.WALLET;
  var MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
                'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  var MONTHS_S = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

  // "วันนี้" ของ prototype — ตรึงไว้เพื่อให้สถานะบัตร / เอกสาร คงที่ทุกครั้งที่เปิด
  var TODAY = new Date('2026-09-29T09:00:00');
  var STORE_KEY = 'dw.state';

  function parse(iso) { return iso instanceof Date ? iso : new Date(iso.length === 10 ? iso + 'T00:00:00' : iso); }
  function isoDate(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }

  /* ─── State ของ demo (localStorage) ─── */
  function load() {
    var s = {};
    try { s = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) {}
    s.added = s.added || []; s.removed = s.removed || []; s.requests = s.requests || [];
    s.docs = s.docs || []; s.done = s.done || {};
    return s;
  }
  function save(s) { try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {} }

  var DW = {
    today: TODAY,

    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    },
    qs: function (name) { return new URLSearchParams(location.search).get(name); },

    /* ─── วันที่ ─── */
    dateLong: function (iso) { var d = parse(iso); return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + (d.getFullYear() + 543); },
    dateShort: function (iso) { var d = parse(iso); return d.getDate() + ' ' + MONTHS_S[d.getMonth()] + ' ' + (d.getFullYear() + 543); },
    time: function (iso) { var d = parse(iso); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ' น.'; },
    dateTime: function (iso) { return DW.dateShort(iso) + ' ' + DW.time(iso); },
    daysUntil: function (iso) { return Math.ceil((parse(iso) - TODAY) / 86400000); },

    /* ─── State ─── */
    state: load,
    update: function (fn) { var s = load(); fn(s); save(s); return s; },
    reset: function () { try { localStorage.removeItem(STORE_KEY); } catch (e) {} },

    /** บัตรทั้งหมด = บัตรจาก data (ยกเว้นที่ถูกนำออก / ซ่อนใน demo) + บัตรที่ผู้ใช้เพิ่ม */
    cards: function () {
      var s = load();
      return W.cards.filter(function (c) {
        if (s.removed.indexOf(c.id) > -1) return false;
        if (c.id === 'disability' && s.noDisability) return false;
        return true;
      }).concat(s.added);
    },
    card: function (id) { return DW.cards().filter(function (c) { return c.id === id; })[0]; },

    /** เอกสาร = เอกสารที่ออกจากคำขอใน demo (ใหม่สุดก่อน) + เอกสารจาก data */
    docs: function () {
      var list = load().docs.concat(W.documents);
      return list.sort(function (a, b) { return parse(b.issued) - parse(a.issued); });
    },
    doc: function (id) { return DW.docs().filter(function (d) { return d.id === id; })[0]; },

    requests: function () {
      var s = load();
      return s.requests.concat(W.requests).map(function (r) {
        return s.done[r.id] ? Object.assign({}, r, { status: 'done', docId: s.done[r.id] }) : r;
      });
    },

    /** สถานะตามวันหมดอายุ → valid | expiring | expired | none */
    status: function (item) {
      if (!item.expires) return { key: 'none', label: 'ไม่มีวันหมดอายุ', tag: 'tag--info', banner: 'valid' };
      var d = DW.daysUntil(item.expires), warn = item.warnDays || 30;
      if (d < 0) return { key: 'expired', label: 'หมดอายุ', tag: 'tag--danger', banner: 'expired', days: d };
      if (d <= warn) return { key: 'expiring', label: 'ใกล้หมดอายุ', tag: 'tag--warning', banner: 'expiring', days: d };
      return { key: 'valid', label: 'ใช้งานได้', tag: 'tag--success', banner: 'valid', days: d };
    },

    /* ─── Markup helpers (แบบเดียวกับ Health Portal) ─── */
    sectionTitle: function (title) {
      return '<div class="section-title-container card-section__title-container"><div class="section-bar card-section__bar--primary"></div>' +
        '<h3 class="section-title card-section__heading">' + title + '</h3></div>';
    },
    sectionHead: function (title, link, linkText) {
      return '<div class="dw-section-head">' + DW.sectionTitle(title) +
        (link ? '<a class="dw-link" href="' + link + '">' + (linkText || 'ดูทั้งหมด') + ' <span class="material-symbols-outlined">chevron_right</span></a>' : '') + '</div>';
    },
    detailsItem: function (label, value, cls) {
      return '<div class="details-item"><span class="details-label">' + label + '</span>' +
        '<span class="details-value' + (cls ? ' ' + cls : '') + '">' + value + '</span></div>';
    },
    tag: function (st, corner) {
      return '<span class="tag ' + st.tag + ' tag--sm tag--dot' + (corner ? ' list-badge--corner' : '') + '">' + st.label + '</span>';
    },
    welcome: function (title, sub) {
      var name = W.user.fullName.replace(/^(นางสาว|นาย|นาง)/, '');
      return '<div class="ctx-card dw-welcome">' +
        '<div class="ctx-card__deco ctx-card__deco--top"></div><div class="ctx-card__deco ctx-card__deco--bottom"></div>' +
        '<div class="ctx-card__greeting mb-0">' +
          '<p class="ctx-card__greeting-label">สวัสดี คุณ' + DW.esc(name) + '</p>' +
          '<p class="ctx-card__greeting-name">' + DW.esc(title) + '</p>' +
          (sub ? '<div class="dw-welcome-sub">' + DW.esc(sub) + '</div>' : '') +
        '</div></div>';
    },
    mountWelcome: function (title, sub) {
      document.querySelector('.dw-main').insertAdjacentHTML('afterbegin', DW.welcome(title, sub));
    },
    empty: function (icon, text) {
      return '<div class="dw-empty"><span class="material-symbols-outlined">' + icon + '</span>' + text + '</div>';
    },
    /** แถวประวัติการใช้งาน */
    logList: function (log) {
      if (!log || !log.length) return DW.empty('history', 'ยังไม่มีประวัติการใช้งาน');
      return '<ul class="dw-log">' + log.map(function (l) {
        return '<li class="dw-log-item"><span class="dw-icon dw-icon--sm tone-neutral"><span class="material-symbols-outlined">' + (l.icon || 'history') + '</span></span>' +
          '<div class="dw-log-body"><p class="dw-log-title">' + DW.esc(l.action) + '</p>' +
          '<p class="dw-log-sub">' + DW.esc(l.where) + ' · ' + DW.dateTime(l.at) + '</p></div></li>';
      }).join('') + '</ul>';
    },

    /* ============================================================
       VIRTUAL CARD FACE
       ขนาดตัวอักษรใช้หน่วย cqw (container query) → บัตรย่อ/ขยายได้ทุกขนาด
       ============================================================ */
    cardFace: function (c, side, opts) {
      opts = opts || {};
      var e = DW.esc, u = W.user;
      var head = '<div class="dw-face__head"><span class="material-symbols-outlined dw-face__emblem">' + c.icon + '</span>' +
        '<div class="dw-face__titles"><p class="dw-face__title">' + e(c.name) + '</p><p class="dw-face__title-en">' + e(c.nameEn) + '</p></div>' +
        '<p class="dw-face__issuer">' + e(c.issuerShort) + '</p></div>';

      if (side === 'back') {
        var rows = (c.back || []).map(function (r) {
          return '<div class="dw-face__row"><span class="dw-face__label">' + e(r[0]) + '</span><span class="dw-face__value">' + e(r[1]) + '</span></div>';
        }).join('');
        var foot = c.mrz
          ? '<div class="dw-face__mrz">' + c.mrz.map(e).join('<br>') + '</div>'
          : '<div class="dw-face__code"><span class="dw-face__barcode" aria-hidden="true"></span>' +
              (c.code ? '<span class="dw-face__code-text">' + e(c.code.label) + ' ' + e(c.code.value) + '</span>' : '') + '</div>';
        return '<div class="dw-face dw-face--back theme-' + c.theme + '">' +
          '<div class="dw-face__back-head"><span class="material-symbols-outlined">' + c.icon + '</span>' + e(c.issuer) + '</div>' +
          '<div class="dw-face__rows">' + rows + '</div>' + foot +
          '<span class="dw-face__holo" aria-hidden="true"></span></div>';
      }

      var dates = [['วันออกบัตร', DW.dateShort(c.issued)], ['วันหมดอายุ', c.expires ? DW.dateShort(c.expires) : 'ตลอดชีพ']];
      var grid = (c.front || []).concat(dates).map(function (r) {
        return '<div class="dw-face__cell"><span class="dw-face__label">' + e(r[0]) + '</span><span class="dw-face__value">' + e(r[1]) + '</span></div>';
      }).join('');
      var st = DW.status(c);
      return '<div class="dw-face dw-face--front theme-' + c.theme + (st.key === 'expired' ? ' is-expired' : '') + '">' + head +
        '<div class="dw-face__body"><div class="dw-face__info">' +
          '<p class="dw-face__label">' + e(c.numberLabel) + '</p>' +
          '<p class="dw-face__number">' + e(opts.masked ? c.numberMasked : c.number) + '</p>' +
          '<p class="dw-face__name">' + e(u.fullName) + '</p>' +
          '<p class="dw-face__name-en">' + e(u.fullNameEn) + '</p>' +
          '<div class="dw-face__grid">' + grid + '</div>' +
        '</div>' +
        '<div class="dw-face__photo" aria-hidden="true"><span class="material-symbols-outlined">person</span></div></div>' +
        (st.key === 'expired' ? '<span class="dw-face__stamp">หมดอายุ</span>' : '') +
        '<span class="dw-face__holo" aria-hidden="true"></span></div>';
    },

    /** บัตรพลิกได้ (หน้า/หลัง) */
    flipCard: function (c, opts) {
      return '<div class="dw-flip" tabindex="0" role="button" aria-label="' + DW.esc(c.name) + ' — แตะหรือปัดเพื่อพลิกบัตร" aria-pressed="false">' +
        '<div class="dw-flip__inner">' +
          '<div class="dw-flip__side dw-flip__side--front">' + DW.cardFace(c, 'front', opts) + '</div>' +
          '<div class="dw-flip__side dw-flip__side--back" aria-hidden="true">' + DW.cardFace(c, 'back', opts) + '</div>' +
        '</div></div>';
    },

    /**
     * พลิกบัตร: แตะ = พลิก, ปัด/ลากซ้าย-ขวา = หมุนตามนิ้วแล้วพลิก, คีย์บอร์ด Enter/Space/←/→
     * คืนค่า { set(side), side() } ; onChange(side) ถูกเรียกทุกครั้งที่พลิก
     */
    bindFlip: function (el, onChange, vertical) {
      // vertical = บัตรถูกหมุน 90° (โหมดเต็มจอบนมือถือแนวตั้ง) → ปัดขึ้น-ลงบนจอ = ซ้าย-ขวาของบัตร
      function pos(ev) { return vertical ? ev.clientY : ev.clientX; }
      var inner = el.querySelector('.dw-flip__inner');
      var front = el.querySelector('.dw-flip__side--front'), back = el.querySelector('.dw-flip__side--back');
      var angle = 0, startX = null, dx = 0, dragging = false;
      function side() { return Math.round(angle / 180) % 2 === 0 ? 'front' : 'back'; }
      function apply() {
        inner.style.transform = 'rotateY(' + angle + 'deg)';
        var s = side();
        el.setAttribute('aria-pressed', s === 'back' ? 'true' : 'false');
        front.setAttribute('aria-hidden', s === 'back' ? 'true' : 'false');
        back.setAttribute('aria-hidden', s === 'back' ? 'false' : 'true');
        if (onChange) onChange(s);
      }
      function flip(dir) { angle += (dir || 1) * 180; apply(); }

      el.addEventListener('pointerdown', function (ev) {
        if (ev.button > 0) return;
        startX = pos(ev); dx = 0; dragging = false;
        el.setPointerCapture(ev.pointerId);
      });
      el.addEventListener('pointermove', function (ev) {
        if (startX === null) return;
        dx = pos(ev) - startX;
        if (!dragging && Math.abs(dx) > 6) { dragging = true; inner.style.transition = 'none'; }
        if (dragging) inner.style.transform = 'rotateY(' + (angle + Math.max(-180, Math.min(180, dx * 0.6))) + 'deg)';
      });
      function end() {
        if (startX === null) return;
        inner.style.transition = '';
        if (!dragging) flip(1);
        else if (Math.abs(dx) > 45) flip(dx > 0 ? 1 : -1);
        else apply();
        startX = null; dragging = false;
      }
      el.addEventListener('pointerup', end);
      el.addEventListener('pointercancel', function () { if (startX !== null) { inner.style.transition = ''; startX = null; dragging = false; apply(); } });
      el.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); flip(1); }
        if (ev.key === 'ArrowRight') { ev.preventDefault(); flip(1); }
        if (ev.key === 'ArrowLeft') { ev.preventDefault(); flip(-1); }
      });
      return {
        side: side,
        set: function (s) { if (s !== side()) flip(1); }
      };
    },

    /* ─── บัตรแบบเต็มจอ: พลิกได้ + เลื่อนไปบัตรอื่นได้ + นาฬิกาสด กันการใช้ภาพหน้าจอ ─── */
    fullscreen: function (list, index, onLog) {
      var i = index || 0, e = DW.esc, timer, flipper;
      var ov = document.createElement('div');
      ov.className = 'dw-fs';
      ov.setAttribute('role', 'dialog');
      ov.setAttribute('aria-modal', 'true');
      ov.innerHTML =
        '<div class="dw-fs__top"><div><p class="dw-fs__title"></p><p class="dw-fs__sub"></p></div>' +
          '<div class="dw-row"><button type="button" class="dw-fs__btn" data-fs-rotate aria-pressed="false" aria-label="หมุนบัตรแนวนอน"><span class="material-symbols-outlined">screen_rotation</span></button>' +
          '<button type="button" class="dw-fs__btn" data-fs-close aria-label="ปิดโหมดเต็มจอ"><span class="material-symbols-outlined">close</span></button></div></div>' +
        '<div class="dw-fs__stage"></div>' +
        '<div class="dw-fs__live" aria-live="off"><span class="dw-fs__pulse"></span>บัตรจริงจากทางรัฐ · <span class="dw-fs__clock"></span></div>' +
        '<p class="dw-fs__hint">แตะ หรือปัดซ้าย-ขวา เพื่อพลิกดูด้านหลังบัตร</p>' +
        '<div class="dw-fs__nav">' +
          '<button type="button" class="dw-fs__btn" data-fs-dir="-1" aria-label="บัตรก่อนหน้า"><span class="material-symbols-outlined">chevron_left</span></button>' +
          '<button type="button" class="dw-fs__side-btn" data-fs-flip><span class="material-symbols-outlined">flip</span><span class="dw-fs__side-label">ด้านหน้า</span></button>' +
          '<button type="button" class="dw-fs__btn" data-fs-dir="1" aria-label="บัตรถัดไป"><span class="material-symbols-outlined">chevron_right</span></button>' +
        '</div>';
      document.body.appendChild(ov);
      document.body.style.overflow = 'hidden';
      var last = document.activeElement;

      // มือถือแนวตั้ง: หมุนบัตร 90° ให้เต็มความสูงจอ (ปิดได้ด้วยปุ่มหมุน)
      var rotated = window.innerHeight > window.innerWidth * 1.2;
      function render() {
        var c = list[i];
        ov.classList.toggle('dw-fs--rotated', rotated);
        ov.querySelector('[data-fs-rotate]').setAttribute('aria-pressed', rotated ? 'true' : 'false');
        ov.querySelector('.dw-fs__hint').textContent = 'แตะ หรือปัด' + (rotated ? 'ขึ้น-ลง' : 'ซ้าย-ขวา') + ' เพื่อพลิกดูด้านหลังบัตร';
        ov.setAttribute('aria-label', c.name + ' แบบเต็มจอ');
        ov.querySelector('.dw-fs__title').textContent = c.name;
        ov.querySelector('.dw-fs__sub').textContent = (i + 1) + ' / ' + list.length + ' · ' + c.issuerShort;
        ov.querySelector('.dw-fs__stage').innerHTML = DW.flipCard(c);
        flipper = DW.bindFlip(ov.querySelector('.dw-flip'), function (s) {
          ov.querySelector('.dw-fs__side-label').textContent = s === 'back' ? 'ด้านหลัง' : 'ด้านหน้า';
        }, rotated);
        ov.querySelector('[data-fs-dir="-1"]').disabled = i === 0;
        ov.querySelector('[data-fs-dir="1"]').disabled = i === list.length - 1;
        ov.querySelector('.dw-fs__nav').style.visibility = list.length > 1 ? '' : 'hidden';
        if (onLog) onLog(c);
      }
      function tick() {
        var d = new Date();
        ov.querySelector('.dw-fs__clock').textContent = DW.dateShort(d) + ' ' +
          [d.getHours(), d.getMinutes(), d.getSeconds()].map(function (n) { return String(n).padStart(2, '0'); }).join(':');
      }
      function close() {
        clearInterval(timer);
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('fullscreenchange', onFs);
        if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
        ov.remove();
        document.body.style.overflow = '';
        if (last) last.focus();
      }
      function onKey(ev) {
        if (ev.key === 'Escape') close();
        if (ev.target.closest && ev.target.closest('.dw-flip')) return; // ←/→ บนบัตร = พลิก
        if (ev.key === 'ArrowRight' && i < list.length - 1) { i++; render(); }
        if (ev.key === 'ArrowLeft' && i > 0) { i--; render(); }
      }
      var wasFs = false;
      function onFs() { if (document.fullscreenElement) wasFs = true; else if (wasFs) close(); }

      ov.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-fs-close]')) return close();
        if (ev.target.closest('[data-fs-rotate]')) { rotated = !rotated; render(); return; }
        var d = ev.target.closest('[data-fs-dir]');
        if (d) { i = Math.max(0, Math.min(list.length - 1, i + (+d.dataset.fsDir))); render(); return; }
        if (ev.target.closest('[data-fs-flip]')) flipper.set(flipper.side() === 'back' ? 'front' : 'back');
      });
      document.addEventListener('keydown', onKey);
      document.addEventListener('fullscreenchange', onFs);

      render(); tick(); timer = setInterval(tick, 1000);
      ov.querySelector('.dw-flip').focus();
      // เต็มจอจริง + ล็อกแนวนอน (รองรับบางเบราว์เซอร์ — ถ้าไม่ได้ก็ใช้ overlay อย่างเดียว)
      if (ov.requestFullscreen) {
        ov.requestFullscreen().then(function () {
          if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function () {});
        }).catch(function () {});
      }
    },

    /* ─── Carousel แบบ scroll-snap (เหมือน HP.carousel ของ Health Portal) ─── */
    carousel: function (root, label, itemLabel) {
      var track = root.querySelector('.dw-carousel-track');
      var slides = [].slice.call(track.children);
      var dots = root.querySelector('.dw-carousel-dots');
      var prev = root.querySelector('[data-dir="-1"]'), next = root.querySelector('[data-dir="1"]');
      root.setAttribute('role', 'region');
      root.setAttribute('aria-roledescription', 'carousel');
      root.setAttribute('aria-label', label);
      slides.forEach(function (s, i) {
        s.setAttribute('role', 'group');
        s.setAttribute('aria-roledescription', 'slide');
        s.setAttribute('aria-label', (i + 1) + ' จาก ' + slides.length);
      });
      dots.innerHTML = slides.map(function (s, i) {
        return '<button type="button" class="dw-carousel-dot" data-i="' + i + '" aria-label="ไปที่' + (itemLabel || 'รายการ') + ' ' + (i + 1) + '"><span class="dyk-card__dot"></span></button>';
      }).join('');
      function go(i) {
        i = Math.max(0, Math.min(slides.length - 1, i));
        track.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: 'smooth' });
      }
      function current() {
        var x = track.scrollLeft, best = 0;
        slides.forEach(function (s, i) {
          if (Math.abs(s.offsetLeft - slides[0].offsetLeft - x) < Math.abs(slides[best].offsetLeft - slides[0].offsetLeft - x)) best = i;
        });
        if (x + track.clientWidth >= track.scrollWidth - 2) best = slides.length - 1;
        return best;
      }
      function sync() {
        var c = current();
        [].forEach.call(dots.children, function (d, i) {
          d.firstChild.classList.toggle('dyk-card__dot--active', i === c);
          d.setAttribute('aria-current', i === c ? 'true' : 'false');
        });
        prev.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      }
      var t;
      track.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(sync, 60); }, { passive: true });
      window.addEventListener('resize', sync);
      dots.onclick = function (ev) { var b = ev.target.closest('[data-i]'); if (b) go(+b.dataset.i); };
      prev.onclick = function () { go(current() - 1); };
      next.onclick = function () { go(current() + 1); };
      track.addEventListener('keydown', function (ev) {
        if (ev.key === 'ArrowRight') { ev.preventDefault(); go(current() + 1); }
        if (ev.key === 'ArrowLeft') { ev.preventDefault(); go(current() - 1); }
      });
      sync();
    },

    /* ─── QR (qrcodejs จาก cdnjs; ถ้าโหลดไม่ได้ แสดงกล่องแทน) ─── */
    qr: function (el, text, size) {
      el.innerHTML = '';
      if (typeof QRCode === 'undefined') {
        el.innerHTML = '<div class="dw-qr-fallback">QR<br>ตรวจสอบ</div>';
        return;
      }
      new QRCode(el, { text: text, width: size || 180, height: size || 180, colorDark: '#1b1b1b', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });
      var img = el.querySelector('img'); if (img) img.alt = 'QR Code';
    },
    token: function (n) {
      var s = '', a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      for (var i = 0; i < (n || 8); i++) s += a[Math.floor(Math.random() * a.length)];
      return s;
    },

    /* ============================================================
       DOCUMENT PREVIEW (ส่วนนี้คือสิ่งที่ถูกแปลงเป็น PDF)
       ============================================================ */
    docPreview: function (d) {
      var e = DW.esc, u = W.user, t = W.docTypes[d.type], st = DW.status(d), body = '';
      function table(rows) {
        return '<table class="dw-doc-table">' + rows.map(function (r) { return '<tr><td>' + e(r[0]) + '</td><td>' + e(r[1]) + '</td></tr>'; }).join('') + '</table>';
      }
      if (d.type === 'loan') {
        body = '<p>เอกสารชุดนี้รวบรวมข้อมูลของ <strong>' + e(u.fullName) + '</strong> เลขประจำตัวประชาชน ' + e(u.pidMasked) +
          ' จากหน่วยงานต้นทางโดยตรง เพื่อใช้ประกอบการขอ' + e(d.fields[0][1]) + ' กับ' + e(d.fields[1][1]) + '</p>' +
          d.data.items.map(function (it, i) {
            return '<p class="dw-doc-sub">' + (i + 1) + '. ' + e(it.name) + ' <span>— ออกโดย' + e(it.from) + '</span></p>' + table(it.rows);
          }).join('');
      } else if (d.type === 'ocsc') {
        body = '<p>สำนักงาน ก.พ. ขอรับรองว่า <strong>' + e(u.fullName) + '</strong> เลขประจำตัวประชาชน ' + e(u.pidMasked) +
          ' ได้เข้าสอบวัดความรู้ความสามารถทั่วไป (ภาค ก.) และมีผลการสอบดังนี้</p>' +
          '<table class="dw-doc-table dw-doc-table--grid"><tr><th>วิชา</th><th>คะแนนที่ได้</th><th>คะแนนเต็ม</th></tr>' +
          d.data.scores.map(function (s) { return '<tr><td>' + e(s[0]) + '</td><td>' + s[1] + '</td><td>' + s[2] + '</td></tr>'; }).join('') + '</table>' +
          table(d.fields.filter(function (f) { return f[0] !== 'ผลการสอบ'; })) +
          '<p class="dw-doc-result">ผลการสอบ: <strong>' + e(d.data.result) + '</strong> ตามหลักเกณฑ์ที่ ก.พ. กำหนด</p>';
      } else if (d.type === 'sme') {
        body = '<p>สำนักงานส่งเสริมวิสาหกิจขนาดกลางและขนาดย่อม (สสว.) ขอรับรองว่า <strong>' + e(d.data.biz) + '</strong> ซึ่งมี ' + e(u.fullName) +
          ' เป็นผู้มีอำนาจลงนาม ได้ขึ้นทะเบียนเป็นผู้ประกอบการวิสาหกิจขนาดกลางและขนาดย่อม ตามรายละเอียดดังนี้</p>' +
          table([['ชื่อกิจการ', d.data.biz], ['เลขทะเบียนนิติบุคคล', d.data.reg], ['ขนาดวิสาหกิจ', d.data.size], ['ประเภทธุรกิจ', d.data.sector], ['รายได้ต่อปี', d.data.revenue], ['จำนวนการจ้างงาน', d.data.staff]]) +
          '<p>หนังสือรับรองนี้ใช้ได้ถึงวันที่ ' + (d.expires ? DW.dateLong(d.expires) : 'ไม่ระบุ') + '</p>';
      } else if (d.type === 'edu') {
        body = '<p>มหาวิทยาลัยขอรับรองว่า <strong>' + e(u.fullName) + '</strong> (' + e(u.fullNameEn) + ') ได้สำเร็จการศึกษาตามหลักสูตร <strong>' + e(d.fields[0][1]) + '</strong></p>' +
          (d.data.years ? '<table class="dw-doc-table dw-doc-table--grid"><tr><th>ชั้นปี</th><th>หน่วยกิต</th><th>เกรดเฉลี่ย</th></tr>' +
            d.data.years.map(function (y) { return '<tr><td>' + y[0] + '</td><td>' + y[1] + '</td><td>' + y[2] + '</td></tr>'; }).join('') + '</table>' : '') +
          table([['Degree', d.data.degree], ['หน่วยกิตสะสม', String(d.data.credits)], ['เกรดเฉลี่ยสะสม (GPAX)', d.data.gpa], ['วันที่สำเร็จการศึกษา', DW.dateLong(d.data.graduated)]]);
      }
      var verify = 'https://verify.thangrath.go.th/d/' + d.id;
      return '<div class="dw-doc' + (st.key === 'expired' ? ' is-expired' : '') + '" id="doc">' +
        '<div class="dw-doc-head"><div><div class="dw-doc-agency">' + e(t.issuer) + '</div><div class="dw-doc-meta">ออกผ่านกระเป๋าเอกสาร แอปทางรัฐ</div></div>' +
          '<div class="dw-doc-ref">เลขที่ ' + e(d.id) + '<br>ออกให้ ณ วันที่ ' + DW.dateLong(d.issued) + '</div></div>' +
        '<div class="dw-doc-title">' + e(d.title) + '</div>' + body +
        '<div class="dw-doc-sign">' +
          '<div class="dw-doc-qr-wrap"><div class="dw-doc-qr" data-qr="' + e(verify) + '"></div><span>สแกนเพื่อตรวจสอบ</span></div>' +
          '<div class="dw-doc-signer"><div class="line">' + e(d.issuer) + '</div>ลงลายมือชื่ออิเล็กทรอนิกส์<br>' +
            (d.expires ? 'ใช้ได้ถึง ' + DW.dateLong(d.expires) : 'ไม่มีวันหมดอายุ') + '</div>' +
        '</div>' +
        '<div class="dw-doc-foot">ลงลายมือชื่ออิเล็กทรอนิกส์ (Digital Signature) · ตรวจสอบความถูกต้องได้ที่ ' + e(verify) + '</div>' +
        (st.key === 'expired' ? '<div class="dw-doc-watermark" aria-hidden="true">หมดอายุ</div>' : '') +
      '</div>';
    },
    renderQrs: function (root) {
      root.querySelectorAll('[data-qr]').forEach(function (el) { DW.qr(el, el.dataset.qr, 84); });
    },

    /** แปลง .dw-doc → PDF (html2pdf แบบเดียวกับ Health Portal) */
    downloadPdf: function (docEl, fileName, btn) {
      if (typeof html2pdf === 'undefined') {
        DW.toast('ไม่สามารถโหลดตัวสร้าง PDF ได้ กรุณาลองใหม่อีกครั้ง', 'warning', 'warning');
        return Promise.resolve(false);
      }
      var label = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="material-symbols-outlined">hourglass_top</span>กำลังสร้าง PDF…';
      // render สำเนาเอกสารที่ตำแหน่ง 0,0 ความกว้างคงที่ — กันภาพเลื่อน/ถูกตัดจาก scroll
      var stage = document.createElement('div');
      stage.style.cssText = 'position:fixed;left:0;top:0;width:720px;z-index:-1;pointer-events:none;';
      var clone = docEl.cloneNode(true);
      clone.removeAttribute('id');
      clone.style.cssText = 'margin:0;max-width:none;width:720px;border:none;border-radius:0;padding-bottom:64px;';
      stage.appendChild(clone);
      document.body.appendChild(stage);
      return html2pdf().set({
        margin: [10, 10, 10, 10], filename: fileName,
        image: { type: 'jpeg', quality: 0.96 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollX: 0, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(clone).save().then(function () {
        DW.toast('ดาวน์โหลด ' + fileName + ' เรียบร้อยแล้ว', 'success', 'check_circle');
        return true;
      }).catch(function () {
        DW.toast('สร้าง PDF ไม่สำเร็จ กรุณาลองใหม่', 'danger', 'error');
        return false;
      }).then(function (ok) {
        stage.remove();
        btn.disabled = false;
        btn.innerHTML = label;
        return ok;
      });
    },

    /* ─── สร้างเอกสารจากคำขอ (เมื่อ demo จำลองว่าหน่วยงานออกเอกสารแล้ว) ─── */
    makeDoc: function (r) {
      var t = W.docTypes[r.type], a = {};
      (r.answers || []).forEach(function (x) { a[x[0]] = x[1]; });
      var issued = new Date(TODAY), n = String(Math.floor(Math.random() * 9000) + 1000);
      var base = {
        id: { loan: 'LN', ocsc: 'OCSC', sme: 'SME', edu: 'EDU' }[r.type] + '-2569-0929-' + n,
        type: r.type, issued: issued.toISOString(), requestId: r.id,
        expires: t.validityDays ? isoDate(addDays(issued, t.validityDays)) : null,
        fileSize: (180 + Math.floor(Math.random() * 400)) + ' KB', pages: 1,
        log: [{ at: issued.toISOString(), action: 'ออกเอกสาร', where: 'ตามคำขอ ' + r.id, icon: 'task' }]
      };
      if (r.type === 'loan') {
        var src = W.documents[0].data.items;
        var chosen = (a['เอกสารที่ต้องการในชุด'] || '').split(', ');
        var items = src.filter(function (it) { return chosen.indexOf(it.name) > -1; });
        return Object.assign(base, {
          title: 'ชุดเอกสารประกอบการขอ' + a['ประเภทสินเชื่อ'], issuer: 'ทางรัฐ — รวบรวมจาก ' + items.length + ' หน่วยงาน', pages: items.length + 1,
          fields: [['ประเภทสินเชื่อ', a['ประเภทสินเชื่อ']], ['ยื่นกับสถาบันการเงิน', a['ยื่นกับสถาบันการเงิน']], ['จำนวนเอกสารในชุด', items.length + ' ฉบับ']],
          data: { items: items }, usableFor: [a['ยื่นกับสถาบันการเงิน']]
        });
      }
      if (r.type === 'ocsc') {
        var o = W.documents.filter(function (d) { return d.type === 'ocsc'; })[0];
        return Object.assign(base, {
          title: 'หนังสือรับรองผลการสอบ ภาค ก. ระดับ' + a['ระดับการสอบ'] + (a['ภาษาของเอกสาร'] === 'ภาษาอังกฤษ' ? ' (ภาษาอังกฤษ)' : ''),
          issuer: 'สำนักงาน ก.พ.', fields: [['ประเภทการสอบ', 'สอบวัดความรู้ความสามารถทั่วไป (ภาค ก.)'], ['ระดับ', a['ระดับการสอบ']], ['รอบการสอบ', a['รอบที่สอบผ่าน']], ['ภาษา', a['ภาษาของเอกสาร']], ['ผลการสอบ', 'ผ่าน']],
          data: o.data, usableFor: o.usableFor
        });
      }
      if (r.type === 'sme') {
        var s = W.documents.filter(function (d) { return d.type === 'sme'; })[0];
        return Object.assign(base, {
          title: 'หนังสือรับรองการขึ้นทะเบียนผู้ประกอบการ SME', issuer: 'สสว.',
          fields: s.fields.slice(0, 4).concat([['วัตถุประสงค์', a['วัตถุประสงค์']]]), data: s.data, usableFor: s.usableFor
        });
      }
      var edu = W.documents.filter(function (d) { return d.type === 'edu'; })[0];
      var isCert = /คุณวุฒิ/.test(a['ประเภทเอกสาร']);
      return Object.assign(base, {
        title: (isCert ? 'ใบรับรองคุณวุฒิ (สำเร็จการศึกษา)' : 'ใบแสดงผลการศึกษา (Transcript)') + ' ปริญญาตรี', issuer: 'มหาวิทยาลัยเกษตรศาสตร์',
        fields: edu.fields.slice(0, 4).concat([['ภาษา', a['ภาษาของเอกสาร']]]),
        data: isCert ? Object.assign({}, edu.data, { years: null }) : edu.data, usableFor: edu.usableFor
      });
    },
    /** demo: ให้ทุกคำขอที่รออยู่ "ออกเอกสารแล้ว" */
    completeRequests: function () {
      var made = 0;
      var pending = DW.requests().filter(function (r) { return r.status !== 'done'; });
      DW.update(function (s) {
        pending.forEach(function (r) {
          var d = DW.makeDoc(r);
          s.docs.unshift(d);
          s.done[r.id] = d.id;
          made++;
        });
      });
      return made;
    },

    /* ─── Toast (same markup as components/toast.html) ─── */
    toast: function (message, type, icon) {
      var c = document.getElementById('toast-container');
      if (!c) { c = document.createElement('div'); c.id = 'toast-container'; c.className = 'toast-container'; document.body.appendChild(c); }
      var el = document.createElement('div');
      el.className = 'toast' + (type && type !== 'default' ? ' toast--' + type : '');
      el.setAttribute('role', 'status');
      el.innerHTML = '<span class="material-symbols-outlined">' + (icon || 'notifications') + '</span>' +
        '<span class="toast__message">' + DW.esc(message) + '</span>' +
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

    /* ─── Modal แบบเดียวกับ components/modal.html ─── */
    openModal: function (id) {
      var m = document.getElementById(id);
      DW._lastFocus = document.activeElement;
      m.classList.add('active');
      m.setAttribute('aria-hidden', 'false');
      var f = m.querySelector('input, select, button:not(.modal-close-btn)') || m.querySelector('button');
      if (f) setTimeout(function () { f.focus(); }, 50);
    },
    closeModal: function (id) {
      var m = typeof id === 'string' ? document.getElementById(id) : id;
      m.classList.remove('active');
      m.setAttribute('aria-hidden', 'true');
      if (DW._lastFocus) DW._lastFocus.focus();
    },

    /** เปิดเว็บไซต์ภายนอก — ยืนยันก่อนออกจากทางรัฐ */
    openExternal: function (name, agency, url) {
      var go = function () { window.open(url, '_blank', 'noopener'); };
      if (typeof ThaiAlert === 'undefined') return go();
      ThaiAlert.confirm({
        title: 'กำลังออกจากทางรัฐ',
        message: 'ระบบจะเปิดเว็บไซต์ "' + name + '" ของ' + agency + ' ในแท็บใหม่ ต้องการดำเนินการต่อหรือไม่',
        type: 'info', confirmText: 'ไปที่เว็บไซต์', cancelText: 'ยกเลิก'
      }).then(function (ok) { if (ok) go(); });
    },

    /* ─── ปุ่มลอย "Demo การแสดงผล" + modal (หน้าตาเดียวกับ Portal อื่น ใช้ ../../demo-tools.css + ../portal-demo.js) ─── */
    mountDemo: function () {
      var s = load();
      var pending = DW.requests().filter(function (r) { return r.status !== 'done'; }).length;
      function chip(attr, val, on, label) {
        return '<button type="button" class="dc-chip' + (on ? ' active' : '') + '" ' + attr + '="' + val + '" aria-pressed="' + on + '">' + label + '</button>';
      }
      document.body.insertAdjacentHTML('beforeend',
        '<button type="button" class="demo-fab" data-demo-open="modal-demo-config" aria-haspopup="dialog">' +
          '<span class="material-symbols-outlined demo-fab__icon">tune</span>Demo การแสดงผล</button>' +
        '<div id="modal-demo-config" class="modal-overlay" aria-hidden="true" data-demo-modal>' +
          '<div class="modal-content modal__content--flex-col" role="dialog" aria-modal="true" aria-labelledby="dc-title">' +
            '<div class="dc-modal__header"><div><p class="dc-modal__title" id="dc-title">ตั้งค่าการแสดงผล</p><p class="dc-modal__sub">จำลองสถานการณ์สำหรับ demo</p></div>' +
              '<button type="button" class="dc-modal__close-btn" data-demo-close aria-label="ปิด"><span class="material-symbols-outlined dc-modal__close-icon">close</span></button></div>' +
            '<div class="dc-modal__body">' +
              '<div class="dc-group"><p class="dc-group-label">♿ บัตรประจำตัวคนพิการ (ซิงก์จาก พก.)</p><div class="dc-chips">' +
                chip('data-dis', '1', !s.noDisability, 'มีบัตร') + chip('data-dis', '0', !!s.noDisability, 'ไม่พบข้อมูล') + '</div></div>' +
              '<div class="dc-group"><p class="dc-group-label">📨 คำขอเอกสารที่รอดำเนินการ (' + pending + ' รายการ)</p><div class="dc-chips">' +
                '<button type="button" class="dc-chip" data-demo-act="complete"' + (pending ? '' : ' disabled') + '>จำลองว่าหน่วยงานออกเอกสารแล้ว</button></div></div>' +
              '<div class="dc-group dc-group--last"><p class="dc-group-label">🔄 ข้อมูลที่เพิ่ม / ขอใน demo</p><div class="dc-chips">' +
                '<button type="button" class="dc-chip" data-demo-act="reset">รีเซ็ตกลับค่าเริ่มต้น</button></div></div>' +
            '</div></div></div>');
      document.getElementById('modal-demo-config').addEventListener('click', function (ev) {
        var d = ev.target.closest('[data-dis]');
        if (d) { DW.update(function (x) { x.noDisability = d.dataset.dis === '0'; }); location.reload(); return; }
        var a = ev.target.closest('[data-demo-act]');
        if (!a) return;
        if (a.dataset.demoAct === 'complete') {
          var n = DW.completeRequests();
          sessionStorage.setItem('dw.flash', 'หน่วยงานออกเอกสารให้แล้ว ' + n + ' ฉบับ — เก็บเข้ากระเป๋าเรียบร้อย');
        }
        if (a.dataset.demoAct === 'reset') { DW.reset(); sessionStorage.setItem('dw.flash', 'รีเซ็ตข้อมูล demo แล้ว'); }
        location.reload();
      });
      var flash = sessionStorage.getItem('dw.flash');
      if (flash) { sessionStorage.removeItem('dw.flash'); setTimeout(function () { DW.toast(flash, 'success', 'check_circle'); }, 300); }
    }
  };

  window.DW = DW;

  /* ─── Page chrome: back-to-top + source-note time + ปิด modal ─── */
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.getElementById('back-to-top');
    if (b) window.addEventListener('scroll', function () { b.classList.toggle('visible', window.pageYOffset > 240); }, { passive: true });

    var now = new Date();
    var s = DW.dateLong(now) + ' เวลา ' + DW.time(now);
    document.querySelectorAll('.source-note-time').forEach(function (e) { e.textContent = s; });
  });
  document.addEventListener('click', function (ev) {
    var c = ev.target.closest('[data-modal-close]');
    if (c) { DW.closeModal(c.closest('.modal-overlay')); return; }
    if (ev.target.classList && ev.target.classList.contains('modal-overlay') && ev.target.classList.contains('active') && !ev.target.hasAttribute('data-demo-modal')) DW.closeModal(ev.target);
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape') return;
    var m = document.querySelector('.modal-overlay.active:not([data-demo-modal])');
    if (m) DW.closeModal(m);
  });
})();
