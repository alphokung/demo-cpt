/*
 * today-context-card.js
 * The today-context card: greeting, name and location, a weather chip and a
 * PM2.5 chip, and one line of advice, drawn over an illustrated sky that
 * follows the time of day (sun rising / at the top / setting, moon and stars
 * at night), with optional rain and a choice of landscape art.
 *
 * Self-contained: needs only today-context-card.css and the assets/ folder
 * next to this file (found from this script's own URL), plus the Material
 * Symbols Outlined font for the location and advice icons.
 *
 *   <link rel="stylesheet" href="today-context-card/today-context-card.css">
 *   <div id="my-card"></div>
 *   <script src="today-context-card/today-context-card.js"></script>
 *   <script>
 *     var card = TodayContextCard.mount(document.getElementById('my-card'));
 *     card.update({
 *       name: 'คุณสมชาย ใจดี',
 *       location: 'กรุงเทพมหานคร',
 *       weather: { label: 'มีเมฆบางส่วน', temp: 'อุณหภูมิ 32°C - 34°C',
 *                  detail: 'ความชื้น 66%', icon: 'w2.svg', color: '#0086c9' },
 *       pm25: { label: 'อากาศดี', value: 9, station: 'สถานี…',
 *               icon: 'green.svg', color: '#a2f061', textColor: '#25272a' },
 *       advice: { icon: 'info', text: 'แนะนำ…' },
 *       sky: 'auto',   // 'auto' (from the clock) | morning | noon | evening | night
 *       bg: '1',       // a key of TodayContextCard.BACKGROUNDS
 *       rain: 'off',   // off | light | medium | heavy | storm
 *     });
 *   </script>
 *
 * update() takes any subset of those fields and only repaints what it gets.
 * weather also takes iconWidth / iconHeight (px), flipIcon and textColor;
 * pm25.value may be null for "no data". The greeting follows the sky phase
 * unless update({ greeting: '…' }) pins one (null unpins it).
 */
(function () {
  var ASSETS = (document.currentScript ? document.currentScript.src : '')
    .replace(/[^/]*$/, '') + 'assets/';

  var SKY_PHASES = {
    morning: { label: 'เช้า · พระอาทิตย์ขึ้น', greeting: 'สวัสดีตอนเช้า' },
    noon: { label: 'กลางวัน · พระอาทิตย์ตรงหัว', greeting: 'สวัสดีตอนกลางวัน' },
    evening: { label: 'เย็น · พระอาทิตย์ตก', greeting: 'สวัสดีตอนเย็น' },
    night: { label: 'กลางคืน · ดาว/พระจันทร์', greeting: 'สวัสดีตอนกลางคืน' },
  };

  // Landscape art drawn over the sky, from assets/.
  var BACKGROUNDS = {
    '1': { label: 'ภาพ 1 · เนินเขา', file: 'bg.svg' },
    '2': { label: 'ภาพ 2 · วัด', file: 'bg-2.svg' },
  };

  // Rain levels: number of drops and their fall time in seconds.
  var RAIN_LEVELS = {
    off: { label: 'ไม่มีฝน', drops: 0 },
    light: { label: 'ฝนเล็กน้อย', drops: 28, speed: 1.1 },
    medium: { label: 'ฝนปานกลาง', drops: 50, speed: 0.85 },
    heavy: { label: 'ฝนหนัก', drops: 85, speed: 0.65 },
    storm: { label: 'ฝนฟ้าคะนอง', drops: 85, speed: 0.6 },
  };

  var STAR_COUNT = 26;

  var TEMPLATE =
    '<div class="tcc__sky" aria-hidden="true">' +
    '  <div class="tcc__stars"></div>' +
    '  <img class="tcc__sun" src="' + ASSETS + 'sun.svg" alt="">' +
    '  <img class="tcc__moon" src="' + ASSETS + 'sun.svg" alt="">' +
    '  <img class="tcc__cloud tcc__cloud--1" src="' + ASSETS + 'cloud-1.svg" alt="">' +
    '  <img class="tcc__cloud tcc__cloud--2" src="' + ASSETS + 'cloud-2.svg" alt="">' +
    '  <div class="tcc__gloom"></div>' +
    '  <div class="tcc__land"></div>' +
    '  <div class="tcc__rain"></div>' +
    '  <div class="tcc__flash"></div>' +
    '</div>' +
    '<div class="tcc__greeting">' +
    '  <p class="tcc__greeting-label"></p>' +
    '  <p class="tcc__name"></p>' +
    '  <div class="tcc__location">' +
    '    <span class="material-symbols-outlined tcc__location-icon">location_on</span>' +
    '    <span class="tcc__location-text">กำลังระบุตำแหน่ง…</span>' +
    '  </div>' +
    '</div>' +
    '<div class="tcc__panel">' +
    '  <div class="tcc-chip tcc-chip--weather">' +
    '    <img class="tcc-chip__icon" alt="">' +
    '    <div class="tcc-chip__text">' +
    '      <p class="tcc-chip__title">กำลังโหลด…</p>' +
    '      <p class="tcc-chip__value"></p>' +
    '      <p class="tcc-chip__note"></p>' +
    '    </div>' +
    '  </div>' +
    '  <div class="tcc-chip tcc-chip--pm">' +
    '    <img class="tcc-chip__icon tcc-chip__icon--pm" alt="">' +
    '    <div class="tcc-chip__text">' +
    '      <p class="tcc-chip__title">—</p>' +
    '      <p class="tcc-chip__value"></p>' +
    '      <p class="tcc-chip__note"></p>' +
    '    </div>' +
    '  </div>' +
    '  <div class="tcc__advice">' +
    '    <span class="material-symbols-outlined tcc__advice-icon">info</span>' +
    '    <p class="tcc__advice-text">กำลังโหลดคำแนะนำ…</p>' +
    '  </div>' +
    '</div>';

  function phaseForHour(h) {
    if (h >= 5 && h < 10) return 'morning';
    if (h >= 10 && h < 16) return 'noon';
    if (h >= 16 && h < 19) return 'evening';
    return 'night';
  }

  function setText(el, text) {
    el.textContent = text || '';
    el.style.display = text ? '' : 'none';
  }

  function Card(el) {
    var q = function (sel) { return el.querySelector(sel); };
    this.el = el;
    this.state = { greeting: null };

    el.classList.add('tcc');
    el.innerHTML = TEMPLATE;
    this.refs = {
      stars: q('.tcc__stars'),
      land: q('.tcc__land'),
      rain: q('.tcc__rain'),
      greeting: q('.tcc__greeting-label'),
      name: q('.tcc__name'),
      location: q('.tcc__location-text'),
      weather: q('.tcc-chip--weather'),
      pm25: q('.tcc-chip--pm'),
      adviceIcon: q('.tcc__advice-icon'),
      adviceText: q('.tcc__advice-text'),
    };

    // Scatter stars over the upper part of the sky (only shown at night).
    for (var i = 0; i < STAR_COUNT; i++) {
      var s = document.createElement('span');
      s.className = 'tcc__star' + (i % 5 === 0 ? ' tcc__star--big' : '');
      s.style.left = (Math.random() * 96 + 2).toFixed(1) + '%';
      s.style.top = (Math.random() * 55 + 3).toFixed(1) + '%';
      s.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
      this.refs.stars.appendChild(s);
    }

    this.update({ sky: 'auto', bg: '1', rain: 'off' });
  }

  Card.prototype.update = function (patch) {
    var r = this.refs;
    Object.keys(patch).forEach(function (k) { this.state[k] = patch[k]; }, this);

    if ('sky' in patch) this._paintSky();
    if ('sky' in patch || 'greeting' in patch) {
      r.greeting.textContent = this.state.greeting || SKY_PHASES[this.phase].greeting;
    }
    if ('bg' in patch) {
      var bg = BACKGROUNDS[patch.bg] || BACKGROUNDS['1'];
      r.land.style.backgroundImage = 'url("' + ASSETS + bg.file + '")';
    }
    if ('rain' in patch) this._paintRain();
    if ('name' in patch) r.name.textContent = patch.name;
    if ('location' in patch) r.location.textContent = patch.location;
    if (patch.weather) this._paintWeather(patch.weather);
    if (patch.pm25) this._paintPm25(patch.pm25);
    if (patch.advice) {
      r.adviceIcon.textContent = patch.advice.icon || 'info';
      r.adviceText.textContent = patch.advice.text;
    }
    return this;
  };

  Card.prototype._paintSky = function () {
    var sky = this.state.sky;
    this.phase = SKY_PHASES[sky] ? sky : phaseForHour(new Date().getHours());
    this.el.dataset.sky = this.phase;
    // Restart the rise / set animation on every switch.
    this.el.classList.remove('tcc--anim');
    void this.el.offsetWidth;
    this.el.classList.add('tcc--anim');
  };

  Card.prototype._paintRain = function () {
    var key = RAIN_LEVELS[this.state.rain] ? this.state.rain : 'off';
    var level = RAIN_LEVELS[key];
    var box = this.refs.rain;
    if (this.el.dataset.rain === key) return;
    this.el.dataset.rain = key;

    // Negative delays start each drop mid-fall, so it's already raining.
    box.innerHTML = '';
    for (var i = 0; i < level.drops; i++) {
      var d = document.createElement('span');
      var dur = level.speed * (0.8 + Math.random() * 0.4);
      d.className = 'tcc__drop';
      d.style.left = (Math.random() * 120 - 5).toFixed(1) + '%';
      d.style.animationDuration = dur.toFixed(2) + 's';
      d.style.animationDelay = (-Math.random() * dur).toFixed(2) + 's';
      box.appendChild(d);
    }
  };

  Card.prototype._paintWeather = function (w) {
    var chip = this.refs.weather;
    var icon = chip.querySelector('.tcc-chip__icon');
    chip.style.background = w.color || '';
    chip.style.color = w.textColor || '';
    icon.src = w.icon;
    icon.style.width = w.iconWidth ? w.iconWidth + 'px' : '';
    icon.style.height = w.iconHeight ? w.iconHeight + 'px' : '';
    icon.style.transform = w.flipIcon ? 'scaleY(-1)' : '';
    chip.querySelector('.tcc-chip__title').textContent = w.label;
    setText(chip.querySelector('.tcc-chip__value'), w.temp);
    setText(chip.querySelector('.tcc-chip__note'), w.detail);
  };

  Card.prototype._paintPm25 = function (pm) {
    var chip = this.refs.pm25;
    chip.style.background = pm.color || '';
    chip.style.color = pm.textColor || '';
    chip.querySelector('.tcc-chip__icon').src = pm.icon;
    chip.querySelector('.tcc-chip__title').textContent = pm.label;
    chip.querySelector('.tcc-chip__value').textContent = pm.value == null
      ? 'PM 2.5: ไม่ระบุ'
      : 'PM 2.5: ' + pm.value + ' μg/m³';
    setText(chip.querySelector('.tcc-chip__note'), pm.station);
  };

  window.TodayContextCard = {
    mount: function (el) { return new Card(el); },
    phaseForHour: phaseForHour,
    SKY_PHASES: SKY_PHASES,
    BACKGROUNDS: BACKGROUNDS,
    RAIN_LEVELS: RAIN_LEVELS,
  };
})();
