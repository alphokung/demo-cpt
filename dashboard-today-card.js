/*
 * dashboard-today-card.js
 * Wires the reusable TodayContextCard (today-context-card/) into
 * dashboard-with-consent-theme.html: feeds it the page's persona name, mock
 * location, and the demo's weather / PM2.5 variants, and adds the demo
 * panel's sky, rain and background pickers.
 *
 * URL parameters (for presenting a fixed look):
 *   ?sky=morning|noon|evening|night   time of day (default: from the clock)
 *   ?bg=1|2                           landscape art (default 1)
 *   ?rain=off|light|medium|heavy|storm  sets the weather chip to that rain
 *
 * Rain follows the weather chip, so chip, advice and sky always agree.
 * Loaded last: it needs dashboard-demo.js, dashboard-consent.js and
 * dashboard-context.js already parsed.
 */

// Weather chip variant → rain level on the card.
var RAIN_BY_WEATHER = {
  rainLight: 'light',
  rainMedium: 'medium',
  rainHeavy: 'heavy',
  thunder: 'storm',
};

// Rain level → the weather chip variant the rain picker / ?rain= selects.
var WEATHER_BY_RAIN = {
  off: 'partly',
  light: 'rainLight',
  medium: 'rainMedium',
  heavy: 'rainHeavy',
  storm: 'thunder',
};

var SKY_SWATCHES = { morning: '#ffd9a8', noon: '#9fd8ff', evening: '#f4a582', night: '#1c2d55' };

var todayCard = TodayContextCard.mount(document.getElementById('today-context-card'));

// Pushes the demo's current weather / PM2.5 / persona into the card.
function syncTodayCard() {
  var wData = WEATHER_TYPES[DEMO.weather] || WEATHER_TYPES.partly;
  var pmData = PM25_LEVELS[DEMO.pm25] || PM25_LEVELS.moderate;

  todayCard.update({
    name: PERSONAS[currentPersonaKey].fullName,
    location: window.CONTEXT_LOCATION || '',
    rain: RAIN_BY_WEATHER[DEMO.weather] || 'off',
    weather: {
      label: wData.label,
      temp: wData.temp,
      detail: wData.noDetail ? '' : WEATHER_DETAIL,
      icon: '_media/weather/' + wData.icon,
      iconWidth: Math.round(wData.w * WEATHER_ICON_SCALE),
      iconHeight: Math.round(wData.h * WEATHER_ICON_SCALE),
      flipIcon: wData.flipY,
      color: wData.bg,
      textColor: wData.fg,
    },
    pm25: {
      label: pmData.label,
      value: pmData.value,
      station: pmData.noStation ? '' : PM25_STATION,
      icon: '_media/pm/' + pmData.icon,
      color: pmData.color,
      textColor: pmData.textColor,
    },
    advice: contextAdvice(wData, pmData),
  });
  markActive('chip-rain-', WEATHER_BY_RAIN, function (k) { return WEATHER_BY_RAIN[k] === DEMO.weather; });
}

function setTodaySky(key) {
  todayCard.update({ sky: key });
  markActive('chip-sky-', SKY_SWATCHES, function (k) { return k === key; });
  var auto = document.getElementById('chip-sky-auto');
  if (auto) auto.classList.toggle('active', key === 'auto');
}

function setTodayBg(key) {
  todayCard.update({ bg: key });
  markActive('chip-bg-', TodayContextCard.BACKGROUNDS, function (k) { return k === key; });
}

function setTodayRain(key) {
  demoSet('weather', WEATHER_BY_RAIN[key]);
}

function markActive(prefix, table, isActive) {
  Object.keys(table).forEach(function (k) {
    var chip = document.getElementById(prefix + k);
    if (chip) chip.classList.toggle('active', isActive(k));
  });
}

// Keep the card in step with the demo panel and persona switcher.
var renderContextBarsBase = renderContextBars;
renderContextBars = function () {
  renderContextBarsBase();
  syncTodayCard();
};

var applyPersonaUIBase = applyPersonaUI;
applyPersonaUI = function () {
  applyPersonaUIBase();
  syncTodayCard();
};

(function () {
  var phases = TodayContextCard.SKY_PHASES;
  var wrap = document.getElementById('dc-sky-chips');
  if (wrap) {
    wrap.appendChild(buildDemoChip('chip-sky-auto', 'อัตโนมัติ (ตามเวลาจริง)',
      function () { setTodaySky('auto'); }));
    Object.keys(phases).forEach(function (k) {
      wrap.appendChild(buildDemoChip('chip-sky-' + k, phases[k].label,
        function () { setTodaySky(k); }, SKY_SWATCHES[k]));
    });
  }

  var rains = TodayContextCard.RAIN_LEVELS;
  wrap = document.getElementById('dc-rain-chips');
  if (wrap) {
    Object.keys(rains).forEach(function (k) {
      wrap.appendChild(buildDemoChip('chip-rain-' + k, rains[k].label,
        function () { setTodayRain(k); }));
    });
  }

  var bgs = TodayContextCard.BACKGROUNDS;
  wrap = document.getElementById('dc-bg-chips');
  if (wrap) {
    Object.keys(bgs).forEach(function (k) {
      wrap.appendChild(buildDemoChip('chip-bg-' + k, bgs[k].label,
        function () { setTodayBg(k); }));
    });
  }

  var params = new URLSearchParams(location.search);
  var sky = params.get('sky');
  var bg = params.get('bg');
  var rain = params.get('rain');
  setTodaySky(phases[sky] ? sky : 'auto');
  setTodayBg(bgs[bg] ? bg : '1');
  if (WEATHER_BY_RAIN[rain]) setTodayRain(rain);
  else syncTodayCard();
})();
