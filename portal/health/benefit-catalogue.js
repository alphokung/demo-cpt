/* ============================================================
   Benefit catalogue — การ์ดรายการสิทธิประโยชน์แบบค้นหา/กรองได้ พร้อมอ้างอิง
   ใช้กับข้อมูลรูปแบบเดียวกันของ sso-benefits.js และ csmbs-benefits.js:
     D.meta     = หัวข้อการ์ด ลิงก์เว็บไซต์หน่วยงาน หมวด (cats) และป้ายกำกับ
     D.sections = กลุ่มผู้มีสิทธิ (เช่น มาตรา 33/39/40) — การ์ดแสดงเฉพาะกลุ่มที่ส่งเข้ามาใน render()
     D.items    = รายการสิทธิ (cat, sec, title, detail, rates, cond, since, ref ...)
     D.refs     = แหล่งอ้างอิง (src: official | gov | news)
   ============================================================ */
(function () {
  var H = window.HEALTH, e = HP.esc;
  var SRC_NOTE = {
    gov: 'หน่วยงานรัฐเผยแพร่ซ้ำ — ไม่ใช่เว็บไซต์หน่วยงานเจ้าของสิทธิโดยตรง',
    news: 'สื่อข่าว — ไม่ใช่เว็บไซต์หน่วยงานเจ้าของสิทธิโดยตรง'
  };

  HP.benefitCatalogue = function (root, D) {
    var M = D.meta;
    var age = HP.age();
    var st = { sec: Object.keys(D.sections)[0], filter: 'all', q: '' };

    root.innerHTML =
      '<div class="hp-section-head">' +
        '<div class="section-title-container card-section__title-container">' +
          '<div class="section-bar card-section__bar--primary"></div>' +
          '<h3 class="section-title card-section__heading">' + e(M.title) + '</h3>' +
        '</div>' +
        '<a class="hp-link" href="' + e(M.site.url) + '" target="_blank" rel="noopener">' +
          '<span class="material-symbols-outlined">open_in_new</span>' + e(M.site.label) + '</a>' +
      '</div>' +
      '<div class="hp-notice" style="margin-bottom: var(--spacing-lg);"><span class="material-symbols-outlined">info</span><div>' + M.note + '</div></div>' +
      '<div class="hp-cat-sec" data-el="sec"></div>' +
      '<div class="hp-toolbar">' +
        '<label class="hp-search"><span class="material-symbols-outlined">search</span>' +
          '<input type="search" data-el="search" placeholder="' + e(M.searchPlaceholder) + '" aria-label="ค้นหา' + e(M.title) + '"></label>' +
        '<div class="filter-row" data-el="filters"></div>' +
        '<p class="hp-count" data-el="count"></p>' +
      '</div>' +
      '<div class="accordion" data-el="list"></div>' +
      '<details class="hp-refs"><summary><span class="material-symbols-outlined">menu_book</span>แหล่งอ้างอิง</summary><ol data-el="refs"></ol></details>';

    function $(name) { return root.querySelector('[data-el="' + name + '"]'); }

    function eligible(i) {
      if (i.cat !== 'health') return false;
      if (i.sex && i.sex !== H.user.sex) return false;
      if (i.bornBefore) return +H.user.birthDate.slice(0, 4) < i.bornBefore;
      return !i.ages || i.ages.some(function (r) { return age >= r[0] && age <= r[1]; });
    }
    function sectionItems() {
      return D.items.filter(function (i) { return i.sec.indexOf(st.sec) >= 0; });
    }
    function srcNote(r) {
      return r.src === 'official' ? '' : ' <em>(' + SRC_NOTE[r.src] + ')</em>';
    }
    function refLinks(keys) {
      return keys.map(function (k) {
        var r = D.refs[k];
        return '<a class="hp-ref" href="' + e(r.url) + '" target="_blank" rel="noopener">' +
          '<span class="material-symbols-outlined">open_in_new</span><span>' + e(r.title) + srcNote(r) + '</span></a>';
      }).join('');
    }

    function renderSection() {
      var s = D.sections[st.sec], L = M.labels;
      $('sec').innerHTML =
        '<p class="hp-cat-title"><span class="material-symbols-outlined">' + s.icon + '</span>' + e(s.label) + ' — ' + e(s.title) + '</p>' +
        '<div class="hp-kv hp-kv--3">' +
          '<div><p class="hp-kv-label">' + e(L.who) + '</p><p class="hp-kv-value">' + e(s.who) + '</p></div>' +
          '<div><p class="hp-kv-label">' + e(L.pay) + '</p><p class="hp-kv-value">' + e(s.pay) + '</p></div>' +
          '<div><p class="hp-kv-label">' + e(L.cover) + '</p><p class="hp-kv-value">' + e(s.cover) + '</p></div>' +
        '</div>' +
        '<div class="hp-notice hp-notice--warning" style="margin-top:var(--spacing-lg)"><span class="material-symbols-outlined">lightbulb</span><div>' + e(s.note) + '</div></div>' +
        '<div class="hp-ref-list">' + refLinks(s.ref) + '</div>';
    }

    function renderFilters() {
      var list = sectionItems();
      $('filters').innerHTML = M.cats.filter(function (c) {
        if (c.key === 'all') return true;
        if (c.key === 'mine') return list.some(eligible);
        return list.some(function (i) { return i.cat === c.key; });
      }).map(function (c) {
        return '<button class="filter-chip' + (c.key === st.filter ? ' active' : '') + '" data-filter="' + c.key + '">' +
          (c.icon ? '<span class="material-symbols-outlined" style="font-size:16px">' + c.icon + '</span>' : '') + e(c.label) + '</button>';
      }).join('');
      root.querySelectorAll('[data-filter]').forEach(function (b) {
        b.onclick = function () { st.filter = b.dataset.filter; renderFilters(); renderList(); };
      });
    }

    function renderList() {
      var q = st.q.trim().toLowerCase();
      var list = sectionItems().filter(function (i) {
        if (st.filter === 'mine' && !eligible(i)) return false;
        if (st.filter !== 'mine' && st.filter !== 'all' && i.cat !== st.filter) return false;
        var text = i.title + i.detail + i.cond + (i.rates || []).map(function (r) { return r.label + r.value; }).join('');
        if (q && text.toLowerCase().indexOf(q) < 0) return false;
        return true;
      });

      $('count').textContent = 'พบ ' + list.length + ' รายการ' +
        (st.filter === 'mine' ? ' ที่เหมาะกับอายุ ' + age + ' ปี เพศ' + H.user.sex : '');

      if (!list.length) {
        $('list').innerHTML = '<div class="hp-empty"><span class="material-symbols-outlined">search_off</span>ไม่พบสิทธิประโยชน์ที่ตรงกับเงื่อนไข</div>';
        return;
      }

      $('list').innerHTML = list.map(function (i) {
        var tags = '';
        if (eligible(i) && st.filter !== 'mine') tags += '<span class="tag tag--primary tag--sm">เหมาะกับคุณ</span>';
        if (i.opts) tags += i.opts.map(function (o) { return '<span class="tag tag--info tag--sm">ทางเลือก ' + o + '</span>'; }).join('');
        if (i.since && HP.daysUntil(i.since) > -365) {
          tags += HP.daysUntil(i.since) > 0
            ? '<span class="tag tag--info tag--sm">มีผล ' + HP.dateShort(i.since) + '</span>'
            : '<span class="tag tag--success tag--sm">ปรับปรุง ' + HP.dateShort(i.since) + '</span>';
        }

        var body =
          '<div class="hp-kv">' +
            '<div><p class="hp-kv-label">สิทธิที่ได้รับ</p><p class="hp-kv-value">' + e(i.detail) + '</p></div>' +
            (i.rates ? '<div><p class="hp-kv-label">อัตรา / วงเงิน</p><div class="hp-rates">' + i.rates.map(function (r) {
              return '<div class="hp-rate"><span class="hp-rate-label">' + e(r.label) + '</span><span class="hp-rate-value">' + e(r.value) + '</span></div>';
            }).join('') + '</div></div>' : '') +
            '<div><p class="hp-kv-label">เงื่อนไขการรับสิทธิ</p><p class="hp-kv-value">' + e(i.cond) + '</p></div>' +
            (i.since ? '<div><p class="hp-kv-label">มีผลตั้งแต่</p><p class="hp-kv-value">' + HP.dateLong(i.since) + '</p></div>' : '') +
            '<div><p class="hp-kv-label">อ้างอิง</p><div class="hp-ref-list">' + refLinks(i.ref) + '</div></div>' +
          '</div>';

        return '<div class="accordion-item">' +
          '<div class="accordion-header" onclick="toggleAccordion(this)">' +
            '<div class="hp-bn-head"><span class="accordion-title">' + e(i.title) + '</span>' +
              '<div class="hp-bn-tags">' + tags + '</div></div>' +
            '<span class="accordion-icon"><span class="material-symbols-outlined">expand_more</span></span>' +
          '</div>' +
          '<div class="accordion-body"><div class="accordion-body-inner">' + body + '</div></div>' +
        '</div>';
      }).join('');
    }

    $('refs').innerHTML = Object.keys(D.refs).map(function (k) {
      var r = D.refs[k];
      return '<li><a href="' + e(r.url) + '" target="_blank" rel="noopener">' + e(r.title) + '</a>' + srcNote(r) + '</li>';
    }).join('');
    $('search').addEventListener('input', function () { st.q = this.value; renderList(); });

    return {
      /** section = กลุ่มผู้มีสิทธิที่จะแสดง (เช่น '33') */
      render: function (section) {
        st.sec = section;
        if (st.filter !== 'all' && !sectionItems().some(function (i) { return st.filter === 'mine' ? eligible(i) : i.cat === st.filter; })) st.filter = 'all';
        renderSection(); renderFilters(); renderList();
      }
    };
  };
})();
