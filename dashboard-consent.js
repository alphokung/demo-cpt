/*
 * dashboard-consent.js
 * Consent state (Tier 1 / Tier 2) for the citizen dashboard prototype, plus the
 * persona switcher and the consent-gated sections it drives:
 *   - skeleton → loaded reveal (initLoading)
 *   - Tier 1 / Tier 2 consent persistence in localStorage
 *   - บริการที่คุณน่าจะสนใจ (renderServices) and สิ่งที่คุณควรรู้ notices
 *   - the Tier 2 request modal and the consent-management modal
 *
 * Depends on dashboard-demo.js for DEMO / NOTICE_TYPES / renderContextBars(),
 * and on dashboard-ui.js for openModal() / closeModal(). Load this file first;
 * everything here runs on `pageshow` (bootConsent), by which point all three
 * files are in place.
 */

function initLoading() {
  const wrappers = document.querySelectorAll('.loading-wrapper');
  let remaining = wrappers.length;

  function onWrapperDone() {
    remaining--;
  }

  wrappers.forEach(wrapper => {
    const skeleton = wrapper.querySelector('.skeleton-item');
    const loaded = wrapper.querySelector('.loaded-item');
    // วันสำคัญ shares this wrapper's skeleton with รู้หรือไม่ — reveal both
    // together instead of popping in before รู้หรือไม่ has finished loading.
    const dailyNotices = wrapper.querySelector('#daily-notice-list');

    if (skeleton) skeleton.style.display = '';
    if (loaded) loaded.style.display = 'none';
    if (dailyNotices) dailyNotices.style.display = 'none';

    // Fixed 1s skeleton so the loading state is actually observable.
    //const randomDelay = 400 + Math.random() * 1600;
    const randomDelay = 1000;

    setTimeout(() => {
      if (skeleton) skeleton.style.display = 'none';
      if (loaded) loaded.style.display = '';
      if (dailyNotices) dailyNotices.style.display = '';
      onWrapperDone();
    }, randomDelay);
  });
}

// ─── Consent (Tier 1 / Tier 2) ──────────────────────────────────────
var CONSENT_STORAGE_KEY = 'czp_consent_v1';

function defaultConsent() {
  return { tier1: false, tier2: { health: false, disability: false, welfare: false, insurance: false, ticket: false, utility: false } };
}

function loadConsent() {
  try {
    var raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      return {
        tier1: !!parsed.tier1,
        tier2: {
          health: !!(parsed.tier2 && parsed.tier2.health),
          disability: !!(parsed.tier2 && parsed.tier2.disability),
          welfare: !!(parsed.tier2 && parsed.tier2.welfare),
          insurance: !!(parsed.tier2 && parsed.tier2.insurance),
          ticket: !!(parsed.tier2 && parsed.tier2.ticket),
          utility: !!(parsed.tier2 && parsed.tier2.utility),
        }
      };
    }
  } catch (e) { }
  return defaultConsent();
}

function saveConsent() {
  try { localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent)); } catch (e) { }
}

var consent = loadConsent();

// ─── Persona (demo user switcher) ───────────────────────────────────
var PERSONA_STORAGE_KEY = 'czp_persona_v1';

var PERSONAS = {
  somchai: {
    fullName: 'คุณสมชาย ใจดี',
    tagline: 'ประชาชนทั่วไป',
    forceBirthday: true,
    entitlements: { disability: false, welfare: false },
  },
  somsri: {
    fullName: 'คุณสมศรี มีสุข',
    tagline: 'ผู้ถือบัตรประจำตัวคนพิการ',
    forceBirthday: false,
    entitlements: { disability: true, welfare: false },
  },
  somying: {
    fullName: 'คุณสมหญิง รุ่งเรือง',
    tagline: 'ผู้ถือบัตรสวัสดิการแห่งรัฐและบัตรประจำตัวคนพิการ',
    forceBirthday: false,
    entitlements: { disability: true, welfare: true },
  },
  guest: {
    fullName: 'ผู้เยี่ยมชม',
    tagline: 'ยังไม่ได้เข้าสู่ระบบ',
    forceBirthday: false,
    isGuest: true,
    entitlements: {},
  },
};

// ─── บริการที่คุณน่าจะสนใจ ──────────────────────────────────────────────
// Catalog of recommendable services (public, no consent needed). `icon` is an
// image path under _media/ — swap these for the real service icons.
var SERVICE_CATALOG = {
  vehicle_reg: {
    title: 'ตรวจสอบทะเบียนรถ',
    desc: 'ตรวจสอบข้อมูลทะเบียนรถยนต์และรถจักรยานยนต์ วันครบกำหนดภาษี และประวัติการต่อทะเบียนของรถที่คุณถือครอง',
    category: 'ยานพาหนะ',
    icon: 'https://www.thangrath.go.th/wp-content/uploads/2023/03/IC_%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%B9%E0%B8%A5%E0%B8%97%E0%B8%B0%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%A3%E0%B8%96.jpg',
    url: 'https://www.thangrath.go.th/feature/vehicle-registration-information/',
  },
  traffic_ticket: {
    title: 'ตรวจสอบใบสั่งจราจร',
    desc: 'ตรวจสอบใบสั่งจราจรของรถยนต์และรถจักรยานยนต์ พร้อมชำระค่าปรับผ่าน QR Code และติดตามสถานะการชำระเงิน',
    category: 'ยานพาหนะ',
    icon: 'https://www.thangrath.go.th/wp-content/uploads/2023/03/%E0%B9%83%E0%B8%9A%E0%B8%AA%E0%B8%B1%E0%B9%88%E0%B8%87768.jpg',
    url: 'https://www.thangrath.go.th/feature/%e0%b9%83%e0%b8%9a%e0%b8%aa%e0%b8%b1%e0%b9%88%e0%b8%87%e0%b8%88%e0%b8%a3%e0%b8%b2%e0%b8%88%e0%b8%a3/',
  },
  newborn_subsidy: {
    title: 'เงินอุดหนุนเด็กแรกเกิด',
    desc: 'ตรวจสอบสิทธิและสถานะการรับเงินอุดหนุนเพื่อการเลี้ยงดูเด็กแรกเกิด พร้อมยื่นลงทะเบียนออนไลน์',
    category: 'สวัสดิการ',
    icon: 'https://www.thangrath.go.th/wp-content/uploads/2022/02/%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%AB%E0%B8%99%E0%B8%B8%E0%B8%99%E0%B9%80%E0%B8%94%E0%B9%87%E0%B8%81%E0%B9%81%E0%B8%A3%E0%B8%81%E0%B9%80%E0%B8%81%E0%B8%B4%E0%B8%94.png',
    url: 'https://www.thangrath.go.th/feature/%e0%b9%80%e0%b8%87%e0%b8%b4%e0%b8%99%e0%b8%ad%e0%b8%b8%e0%b8%94%e0%b8%ab%e0%b8%99%e0%b8%b8%e0%b8%99%e0%b9%80%e0%b8%94%e0%b9%87%e0%b8%81%e0%b9%81%e0%b8%a3%e0%b8%81%e0%b9%80%e0%b8%81%e0%b8%b4%e0%b8%94-3/',
  },
  credit_bureau: {
    title: 'ตรวจสอบเครดิตบูโร',
    desc: 'ตรวจสอบสรุปข้อมูลเครดิตบูโรและยอดหนี้เบื้องต้น เพื่อดูภาพรวมบัญชีสินเชื่อ และหนี้สินส่วนบุคคลสำหรับใช้วางแผนทางการเงินส่วนบุคคล',
    category: 'การเงิน · ประกัน',
    icon: 'https://www.thangrath.go.th/wp-content/uploads/2022/02/%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95%E0%B8%9A%E0%B8%B9%E0%B9%82%E0%B8%A3.png',
    url: 'https://www.thangrath.go.th/feature/%e0%b8%95%e0%b8%a3%e0%b8%a7%e0%b8%88%e0%b8%aa%e0%b8%ad%e0%b8%9a%e0%b9%80%e0%b8%84%e0%b8%a3%e0%b8%94%e0%b8%b4%e0%b8%95%e0%b8%9a%e0%b8%b9%e0%b9%82%e0%b8%a3-%e0%b8%87%e0%b9%88%e0%b8%b2%e0%b8%a2%e0%b9%81/',
  },
  medical_rights: {
    title: 'ตรวจสอบสิทธิการรักษาพยาบาล',
    desc: 'ตรวจสอบสิทธิรักษาพยาบาล ประวัติสุขภาพ ค้นหาหรือเปลี่ยนหน่วยบริการ และสแกนเพื่อเข้ารับบริการทางการแพทย์',
    category: 'สุขภาพ',
    icon: 'https://www.thangrath.go.th/wp-content/uploads/2022/02/%E0%B8%AA%E0%B8%B4%E0%B8%97%E0%B8%98%E0%B8%B4%E0%B8%A3%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B8%B2%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%9A%E0%B8%B2%E0%B8%A5.png',
    url: 'https://www.thangrath.go.th/feature/%e0%b8%95%e0%b8%a3%e0%b8%a7%e0%b8%88%e0%b8%aa%e0%b8%ad%e0%b8%9a%e0%b8%aa%e0%b8%b4%e0%b8%97%e0%b8%98%e0%b8%b4%e0%b8%81%e0%b8%b2%e0%b8%a3%e0%b8%a3%e0%b8%b1%e0%b8%81%e0%b8%a9%e0%b8%b2%e0%b8%9e%e0%b8%a2/',
  },
  social_insurance: {
    title: 'เช็กสิทธิประกันสังคม',
    desc: 'ตรวจสอบสิทธิประกันสังคม เช็กยอดเงินสมทบชราภาพ และสิทธิรักษาพยาบาล พร้อมทำธุรกรรมออนไลน์สำหรับผู้ประกันตน',
    category: 'สวัสดิการ',
    icon: 'https://www.thangrath.go.th/wp-content/uploads/2022/02/%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B1%E0%B8%99%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1.png',
    url: 'https://www.thangrath.go.th/feature/%e0%b9%80%e0%b8%8a%e0%b9%87%e0%b8%81%e0%b8%aa%e0%b8%b4%e0%b8%97%e0%b8%98%e0%b8%b4%e0%b8%9b%e0%b8%a3%e0%b8%b0%e0%b8%81%e0%b8%b1%e0%b8%99%e0%b8%aa%e0%b8%b1%e0%b8%87%e0%b8%84%e0%b8%a1-%e0%b9%82%e0%b8%84/',
  },
};

// Which services to surface per persona, in display order. Keys reference
// SERVICE_CATALOG above.
var PERSONA_SERVICES = {
  somchai: ['vehicle_reg', 'traffic_ticket', 'credit_bureau', 'medical_rights'],
  somsri: ['medical_rights', 'social_insurance', 'traffic_ticket', 'credit_bureau'],
  somying: ['social_insurance', 'newborn_subsidy', 'medical_rights', 'credit_bureau'],
  guest: ['vehicle_reg', 'traffic_ticket', 'credit_bureau', 'medical_rights'],
};

function loadPersonaKey() {
  try { return PERSONAS[localStorage.getItem(PERSONA_STORAGE_KEY)] ? localStorage.getItem(PERSONA_STORAGE_KEY) : 'somchai'; }
  catch (e) { return 'somchai'; }
}
function savePersonaKey(k) {
  try { localStorage.setItem(PERSONA_STORAGE_KEY, k); } catch (e) { }
}

var currentPersonaKey = loadPersonaKey();

function applyPersonaUI() {
  var persona = PERSONAS[currentPersonaKey];
  var nameEl = document.getElementById('greeting-name');
  if (nameEl) nameEl.textContent = persona.fullName;
  DEMO.birthday = persona.forceBirthday;
  renderServices();
  updateProactiveNotices();
}

// Renders บริการที่คุณน่าจะสนใจ from the current persona's service list.
// For a signed-in persona the section stays hidden until Tier 1 consent is
// given; the guest persona never consents to Tier 1, so it shows immediately.
function renderServices() {
  var section = document.getElementById('services-section');
  var list = document.getElementById('services-list');
  if (!section || !list) return;
  var isGuest = !!(PERSONAS[currentPersonaKey] && PERSONAS[currentPersonaKey].isGuest);
  if (!isGuest && !consent.tier1) {
    section.style.display = 'none';
    return;
  }
  var keys = PERSONA_SERVICES[currentPersonaKey] || [];
  // Same skeleton → loaded-item pattern as เอกสารราชการ; initLoading() reveals
  // the loaded items after a short delay (so renderServices must run first).
  list.innerHTML = keys.map(function (key) {
    var svc = SERVICE_CATALOG[key];
    if (!svc) return '';
    return '' +
      '<div class="loading-wrapper">' +
        '<div class="list-item skeleton-item">' +
          '<span class="list-badge skeleton-loading list-badge--corner skeleton-badge-sm"></span>' +
          '<div class="skeleton-loading skeleton-icon-md"></div>' +
          '<div class="list-body skeleton-body-gap">' +
            '<div class="skeleton-loading skeleton-text medium skeleton-text--no-mb"></div>' +
            '<div class="skeleton-loading skeleton-text short skeleton-text--xs-h"></div>' +
          '</div>' +
          '<div class="skeleton-loading skeleton-circle skeleton-dot-sm"></div>' +
        '</div>' +
        '<a href="' + svc.url + '" target="_blank" rel="noopener" class="list-item loaded-item" style="display:none;">' +
          '<div class="list-icon">' +
            '<img src="' + svc.icon + '" alt="" class="img-helper-frame circle size-sm">' +
          '</div>' +
          '<div class="list-body">' +
            '<p class="service-item__title">' + svc.title + '</p>' +
            '<p class="service-item__desc">' + svc.desc + '</p>' +
            '<span class="service-item__category">' + svc.category + '</span>' +
          '</div>' +
          '<span class="material-symbols-outlined chevron">chevron_right</span>' +
        '</a>' +
      '</div>';
  }).join('');
  section.style.display = keys.length ? '' : 'none';
}

// "เบี้ยความพิการเดือนนี้โอนแล้ว" only makes sense for a persona who actually
// holds a disability card, and only once they've consented to view that Tier 2 data.
function updateProactiveNotices() {
  var disabilityEl = document.getElementById('notice-disability-allowance');
  if (disabilityEl) {
    var persona = PERSONAS[currentPersonaKey];
    var isDisabled = !!(persona && persona.entitlements.disability);
    disabilityEl.style.display = (isDisabled && consent.tier2.disability) ? '' : 'none';
  }

  // Policy expiry notice only makes sense once the user has consented to view
  // their insurance data — same logic as any other Tier 2-derived notice.
  var insuranceEl = document.getElementById('notice-insurance-expiring');
  if (insuranceEl) {
    insuranceEl.style.display = consent.tier2.insurance ? '' : 'none';
  }

  // Traffic ticket reminder is Tier 2 (realtime, from the police) — hidden
  // until the user explicitly consents to view their ticket data.
  var ticketEl = document.getElementById('notice-ticket-reminder');
  if (ticketEl) {
    ticketEl.style.display = consent.tier2.ticket ? '' : 'none';
  }

  // Any demo override wins over the rules above.
  if (typeof applyNoticeOverrides === 'function') applyNoticeOverrides();
}

// Switching persona changes who the dashboard belongs to, so any previously
// granted consent (Tier 1 + Tier 2) no longer applies and must be re-given.
function setPersona(key) {
  if (!PERSONAS[key] || key === currentPersonaKey) { closeModal('modal-demo-config'); return; }
  savePersonaKey(key);
  consent = defaultConsent();
  saveConsent();
  location.reload();
}

// Order matches the consent modal in the design: health, utility, ticket,
// insurance, welfare, disability. `desc` is the line shown in that modal;
// `sub` is the source agency shown on the dataset cards in the page.
var TIER2_INFO = {
  health: {
    title: 'ข้อมูลสิทธิการรักษาพยาบาล',
    sub: 'สำนักงานหลักประกันสุขภาพแห่งชาติ (สปสช.)',
    desc: 'เชื่อมต่อข้อมูลสิทธิการรักษาพยาบาลบัตรทอง, สิทธิประกันสังคม, และสิทธิข้าราชการ จากสำนักงานหลักประกันสุขภาพแห่งชาติ',
    icon: 'health_and_safety',
  },
  utility: {
    title: 'ข้อมูลค่าน้ำ ค่าไฟ',
    sub: 'การไฟฟ้า/ประปานครหลวงและส่วนภูมิภาค',
    desc: 'เชื่อมต่อข้อมูลค่าน้ำ ค่าไฟ จากการไฟฟ้านครหลวง, การไฟฟ้าส่วนภูมิภาค, การประปานครหลวง และการประปาส่วนภูมิภาค',
    icon: 'bolt',
  },
  ticket: {
    title: 'ข้อมูลใบสั่งจราจร',
    sub: 'สำนักงานตำรวจแห่งชาติ',
    desc: 'เชื่อมต่อข้อมูลค่าปรับ และรายละเอียดใบสั่งจราจร จากสำนักงานตำรวจแห่งชาติ',
    icon: 'receipt_long',
  },
  insurance: {
    title: 'ข้อมูลกรมธรรม์ประกันภัย',
    sub: 'สำนักงานคณะกรรมการกำกับและส่งเสริมการประกอบธุรกิจประกันภัย (คปภ.)',
    desc: 'เชื่อมต่อข้อมูลกรมธรรม์ จากสำนักงานคณะกรรมการกำกับและส่งเสริม การประกอบธุรกิจประกันภัย (คปภ.)',
    icon: 'policy',
  },
  welfare: {
    title: 'สิทธิสวัสดิการแห่งรัฐ',
    sub: 'กรมบัญชีกลาง กระทรวงการคลัง',
    desc: 'เชื่อมต่อข้อมูลการเป็นผู้มีสิทธิสวัสดิการแห่งรัฐ จากกรมบัญชีกลาง',
    icon: 'volunteer_activism',
  },
  disability: {
    title: 'ข้อมูลบัตรคนพิการ',
    sub: 'กรมส่งเสริมและพัฒนาคุณภาพชีวิตคนพิการ (พก.)',
    desc: 'เชื่อมต่อข้อมูลสถานะความพิการ และวันหมดอายุ กับจากกรมส่งเสริมคุณภาพชีวิตคนพิการ',
    icon: 'accessible',
  },
};

function tier2Gate(key) {
  return document.querySelector('.tier2-gate[data-tier2-key="' + key + '"]');
}

function setTier2State(gate, state) {
  if (!gate) return;
  ['loading', 'loaded', 'empty'].forEach(function (s) {
    var el = gate.querySelector('[data-state="' + s + '"]');
    if (el) el.style.display = (s === state) ? '' : 'none';
  });
}

// Renders a tier2 dataset. Ungranted datasets are hidden entirely — the
// "ให้ความยินยอมเพิ่มเติม" card is the only entry point for those, so there's
// no separate per-dataset locked card to show. If the user already consented
// (persisted), simulate a fresh realtime fetch every time the page loads
// (tier2 is never cached). After the "fetch" resolves, the current persona may
// simply have no record for this dataset (e.g. สมชาย has no disability card) —
// that's the 'empty' state.
function renderTier2(key, justConsented) {
  var gate = tier2Gate(key);
  if (!gate) return;
  if (!consent.tier2[key]) {
    gate.style.display = 'none';
    return;
  }
  gate.style.display = '';
  setTier2State(gate, 'loading');
  var delay = justConsented ? 900 : (500 + Math.random() * 700);
  setTimeout(function () {
    var entitlements = PERSONAS[currentPersonaKey].entitlements;
    var hasData = (key in entitlements) ? entitlements[key] : true;
    if (hasData) {
      setTier2State(gate, 'loaded');
    } else if (gate.querySelector('[data-state="empty"]')) {
      setTier2State(gate, 'empty');
    } else {
      // No "not found" state defined for this gate (e.g. บัตรประจำตัวคนพิการ,
      // which now lives among เอกสารราชการ) — just hide it instead of showing
      // an out-of-place "no record found" message next to real documents.
      gate.style.display = 'none';
    }
  }, delay);
}

// Opens the tier2 consent modal listing EVERY dataset, so one confirmation can
// cover several datasets at once — but nothing is pre-checked, the user must
// explicitly tick what they want to grant. Tier 2 data belongs to the same
// citizen record as Tier 1, so it can only be requested once Tier 1 (basic
// identity + location) has been consented to.
function buildTier2ModalList() {
  var list = document.getElementById('tier2-modal-list');
  list.innerHTML = '';
  Object.keys(TIER2_INFO).forEach(function (k) {
    var info = TIER2_INFO[k];
    var already = !!consent.tier2[k];
    var row = document.createElement('label');
    row.className = 'consent-modal__perm-item consent-modal__perm-item--checkable';
    // Everything not already granted starts selected: this modal's entry
    // point promises granting the remaining datasets "ในครั้งเดียว".
    // Selection shows as a green border on the card, per the design.
    row.innerHTML =
      '<input type="checkbox" class="consent-modal__checkbox" id="tier2-check-' + k + '"' +
      (already ? ' checked disabled' : ' checked') + '>' +
      '<div class="consent-modal__perm-icon"><span class="material-symbols-outlined">' + info.icon + '</span></div>' +
      '<div>' +
      '<p class="consent-modal__perm-title">' + info.title +
      (already ? ' <span class="consent-modal__granted">(ยินยอมแล้ว)</span>' : '') + '</p>' +
      '<p class="consent-modal__perm-sub">' + info.desc + '</p>' +
      '</div>';
    list.appendChild(row);
  });
}

// Entry point from an individual dataset card.
function requestTier2Consent(key) {
  if (!consent.tier1) {
    closeModal('modal-permissions');
    openTier1ConsentModal();
    return;
  }
  buildTier2ModalList();
  openModal('modal-consent-tier2');
}

// Entry point from the "ให้ความยินยอมเพิ่มเติม" card — lists everything not yet
// granted so the user can tick and grant several datasets in one confirmation.
function requestTier2ConsentRemaining() {
  if (!consent.tier1) {
    closeModal('modal-permissions');
    openTier1ConsentModal();
    return;
  }
  buildTier2ModalList();
  openModal('modal-consent-tier2');
}

function confirmTier2Consent() {
  var newlyGranted = [];
  Object.keys(TIER2_INFO).forEach(function (k) {
    var cb = document.getElementById('tier2-check-' + k);
    if (cb && cb.checked && !cb.disabled) {
      consent.tier2[k] = true;
      newlyGranted.push(k);
    }
  });
  closeModal('modal-consent-tier2');
  if (!newlyGranted.length) return;
  saveConsent();
  newlyGranted.forEach(function (k) { renderTier2(k, true); });
  updateConsentButtonVisibility();
  updateTier2ConsentBanner();
  updateTier2GateListVisibility();
  updateProactiveNotices();
}

function cancelTier2Consent() {
  closeModal('modal-consent-tier2');
}

// Hides the "give additional consent" banner once every Tier 2 dataset is granted.
function updateTier2ConsentBanner() {
  var banner = document.getElementById('tier2-consent-more');
  if (!banner) return;
  var hintEl = document.getElementById('tier2-consent-more-hint');
  var grantedCount = Object.keys(TIER2_INFO).filter(function (k) { return consent.tier2[k]; }).length;
  var totalCount = Object.keys(TIER2_INFO).length;

  // The banner sits outside #tier2-section now, so it has to gate on Tier 1
  // itself — Tier 2 data belongs to the same citizen record as Tier 1.
  if (!consent.tier1) {
    banner.style.display = 'none';
    return;
  }

  if (grantedCount === totalCount) {
    banner.style.display = 'none';
    return;
  }
  banner.style.display = '';
  if (hintEl) {
    hintEl.textContent = grantedCount === 0
      ? 'เพื่อดูสวัสดิการต่างๆ เช่น สิทธิการรักษาพยาบาล ข้อมูลบัตรคนพิการ และสวัสดิการแห่งรัฐ ในครั้งเดียว'
      : 'เพื่อดูข้อมูลสิทธิการรักษาพยาบาลและสวัสดิการภาครัฐที่เหลือของคุณในครั้งเดียว';
  }
}

// The individual Tier 2 dataset cards stay hidden until at least one has been
// granted — before that, the banner above is the only, uncluttered entry point.
// บัตรประจำตัวคนพิการ now lives inside เอกสารราชการ, not this list, so it
// shouldn't count toward whether this list has anything to show.
// Shared by any container that holds a subset of tier2-gate cards (สิทธิ และ
// สวัสดิการ's #tier2-gate-list, เรื่องเงินของคุณ's #money-gate-list) — only
// counts datasets that actually have a gate card inside THIS list, since some
// (บัตรประจำตัวคนพิการ, ใบสั่งจราจร's notice) live elsewhere or are notice-only.
function updateGateListVisibility(listId) {
  var list = document.getElementById(listId);
  if (!list) return;
  var anyGranted = Object.keys(TIER2_INFO).some(function (k) {
    return consent.tier2[k] && list.querySelector('.tier2-gate[data-tier2-key="' + k + '"]');
  });
  list.style.display = anyGranted ? '' : 'none';
}

// Neither สิทธิ และสวัสดิการ nor เรื่องเงินของคุณ holds a "consent more"
// entry point any more — that panel now sits above บริการที่คุณน่าจะสนใจ —
// so either section's heading/note would otherwise show above empty content.
// Hide the whole section unless at least one of its own tier2 datasets
// (the cards inside its gate list) has been granted.
function updateGatedSectionVisibility(sectionId, listId) {
  var section = document.getElementById(sectionId);
  var list = document.getElementById(listId);
  if (!section || !list) return;
  var anyGranted = consent.tier1 && Object.keys(TIER2_INFO).some(function (k) {
    return consent.tier2[k] && list.querySelector('.tier2-gate[data-tier2-key="' + k + '"]');
  });
  section.style.display = anyGranted ? '' : 'none';
}

function updateTier2GateListVisibility() {
  updateGateListVisibility('tier2-gate-list');
  updateGateListVisibility('money-gate-list');
  updateGatedSectionVisibility('tier2-section', 'tier2-gate-list');
  updateGatedSectionVisibility('money-section', 'money-gate-list');
}

// Demo-only shortcut: wipes consent state instantly (no confirm dialog) for quick re-testing.
function clearAllConsentDemo() {
  consent = defaultConsent();
  saveConsent();
  location.reload();
}

// The "จัดการความยินยอม" button has nothing to manage until the user has
// granted at least one tier, so it stays hidden before that.
function updateConsentButtonVisibility() {
  var btn = document.getElementById('top-nav-consent-btn');
  if (!btn) return;
  var hasAnyConsent = consent.tier1 || Object.keys(TIER2_INFO).some(function (k) { return consent.tier2[k]; });
  btn.style.display = hasAnyConsent ? '' : 'none';
}

function applyTier1UI() {
  var content = document.getElementById('tier1-content');
  var locked = document.getElementById('tier1-locked-panel');
  var tier2Section = document.getElementById('tier2-section');
  var moneySection = document.getElementById('money-section');
  var isGuest = !!(PERSONAS[currentPersonaKey] && PERSONAS[currentPersonaKey].isGuest);
  if (consent.tier1) {
    if (content) content.style.display = '';
    if (locked) locked.style.display = 'none';
    if (tier2Section) tier2Section.style.display = '';
    // moneySection stays hidden until one of its own Tier 2 datasets is
    // granted — handled by updateTier2GateListVisibility() below.
  } else {
    if (content) content.style.display = 'none';
    // A guest hasn't logged in at all, so prompting them to consent to
    // Tier 1 (which implies they already have an identity) doesn't apply —
    // they only get the public วันสำคัญ / รู้หรือไม่ content above.
    if (locked) locked.style.display = isGuest ? 'none' : '';
    if (tier2Section) tier2Section.style.display = 'none';
    if (moneySection) moneySection.style.display = 'none';
  }
  // Recommended services depend on Tier 1 consent for signed-in personas —
  // render before initLoading() so its freshly-built skeleton wrappers are
  // picked up and revealed along with the rest of the page.
  renderServices();
  // Runs regardless of Tier 1 status — วันสำคัญ and รู้หรือไม่ are public
  // .loading-wrapper cards that live outside #tier1-content.
  initLoading();
  updateConsentButtonVisibility();
  updateTier2ConsentBanner();
  updateTier2GateListVisibility();
}

function openTier1ConsentModal() {
  openModal('modal-consent-tier1');
}

function confirmTier1Consent() {
  consent.tier1 = true;
  saveConsent();
  closeModal('modal-consent-tier1');
  applyTier1UI();
}

function revokeAllConsent() {
  var ok = confirm('ยกเลิกความยินยอมทั้งหมด (Tier 1 และ Tier 2)? ระบบจะหยุดแสดงข้อมูลที่เกี่ยวข้องทันที และคุณจะต้องให้ความยินยอมใหม่อีกครั้งเพื่อใช้งาน');
  if (!ok) return;
  consent = defaultConsent();
  saveConsent();
  closeModal('modal-permissions');
  location.reload();
}

// ─── Permissions modal: rendered from actual consent state, not hardcoded ──
// What Tier 1 consent actually unlocks, as listed in the consent-management
// modal. Titles use the same "ข้อมูล…" phrasing as the Tier 2 entries so the
// combined list reads consistently.
var TIER1_ITEMS = [
  { key: 'passport',   title: 'ข้อมูลหนังสือเดินทาง (Passport)', sub: 'กรมการกงสุล',      icon: 'book_2',         miniapp: '7a1965f1-27e3-43c5-9b14-4627039a28d2' },
  { key: 'vehicleReg', title: 'ข้อมูลทะเบียนยานพาหนะ',          sub: 'กรมการขนส่งทางบก', icon: 'car_tag',        miniapp: 'fbc474d8-fde8-4f48-8063-f04d83fabf13' },
  { key: 'license',    title: 'ข้อมูลใบอนุญาตขับรถยนต์',        sub: 'กรมการขนส่งทางบก', icon: 'directions_car', miniapp: 'e82f601e-ce10-4d45-a297-51d59722d86a' },
];

// The agency line shown under each Tier 2 entry in this modal. TIER2_INFO's
// own `sub` spells the agency out in full, which is too long here.
var TIER2_SOURCE = {
  health:     'สำนักงานหลักประกันสุขภาพแห่งชาติ',
  utility:    'การไฟฟ้านครหลวง, การไฟฟ้าส่วนภูมิภาค, การประปานครหลวง และการประปาส่วนภูมิภาค',
  ticket:     'สำนักงานตำรวจแห่งชาติ',
  insurance:  'สำนักงานคณะกรรมการกำกับและส่งเสริมการประกอบธุรกิจประกันภัย (คปภ.)',
  welfare:    'กรมบัญชีกลาง กระทรวงการคลัง',
  disability: 'กรมส่งเสริมคุณภาพชีวิตคนพิการ',
};

function buildPermItem(opts) {
  var iconInner = opts.img
    ? '<img src="' + opts.img + '" alt="" class="img-helper-frame circle size-sm">'
    : '<span class="material-symbols-outlined perm-icon">' + opts.icon + '</span>';
  var el = document.createElement('div');
  el.className = 'perm-item';
  el.innerHTML =
    '<div class="perm-item__icon">' + iconInner + '</div>' +
    '<div class="perm-item-body">' +
      '<p class="perm-item-title">' + opts.title + '</p>' +
      '<p class="perm-item-sub">' + opts.sub + '</p>' +
    '</div>';
  if (opts.onClick) {
    el.classList.add('perm-item--tappable');
    el.addEventListener('click', opts.onClick);
  }
  return el;
}

// Lists only what currently has access — the modal is titled
// "บริการที่มีการเข้าถึงข้อมูล", so anything not consented to has no place here.
function renderPermissionsModal() {
  var list = document.getElementById('perm-list');
  if (!list) return;
  list.innerHTML = '';

  if (consent.tier1) {
    TIER1_ITEMS.forEach(function (item) {
      list.appendChild(buildPermItem({
        title: item.title, sub: item.sub, icon: item.icon,
        onClick: function () {
          closeModal('modal-permissions');
          if (window.czpSdk) window.czpSdk.openMiniApp(item.miniapp);
        },
      }));
    });
  }

  Object.keys(TIER2_INFO).forEach(function (k) {
    if (!consent.tier2[k]) return;
    var info = TIER2_INFO[k];
    list.appendChild(buildPermItem({
      title: info.title, sub: TIER2_SOURCE[k] || info.sub, icon: info.icon,
    }));
  });

  if (!list.childElementCount) {
    list.innerHTML = '<p class="perm-list__empty">ยังไม่มีบริการใดเข้าถึงข้อมูลของคุณ</p>';
  }
}

function openPermissionsModal() {
  renderPermissionsModal();
  openModal('modal-permissions');
}

function bootConsent() {
  applyPersonaUI();
  renderContextBars();
  applyTier1UI();
  Object.keys(TIER2_INFO).forEach(function (key) {
    renderTier2(key, false);
  });
  var isGuest = !!(PERSONAS[currentPersonaKey] && PERSONAS[currentPersonaKey].isGuest);
  if (!consent.tier1 && !isGuest) {
    setTimeout(function () { openModal('modal-consent-tier1'); }, 400);
  }
}

window.addEventListener('pageshow', bootConsent);
