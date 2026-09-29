/* ============================================================
   Emergency Portal — shared helpers (ใช้ร่วมทุกหน้าใน portal/emergency)
   ============================================================ */
(function () {
  var E = window.EMERGENCY;
  var MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
                'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  var MONTHS_S = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

  // "ตอนนี้" ของ prototype — ตรึงไว้เพื่อให้สถานะ "กำลังมีผล" คงที่ทุกครั้งที่เปิด
  var NOW = new Date('2026-09-29T09:00:00');
  var DEMO_KEY = 'ep-demo-user';

  function parse(iso) { return iso instanceof Date ? iso : new Date(iso.length === 10 ? iso + 'T00:00:00' : iso); }
  function byKey(list, key) { return list.filter(function (x) { return x.key === key; })[0]; }
  function dayStart(d) { d = parse(d); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

  var EP = {
    now: NOW,

    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    },

    dateLong: function (iso) { var d = parse(iso); return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + (d.getFullYear() + 543); },
    dateShort: function (iso) { var d = parse(iso); return d.getDate() + ' ' + MONTHS_S[d.getMonth()] + ' ' + (d.getFullYear() + 543); },
    time: function (iso) { var d = parse(iso); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ' น.'; },
    dateTime: function (iso) { return EP.dateShort(iso) + ' · ' + EP.time(iso); },

    /** หัวข้อกลุ่มตามวัน: วันนี้ / เมื่อวาน / 26 ก.ย. 2569 */
    dayLabel: function (iso) {
      var diff = Math.round((dayStart(NOW) - dayStart(iso)) / 86400000);
      return diff === 0 ? 'วันนี้' : diff === 1 ? 'เมื่อวาน' : EP.dateLong(iso);
    },

    qs: function (name) { return new URLSearchParams(location.search).get(name); },
    norm: function (s) { return String(s || '').toLowerCase().replace(/\s+/g, ''); },

    /* ─── ผู้ใช้ (รวมค่าที่จำลองไว้ในกล่อง demo) ─── */
    user: function () {
      var u = JSON.parse(JSON.stringify(E.user)), demo = null;
      try { demo = JSON.parse(localStorage.getItem(DEMO_KEY) || 'null'); } catch (e) {}
      if (demo) {
        var p = byKey(E.demoPersonas, demo.persona);
        if (p) { u.gender = p.gender; u.birthDate = p.birthDate; }
        if (demo.location) u.location = demo.location;
      }
      return u;
    },
    saveDemo: function (demo) { try { localStorage.setItem(DEMO_KEY, JSON.stringify(demo)); } catch (e) {} },
    demo: function () { try { return JSON.parse(localStorage.getItem(DEMO_KEY) || 'null') || {}; } catch (e) { return {}; } },

    age: function (u) {
      var b = parse(u.birthDate), a = NOW.getFullYear() - b.getFullYear();
      if (NOW.getMonth() < b.getMonth() || (NOW.getMonth() === b.getMonth() && NOW.getDate() < b.getDate())) a--;
      return a;
    },
    genderLabel: function (g) { return g === 'male' ? 'ชาย' : g === 'female' ? 'หญิง' : 'ทุกเพศ'; },
    locationLabel: function (loc) { return loc.district ? loc.district + ' ' + loc.province : loc.province; },

    category: function (key) { return byKey(E.categories, key); },
    severity: function (key) { return byKey(E.severities, key); },
    alert: function (id) { return E.alerts.filter(function (a) { return a.id === id; })[0]; },

    isActive: function (a) { return !a.resolved && parse(a.sentAt) <= NOW && NOW < parse(a.expiresAt); },
    isNationwide: function (a) { return a.areas.some(function (x) { return x.province === '*'; }); },

    /* ─── เงื่อนไขการส่ง ─── */
    /** อยู่ในพื้นที่เป้าหมาย (ระดับเขต/อำเภอ) */
    inArea: function (a, loc) {
      return a.areas.some(function (x) {
        return x.province === '*' || (x.province === loc.province && (!x.district || x.district === loc.district));
      });
    },
    /** เกี่ยวข้องกับจังหวัดที่เลือก (ระดับจังหวัด) */
    inProvince: function (a, province) {
      return a.areas.some(function (x) { return x.province === '*' || x.province === province; });
    },
    inAudience: function (a, u) {
      var t = a.audience, age = EP.age(u);
      if (t.gender !== 'all' && t.gender !== u.gender) return false;
      if (t.ageMin != null && age < t.ageMin) return false;
      if (t.ageMax != null && age > t.ageMax) return false;
      return true;
    },
    /** ผู้ใช้ได้รับข้อความนี้หรือไม่ + เหตุผล */
    delivery: function (a, u) {
      var area = EP.inArea(a, u.location), aud = EP.inAudience(a, u), why = [];
      if (!area) why.push('อยู่นอกพื้นที่แจ้งเตือน');
      if (!aud) why.push('ไม่อยู่ในกลุ่มเป้าหมาย (' + EP.audienceLabel(a.audience) + ')');
      return { received: area && aud, inArea: area, inAudience: aud, reasons: why };
    },

    /* ─── ป้ายข้อความ ─── */
    audienceLabel: function (t) {
      var age = t.ageMin != null && t.ageMax != null ? 'อายุ ' + t.ageMin + '–' + t.ageMax + ' ปี'
        : t.ageMin != null ? 'อายุ ' + t.ageMin + ' ปีขึ้นไป'
        : t.ageMax != null ? 'อายุไม่เกิน ' + t.ageMax + ' ปี' : '';
      if (t.gender === 'all' && !age) return 'ประชาชนทุกคน';
      return (t.gender === 'all' ? 'ทุกเพศ' : EP.genderLabel(t.gender)) + (age ? ' ' + age : '');
    },
    provinces: function (a) {
      var seen = [];
      a.areas.forEach(function (x) { if (seen.indexOf(x.province) < 0) seen.push(x.province); });
      return seen;
    },
    areaShort: function (a) {
      if (EP.isNationwide(a)) return 'ทั่วประเทศ';
      var ps = EP.provinces(a);
      if (ps.length === 1) {
        var ds = a.areas.filter(function (x) { return x.district; }).map(function (x) { return x.district; });
        return ds.length === 1 ? ds[0] + ' ' + ps[0] : ds.length ? ps[0] + ' ' + ds.length + ' เขต/อำเภอ' : ps[0];
      }
      return ps.length > 2 ? ps.slice(0, 2).join(', ') + ' และอีก ' + (ps.length - 2) + ' จังหวัด' : ps.join(', ');
    },

    /** cls: extra classes, e.g. 'list-badge--corner' to pin it to a row's corner */
    statusTag: function (a, cls) {
      cls = cls ? ' ' + cls : '';
      if (a.resolved) return '<span class="tag tag--success tag--sm tag--dot' + cls + '">คลี่คลายแล้ว</span>';
      return EP.isActive(a)
        ? '<span class="tag tag--danger tag--sm tag--dot ep-live' + cls + '">กำลังมีผล</span>'
        : '<span class="tag tag--sm' + cls + '">สิ้นสุดแล้ว</span>';
    },
    severityTag: function (a) { var s = EP.severity(a.severity); return '<span class="tag ' + s.tag + ' tag--sm">' + s.label + '</span>'; },
    categoryTag: function (a) {
      var c = EP.category(a.category);
      return '<span class="tag tag--sm"><span class="material-symbols-outlined">' + c.icon + '</span>' + c.label + '</span>';
    },

    /** แถวการแจ้งเตือน ใช้ทั้งรายการประวัติ และกล่อง "กำลังมีผล" */
    alertRow: function (a, u, opts) {
      opts = opts || {};
      var c = EP.category(a.category), s = EP.severity(a.severity), e = EP.esc, d = EP.delivery(a, u);
      var note = !d.received && opts.showDelivery
        ? '<span class="ep-miss"><span class="material-symbols-outlined">notifications_off</span>ไม่ได้ส่งถึงคุณ · ' + e(d.reasons.join(' · ')) + '</span>' : '';
      return '<a class="list-item ep-alert ep-alert--' + s.tone + (EP.isActive(a) ? ' is-active' : '') + '" href="alert.html?id=' + a.id + '">' +
        '<span class="hp-icon tone-' + c.tone + '"><span class="material-symbols-outlined">' + c.icon + '</span></span>' +
        '<div class="hp-visit-body">' +
          EP.statusTag(a, 'list-badge--corner') +
          '<div class="hp-row" style="gap:var(--spacing-xs)">' + EP.severityTag(a) + (opts.hideCategory ? '' : EP.categoryTag(a)) + '</div>' +
          '<span class="hp-visit-title">' + e(a.title) + '</span>' +
          '<span class="ep-alert-desc">' + e(a.description) + '</span>' +
          '<span class="ep-meta">' +
            '<span><span class="material-symbols-outlined">account_balance</span>' + e(a.agency) + '</span>' +
            '<span><span class="material-symbols-outlined">schedule</span>' + (opts.timeOnly ? EP.time(a.sentAt) : EP.dateTime(a.sentAt)) + '</span>' +
            '<span><span class="material-symbols-outlined">location_on</span>' + e(EP.areaShort(a)) + '</span>' +
          '</span>' + note +
        '</div>' +
        '<span class="material-symbols-outlined chevron">chevron_right</span></a>';
    },

    callBtn: function (h) {
      return '<a class="cp-call tone-' + h.tone + '" href="tel:' + h.number + '">' +
        '<span class="material-symbols-outlined">call</span><span><strong>' + EP.esc(h.number) + '</strong>' +
        '<small>' + EP.esc(h.label) + '</small></span></a>';
    },

    detailsItem: function (label, value) {
      return '<div class="details-item"><span class="details-label">' + label + '</span><span class="details-value">' + value + '</span></div>';
    }
  };

  window.EP = EP;

  /* ─── Page chrome: back-to-top + source-note time ─── */
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.getElementById('back-to-top');
    if (b) window.addEventListener('scroll', function () { b.classList.toggle('visible', window.pageYOffset > 240); }, { passive: true });
    var now = new Date(), s = EP.dateLong(now) + ' เวลา ' + EP.time(now);
    document.querySelectorAll('.source-note-time').forEach(function (e) { e.textContent = s; });
  });
})();
