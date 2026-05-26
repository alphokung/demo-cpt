// demo.js — filter-demo page logic

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
  document.querySelectorAll('.fdemo-filter-chip').forEach(function (chip) {
    chip.classList.toggle('active', chip.dataset.filter === filter);
  });
  renderCertSections();
}

function renderCertCard(cert) {
  var iconName = ICONS[cert.typeKey] || 'description';
  var badgeClass = cert.status === 'valid' ? 'valid' : cert.status === 'expiring' ? 'expiring' : 'expired';
  var itemClass = isExpired(cert) ? 'fdemo-cert-item is-expired' : 'fdemo-cert-item';
  var expiryLabel = isExpired(cert) ? 'หมดอายุ' : 'หมดอายุ';

  return '<a href="cert-detail.html" class="' + itemClass + '">' +
    '<div class="fdemo-cert-icon ' + cert.typeKey + '">' +
      '<span class="material-symbols-outlined">' + iconName + '</span>' +
    '</div>' +
    '<div class="fdemo-cert-body">' +
      '<p class="fdemo-cert-title">' + cert.title + '</p>' +
      '<p class="fdemo-cert-meta">' + cert.hospital + '</p>' +
      '<span class="fdemo-cert-badge ' + badgeClass + '">' + STATUS_LABEL[cert.status] + '</span>' +
    '</div>' +
    '<span class="material-symbols-outlined fdemo-chevron">chevron_right</span>' +
  '</a>';
}

function renderCertSections() {
  var certs = demoHasData ? ALL_CERTS : [];
  var activeCerts = certs.filter(isActive);
  var expiredCerts = certs.filter(isExpired);

  // Apply filter
  if (activeFilter === 'valid') {
    expiredCerts = [];
  } else if (activeFilter === 'expired') {
    activeCerts = [];
  }

  var container = document.getElementById('fdemo-content');
  if (!container) return;

  if (certs.length === 0) {
    // No-data state
    container.innerHTML =
      '<div class="fdemo-section">' +
        '<p class="fdemo-section-title">ใบรับรองแพทย์ทั้งหมด (0)</p>' +
        '<div class="fdemo-empty-state">' +
          '<div class="fdemo-empty-icon">' +
            '<span class="material-symbols-outlined" style="font-size:28px">search</span>' +
          '</div>' +
          '<p class="fdemo-empty-title">ไม่พบข้อมูลใบรับรองแพทย์</p>' +
          '<p class="fdemo-empty-desc">ท่านยังไม่มีใบรับรองแพทย์ดิจิทัลในระบบ<br>สามารถขอรับที่โรงพยาบาลที่เข้าร่วมโครงการ</p>' +
        '</div>' +
      '</div>';
    return;
  }

  var html = '';

  // Active section
  if (activeFilter !== 'expired') {
    html += '<div class="fdemo-section">';
    html += '<p class="fdemo-section-title">ใบรับรองแพทย์ที่ใช้งานได้ (' + activeCerts.length + ')</p>';
    if (activeCerts.length > 0) {
      html += '<div class="fdemo-cert-list">';
      activeCerts.forEach(function (c) { html += renderCertCard(c); });
      html += '</div>';
    } else {
      html +=
        '<div class="fdemo-empty-state">' +
          '<div class="fdemo-empty-icon">' +
            '<span class="material-symbols-outlined" style="font-size:28px">search</span>' +
          '</div>' +
          '<p class="fdemo-empty-title">ไม่พบรายการ</p>' +
          '<p class="fdemo-empty-desc">ไม่มีใบรับรองแพทย์ที่ใช้งานได้ในขณะนี้</p>' +
        '</div>';
    }
    html += '</div>';
  }

  // Expired section
  if (activeFilter !== 'valid') {
    html += '<div class="fdemo-section">';
    html += '<p class="fdemo-section-title">ใบรับรองแพทย์ที่หมดอายุ (' + expiredCerts.length + ')</p>';
    if (expiredCerts.length > 0) {
      html += '<div class="fdemo-cert-list">';
      expiredCerts.forEach(function (c) { html += renderCertCard(c); });
      html += '</div>';
      html += '<p class="fdemo-section-note">ใบรับรองแพทย์ที่หมดอายุไม่สามารถใช้งานได้ กรุณาติดต่อโรงพยาบาลเพื่อออกใบรับรองแพทย์ใหม่</p>';
    } else {
      html +=
        '<div class="fdemo-empty-state">' +
          '<div class="fdemo-empty-icon">' +
            '<span class="material-symbols-outlined" style="font-size:28px">search</span>' +
          '</div>' +
          '<p class="fdemo-empty-title">ไม่พบรายการ</p>' +
          '<p class="fdemo-empty-desc">ไม่มีใบรับรองแพทย์ที่หมดอายุ</p>' +
        '</div>';
    }
    html += '</div>';
  }

  container.innerHTML = html;
}

function updateBanner() {
  var nameEl = document.getElementById('fdemo-banner-name');
  var subEl = document.getElementById('fdemo-banner-sub');
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
  var btn = document.getElementById('fdemo-toggle-btn');
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
