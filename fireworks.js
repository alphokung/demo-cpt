/**
 * fireworks.js — New Year celebration gimmick (ทางรัฐ design system)
 *
 * Drop-in: add ONE line before </body> on any page:
 *   <script src="fireworks.js" defer></script>
 *
 * - Injects a floating button at the bottom-right (stacks above .back-to-top)
 * - Each click launches a volley of fireworks on a full-screen overlay
 * - Click repeatedly for more fireworks; the overlay never blocks the page
 *
 * Optional attributes on the <script> tag:
 *   data-label="สวัสดีปีใหม่ 2570"   greeting shown on the first click
 *   data-autoplay="true"              launch one volley on page load
 */
(function () {
  'use strict';
  if (window.__thFireworks) return;
  window.__thFireworks = true;

  var script = document.currentScript || document.querySelector('script[src*="fireworks.js"]');
  var LABEL = (script && script.dataset.label) || 'สวัสดีปีใหม่ ' + (new Date().getFullYear() + 543 + (new Date().getMonth() >= 10 ? 1 : 0));
  var AUTOPLAY = script && script.dataset.autoplay === 'true';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Styles (design tokens only) ── */
  var css = '' +
    '.fw-canvas{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;}' +
    '.fw-fab{position:fixed;right:var(--spacing-xl);bottom:var(--spacing-2xl);z-index:9999;' +
      'display:flex;align-items:center;gap:var(--spacing-md);height:48px;padding:0 var(--spacing-xl) 0 var(--spacing-lg);' +
      'border:none;border-radius:var(--radius-full);cursor:pointer;font-family:inherit;' +
      'font-size:var(--font-size-title-s);line-height:var(--line-height-title-s);font-weight:var(--font-weight-600);' +
      'color:var(--neutral-100);background:linear-gradient(135deg,var(--primary-20),var(--primary-30-base));' +
      'box-shadow:var(--shadow-custom-lg);transition:transform .15s ease,bottom .25s ease,box-shadow .2s ease;' +
      '-webkit-tap-highlight-color:transparent;user-select:none;}' +
    '.fw-fab:hover{box-shadow:var(--shadow-custom-xl);transform:translateY(-2px);}' +
    '.fw-fab:active{transform:scale(.94);}' +
    '.fw-fab:focus-visible{outline:3px solid var(--primary-80);outline-offset:2px;}' +
    '.fw-fab .material-symbols-outlined{font-size:22px;color:var(--warning-60);' +
      'font-variation-settings:"FILL" 1;animation:fw-twinkle 1.6s ease-in-out infinite;}' +
    '.fw-fab.fw-raised{bottom:calc(var(--spacing-2xl) + 60px);}' +
    '.fw-fab-count{min-width:20px;height:20px;padding:0 var(--spacing-xs);border-radius:var(--radius-full);' +
      'background:var(--warning-60);color:var(--neutral-10);font-size:var(--font-size-label-s);' +
      'line-height:20px;text-align:center;display:none;}' +
    '.fw-fab-count.show{display:inline-block;}' +
    '.fw-greeting{position:fixed;left:50%;top:22%;transform:translate(-50%,0) scale(.8);z-index:9999;pointer-events:none;' +
      'padding:var(--spacing-lg) var(--spacing-3xl);border-radius:var(--radius-full);' +
      'background:rgba(0,61,40,.82);color:var(--neutral-100);backdrop-filter:blur(6px);' +
      'font-size:var(--font-size-headline-s);line-height:var(--line-height-headline-s,32px);font-weight:var(--font-weight-700);' +
      'white-space:nowrap;box-shadow:var(--shadow-custom-xl);opacity:0;transition:opacity .4s ease,transform .4s cubic-bezier(.2,1.4,.4,1);}' +
    '.fw-greeting.show{opacity:1;transform:translate(-50%,0) scale(1);}' +
    '@keyframes fw-twinkle{0%,100%{transform:rotate(0) scale(1);}50%{transform:rotate(18deg) scale(1.15);}}' +
    '@media (max-width:479px){.fw-fab-text{display:none;}.fw-fab{width:48px;padding:0;justify-content:center;}' +
      '.fw-fab-count{position:absolute;top:-4px;right:-4px;}.fw-greeting{font-size:var(--font-size-title-l);}}' +
    '@media (min-width:1024px){.fw-fab{bottom:var(--spacing-3xl);}.fw-fab.fw-raised{bottom:calc(var(--spacing-3xl) + 60px);}}' +
    '@media (prefers-reduced-motion:reduce){.fw-fab .material-symbols-outlined{animation:none;}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function init() {
    /* ── DOM ── */
    var canvas = document.createElement('canvas');
    canvas.className = 'fw-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'fw-fab';
    fab.setAttribute('aria-label', 'จุดพลุฉลองปีใหม่');
    fab.innerHTML =
      '<span class="material-symbols-outlined">celebration</span>' +
      '<span class="fw-fab-text">จุดพลุ</span>' +
      '<span class="fw-fab-count" aria-hidden="true">0</span>';
    document.body.appendChild(fab);
    var countEl = fab.querySelector('.fw-fab-count');

    var greeting = document.createElement('div');
    greeting.className = 'fw-greeting';
    greeting.setAttribute('role', 'status');
    greeting.textContent = '🎉 ' + LABEL;
    document.body.appendChild(greeting);

    /* Stack above the back-to-top FAB when it is visible */
    var btt = document.getElementById('back-to-top') || document.querySelector('.back-to-top');
    function syncPosition() {
      fab.classList.toggle('fw-raised', !!(btt && btt.classList.contains('visible')));
    }
    if (btt && window.MutationObserver) {
      new MutationObserver(syncPosition).observe(btt, { attributes: true, attributeFilter: ['class'] });
      syncPosition();
    }

    /* ── Palette from design tokens ── */
    var root = getComputedStyle(document.documentElement);
    var palette = ['--warning-60', '--warning-80', '--danger-60', '--primary-60', '--secondary-60', '--info-60', '--neutral-100']
      .map(function (v) { return root.getPropertyValue(v).trim(); })
      .filter(Boolean);
    if (!palette.length) palette = ['#fdb022', '#fedf89', '#f97066', '#5ed49a', '#5f88d3', '#36bffa', '#ffffff'];

    /* ── Canvas sizing ── */
    var dpr = 1, W = 0, H = 0;
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    /* ── Simulation ── */
    var rockets = [], sparks = [], running = false, last = 0;
    var MAX_SPARKS = 2500;
    var GRAVITY = 0.06;
    function rand(a, b) { return a + Math.random() * (b - a); }
    function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

    function launch(delay) {
      setTimeout(function () {
        var x = rand(W * 0.15, W * 0.85);
        var ty = rand(H * 0.12, H * 0.45);
        rockets.push({
          x: x, y: H + 10,
          tx: x + rand(-60, 60), ty: ty,
          color: pick(palette),
          trail: []
        });
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
          x: r.x, y: r.y,
          vx: Math.cos(a) * s, vy: Math.sin(a) * s,
          life: 1,
          decay: shape === 'willow' ? rand(0.006, 0.01) : rand(0.012, 0.02),
          drag: shape === 'willow' ? 0.975 : 0.985,
          size: rand(1.6, 2.8),
          color: Math.random() < 0.7 ? r.color : c2,
          flicker: Math.random() < 0.3
        });
      }
      /* bright flash */
      sparks.push({ x: r.x, y: r.y, vx: 0, vy: 0, life: 1, decay: 0.08, drag: 1, size: 26, color: '#ffffff', flash: true });
    }

    function step(t) {
      var dt = Math.min((t - last) / 16.67, 3) || 1;
      last = t;

      /* fade previous frame → light trails, then clear fully transparent pixels */
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
        p.vy += GRAVITY * dt * (p.flash ? 0 : 1);
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.life -= p.decay * dt;
        if (p.life <= 0) { sparks.splice(j, 1); continue; }
        var alpha = p.flicker ? p.life * (0.5 + Math.random() * 0.5) : p.life;
        ctx.globalAlpha = p.flash ? p.life * 0.5 : alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.flash ? p.size * (1.4 - p.life) : p.size * (0.4 + p.life * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (rockets.length || sparks.length) {
        requestAnimationFrame(step);
      } else {
        running = false;
        ctx.clearRect(0, 0, W, H);
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
    function fire() {
      var volley = reduceMotion ? 1 : 3;
      for (var k = 0; k < volley; k++) launch(k * 180);
      clicks++;
      countEl.textContent = clicks > 99 ? '99+' : clicks;
      countEl.classList.toggle('show', clicks > 1);
      greeting.classList.add('show');
      clearTimeout(greetTimer);
      greetTimer = setTimeout(function () { greeting.classList.remove('show'); }, 2600);
    }

    fab.addEventListener('click', fire);
    window.thFireworks = { fire: fire, launch: launch };
    if (AUTOPLAY) setTimeout(fire, 600);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
