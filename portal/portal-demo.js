/* ============================================================
   Portal demo panel — ปุ่มลอย "Demo การแสดงผล" + modal ตั้งค่า
   หน้าตาเดียวกับ dashboard-with-consent.html (ใช้ ../../demo-tools.css)

   วิธีใช้ในหน้า portal:
     <button class="demo-fab" data-demo-open="modal-demo-config">…</button>
     <div id="modal-demo-config" class="modal-overlay">…<button data-demo-close>…</div>
   ============================================================ */
(function () {
  var lastFocus = null;

  function open(id) {
    var m = document.getElementById(id);
    if (!m) return;
    lastFocus = document.activeElement;
    m.classList.add('active');
    m.setAttribute('aria-hidden', 'false');
    var first = m.querySelector('.dc-chip.active') || m.querySelector('.dc-chip') || m.querySelector('button');
    if (first) first.focus();
  }
  function close(m) {
    m.classList.remove('active');
    m.setAttribute('aria-hidden', 'true');
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener('click', function (ev) {
    var o = ev.target.closest('[data-demo-open]');
    if (o) { open(o.dataset.demoOpen); return; }
    var c = ev.target.closest('[data-demo-close]');
    if (c) { close(c.closest('.modal-overlay')); return; }
    // คลิกพื้นหลัง = ปิด
    if (ev.target.classList && ev.target.classList.contains('modal-overlay') && ev.target.classList.contains('active')) close(ev.target);
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape') return;
    var m = document.querySelector('.modal-overlay.active');
    if (m) close(m);
  });

  window.PortalDemo = { open: open };
})();
