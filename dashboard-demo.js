/*
 * dashboard-demo.js
 * The "Demo การแสดงผล" control panel and the context bars it drives.
 *
 * Holds the variant tables lifted from Figma — weather chips (WEATHER_TYPES),
 * PM2.5 chips (PM25_LEVELS), event/special-day bars (SPECIAL_LABELS) and the
 * สิ่งที่คุณควรรู้ notice overrides (NOTICE_TYPES) — the demo chip lists that
 * select between them, and renderContextBars(), which paints the current
 * selection onto the today-context card.
 *
 * Load after dashboard-consent.js and before dashboard-context.js, which calls
 * renderContextBars() while parsing.
 */

// ─── Demo config ───────────────────────────────────────────────────
var DEMO = {
  weather: 'partly', birthday: true, special: 'newyear', pm25: 'unhealthySensitive',
  // Per-notice overrides for the สิ่งที่คุณควรรู้ list: 'auto' keeps the
  // page's own rule (persona / consent driven), true or false forces it.
  notices: { expired: 'auto', almost: 'auto', transfer: 'auto', ticket: 'auto' },
};

// ── Weather chip variants (Figma: Weather component set) ────────────────
// `detail` is the third line; the "no data" variant is the only one without it.
var WEATHER_DETAIL = 'ความชื้น 66.41% : ฝนตก 6.2 ม.ม.';
// The chip renders slightly larger than the Figma frame, so the per-variant
// icon sizes below are scaled to match.
var WEATHER_ICON_SCALE = 1.1;
var WEATHER_TYPES = {
  clear:      { label: 'ท้องฟ้าแจ่มใส',      temp: 'อุณหภูมิ 39°C - 42°C', bg: '#fdb022', fg: '#003c66', icon: 'w1-clear.svg',         w: 26, h: 26 },
  partly:     { label: 'มีเมฆบางส่วน',       temp: 'อุณหภูมิ 32°C - 34°C', bg: '#0086c9', fg: '#ffffff', icon: 'w2-partly-cloudy.svg', w: 29, h: 23 },
  mostly:     { label: 'มีเมฆเป็นส่วนมาก',   temp: 'อุณหภูมิ 32°C - 34°C', bg: '#026aa2', fg: '#ffffff', icon: 'w3-cloudy.svg',        w: 32, h: 20 },
  overcast:   { label: 'มีเมฆมาก',           temp: 'อุณหภูมิ 32°C - 34°C', bg: '#026aa2', fg: '#ffffff', icon: 'w3-cloudy.svg',        w: 32, h: 20 },
  rainLight:  { label: 'ฝนตกเล็กน้อย',       temp: 'อุณหภูมิ 20°C - 25°C', bg: '#0b4a6f', fg: '#ffffff', icon: 'w5-rain-light.svg',    w: 24, h: 22, rainy: true },
  rainMedium: { label: 'ฝนตกเล็กปานกลาง',    temp: 'อุณหภูมิ 20°C - 25°C', bg: '#0b4a6f', fg: '#ffffff', icon: 'w6-rain-medium.svg',   w: 24, h: 22, rainy: true },
  rainHeavy:  { label: 'ฝนตกหนัก',           temp: 'อุณหภูมิ 20°C - 25°C', bg: '#003c66', fg: '#ffffff', icon: 'w7-rain-heavy.svg',    w: 28, h: 24, rainy: true },
  thunder:    { label: 'ฝนฟ้าคะนอง',         temp: 'อุณหภูมิ 20°C - 25°C', bg: '#003c66', fg: '#ffffff', icon: 'w8-thunderstorm.svg',  w: 28, h: 23, rainy: true },
  veryCold:   { label: 'อากาศหนาวจัด',       temp: 'อุณหภูมิ 3°C - 5°C',   bg: '#003c66', fg: '#ffffff', icon: 'w9-very-cold.svg',     w: 23, h: 24, flipY: true },
  cold:       { label: 'อากาศหนาว',          temp: 'อุณหภูมิ 5°C - 10°C',  bg: '#003c66', fg: '#ffffff', icon: 'w10-cold.svg',         w: 21, h: 24, flipY: true },
  cool:       { label: 'อากาศเย็น',          temp: 'อุณหภูมิ 16°C - 20°C', bg: '#36bffa', fg: '#ffffff', icon: 'w11-cool.svg',         w: 24, h: 24 },
  veryHot:    { label: 'อากาศร้อนจัด',       temp: 'อุณหภูมิ 42°C - 45°C', bg: '#d92d20', fg: '#ffffff', icon: 'w12-very-hot.svg',     w: 24, h: 24 },
  unknown:    { label: 'ไม่พบข้อมูลในพื้นที่', temp: 'อุณหภูมิ: ไม่ระบุ',   bg: '#62676c', fg: '#ffffff', icon: 'w-undefined.svg',      w: 25, h: 13, noDetail: true, noData: true },
};

// ── PM2.5 chip variants (Figma: pm-chip component set) ──────────────────
var PM25_LEVELS = {
  good:               { value: 9,    label: 'อากาศดี',             color: '#a2f061', textColor: '#25272a', icon: 'green.svg',  tip: null },
  moderate:           { value: 64,   label: 'อากาศดีปานกลาง',      color: '#ffec51', textColor: '#25272a', icon: 'yellow.svg', tip: null },
  unhealthySensitive: { value: 140,  label: 'เริ่มมีผลต่อสุขภาพ',   color: '#ffb14b', textColor: '#25272a', icon: 'orange.svg', tip: null },
  unhealthy:          { value: 160,  label: 'มีผลต่อสุขภาพ',       color: '#ff6175', textColor: '#ffffff', icon: 'red.svg',
    tip: 'คุณภาพอากาศอยู่ในระดับที่มีผลต่อสุขภาพ ควรสวมหน้ากากเมื่อออกนอกอาคาร' },
  hazardous:          { value: 220,  label: 'อันตรายต่อสุขภาพ',    color: '#b36ebd', textColor: '#ffffff', icon: 'purple.svg',
    tip: 'ฝุ่น PM 2.5 อยู่ในระดับอันตราย หลีกเลี่ยงการออกกำลังกายกลางแจ้ง และสวมหน้ากาก N95 ตลอดเวลา' },
  unknown:            { value: null, label: 'ไม่พบข้อมูลในพื้นที่', color: '#62676c', textColor: '#ffffff', icon: 'nodata.svg', tip: null, noStation: true, noData: true },
};

// Nearest air-quality monitoring station shown on the PM2.5 chip.
var PM25_STATION = 'ห้องสมุดใต้สะพานสมเด็จพระเจ้าตากสิน (0 กม.)';

// ── Event bar variants (Figma: event component set) ─────────────────────
var SPECIAL_LABELS = {
  newyear:        { icon: '✨', label: '1 ม.ค. ปีใหม่',       text: 'สวัสดีปีใหม่! ขอให้ปีนี้เป็นปีที่เต็มไปด้วยความสุข ความสำเร็จ และเรื่องราวดีๆ ในทุกวันนะ' },
  children:       { icon: '🧸', label: 'วันเด็ก',              text: 'สุขสันต์วันเด็ก! ขอให้เด็กๆ ทุกคนมีความสุข สดใส เติบโตอย่างแข็งแรงและมีความสุขในแบบของตัวเอง' },
  teacher:        { icon: '📚', label: '16 ม.ค. วันครู',       text: 'สุขสันต์วันครู น้อมระลึกถึงพระคุณครูผู้ให้ความรู้และนำทางชีวิต' },
  chinesenewyear: { icon: '🧧', label: 'ตรุษจีน',              text: 'ซินเจียยู่อี่ ซินนี้ฮวดไช่! มั่งคั่งร่ำรวย สุขภาพแข็งแรง เฮงๆ ปังๆ ตลอดปีนะ' },
  valentine:      { icon: '🌹', label: '14 ก.พ. วาเลนไทน์',    text: 'สุขสันต์วันแห่งความรัก! ขอให้วันนี้และทุกๆ วันของคุณเต็มไปด้วยความรักและความอบอุ่นนะ' },
  songkran:       { icon: '💦', label: '13 เม.ย. สงกรานต์',    text: 'สุขสันต์วันสงกรานต์และวันปีใหม่ไทย! ขอให้เย็นฉ่ำชื่นใจ เดินทางปลอดภัย สนุกกับวันหยุดนะ' },
  labor:          { icon: '💪', label: '1 พ.ค. วันแรงงาน',     text: 'สุขสันต์วันแรงงาน ขอบคุณในความมุ่งมั่นและตั้งใจทำงาน วันนี้พักผ่อนให้เต็มที่นะ' },
  env:            { icon: '🌍', label: '5 มิ.ย. สิ่งแวดล้อมโลก', text: 'สุขสันต์วันสิ่งแวดล้อมโลก มาร่วมมือกันรักษ์โลกใบนี้ให้น่าอยู่และเขียวขจีไปด้วยกันนะ' },
  mother:         { icon: '🤱', label: '12 ส.ค. วันแม่',       text: 'สุขสันต์วันแม่ ขอให้คุณแม่ทุกท่านมีความสุขกาย สบายใจ สุขภาพแข็งแรงในทุกๆ วันนะ' },
  loykrathong:    { icon: '🪷', label: 'ลอยกระทง',             text: 'สุขสันต์วันลอยกระทง ขอให้สิ่งไม่ดีลอยไปกับสายน้ำ และมีแต่สิ่งดีๆ ไหลเวียนเข้ามาในชีวิตนะ' },
  father:         { icon: '👔', label: '5 ธ.ค. วันพ่อ',        text: 'สุขสันต์วันพ่อ ขอให้คุณพ่อทุกท่านมีความสุข สุขภาพแข็งแรง เป็นร่มโพธิ์ร่มไทรของครอบครัว' },
};

// ── สิ่งที่คุณควรรู้ notice variants (Figma: alert-card component set).
// `id` is the row already in the page; the demo can force each on or off.
var NOTICE_TYPES = {
  expired:  { id: 'notice-passport-expiring', label: '⚠️ หนังสือเดินทางใกล้หมดอายุ' },
  almost:   { id: 'notice-tax-due',           label: '⏱️ ภาษีรถใกล้ถึงกำหนด' },
  transfer: { id: 'notice-disability-allowance', label: '💶 เบี้ยความพิการโอนแล้ว' },
  ticket:   { id: 'notice-ticket-reminder',   label: '🧾 แจ้งเตือนใบสั่ง' },
};

function demoSet(key, value) {
  DEMO[key] = value;
  syncChips();
  renderContextBars();
}

// Builds one demo chip. `swatch` paints a small colour dot so the weather
// and PM2.5 lists read as the variants they select.
function buildDemoChip(id, label, onClick, swatch) {
  var b = document.createElement('button');
  b.className = 'dc-chip';
  b.id = id;
  b.innerHTML = (swatch
    ? '<span class="dc-chip__swatch" style="background:' + swatch + '"></span>'
    : '') + label;
  b.onclick = onClick;
  return b;
}

// The demo chip lists are generated from the same tables that drive the
// page, so adding a variant to a table surfaces it here automatically.
function buildDemoChips() {
  var wrap = document.getElementById('dc-weather-chips');
  if (wrap && !wrap.childElementCount) {
    Object.keys(WEATHER_TYPES).forEach(function (k) {
      wrap.appendChild(buildDemoChip('chip-weather-' + k, WEATHER_TYPES[k].label,
        function () { demoSet('weather', k); }, WEATHER_TYPES[k].bg));
    });
  }

  wrap = document.getElementById('dc-pm25-chips');
  if (wrap && !wrap.childElementCount) {
    Object.keys(PM25_LEVELS).forEach(function (k) {
      var lv = PM25_LEVELS[k];
      var label = lv.value === null ? lv.label : lv.label + ' · ' + lv.value;
      wrap.appendChild(buildDemoChip('chip-pm25-' + k, label,
        function () { demoSet('pm25', k); }, lv.color));
    });
  }

  wrap = document.getElementById('dc-special-chips');
  if (wrap && !wrap.childElementCount) {
    wrap.appendChild(buildDemoChip('chip-special-none', 'ไม่มี',
      function () { demoSet('special', null); }));
    Object.keys(SPECIAL_LABELS).forEach(function (k) {
      var sp = SPECIAL_LABELS[k];
      wrap.appendChild(buildDemoChip('chip-special-' + k, sp.icon + ' ' + sp.label,
        function () { demoSet('special', k); }));
    });
  }

  wrap = document.getElementById('dc-notice-chips');
  if (wrap && !wrap.childElementCount) {
    Object.keys(NOTICE_TYPES).forEach(function (k) {
      wrap.appendChild(buildDemoChip('chip-notice-' + k, NOTICE_TYPES[k].label,
        function () { demoCycleNotice(k); }));
    });
  }
}

var NOTICE_STATE_SUFFIX = { true: ' · แสดง', false: ' · ซ่อน' };

function syncChips() {
  buildDemoChips();

  Object.keys(PERSONAS).forEach(function (p) {
    var el = document.getElementById('chip-persona-' + p);
    if (el) el.classList.toggle('active', currentPersonaKey === p);
  });

  Object.keys(WEATHER_TYPES).forEach(function (k) {
    var el = document.getElementById('chip-weather-' + k);
    if (el) el.classList.toggle('active', DEMO.weather === k);
  });

  Object.keys(PM25_LEVELS).forEach(function (k) {
    var el = document.getElementById('chip-pm25-' + k);
    if (el) el.classList.toggle('active', DEMO.pm25 === k);
  });

  var noneEl = document.getElementById('chip-special-none');
  if (noneEl) noneEl.classList.toggle('active', !DEMO.special);
  Object.keys(SPECIAL_LABELS).forEach(function (k) {
    var el = document.getElementById('chip-special-' + k);
    if (el) el.classList.toggle('active', DEMO.special === k);
  });

  // Notice chips are tri-state, so the label carries the current setting.
  Object.keys(NOTICE_TYPES).forEach(function (k) {
    var el = document.getElementById('chip-notice-' + k);
    if (!el) return;
    var state = DEMO.notices[k];
    el.classList.toggle('active', state !== 'auto');
    el.textContent = NOTICE_TYPES[k].label + (NOTICE_STATE_SUFFIX[state] || '');
  });
}

function renderContextBars() {
  var bdBar = document.getElementById('birthday-bar');
  var wpBar = document.getElementById('wan-phra-bar');
  var wpText = document.getElementById('wan-phra-text');
  var wpIcon = document.getElementById('wan-phra-icon');
  var focusIcon = document.getElementById('focus-icon');
  var focusText = document.getElementById('focus-text');

  // Birthday bar
  if (bdBar) bdBar.style.display = DEMO.birthday ? 'flex' : 'none';

  // Event / special-day bar
  if (DEMO.special && SPECIAL_LABELS[DEMO.special]) {
    var sp = SPECIAL_LABELS[DEMO.special];
    if (wpText) wpText.textContent = sp.text;
    if (wpIcon) wpIcon.textContent = sp.icon;
    if (wpBar) wpBar.style.display = 'flex';
  } else {
    if (wpBar) wpBar.style.display = 'none';
  }

  // Weather chip
  var wData = WEATHER_TYPES[DEMO.weather] || WEATHER_TYPES.partly;
  var wChipEl = document.querySelector('.ctx-chip--weather');
  var wIconEl = document.getElementById('weather-icon');
  var wDescEl = document.getElementById('weather-desc');
  var wTempEl = document.getElementById('weather-temp');
  var wDetailEl = document.getElementById('weather-detail');
  if (wChipEl) {
    wChipEl.style.background = wData.bg;
    wChipEl.style.color = wData.fg;
  }
  if (wIconEl) {
    wIconEl.src = '_media/weather/' + wData.icon;
    wIconEl.style.width = Math.round(wData.w * WEATHER_ICON_SCALE) + 'px';
    wIconEl.style.height = Math.round(wData.h * WEATHER_ICON_SCALE) + 'px';
    // Two icons are drawn flipped in the design.
    wIconEl.style.transform = wData.flipY ? 'scaleY(-1)' : '';
  }
  if (wDescEl) wDescEl.textContent = wData.label;
  if (wTempEl) wTempEl.textContent = wData.temp;
  if (wDetailEl) {
    wDetailEl.textContent = wData.noDetail ? '' : WEATHER_DETAIL;
    wDetailEl.style.display = wData.noDetail ? 'none' : '';
  }

  // PM2.5 chip — the chip carries the level's colour, the face icon sits on
  // top of it unfilled.
  var pmData = PM25_LEVELS[DEMO.pm25] || PM25_LEVELS.moderate;
  var pmLabelEl = document.getElementById('pm25-label');
  var pmValueEl = document.getElementById('pm25-value');
  var pmStationEl = document.getElementById('pm25-station');
  var pmChipEl = document.getElementById('pm25-chip');
  var pmIconEl = document.querySelector('.ctx-chip__icon--pm');
  if (pmLabelEl) pmLabelEl.textContent = pmData.label;
  if (pmValueEl) {
    pmValueEl.textContent = pmData.value === null
      ? 'PM 2.5: ไม่ระบุ'
      : 'PM 2.5: ' + pmData.value + ' μg/m³';
  }
  if (pmStationEl) {
    pmStationEl.textContent = pmData.noStation ? '' : PM25_STATION;
    pmStationEl.style.display = pmData.noStation ? 'none' : '';
  }
  if (pmIconEl) pmIconEl.src = '_media/pm/' + pmData.icon;
  if (pmChipEl) {
    pmChipEl.style.background = pmData.color;
    pmChipEl.style.color = pmData.textColor;
  }

  // Weather / air-quality advice (a severe PM2.5 warning takes priority)
  if (focusIcon && focusText) {
    if (wData.noData && pmData.noData) {
      focusIcon.textContent = 'help';
      focusText.textContent = 'ยังไม่พบข้อมูลสภาพอากาศและ PM 2.5 ในพื้นที่ของคุณ ลองใหม่อีกครั้งภายหลัง';
    } else if (wData.noData) {
      focusIcon.textContent = 'help';
      focusText.textContent = 'ยังไม่พบข้อมูลสภาพอากาศในพื้นที่ของคุณ · PM 2.5 ' + pmData.label;
    } else if (pmData.noData) {
      focusIcon.textContent = 'help';
      focusText.textContent = wData.label + ' · ยังไม่พบข้อมูล PM 2.5 ในพื้นที่ของคุณ';
    } else if (pmData.tip) {
      focusIcon.textContent = 'masks';
      focusText.textContent = pmData.tip;
    } else if (wData.rainy) {
      focusIcon.textContent = 'umbrella';
      focusText.textContent = 'เย็นนี้มีโอกาสฝนตกถึง 65% อย่าลืมพกร่มออกจากบ้านด้วย';
    } else {
      focusIcon.textContent = 'info';
      focusText.textContent = wData.label + ' และ PM 2.5 ' + pmData.label + ' แนะนำสวมหน้ากากเมื่ออยู่กลางแจ้งนานๆ';
    }
  }

  applyNoticeOverrides();
}

// Applies the demo's per-notice show/hide overrides. 'auto' leaves whatever
// the page's own persona/consent rules already decided.
function applyNoticeOverrides() {
  Object.keys(NOTICE_TYPES).forEach(function (key) {
    var override = DEMO.notices[key];
    if (override === 'auto') return;
    var el = document.getElementById(NOTICE_TYPES[key].id);
    if (el) el.style.display = override ? 'flex' : 'none';
  });
}

// Cycles a notice through auto → on → off.
function demoCycleNotice(key) {
  var order = ['auto', true, false];
  var idx = order.indexOf(DEMO.notices[key]);
  DEMO.notices[key] = order[(idx + 1) % order.length];
  updateProactiveNotices();
  syncChips();
  renderContextBars();
}
