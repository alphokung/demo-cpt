/* ============================================================
   สิทธิประโยชน์ประกันสังคม — ค้นหาสิทธิตามข้อมูลของผู้ใช้
   ข้อมูล: SSO_DATA (sso-benefits.js ← data/sso_benefits.json)
   คัดสิทธิตาม meta.matching_rules_th: มาตรา/ทางเลือก → เพศ → อายุ → สถานะทุพพลภาพ
   มาตราและทางเลือก ม.40 มาจากสิทธิของผู้ใช้ (health-data.js) — อายุ/เพศมาจากข้อมูลบุคคล
   สถานะทุพพลภาพไม่มีในข้อมูลบุคคล จึงให้ผู้ใช้เลือกเอง (จำไว้ในเครื่อง)
   ใช้:  var sso = HP.ssoRights(rootEl, SSO_DATA);  sso.render('33' | '39' | '40', '40_3')
   ============================================================ */
(function () {
  var H = window.HEALTH, e = HP.esc;
  var STORE = 'hp.sso.profile';

  var CAT_ICON = { sickness: 'medical_services', dental: 'dentistry', maternity: 'pregnant_woman', disability: 'accessible',
    death: 'deceased', child: 'child_care', old_age: 'elderly', unemployment: 'work_off' };
  // 7 กรณีที่ประกันสังคมคุ้มครอง — ชื่อในข้อมูลแต่ละมาตราต่างกันเล็กน้อย จึงแปลงให้ตรงกันก่อนเทียบ
  var CASES = [
    { key: 'เจ็บป่วย', icon: 'medical_services' }, { key: 'คลอดบุตร', icon: 'pregnant_woman' },
    { key: 'ทุพพลภาพ', icon: 'accessible' }, { key: 'ตาย', icon: 'deceased' },
    { key: 'สงเคราะห์บุตร', icon: 'child_care' }, { key: 'ชราภาพ', icon: 'elderly' }, { key: 'ว่างงาน', icon: 'work_off' }
  ];
  var CASE_ALIAS = { 'เสียชีวิต': 'ตาย', 'ประสบอันตรายหรือเจ็บป่วย': 'เจ็บป่วย' };
  var SEC_LABEL = { '33': 'มาตรา 33', '39': 'มาตรา 39', '40_1': 'มาตรา 40 ทางเลือกที่ 1', '40_2': 'มาตรา 40 ทางเลือกที่ 2', '40_3': 'มาตรา 40 ทางเลือกที่ 3' };
  var OPTS = ['40_1', '40_2', '40_3'];

  function fmt(n) { return typeof n === 'number' ? n.toLocaleString('th-TH') : n; }
  function ms(name) { return '<span class="material-symbols-outlined" aria-hidden="true">' + name + '</span>'; }
  function ul(arr) { return '<ul class="hp-sso-list">' + arr.map(function (x) { return '<li>' + e(x) + '</li>'; }).join('') + '</ul>'; }
  function toggle(id, label, desc, on) {
    return '<div class="toggle-item">' +
      '<div class="toggle-text"><p class="toggle-label" id="' + id + '-l">' + e(label) + '</p>' + (desc ? '<p class="toggle-desc">' + e(desc) + '</p>' : '') + '</div>' +
      '<label class="toggle-switch"><input type="checkbox" data-el="' + id + '" aria-labelledby="' + id + '-l"' + (on ? ' checked' : '') + '><span class="toggle-track"></span></label>' +
    '</div>';
  }

  HP.ssoRights = function (root, D) {
    var cats = D.dictionaries.categories.slice().sort(function (a, b) { return a.order - b.order; });
    var CAT = {}, BY_ID = {}, LIFE = {};
    cats.forEach(function (c) { CAT[c.id] = c.label_th; });
    D.benefits.forEach(function (b) { BY_ID[b.id] = b; });
    D.dictionaries.life_events.forEach(function (l) { LIFE[l.id] = l.label_th; });

    var me = { age: HP.age(), gender: H.user.sex === 'หญิง' ? 'female' : 'male' };
    var st = { sec: '33', mine: '33', dis: false, showAll: false, q: '', cat: 'all' };
    try { var saved = JSON.parse(localStorage.getItem(STORE) || 'null'); if (saved) { st.dis = !!saved.dis; st.showAll = !!saved.showAll; } } catch (x) {}
    function save() { try { localStorage.setItem(STORE, JSON.stringify({ dis: st.dis, showAll: st.showAll })); } catch (x) {} }

    root.innerHTML =
      '<div class="card" data-el="summary"></div>' +
      '<div class="card">' +
        '<div class="hp-section-head">' + HP.sectionTitle('รายการสิทธิประโยชน์') +
          '<span class="hp-muted">' + e(D.meta.data_as_of_th) + '</span></div>' +
        '<div class="hp-toolbar">' +
          '<label class="hp-search">' + ms('search') +
            '<input type="search" data-el="q" placeholder="ค้นหา เช่น ทำฟัน คลอด ตกงาน บำนาญ" aria-label="ค้นหาสิทธิประกันสังคม"></label>' +
          '<div class="filter-row hp-sso-cats" data-el="cats" role="group" aria-label="หมวดสิทธิ"></div>' +
          '<p class="hp-count" data-el="count" aria-live="polite"></p>' +
        '</div>' +
        '<div data-el="results"></div>' +
      '</div>' +
      '<div class="card" data-el="compare" hidden></div>' +
      '<div class="card" data-el="howto"></div>';

    function $(name) { return root.querySelector('[data-el="' + name + '"]'); }
    function is40() { return st.sec.indexOf('40') === 0; }
    function S() { return D.sections[is40() ? '40' : st.sec]; }

    /* ─── คัดสิทธิ: null = ไม่ใช่สิทธิของมาตรานี้ · {ok, why[]} = ได้รับ / ยังไม่เข้าเงื่อนไขเพราะอะไร ─── */
    function evaluate(b) {
      if (b.benefit_type === 'กลุ่มสิทธิ' || b.applicable_sections.indexOf(st.sec) < 0) return null;
      var el = b.eligibility, why = [];
      if (el.gender !== 'all' && el.gender !== me.gender) why.push(el.gender === 'female' ? 'เฉพาะผู้ประกันตนหญิง' : 'เฉพาะผู้ประกันตนชาย');
      if (el.age_min != null && me.age < el.age_min) why.push('ใช้สิทธิได้เมื่ออายุครบ ' + el.age_min + ' ปี');
      if (el.age_max != null && me.age > el.age_max) why.push('สำหรับอายุไม่เกิน ' + el.age_max + ' ปี');
      if (el.disability === 'required' && !st.dis) why.push('เฉพาะผู้ทุพพลภาพ');
      return { ok: !why.length, why: why };
    }
    function matches(b) {
      if (!st.q) return true;
      var hay = [b.name_th, b.summary_th, CAT[b.category], b.amount && b.amount.display_th]
        .concat(b.keywords || [], b.conditions_th || []).join(' ').toLowerCase();
      return st.q.toLowerCase().split(/\s+/).filter(Boolean).every(function (t) { return hay.indexOf(t) >= 0; });
    }
    // ลิงก์ไปคู่มือการประกันสังคมฉบับออนไลน์ (flipbook เปิดแท็บใหม่) — เลขหน้าแต่ละเลขลิงก์ตรงไปหน้านั้นด้วย #page/N
    // pages = เลขหน้าในคู่มือ (ไม่ระบุ = ลิงก์ไปหน้าแรกของเล่ม)
    // เลขหน้าใน flipbook = เลขหน้าในคู่มือ + source_url_page_offset (หน้าปก/หน้าแทรกก่อนหน้า 1)
    function manualUrl(page) { return D.meta.source_url + (page ? '#page/' + (page + (D.meta.source_url_page_offset || 0)) : ''); }
    function manualLink(pages) {
      var attrs = ' target="_blank" rel="noopener"';
      if (!pages || !pages.length) {
        return '<a class="hp-sso-ref" href="' + e(manualUrl()) + '"' + attrs + '>คู่มือการประกันสังคม' + ms('open_in_new') + '</a>';
      }
      return '<span class="hp-sso-ref-wrap">คู่มือการประกันสังคม หน้า ' + pages.map(function (pg) {
        return '<a class="hp-sso-ref" href="' + e(manualUrl(pg)) + '"' + attrs +
          ' aria-label="เปิดคู่มือการประกันสังคม หน้า ' + pg + ' (แท็บใหม่)">' + pg + '</a>';
      }).join(', ') + ms('open_in_new') + '</span>';
    }
    function amountText(b) {
      var o = b.amount_by_option && b.amount_by_option[st.sec];
      if (o != null) return typeof o === 'number' ? fmt(o) + ' บาท' : o;
      return (b.amount && b.amount.display_th) || '';
    }
    function shortContrib(c) {
      if (c.months_paid && c.within_months) return 'สมทบ ' + c.months_paid + ' ใน ' + c.within_months + ' เดือน';
      if (c.months_paid) return 'สมทบ ' + c.months_paid + ' เดือนขึ้นไป';
      if (c.months_paid_max) return 'สมทบไม่ถึง ' + (c.months_paid_max + 1) + ' เดือน';
      return 'มีเงื่อนไขเงินสมทบ';
    }
    function ageGroup() {
      var g = D.dictionaries.age_groups.filter(function (g) { return me.age >= g.min && me.age <= g.max; })[0];
      return g ? g.label_th : '';
    }

    /* ─── ตารางอัตรา: items / tiers ตามทางเลือก ม.40 / tiers ตามเดือนที่สมทบ / tiers วงเงิน ─── */
    function table(head, rows) {
      return '<div class="hp-sso-tbl"><table class="hp-sso-table"><thead><tr>' + head.join('') + '</tr></thead><tbody>' +
        rows.join('') + '</tbody></table></div>';
    }
    function ratesHtml(a) {
      if (a.items) return table(['<th>กรณี</th>', '<th>สิทธิที่ได้รับ</th>'], a.items.map(function (i) {
        return '<tr><td>' + e(i.label) + '</td><td>' + e(i.display_th) + '</td></tr>';
      }));
      if (!a.tiers) return '';
      var t0 = a.tiers[0];
      if (t0.condition_th) return table(['<th>เงื่อนไขการจ่ายเงินสมทบ</th>'].concat(OPTS.map(function (o) {
        return '<th class="num' + (o === st.sec ? ' is-sel' : '') + '">ทางเลือก ' + o.slice(-1) + '</th>';
      })), a.tiers.map(function (t) {
        return '<tr><td>' + e(t.condition_th) + '</td>' + OPTS.map(function (o) {
          return '<td class="num' + (o === st.sec ? ' is-sel' : '') + '">' + fmt(t[o]) + ' บาท</td>';
        }).join('') + '</tr>';
      }));
      if ('contribution_months_min' in t0) return table(['<th>จำนวนเดือนที่จ่ายเงินสมทบ</th>', '<th>สิทธิที่ได้รับ</th>'], a.tiers.map(function (t) {
        var r = t.contribution_months_max == null ? 'ตั้งแต่ ' + t.contribution_months_min + ' เดือนขึ้นไป'
          : t.contribution_months_min === 0 ? 'ต่ำกว่า ' + (t.contribution_months_max + 1) + ' เดือน'
          : t.contribution_months_min + '–' + t.contribution_months_max + ' เดือน';
        var v = t.display_th || t.percent_of_wage + '% ของค่าจ้าง × ' + t.months_multiplier + ' เดือน';
        return '<tr><td>' + r + '</td><td>' + e(v) + '</td></tr>';
      }));
      var unit = a.per ? 'บาท/' + a.per : 'บาท';
      return table(['<th>รายการ</th>', '<th class="num">ไม่เกิน</th>'], a.tiers.map(function (t) {
        return '<tr><td>' + e(t.label) + (t.detail_th ? '<span class="hp-sso-cell-sub">' + e(t.detail_th) + '</span>' : '') + '</td>' +
          '<td class="num">' + fmt(t.max) + ' ' + unit + '</td></tr>';
      })) +
        (a.total_max ? '<p class="hp-muted hp-sso-after">รวมทั้งหมดไม่เกิน ' + fmt(a.total_max) + ' บาท</p>' : '') +
        (a.renewal_years ? '<p class="hp-muted hp-sso-after">ใช้สิทธิใหม่ได้เมื่อครบ ' + a.renewal_years + ' ปี นับแต่วันที่ใส่ฟันเทียม</p>' : '');
    }

    function itemHtml(b, ev) {
      var a = b.amount || {}, c = b.contribution_requirement, el = b.eligibility;
      var tags = [];
      if (c && c.text_th) tags.push('<span class="tag tag--sm">' + ms('event_repeat') + e(shortContrib(c)) + '</span>');
      if (el.life_event) tags.push('<span class="tag tag--sm">' + ms('event') + 'เมื่อ' + e(LIFE[el.life_event]) + '</span>');
      if (b.beneficiary && b.beneficiary !== 'ผู้ประกันตน') tags.push('<span class="tag tag--sm">' + ms('group') + 'ผู้รับ: ' + e(b.beneficiary) + '</span>');
      if (el.gender === 'female' && ev.ok) tags.push('<span class="tag tag--info tag--sm">' + ms('female') + 'เฉพาะหญิง</span>');
      ev.why.forEach(function (w) { tags.push('<span class="tag tag--warning tag--sm">' + ms('info') + e(w) + '</span>'); });

      var det = [], rates = ratesHtml(a);
      if (rates) det.push('<div><p class="hp-kv-label">อัตราที่ได้รับ</p>' + rates + '</div>');
      else if (amountText(b)) det.push('<div><p class="hp-kv-label">จำนวนเงิน / สิทธิที่ได้รับ</p><p class="hp-kv-value">' + e(amountText(b)) + '</p></div>');
      if (c && c.text_th) det.push('<div><p class="hp-kv-label">เงื่อนไขการจ่ายเงินสมทบ</p><p class="hp-kv-value">' + e(c.text_th) + '</p></div>');
      if (b.conditions_th && b.conditions_th.length) det.push('<div><p class="hp-kv-label">เงื่อนไขอื่น</p>' + ul(b.conditions_th) + '</div>');
      var notes = (b.notes_th || []).concat(b.parent_id && BY_ID[b.parent_id] ? BY_ID[b.parent_id].notes_th || [] : []);
      if (notes.length) det.push('<div class="hp-sso-notes">' + notes.map(function (n) {
        return '<p class="hp-sso-note">' + ms('info') + '<span>' + e(n) + '</span></p>';
      }).join('') + '</div>');
      det.push('<p class="hp-sso-note">' + ms('menu_book') + '<span>' + manualLink(b.source_pages) + '</span></p>');

      return '<div class="accordion-item' + (ev.ok ? '' : ' hp-sso-item--off') + '">' +
        '<div class="accordion-header" role="button" tabindex="0" aria-expanded="false" onclick="toggleAccordion(this)">' +
          HP.benefitHead(b.name_th, b.summary_th, tags.join('')) +
          '<span class="accordion-icon">' + ms('expand_more') + '</span>' +
        '</div>' +
        '<div class="accordion-body"><div class="accordion-body-inner"><div class="hp-kv">' + det.join('') + '</div></div></div>' +
      '</div>';
    }

    /* ─── การ์ดสรุป: มาตรา · เงินสมทบ · กรณีที่คุ้มครอง · ข้อมูลที่ใช้คัดสิทธิ ─── */
    function renderSummary() {
      var s = S(), key = is40() ? '40' : st.sec, pay, covered, alerts = [];
      if (key === '33') {
        pay = '<b>' + s.contribution.employee_percent + '%</b> ของค่าจ้าง';
        covered = s.coverage_list_th;
        if (me.age < s.age_min || me.age > s.age_max) alerts.push('ผู้ขึ้นทะเบียนมาตรา 33 ต้องมีอายุ ' + s.age_min + '–' + s.age_max + ' ปี ณ วันขึ้นทะเบียน');
      } else if (key === '39') {
        pay = '<b>' + fmt(s.contribution.amount) + '</b> บาท/เดือน';
        covered = s.coverage_list_th;
      } else {
        var o = s.options.filter(function (x) { return x.id === st.sec; })[0];
        pay = '<b>' + fmt(o.contribution) + '</b> ' + e(o.unit);
        covered = o.coverage_list_th;
        var r = s.eligibility_rules;
        if (me.age < r.age_min || me.age > r.age_max) alerts.push('ผู้สมัครมาตรา 40 ต้องมีอายุ ' + r.age_min + '–' + r.age_max + ' ปี');
      }
      var cov = covered.map(function (c) { return CASE_ALIAS[c] || c; });
      var dict = D.dictionaries.sections.filter(function (x) { return x.id === st.sec; })[0];
      var payNote = key === '33' ? 'นายจ้างสมทบอีก ' + s.contribution.employer_percent + '% และรัฐ' + s.contribution.government
        : key === '39' ? s.contribution.formula_th : 'จ่ายเองทุกเดือน เลือกเปลี่ยนทางเลือกได้';

      var optTabs = is40() ? '<div class="hp-sso-opts">' +
        '<p class="hp-kv-label">เปรียบเทียบทางเลือกมาตรา 40</p>' +
        '<div class="tab-bar tab-bar--pill" role="group" aria-label="ทางเลือกมาตรา 40">' + s.options.map(function (o) {
          return '<button type="button" class="tab-btn' + (o.id === st.sec ? ' active' : '') + '" data-opt="' + o.id + '" aria-pressed="' + (o.id === st.sec) + '">' +
            'ทางเลือก ' + o.id.slice(-1) + '<small>' + o.contribution + ' บาท' + (o.id === st.mine ? ' · ของคุณ' : '') + '</small></button>';
        }).join('') + '</div></div>' : '';

      var elig = s.eligibility_th || [], notElig = s.not_eligible_th || [];

      $('summary').innerHTML =
        '<div class="hp-section-head">' + HP.sectionTitle('สิทธิประกันสังคมของคุณ') +
          '<a class="hp-link" href="' + e(D.contacts.website) + '" target="_blank" rel="noopener">' + ms('open_in_new') + 'sso.go.th</a></div>' +

        '<div class="hp-sso-sec">' +
          '<span class="hp-icon tone-secondary">' + ms(is40() ? 'storefront' : 'badge') + '</span>' +
          '<div class="hp-sso-sec-text">' +
            '<p class="hp-sso-sec-name">' + e(SEC_LABEL[st.sec]) + (st.sec !== st.mine ? ' <span class="tag tag--warning tag--sm">ตัวอย่าง</span>' : '') + '</p>' +
            '<p class="hp-muted">' + e(dict ? dict.description_th : s.name_th) + '</p>' +
          '</div>' +
          '<div class="hp-sso-pay"><p class="hp-kv-label">เงินสมทบ</p><p class="hp-sso-pay-value">' + pay + '</p><p class="hp-muted">' + e(payNote) + '</p></div>' +
        '</div>' +
        optTabs +

        '<div class="hp-sso-block">' +
          '<p class="hp-kv-label">คุ้มครอง ' + cov.length + ' จาก ' + CASES.length + ' กรณี</p>' +
          '<div class="hp-sso-cases">' + CASES.map(function (c) {
            var on = cov.indexOf(c.key) >= 0;
            return '<span class="hp-sso-case' + (on ? '' : ' is-off') + '">' + ms(on ? 'check_circle' : 'block') + c.key +
              '<span class="sr-only">' + (on ? ' (คุ้มครอง)' : ' (ไม่คุ้มครอง)') + '</span></span>';
          }).join('') + '</div>' +
          (s.definition_th ? '<p class="hp-muted">' + e(s.definition_th) + '</p>' : '') +
        '</div>' +

        alerts.map(function (a) { return '<div class="hp-notice hp-notice--warning">' + ms('warning') + '<span>' + e(a) + '</span></div>'; }).join('') +

        '<div class="hp-sso-block hp-sso-profile">' +
          '<p class="hp-kv-label">คัดสิทธิจากข้อมูลของคุณ</p>' +
          '<div class="hp-bn-tags">' +
            '<span class="tag tag--primary tag--sm">' + ms('cake') + 'อายุ ' + me.age + ' ปี · ช่วง ' + e(ageGroup()) + '</span>' +
            '<span class="tag tag--primary tag--sm">' + ms(me.gender) + 'เพศ' + e(H.user.sex) + '</span>' +
          '</div>' +
          toggle('dis', 'ฉันเป็นผู้ทุพพลภาพ', 'ตามเกณฑ์ประกันสังคม คือสูญเสียสมรรถภาพการทำงานตั้งแต่ 35% ขึ้นไป ตามการประเมินของแพทย์ — ไม่ได้หมายถึงการมีบัตรคนพิการเท่านั้น', st.dis) +
          toggle('all', 'แสดงสิทธิที่ยังไม่เข้าเงื่อนไขด้วย', 'เช่น ยังอายุไม่ถึง หรือเป็นสิทธิเฉพาะอีกเพศ', st.showAll) +
        '</div>' +

        (elig.length ? '<details class="hp-refs hp-sso-more"><summary>' + ms('fact_check') + 'คุณสมบัติผู้ประกันตน' + e(SEC_LABEL[st.sec].replace(/ ทางเลือกที่ \d/, '')) + '</summary>' +
          ul(elig) + (notElig.length ? '<p class="hp-kv-label hp-sso-after">ไม่มีสิทธิสมัคร</p>' + ul(notElig) : '') + '</details>' : '');

      $('dis').onchange = function () { st.dis = this.checked; save(); renderResults(); };
      $('all').onchange = function () { st.showAll = this.checked; save(); renderResults(); };
      root.querySelectorAll('[data-opt]').forEach(function (btn) {
        btn.onclick = function () { st.sec = btn.dataset.opt; renderAll(); };
      });
    }

    /* ─── รายการสิทธิ แยกตามหมวด ─── */
    function renderResults() {
      var rows = D.benefits.map(function (b) { return { b: b, ev: evaluate(b) }; }).filter(function (r) { return r.ev && matches(r.b); });
      var visible = rows.filter(function (r) { return r.ev.ok || st.showAll; });
      var okN = rows.filter(function (r) { return r.ev.ok; }).length, offN = rows.length - okN;
      var cnt = {};
      visible.forEach(function (r) { cnt[r.b.category] = (cnt[r.b.category] || 0) + 1; });
      if (st.cat !== 'all' && !cnt[st.cat]) st.cat = 'all';

      $('cats').innerHTML = [{ id: 'all', label_th: 'ทั้งหมด', n: visible.length }].concat(cats.filter(function (c) { return cnt[c.id]; }).map(function (c) {
        return { id: c.id, label_th: c.label_th, n: cnt[c.id], icon: CAT_ICON[c.id] };
      })).map(function (c) {
        return '<button type="button" class="filter-chip' + (st.cat === c.id ? ' active' : '') + '" data-cat="' + c.id + '" aria-pressed="' + (st.cat === c.id) + '">' +
          (c.icon ? ms(c.icon) : '') + e(c.label_th) + '<span class="hp-sso-n">' + c.n + '</span></button>';
      }).join('');
      root.querySelectorAll('[data-cat]').forEach(function (btn) {
        btn.onclick = function () { st.cat = btn.dataset.cat; renderResults(); };
      });

      $('count').innerHTML = 'คุณได้รับ <b>' + okN + '</b> สิทธิ' + (st.q ? ' ที่ตรงกับ “' + e(st.q) + '”' : '') +
        (offN ? ' · ' + offN + ' สิทธิยังไม่เข้าเงื่อนไข' + (st.showAll ? ' (แสดงด้วยพื้นสีเทา)' : '') : '');

      var shown = visible.filter(function (r) { return st.cat === 'all' || r.b.category === st.cat; });
      if (!shown.length) {
        $('results').innerHTML = '<div class="hp-empty">' + ms('search_off') + 'ไม่พบสิทธิที่ตรงกับคำค้นหา ลองใช้คำอื่น เช่น “ฟัน” “คลอด” “บำนาญ”</div>';
        return;
      }
      $('results').innerHTML = cats.map(function (c) {
        var list = shown.filter(function (r) { return r.b.category === c.id; });
        if (!list.length) return '';
        list.sort(function (x, y) { return y.ev.ok - x.ev.ok; });
        var ok = list.filter(function (r) { return r.ev.ok; }).length;
        return '<section class="hp-sso-group" aria-label="' + e(c.label_th) + '">' +
          '<div class="hp-sso-group-head"><span class="hp-icon hp-icon--sm tone-primary">' + ms(CAT_ICON[c.id]) + '</span>' +
            '<div><h4 class="hp-sso-group-title">' + e(c.label_th) + '</h4>' +
            '<p class="hp-muted">' + ok + ' สิทธิที่ได้รับ' + (list.length > ok ? ' · ' + (list.length - ok) + ' ยังไม่เข้าเงื่อนไข' : '') + '</p></div></div>' +
          '<div class="accordion">' + list.map(function (r) { return itemHtml(r.b, r.ev); }).join('') + '</div>' +
        '</section>';
      }).join('');
    }

    /* ─── ตารางเปรียบเทียบ 3 ทางเลือกของมาตรา 40 (คู่มือหน้า 24–26) — แสดงเฉพาะ ม.40 ─── */
    function renderCompare() {
      var el = $('compare'), cmp = D.sections['40'].comparison;
      el.hidden = !is40() || !cmp;
      if (el.hidden) return;
      var head = '<tr><th>ความคุ้มครอง</th>' + OPTS.map(function (o) {
        var opt = D.sections['40'].options.filter(function (x) { return x.id === o; })[0];
        return '<th class="num' + (o === st.sec ? ' is-sel' : '') + '">ทางเลือก ' + o.slice(-1) +
          '<span class="hp-sso-cell-sub">' + fmt(opt.contribution) + ' บาท/เดือน</span></th>';
      }).join('') + '</tr>';
      var body = cmp.groups.map(function (g) {
        return '<tr class="hp-sso-grp"><td colspan="4"><span class="hp-sso-grp-icon">' + ms(CAT_ICON[g.case]) + '</span>' +
          '<span><strong>' + e(g.case_th) + '</strong> · ' + e(g.sub_th) +
          '<span class="hp-sso-cell-sub">เงื่อนไข: ' + e(g.condition_th) + '</span></span></td></tr>' +
          g.rows.map(function (r) {
            return '<tr><td>' + e(r.label_th) + (r.condition_th ? '<span class="hp-sso-cell-sub">' + e(r.condition_th) + '</span>' : '') + '</td>' +
              OPTS.map(function (o) {
                var val = r.values[o];
                return '<td class="num' + (o === st.sec ? ' is-sel' : '') + (val === 'ไม่คุ้มครอง' ? ' is-off' : '') + '">' + e(val) + '</td>';
              }).join('') + '</tr>';
          }).join('');
      }).join('');
      el.innerHTML =
        '<div class="hp-section-head">' + HP.sectionTitle(e(cmp.title_th)) + '</div>' +
        '<p class="hp-muted">คอลัมน์สีเขียวคือทางเลือกที่คุณกำลังดู · แตะที่ทางเลือกด้านบนเพื่อเปลี่ยน</p>' +
        '<div class="hp-sso-tbl"><table class="hp-sso-table hp-sso-cmp"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>' +
        '<p class="hp-sso-note">' + ms('menu_book') + '<span>' + e(cmp.note_th) + ' · ' + manualLink(cmp.source_pages) + '</span></p>';
    }

    /* ─── วิธียื่นขอรับสิทธิ + ช่องทางติดต่อ ─── */
    /* ─── ช่องทางแบบไอคอน (ตามคู่มือหน้า 27–28): ข้อความ → ไอคอน · "ชื่อ (รายละเอียด)" → หัวข้อ + บรรทัดรอง ─── */
    var CH_ICON = [
      [/ออนไลน์|e-Self|อิเล็กทรอนิกส์|www\./, 'computer'],
      [/ไปรษณีย์ลงทะเบียน/, 'mail'],
      [/ธนาณัติ/, 'local_post_office'],
      [/พร้อมเพย์/, 'qr_code_2'],
      [/ธนาคาร|บัญชี/, 'account_balance'],
      [/สำนักงาน/, 'apartment']
    ];
    function chIcon(t) { for (var i = 0; i < CH_ICON.length; i++) if (CH_ICON[i][0].test(t)) return CH_ICON[i][1]; return 'check_circle'; }
    function tile(icon, title, sub, chips, note, wide) {
      return '<div class="hp-sso-ch' + (wide ? ' hp-sso-ch--wide' : '') + '"><span class="hp-icon hp-icon--sm tone-primary">' + ms(icon) + '</span>' +
        '<div class="hp-sso-ch-body"><p class="hp-sso-ch-title">' + e(title) + '</p>' +
          (sub ? '<p class="hp-sso-ch-sub">' + e(sub) + '</p>' : '') +
          (chips && chips.length ? '<div class="hp-sso-chips">' + chips.map(function (c) { return '<span class="hp-sso-chip">' + e(c) + '</span>'; }).join('') + '</div>' : '') +
          (note ? '<p class="hp-sso-ch-foot">' + ms('info') + '<span>' + e(note) + '</span></p>' : '') +
        '</div></div>';
    }
    // "รับเงินผ่านธนาคาร: ออมสิน, ธ.ก.ส." → หัวข้อ + chips · "สำนักงาน…สาขา (ทั่วประเทศ)" → หัวข้อ + บรรทัดรอง
    function textTile(t, extraChips, note) {
      var m = t.match(/^([^:]+):\s*(.+)$/);
      if (m) return tile(chIcon(t), m[1], '', m[2].split(/,\s*/), note);
      m = t.match(/^(.*?)\s*\(([^)]*)\)$/);
      // การ์ดที่มีรายชื่อธนาคารยาว (extraChips) ขยายเต็มแถว
      return tile(chIcon(t), m ? m[1] : t, m ? m[2] : '', extraChips, note, !!(extraChips && extraChips.length));
    }
    function chGroup(icon, title, tiles, foot) {
      return '<section class="hp-sso-chgroup"><p class="hp-sso-chgroup-title">' + ms(icon) + e(title) + '</p>' +
        '<div class="hp-sso-chs">' + tiles.join('') + '</div>' + (foot || '') + '</section>';
    }

    /* ─── วิธียื่นขอรับสิทธิ + ช่องทางติดต่อ ─── */
    function renderHowto() {
      var C = is40() ? D.claims.section_40 : D.claims.section_33_39, s = S(), groups = [];
      groups.push(chGroup('location_on', 'ยื่นได้ที่', C.where_th.map(function (t) { return textTile(t); })));
      groups.push(chGroup('account_balance_wallet', 'ช่องทางรับเงิน', C.payout_channels_th.map(function (t) {
        // ม.33/39: รายชื่อธนาคารที่รองรับ (supported_banks) และข้อจำกัด (bank_restrictions_th) อยู่ในการ์ด "บัญชีธนาคาร"
        var bank = chIcon(t) === 'account_balance';
        return textTile(t, bank ? C.supported_banks : null, bank ? C.bank_restrictions_th : null);
      })));
      var p = s.payment_channels_th;
      if (p) {
        var pay = (p.office || []).map(function (t) { return tile('apartment', t); });
        if ((p.counters || []).length) pay.push(tile('storefront', 'เคาน์เตอร์ธนาคารและหน่วยบริการ', '', p.counters));
        if ((p.bank_deduction || []).length) pay.push(tile('account_balance', 'หักบัญชีเงินฝากธนาคาร', '', p.bank_deduction));
        if ((p.mobile_apps || []).length) pay.push(tile('smartphone', 'แอปพลิเคชัน', '', p.mobile_apps));
        if (p.e_self_service) pay.push(tile('qr_code_scanner', 'ผ่านระบบ e-Self Service', p.e_self_service));
        groups.push(chGroup('payments', 'ช่องทางจ่ายเงินสมทบ', pay));
      } else if (st.sec === '33') {
        groups.push(chGroup('payments', 'การจ่ายเงินสมทบ', [tile('business_center', 'นายจ้างหักจากค่าจ้างและนำส่งให้ทุกเดือน', s.contribution.deadline_th)]));
      }
      $('howto').innerHTML =
        HP.sectionTitle('วิธียื่นขอรับสิทธิ' + (C.form ? ' (แบบ ' + e(C.form) + ')' : '')) +
        '<div class="hp-notice">' + ms('schedule') + '<span>ยื่นคำขอ<strong>' + e(C.deadline_th) + '</strong> หากเกินกำหนดจะหมดสิทธิรับประโยชน์ทดแทนครั้งนั้น</span></div>' +
        groups.join('') +
        '<p class="hp-muted hp-sso-source">ที่มา: ' + manualLink() + ' สำนักงานประกันสังคม · ' + e(D.meta.data_as_of_th) + '<br>' + e(D.meta.disclaimer_th) + '</p>';
    }

    function renderAll() { renderSummary(); renderResults(); renderCompare(); renderHowto(); }

    $('q').addEventListener('input', function () { st.q = this.value.trim(); renderResults(); });
    // เปิด/ปิดรายการด้วยคีย์บอร์ด (Enter / Space) — header เป็น div ตาม components/accordion.html
    root.addEventListener('keydown', function (ev) {
      var h = ev.target.closest && ev.target.closest('.accordion-header');
      if (h && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); h.click(); }
    });
    root.addEventListener('click', function (ev) {
      var h = ev.target.closest('.accordion-header');
      if (h) h.setAttribute('aria-expanded', h.closest('.accordion-item').classList.contains('open'));
    });

    return {
      /** section = '33' | '39' | '40' · option = ทางเลือกของ ม.40 ('40_1' | '40_2' | '40_3') */
      render: function (section, option) {
        st.mine = st.sec = section === '40' ? (option || '40_3') : section;
        st.cat = 'all';
        renderAll();
      }
    };
  };
})();
