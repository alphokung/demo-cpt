/*
 * dashboard-ui.js
 * Page chrome shared by the dashboard: modal open/close, the time-of-day
 * greeting, and the back-to-top button.
 *
 * Loaded last, after the demo FAB and back-to-top markup — both handlers below
 * read those elements at parse time. openModal()/closeModal() are only ever
 * called from click handlers or on `pageshow`, so defining them here is late
 * enough for dashboard-consent.js.
 */

function openModal(id) {
  if (id === 'modal-demo-config') syncChips();
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

// ─── Time-of-day greeting ──────────────────────────────────────────
(function () {
  var h = new Date().getHours();
  var greeting = h >= 5 && h < 12 ? 'สวัสดีตอนเช้า'
    : h >= 12 && h < 17 ? 'สวัสดีตอนกลางวัน'
      : h >= 17 && h < 21 ? 'สวัสดีตอนเย็น'
        : 'สวัสดีตอนกลางคืน';
  var el = document.getElementById('welcome-greeting');
  if (el) el.textContent = greeting;
})();

// ─── Back to top ───────────────────────────────────────────────────
(function () { var b = document.getElementById('back-to-top'); window.addEventListener('scroll', function () { b.classList.toggle('visible', window.pageYOffset > 240); }, { passive: true }); })();
