/*
 * dashboard-sky.js
 * Time-of-day sky on the today-context card (dashboard-with-consent-theme.html).
 *
 * Picks a phase from the current hour — morning (sun rising), noon (sun at the
 * top), evening (sun setting), night (moon + stars) — and stamps it on the
 * card as data-sky; dashboard-theme.css does the rest. The demo modal (or
 * ?sky=<phase> in the URL) can pin a phase for presenting.
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

  var fromUrl = new URLSearchParams(location.search).get('sky');
  setSkyPhase(SKY_PHASES[fromUrl] ? fromUrl : 'auto');
})();
