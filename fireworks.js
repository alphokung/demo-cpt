/**
 * fireworks.js — New Year celebration gimmick (ทางรัฐ design system)
 *
 * Drop-in: add ONE line before </body> on any page:
 *   <script src="fireworks.js" defer></script>
 *
 * - Floating button at the bottom-right (stacks above .back-to-top)
 * - A small switch above it lets the user choose what to release:
 *     พลุ (fireworks)  or  โคมลอย (sky lanterns)
 * - Click repeatedly for more; the overlay never blocks the page
 *
 * Optional attributes on the <script> tag:
 *   data-label="สวัสดีปีใหม่ 2570"    greeting shown on click
 *   data-mode="lantern"                default choice: "firework" (default) | "lantern"
 *   data-modes="lantern"               limit the choices (comma-separated); one value hides the switch
 *   data-autoplay="true"               release one round on page load
 *   data-haptic="false"                turn off vibration feedback
 *
 * JavaScript:
 *   thFireworks.fire()                 release using the current choice
 *   thFireworks.fire('lantern')        release a specific type
 *   thFireworks.setMode('firework')    change the current choice
 */
(function () {
  'use strict';
  if (window.__thFireworks) return;
  window.__thFireworks = true;

  var script = document.currentScript || document.querySelector('script[src*="fireworks.js"]');
  var ds = (script && script.dataset) || {};
  var now = new Date();
  var LABEL = ds.label || 'สวัสดีปีใหม่ ' + (now.getFullYear() + 543 + (now.getMonth() >= 10 ? 1 : 0));
  var AUTOPLAY = ds.autoplay === 'true';
  var HAPTIC = ds.haptic !== 'false';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var LANTERN_SVG =
    '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">' +
      '<path d="M5 4.5C5 3.1 8.1 2 12 2s7 1.1 7 2.5L16.6 17H7.4L5 4.5z" fill="currentColor"/>' +
      '<rect x="8.5" y="17.8" width="7" height="1.4" rx=".7" fill="currentColor" opacity=".7"/>' +
      '<ellipse cx="12" cy="21" rx="1.3" ry="1.8" fill="currentColor" opacity=".9"/>' +
    '</svg>';

  var MODES = {
    firework: { label: 'พลุ',    action: 'จุดพลุ',    aria: 'จุดพลุฉลองปีใหม่', icon: '<span class="material-symbols-outlined">celebration</span>' },
    lantern:  { label: 'โคมลอย', action: 'ปล่อยโคม', aria: 'ปล่อยโคมลอยฉลองปีใหม่', icon: LANTERN_SVG }
  };
  var allowed = (ds.modes || 'firework,lantern').split(',')
    .map(function (s) { return s.trim(); })
    .filter(function (m) { return MODES[m]; });
  if (!allowed.length) allowed = ['firework', 'lantern'];

  var STORE_KEY = 'thFireworksMode';
  var saved = null;
  try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
  /* the user's last choice wins over the page default */
  var mode = [saved, ds.mode, allowed[0]].filter(function (m) { return m && allowed.indexOf(m) > -1; })[0];

  /* ── Styles (design tokens only) ── */
  var css = '' +
    '.fw-canvas{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;}' +
    '.fw-dock{position:fixed;right:var(--spacing-xl);bottom:var(--spacing-2xl);z-index:9999;' +
      'touch-action:manipulation;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;' +
      'display:flex;flex-direction:column;align-items:flex-end;gap:var(--spacing-md);transition:bottom .25s ease;}' +
    '.fw-dock.fw-raised{bottom:calc(var(--spacing-2xl) + 60px);}' +

    /* mode switch */
    '.fw-modes{display:flex;gap:var(--spacing-xxs);padding:var(--spacing-xs);border-radius:var(--radius-full);' +
      'background:var(--neutral-100);box-shadow:var(--shadow-custom-lg);border:1px solid var(--stroke-neutral-lighter);}' +
    '.fw-mode{display:flex;align-items:center;gap:var(--spacing-xs);height:32px;padding:0 var(--spacing-lg) 0 var(--spacing-md);' +
      'border:none;border-radius:var(--radius-full);background:transparent;cursor:pointer;font-family:inherit;' +
      'font-size:var(--font-size-label-m);line-height:var(--line-height-label-m);font-weight:var(--font-weight-500);' +
      'color:var(--foreground-neutral-light);transition:background .15s ease,color .15s ease;-webkit-tap-highlight-color:transparent;}' +
    '.fw-mode,.fw-fab{touch-action:manipulation;}' +
    '.fw-mode .material-symbols-outlined{font-size:18px;}' +
    '.fw-mode svg{width:18px;height:18px;}' +
    '.fw-mode:hover{background:var(--background-neutral-medium);}' +
    '.fw-mode[aria-checked="true"]{background:var(--background-primary-lighter);color:var(--foreground-primary-default);font-weight:var(--font-weight-600);}' +
    '.fw-mode:focus-visible{outline:2px solid var(--primary-60);outline-offset:1px;}' +

    /* main button */
    '.fw-fab{position:relative;display:flex;align-items:center;gap:var(--spacing-md);height:48px;padding:0 var(--spacing-xl) 0 var(--spacing-lg);' +
      'border:none;border-radius:var(--radius-full);cursor:pointer;font-family:inherit;' +
      'font-size:var(--font-size-title-s);line-height:var(--line-height-title-s);font-weight:var(--font-weight-600);' +
      'color:var(--neutral-100);background:linear-gradient(135deg,var(--primary-20),var(--primary-30-base));' +
      'box-shadow:var(--shadow-custom-lg);transition:transform .15s ease,box-shadow .2s ease;' +
      '-webkit-tap-highlight-color:transparent;user-select:none;}' +
    '.fw-fab:hover{box-shadow:var(--shadow-custom-xl);transform:translateY(-2px);}' +
    '.fw-fab:active{transform:scale(.94);}' +
    '.fw-fab:focus-visible{outline:3px solid var(--primary-80);outline-offset:2px;}' +
    '.fw-fab-icon{display:flex;color:var(--warning-60);animation:fw-twinkle 1.6s ease-in-out infinite;}' +
    '.fw-fab-icon .material-symbols-outlined{font-size:22px;font-variation-settings:"FILL" 1;}' +
    '.fw-fab-count{min-width:20px;height:20px;padding:0 var(--spacing-xs);border-radius:var(--radius-full);' +
      'background:var(--warning-60);color:var(--neutral-10);font-size:var(--font-size-label-s);' +
      'line-height:20px;text-align:center;display:none;}' +
    '.fw-fab-count.show{display:inline-block;}' +

    /* greeting */
    '.fw-greeting{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(.8);z-index:9999;pointer-events:none;' +
      'padding:var(--spacing-lg) var(--spacing-3xl);border-radius:var(--radius-full);' +
      'background:rgba(0,61,40,.82);color:var(--neutral-100);backdrop-filter:blur(6px);' +
      'font-size:var(--font-size-headline-s);line-height:32px;font-weight:var(--font-weight-700);' +
      'white-space:nowrap;box-shadow:var(--shadow-custom-xl);opacity:0;transition:opacity .4s ease,transform .4s cubic-bezier(.2,1.4,.4,1);}' +
    '.fw-greeting.show{opacity:1;transform:translate(-50%,-50%) scale(1);}' +

    '@keyframes fw-twinkle{0%,100%{transform:rotate(0) scale(1);}50%{transform:rotate(12deg) scale(1.12);}}' +
    '@media (max-width:479px){.fw-fab-text{display:none;}.fw-fab{width:48px;padding:0;justify-content:center;}' +
      '.fw-fab-count{position:absolute;top:-4px;right:-4px;}.fw-greeting{font-size:var(--font-size-title-l);}}' +
    '@media (min-width:1024px){.fw-dock{bottom:var(--spacing-3xl);}.fw-dock.fw-raised{bottom:calc(var(--spacing-3xl) + 60px);}}' +
    '@media (prefers-reduced-motion:reduce){.fw-fab-icon{animation:none;}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function init() {
    /* ── Haptics ──
       Android (Chrome, Samsung, Firefox): Vibration API.
       iOS (Safari AND Chrome/Edge/Firefox — all WebKit): no Vibration API, but on
       iOS 18+ toggling an <input type="checkbox" switch> plays the system haptic.
       We create a hidden switch, click its label, then remove it (same approach as
       the ios-haptics library). Works in Safari, Chrome on iOS and home-screen apps.
       Needs iOS 18+, and "System Haptics" turned on in Settings → Sounds & Haptics. */
    var canVibrate = typeof navigator.vibrate === 'function';
    var isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);   /* iPadOS reports as Mac */

    function iosTick() {
      var label = document.createElement('label');
      label.setAttribute('aria-hidden', 'true');
      label.style.display = 'none';
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.setAttribute('switch', '');
      input.tabIndex = -1;
      label.appendChild(input);
      document.head.appendChild(label);
      label.click();
      document.head.removeChild(label);
    }

    /* pattern: ms number or [on, off, on, ...] like navigator.vibrate */
    function iosPattern(pattern) {
      if (typeof pattern === 'number') { iosTick(); return; }
      var at = 0;
      for (var i = 0; i < pattern.length; i++) {
        if (i % 2 === 0) {
          if (at === 0) iosTick(); else setTimeout(iosTick, at);
        }
        at += pattern[i];
      }
    }

    var lastBuzz = 0;
    function haptic(pattern, fromGesture) {
      if (!HAPTIC) return;
      var t = performance.now();
      /* don't stack overlapping bursts (iOS ticks are stronger, so space them more) */
      if (!fromGesture && t - lastBuzz < (canVibrate ? 90 : 140)) return;
      lastBuzz = t;
      try {
        if (canVibrate) navigator.vibrate(pattern);
        else if (isIOS) iosPattern(pattern);
      } catch (e) {}
    }

    /* ── Canvases: fireworks keep light trails, lanterns are redrawn cleanly ── */
    function makeCanvas() {
      var c = document.createElement('canvas');
      c.className = 'fw-canvas';
      c.setAttribute('aria-hidden', 'true');
      document.body.appendChild(c);
      return c;
    }
    var lanternCanvas = makeCanvas();
    var fwCanvas = makeCanvas();
    var lctx = lanternCanvas.getContext('2d');
    var ctx = fwCanvas.getContext('2d');

    /* ── Dock: mode switch + main button ── */
    var dock = document.createElement('div');
    dock.className = 'fw-dock';

    var modesEl = null;
    if (allowed.length > 1) {
      modesEl = document.createElement('div');
      modesEl.className = 'fw-modes';
      modesEl.setAttribute('role', 'radiogroup');
      modesEl.setAttribute('aria-label', 'เลือกสิ่งที่จะปล่อย');
      allowed.forEach(function (m) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'fw-mode';
        b.dataset.mode = m;
        b.setAttribute('role', 'radio');
        b.innerHTML = MODES[m].icon + '<span>' + MODES[m].label + '</span>';
        b.addEventListener('click', function () { haptic(8, true); setMode(m); });
        modesEl.appendChild(b);
      });
      dock.appendChild(modesEl);
    }

    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'fw-fab';
    fab.innerHTML =
      '<span class="fw-fab-icon"></span>' +
      '<span class="fw-fab-text"></span>' +
      '<span class="fw-fab-count" aria-hidden="true">0</span>';
    dock.appendChild(fab);
    document.body.appendChild(dock);
    var countEl = fab.querySelector('.fw-fab-count');

    var greeting = document.createElement('div');
    greeting.className = 'fw-greeting';
    greeting.setAttribute('role', 'status');
    document.body.appendChild(greeting);

    function setMode(m) {
      if (!MODES[m] || allowed.indexOf(m) < 0) return;
      mode = m;
      try { localStorage.setItem(STORE_KEY, m); } catch (e) {}
      fab.querySelector('.fw-fab-icon').innerHTML = MODES[m].icon;
      fab.querySelector('.fw-fab-text').textContent = MODES[m].action;
      fab.setAttribute('aria-label', MODES[m].aria);
      if (modesEl) {
        Array.prototype.forEach.call(modesEl.children, function (b) {
          b.setAttribute('aria-checked', b.dataset.mode === m ? 'true' : 'false');
        });
      }
    }
    setMode(mode);

    /* Stack above the back-to-top FAB when it is visible */
    var btt = document.getElementById('back-to-top') || document.querySelector('.back-to-top');
    function syncPosition() {
      dock.classList.toggle('fw-raised', !!(btt && btt.classList.contains('visible')));
    }
    if (btt && window.MutationObserver) {
      new MutationObserver(syncPosition).observe(btt, { attributes: true, attributeFilter: ['class'] });
      syncPosition();
    }

    /* ── Palette from design tokens ── */
    var root = getComputedStyle(document.documentElement);
    function token(name, fallback) { return root.getPropertyValue(name).trim() || fallback; }
    var palette = ['--warning-60', '--warning-80', '--danger-60', '--primary-60', '--secondary-60', '--info-60']
      .map(function (v) { return token(v, ''); })
      .filter(Boolean);
    if (!palette.length) palette = ['#fdb022', '#fedf89', '#f97066', '#5ed49a', '#5f88d3', '#36bffa'];
    var WARM_DARK = token('--warning-40', '#dc6803');
    var WARM_MID = token('--warning-60', '#fdb022');
    var WARM_LIGHT = token('--warning-80', '#fedf89');

    /* ── Canvas sizing ── */
    var W = 0, H = 0;
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      [fwCanvas, lanternCanvas].forEach(function (c) { c.width = W * dpr; c.height = H * dpr; });
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function rand(a, b) { return a + Math.random() * (b - a); }
    function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

    /* ════════════ Fireworks ════════════ */
    var rockets = [], sparks = [];
    var MAX_SPARKS = 2500, GRAVITY = 0.06;

    function launchFirework(delay) {
      setTimeout(function () {
        var x = rand(W * 0.15, W * 0.85);
        rockets.push({ x: x, y: H + 10, tx: x + rand(-60, 60), ty: rand(H * 0.12, H * 0.45), color: pick(palette) });
        start();
      }, delay || 0);
    }

    function explode(r) {
      var shape = pick(['ring', 'burst', 'burst', 'willow']);
      var n = reduceMotion ? 40 : (shape === 'ring' ? 70 : 110);
      var c2 = pick(palette);
      var speed = rand(3, 5.5);
      for (var i = 0; i < n && sparks.length < MAX_SPARKS; i++) {
        var a = (Math.PI * 2 * i) / n + (shape === 'ring' ? 0 : rand(-0.1, 0.1));
        var s = shape === 'ring' ? speed : speed * Math.pow(Math.random(), 0.5);
        sparks.push({
          x: r.x, y: r.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1,
          decay: shape === 'willow' ? rand(0.006, 0.01) : rand(0.012, 0.02),
          drag: shape === 'willow' ? 0.975 : 0.985,
          size: rand(1.6, 2.8), color: Math.random() < 0.7 ? r.color : c2, flicker: Math.random() < 0.3
        });
      }
      sparks.push({ x: r.x, y: r.y, vx: 0, vy: 0, life: 1, decay: 0.08, drag: 1, size: 26, color: '#ffffff', flash: true });
      haptic(shape === 'ring' ? [18, 30, 12] : 28);   /* boom */
    }

    function stepFireworks(dt) {
      /* fade previous frame → light trails */
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';

      for (var i = rockets.length - 1; i >= 0; i--) {
        var r = rockets[i];
        var dx = r.tx - r.x, dy = r.ty - r.y;
        r.x += dx * 0.06 * dt;
        r.y += dy * 0.06 * dt;
        ctx.fillStyle = r.color;
        ctx.beginPath(); ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2); ctx.fill();
        if (Math.abs(dy) < 8) { explode(r); rockets.splice(i, 1); }
      }
      for (var j = sparks.length - 1; j >= 0; j--) {
        var p = sparks[j];
        p.vx *= Math.pow(p.drag, dt); p.vy *= Math.pow(p.drag, dt);
        if (!p.flash) p.vy += GRAVITY * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.life -= p.decay * dt;
        if (p.life <= 0) { sparks.splice(j, 1); continue; }
        ctx.globalAlpha = p.flash ? p.life * 0.5 : (p.flicker ? p.life * (0.5 + Math.random() * 0.5) : p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.flash ? p.size * (1.4 - p.life) : p.size * (0.4 + p.life * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!rockets.length && !sparks.length) ctx.clearRect(0, 0, W, H);
    }

    /* ════════════ Sky lanterns (โคมลอย) ════════════ */
    var lanterns = [];
    var MAX_LANTERNS = 120;

    function launchLantern(delay) {
      setTimeout(function () {
        if (lanterns.length >= MAX_LANTERNS) return;
        var depth = Math.random();                     /* 0 = far, 1 = near */
        var size = 14 + depth * 20;                    /* body width in px */
        lanterns.push({
          x: rand(W * 0.08, W * 0.92),
          y: H + size * 2,
          size: size,
          vy: (0.45 + depth * 0.55) * rand(0.85, 1.15),
          swayAmp: rand(0.25, 0.6),
          swayFreq: rand(0.008, 0.016),
          phase: rand(0, Math.PI * 2),
          tilt: 0,
          t: 0,
          flicker: rand(0, 10),
          alpha: 0
        });
        start();
      }, delay || 0);
    }

    function drawLantern(l) {
      var w = l.size, h = w * 1.25;
      var topW = w, botW = w * 0.66;
      /* perspective: shrink & fade as it rises */
      var progress = Math.max(0, Math.min(1, 1 - l.y / H));
      var scale = 1 - progress * 0.45;
      var fadeTop = l.y < H * 0.18 ? Math.max(0, l.y / (H * 0.18)) : 1;
      var a = l.alpha * fadeTop;
      if (a <= 0) return;
      var flick = 0.85 + Math.sin(l.flicker) * 0.08 + Math.random() * 0.07;

      lctx.save();
      lctx.translate(l.x, l.y);
      lctx.rotate(l.tilt);
      lctx.scale(scale, scale);
      lctx.globalAlpha = a;

      /* outer glow */
      var g = lctx.createRadialGradient(0, h * 0.15, 0, 0, h * 0.15, w * 2.2);
      g.addColorStop(0, 'rgba(253,176,34,' + (0.45 * flick) + ')');
      g.addColorStop(0.45, 'rgba(253,176,34,' + (0.14 * flick) + ')');
      g.addColorStop(1, 'rgba(253,176,34,0)');
      lctx.fillStyle = g;
      lctx.beginPath(); lctx.arc(0, h * 0.15, w * 2.2, 0, Math.PI * 2); lctx.fill();

      /* paper body (wide rounded top, narrower bottom opening) */
      var top = -h / 2, bot = h / 2;
      var body = lctx.createLinearGradient(0, top, 0, bot);
      body.addColorStop(0, WARM_DARK);
      body.addColorStop(0.55, WARM_MID);
      body.addColorStop(1, WARM_LIGHT);
      lctx.fillStyle = body;
      lctx.beginPath();
      lctx.moveTo(-botW / 2, bot);
      lctx.lineTo(-topW / 2, top + w * 0.18);
      lctx.quadraticCurveTo(-topW / 2, top, 0, top);
      lctx.quadraticCurveTo(topW / 2, top, topW / 2, top + w * 0.18);
      lctx.lineTo(botW / 2, bot);
      lctx.closePath();
      lctx.fill();

      /* inner light */
      var inner = lctx.createRadialGradient(0, bot - h * 0.15, 0, 0, bot - h * 0.15, h * 0.75);
      inner.addColorStop(0, 'rgba(255,255,235,' + (0.85 * flick) + ')');
      inner.addColorStop(1, 'rgba(255,255,235,0)');
      lctx.fillStyle = inner;
      lctx.fill();

      /* paper seams */
      lctx.strokeStyle = 'rgba(181,71,8,0.35)';
      lctx.lineWidth = 0.8;
      lctx.beginPath();
      lctx.moveTo(0, top + 1); lctx.lineTo(0, bot);
      lctx.moveTo(-topW * 0.25, top + w * 0.06); lctx.lineTo(-botW * 0.25, bot);
      lctx.moveTo(topW * 0.25, top + w * 0.06); lctx.lineTo(botW * 0.25, bot);
      lctx.stroke();

      /* bottom ring + flame */
      lctx.fillStyle = 'rgba(122,46,14,0.7)';
      lctx.fillRect(-botW / 2, bot - 1, botW, 2);
      lctx.fillStyle = 'rgba(255,250,220,' + flick + ')';
      lctx.beginPath();
      lctx.ellipse(0, bot + w * 0.12, w * 0.09, w * 0.16 * flick, 0, 0, Math.PI * 2);
      lctx.fill();

      lctx.restore();
    }

    function stepLanterns(dt) {
      lctx.clearRect(0, 0, W, H);
      for (var i = lanterns.length - 1; i >= 0; i--) {
        var l = lanterns[i];
        l.t += dt;
        l.y -= l.vy * dt;
        var sway = Math.sin(l.t * l.swayFreq + l.phase);
        l.x += sway * l.swayAmp * dt;
        l.tilt = sway * 0.08;
        l.flicker += 0.25 * dt;
        l.alpha = Math.min(1, l.alpha + 0.03 * dt);
        if (l.y < -l.size * 2) { lanterns.splice(i, 1); continue; }
      }
      /* draw far (small) lanterns first */
      lanterns.slice().sort(function (a, b) { return a.size - b.size; }).forEach(drawLantern);
    }

    /* ── Shared loop ── */
    var running = false, last = 0;
    function step(t) {
      var dt = Math.min((t - last) / 16.67, 3) || 1;
      last = t;
      stepFireworks(dt);
      stepLanterns(dt);
      if (rockets.length || sparks.length || lanterns.length) {
        requestAnimationFrame(step);
      } else {
        running = false;
        ctx.clearRect(0, 0, W, H);
        lctx.clearRect(0, 0, W, H);
      }
    }
    function start() {
      if (running) return;
      running = true;
      last = performance.now();
      requestAnimationFrame(step);
    }

    /* ── Interaction ── */
    var clicks = 0, greetTimer;
    function fire(kind) {
      kind = MODES[kind] ? kind : mode;
      if (kind === 'lantern') {
        var n = reduceMotion ? 2 : 4;
        for (var i = 0; i < n; i++) launchLantern(i * 260);
      } else {
        var v = reduceMotion ? 1 : 3;
        for (var k = 0; k < v; k++) launchFirework(k * 180);
      }
      clicks++;
      countEl.textContent = clicks > 99 ? '99+' : clicks;
      countEl.classList.toggle('show', clicks > 1);
      greeting.textContent = (kind === 'lantern' ? '🏮 ' : '🎉 ') + LABEL;
      greeting.classList.add('show');
      clearTimeout(greetTimer);
      greetTimer = setTimeout(function () { greeting.classList.remove('show'); }, 2600);
    }

    fab.addEventListener('click', function () { haptic(12, true); fire(); });
    /* belt-and-braces: stop double-tap zoom on browsers that ignore touch-action */
    dock.addEventListener('dblclick', function (e) { e.preventDefault(); });
    var lastTouch = 0;
    dock.addEventListener('touchend', function (e) {
      var t = Date.now();
      if (t - lastTouch < 350) { e.preventDefault(); e.target.closest('button') && e.target.closest('button').click(); }
      lastTouch = t;
    }, { passive: false });
    window.thFireworks = { fire: fire, setMode: setMode, getMode: function () { return mode; } };
    if (AUTOPLAY) setTimeout(fire, 600);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
