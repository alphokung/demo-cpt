/*
 * dashboard-sky.js
 * Time-of-day sky on the today-context card (dashboard-with-consent-theme.html).
 *
 * Picks a phase from the current hour — morning (sun rising), noon (sun at the
 * top), evening (sun setting), night (moon + stars) — and stamps it on the
 * card as data-sky; dashboard-theme.css does the rest. The demo modal (or
 * ?sky=<phase> in the URL) can pin a phase for presenting. The landscape art
 * is picked the same way, via the demo modal or ?bg=<key> (default 1).
 *
 * Rain (data-rain on the card) follows the weather chip: any rainy variant
 * makes it rain, at a strength matching the variant. ?rain=<level> and the
 * demo modal's rain group set the weather chip, so chip and sky always agree.
 *
 * Loaded after dashboard-ui.js so a pinned phase can also retitle the greeting.
 */

var SKY_PHASES = {
  auto: { label: 'อัตโนมัติ (ตามเวลาจริง)' },
  morning: { label: 'เช้า · พระอาทิตย์ขึ้น', greeting: 'สวัสดีตอนเช้า', swatch: '#ffd9a8' },
  noon: { label: 'กลางวัน · พระอาทิตย์ตรงหัว', greeting: 'สวัสดีตอนกลางวัน', swatch: '#9fd8ff' },
  evening: { label: 'เย็น · พระอาทิตย์ตก', greeting: 'สวัสดีตอนเย็น', swatch: '#f4a582' },
  night: { label: 'กลางคืน · ดาว/พระจันทร์', greeting: 'สวัสดีตอนกลางคืน', swatch: '#1c2d55' },
};

// Landscape art drawn over the sky. Add a variant here and it shows up in
// the demo modal and as ?bg=<key>.
var CTX_BACKGROUNDS = {
  '1': { label: 'ภาพ 1 · เนินเขา', file: '_media/ctx-bg/bg.svg' },
  '2': { label: 'ภาพ 2', file: '_media/ctx-bg/bg-2.svg' },
};

// Rain follows the weather chip (DEMO.weather in dashboard-demo.js): each
// rainy variant maps to a rain level, its number of drops and fall time (s).
var RAIN_BY_WEATHER = {
  rainLight: { level: 'light', drops: 28, speed: 1.1 },
  rainMedium: { level: 'medium', drops: 50, speed: 0.85 },
  rainHeavy: { level: 'heavy', drops: 85, speed: 0.65 },
  thunder: { level: 'storm', drops: 85, speed: 0.6 },
};

// Demo / ?rain=<key> shortcuts: each one just picks a weather chip variant.
var RAIN_OPTIONS = {
  off: { label: 'ไม่มีฝน', weather: 'partly' },
  light: { label: 'ฝนเล็กน้อย', weather: 'rainLight' },
  medium: { label: 'ฝนปานกลาง', weather: 'rainMedium' },
  heavy: { label: 'ฝนหนัก', weather: 'rainHeavy' },
  storm: { label: 'ฝนฟ้าคะนอง', weather: 'thunder' },
};

var STAR_COUNT = 26;

function skyPhaseForHour(h) {
  if (h >= 5 && h < 10) return 'morning';
  if (h >= 10 && h < 16) return 'noon';
  if (h >= 16 && h < 19) return 'evening';
  return 'night';
}

function setSkyPhase(key) {
  var card = document.getElementById('today-context-card');
  if (!card) return;
  var phase = key === 'auto' ? skyPhaseForHour(new Date().getHours()) : key;

  card.dataset.sky = phase;
  // Restart the rise / set animation on every switch.
  card.classList.remove('ctx-card--sky-anim');
  void card.offsetWidth;
  card.classList.add('ctx-card--sky-anim');

  // A pinned phase overrides the clock-based greeting from dashboard-ui.js.
  var greetEl = document.getElementById('welcome-greeting');
  if (greetEl && key !== 'auto') greetEl.textContent = SKY_PHASES[phase].greeting;

  Object.keys(SKY_PHASES).forEach(function (k) {
    var chip = document.getElementById('chip-sky-' + k);
    if (chip) chip.classList.toggle('active', k === key);
  });
}

function setCtxBackground(key) {
  var land = document.getElementById('ctx-sky-land');
  if (land) land.style.backgroundImage = 'url("' + CTX_BACKGROUNDS[key].file + '")';

  Object.keys(CTX_BACKGROUNDS).forEach(function (k) {
    var chip = document.getElementById('chip-bg-' + k);
    if (chip) chip.classList.toggle('active', k === key);
  });
}

function applyRain() {
  var card = document.getElementById('today-context-card');
  var box = document.getElementById('ctx-sky-rain');
  if (!card || !box) return;
  var rain = RAIN_BY_WEATHER[DEMO.weather];
  var level = rain ? rain.level : 'off';

  Object.keys(RAIN_OPTIONS).forEach(function (k) {
    var chip = document.getElementById('chip-rain-' + k);
    if (chip) chip.classList.toggle('active', RAIN_OPTIONS[k].weather === DEMO.weather);
  });

  if (card.dataset.rain === level) return;
  card.dataset.rain = level;

  // Rebuild the drops; negative delays start them mid-fall so the rain is
  // already falling when the level switches.
  box.innerHTML = '';
  for (var i = 0; i < (rain ? rain.drops : 0); i++) {
    var d = document.createElement('span');
    var dur = rain.speed * (0.8 + Math.random() * 0.4);
    d.className = 'ctx-sky__drop';
    d.style.left = (Math.random() * 120 - 5).toFixed(1) + '%';
    d.style.animationDuration = dur.toFixed(2) + 's';
    d.style.animationDelay = (-Math.random() * dur).toFixed(2) + 's';
    box.appendChild(d);
  }
}

function setRain(key) {
  demoSet('weather', RAIN_OPTIONS[key].weather);
}

// Repaint the rain whenever the demo re-renders the weather chip.
var renderContextBarsBase = renderContextBars;
renderContextBars = function () {
  renderContextBarsBase();
  applyRain();
};

(function () {
  // Scatter stars over the upper part of the sky (only shown at night).
  var stars = document.getElementById('ctx-sky-stars');
  if (stars) {
    for (var i = 0; i < STAR_COUNT; i++) {
      var s = document.createElement('span');
      s.className = 'ctx-sky__star' + (i % 5 === 0 ? ' ctx-sky__star--big' : '');
      s.style.left = (Math.random() * 96 + 2).toFixed(1) + '%';
      s.style.top = (Math.random() * 55 + 3).toFixed(1) + '%';
      s.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
      stars.appendChild(s);
    }
  }

  var wrap = document.getElementById('dc-sky-chips');
  if (wrap) {
    Object.keys(SKY_PHASES).forEach(function (k) {
      wrap.appendChild(buildDemoChip('chip-sky-' + k, SKY_PHASES[k].label,
        function () { setSkyPhase(k); }, SKY_PHASES[k].swatch));
    });
  }

  wrap = document.getElementById('dc-bg-chips');
  if (wrap) {
    Object.keys(CTX_BACKGROUNDS).forEach(function (k) {
      wrap.appendChild(buildDemoChip('chip-bg-' + k, CTX_BACKGROUNDS[k].label,
        function () { setCtxBackground(k); }));
    });
  }

  wrap = document.getElementById('dc-rain-chips');
  if (wrap) {
    Object.keys(RAIN_OPTIONS).forEach(function (k) {
      wrap.appendChild(buildDemoChip('chip-rain-' + k, RAIN_OPTIONS[k].label,
        function () { setRain(k); }));
    });
  }

  var params = new URLSearchParams(location.search);
  var sky = params.get('sky');
  var bg = params.get('bg');
  var rain = params.get('rain');
  setSkyPhase(SKY_PHASES[sky] ? sky : 'auto');
  setCtxBackground(CTX_BACKGROUNDS[bg] ? bg : '1');
  if (RAIN_OPTIONS[rain]) setRain(rain);
  else applyRain();
})();
