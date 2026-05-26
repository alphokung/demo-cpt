// med.js — med-index page logic

var ALL_CERTS = [];
var USER = {};
var activeFilter = 'all'; // 'all' | 'valid' | 'expired'
var demoHasData = true;

var ICONS = {
  health:  'ecg_heart',
  driving: 'directions_car',
  covid:   'biotech',
  work:    'work'
};

var STATUS_LABEL = {
  valid:    'ใช้งานได้',
  expiring: 'ใกล้หมดอายุ',
  expired:  'หมดอายุแล้ว'
};

function isActive(cert) {
  return cert.status === 'valid' || cert.status === 'expiring';
}

function isExpired(cert) {
  return cert.status === 'expired';
}

function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('.filter-chip').forEach(function (chip) {
    chip.classList.toggle('active', chip.dataset.filter === filter);
  });
  renderCertSections();
}

function renderCertCard(cert) {
  var iconName = ICONS[cert.typeKey] || 'description';
  var badgeClass = cert.status === 'valid' ? 'valid' : cert.status === 'expiring' ? 'expiring' : 'expired';
  var itemClass = isExpired(cert) ? 'list-item is-expired' : 'list-item';

  return '<a href="med-detail.html" class="' + itemClass + '">' +
    '<span class="list-badge ' + badgeClass + ' list-badge--corner">' + STATUS_LABEL[cert.status] + '</span>' +
    '<div class="list-icon ' + cert.typeKey + '">' +
      '<span class="material-symbols-outlined">' + iconName + '</span>' +
    '</div>' +
    '<div class="list-body">' +
      '<p class="list-title">' + cert.title + '</p>' +
      '<div class="list-meta">' +
        '<span class="list-meta-item">' +
          '<span class="material-symbols-outlined list-meta-icon">domain</span>' +
          '<span>' + cert.hospital + '</span>' +
        '</span>' +
        '<span class="list-meta-item">' +
          '<span class="material-symbols-outlined list-meta-icon">calendar_today</span>' +
          '<span>หมดอายุ ' + cert.expiryDate + '</span>' +
        '</span>' +
      '</div>' +
    '</div>' +
    '<span class="material-symbols-outlined chevron">chevron_right</span>' +
  '</a>';
}

function renderCertSections() {
  var certs = demoHasData ? ALL_CERTS : [];

  // Apply category type filter
  if (activeFilter !== 'all') {
    certs = certs.filter(function (c) {
      return c.typeKey === activeFilter;
    });
  }

  var activeCerts = certs.filter(isActive);
  var expiredCerts = certs.filter(isExpired);

  var container = document.getElementById('list-content');
  if (!container) return;

  if (certs.length === 0) {
    // No-data state
    container.innerHTML =
      '<div class="list-section">' +
        '<p class="list-section-title">ใบรับรองแพทย์ทั้งหมด (0)</p>' +
        '<div class="empty-state">' +
          '<div class="empty-icon">' +
            '<span class="material-symbols-outlined" style="font-size:28px">search</span>' +
          '</div>' +
          '<p class="empty-title">ไม่พบข้อมูลใบรับรองแพทย์</p>' +
          '<p class="empty-desc">ท่านยังไม่มีใบรับรองแพทย์ดิจิทัลในระบบ<br>สามารถขอรับที่โรงพยาบาลที่เข้าร่วมโครงการ</p>' +
        '</div>' +
      '</div>';
    return;
  }

  var html = '';

  // Active section
  if (activeFilter !== 'expired') {
    html += '<div class="list-section">';
    html += '<p class="list-section-title">ใบรับรองแพทย์ที่ใช้งานได้ (' + activeCerts.length + ')</p>';
    html += '<p class="list-section-note">ใบรับรองแพทย์ที่ยังไม่หมดอายุ สามารถใช้แสดงต่อหน่วยงานหรือนำไปใช้ประกอบการทำธุรกรรมได้</p>';
    if (activeCerts.length > 0) {
      html += '<div class="cert-list">';
      activeCerts.forEach(function (c) { html += renderCertCard(c); });
      html += '</div>';
    } else {
      html +=
        '<div class="empty-state">' +
          '<div class="empty-icon">' +
            '<span class="material-symbols-outlined" style="font-size:28px">search</span>' +
          '</div>' +
          '<p class="empty-title">ไม่พบรายการ</p>' +
          '<p class="empty-desc">ไม่มีใบรับรองแพทย์ที่ใช้งานได้ในขณะนี้</p>' +
        '</div>';
    }
    html += '</div>';
  }

  // Expired section
  if (activeFilter !== 'valid') {
    html += '<div class="list-section">';
    html += '<p class="list-section-title">ใบรับรองแพทย์ที่หมดอายุ (' + expiredCerts.length + ')</p>';
    html += '<p class="list-section-note">ใบรับรองแพทย์ที่หมดอายุไม่สามารถใช้งานได้ กรุณาติดต่อโรงพยาบาลเพื่อออกใบรับรองแพทย์ใหม่</p>';
    if (expiredCerts.length > 0) {
      html += '<div class="cert-list">';
      expiredCerts.forEach(function (c) { html += renderCertCard(c); });
      html += '</div>';      
    } else {
      html +=
        '<div class="empty-state">' +
          '<div class="empty-icon">' +
            '<span class="material-symbols-outlined" style="font-size:28px">search</span>' +
          '</div>' +
          '<p class="empty-title">ไม่พบรายการ</p>' +
          '<p class="empty-desc">ไม่มีใบรับรองแพทย์ที่หมดอายุ</p>' +
        '</div>';
    }
    html += '</div>';
  }

  container.innerHTML = html;
}

function updateBanner() {
  var nameEl = document.getElementById('welcome-banner-name');
  var subEl = document.getElementById('welcome-banner-sub');
  if (!nameEl || !subEl) return;

  if (demoHasData) {
    nameEl.textContent = USER.greeting + ' ' + USER.name;
    var activeCerts = ALL_CERTS.filter(isActive);
    subEl.textContent = 'คุณมีใบรับรองแพทย์ที่ใช้งานได้ ' + activeCerts.length + ' ฉบับ';
  } else {
    nameEl.textContent = USER.greeting + ' ' + USER.name;
    subEl.textContent = 'ท่านยังไม่มีใบรับรองแพทย์ดิจิทัลในระบบ';
  }
}

function toggleDemoState() {
  demoHasData = !demoHasData;
  var btn = document.getElementById('demo-toggle-btn');
  if (btn) btn.textContent = demoHasData ? 'สลับ: ไม่มีข้อมูล' : 'สลับ: มีข้อมูล';
  updateBanner();
  renderCertSections();
}

function initFilterDemo() {
  fetch('demo.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      USER = data.user;
      ALL_CERTS = data.certificates;
      updateBanner();
      renderCertSections();
    });
}
