/*
 * dashboard-context.js
 * Today's context: Thai public holidays / วันสำคัญ, วันพระ detection, the
 * birthday greeting text, and the mock weather location.
 *
 * Only the location and the bar copy come from here — the weather and PM2.5
 * chips themselves are owned by renderContextBars() in dashboard-demo.js, which
 * this file calls once the mock data is applied. Runs at parse time, so it must
 * be loaded at the end of <body>, after dashboard-demo.js.
 */

// ─── Weather + PM2.5 + วันสำคัญ ───────────────────────────────────────
(function () {
  // Thai public holidays & important days (Buddhist Era dates mapped to Gregorian month/day)
  const SPECIAL_DAYS = {
    '1-1': { name: 'วันขึ้นปีใหม่', desc: 'หน่วยงานรัฐและธนาคารปิดทำการ' },
    '2-14': { name: 'วันวาเลนไทน์', desc: 'เทศกาลแห่งความรัก' },
    '4-6': { name: 'วันจักรี', desc: 'วันระลึกพระบาทสมเด็จพระพุทธยอดฟ้าจุฬาโลก หน่วยงานรัฐปิดทำการ' },
    '4-13': { name: 'วันสงกรานต์', desc: 'เทศกาลปีใหม่ไทย หน่วยงานรัฐปิดทำการ 3 วัน' },
    '4-14': { name: 'วันสงกรานต์', desc: 'เทศกาลปีใหม่ไทย (วันครอบครัว)' },
    '4-15': { name: 'วันสงกรานต์', desc: 'เทศกาลปีใหม่ไทย (วันผู้สูงอายุ)' },
    '5-1': { name: 'วันแรงงาน', desc: 'วันแรงงานแห่งชาติ' },
    '5-4': { name: 'วันฉัตรมงคล', desc: 'วันระลึกพระราชพิธีบรมราชาภิเษก' },
    '6-3': { name: 'วันวิสาขบูชา', desc: 'วันสำคัญทางพระพุทธศาสนา ธนาคารและหน่วยงานรัฐบางแห่งปิดทำการ' },
    '7-28': { name: 'วันเฉลิมพระชนมพรรษา ร.10', desc: 'วันหยุดราชการ หน่วยงานรัฐปิดทำการ' },
    '8-12': { name: 'วันแม่แห่งชาติ', desc: 'วันเฉลิมพระชนมพรรษาสมเด็จพระบรมราชชนนี' },
    '10-13': { name: 'วันนวมินทรมหาราช', desc: 'วันคล้ายวันสวรรคต ร.9 หน่วยงานรัฐปิดทำการ' },
    '10-23': { name: 'วันปิยมหาราช', desc: 'วันคล้ายวันสวรรคต ร.5 หน่วยงานรัฐปิดทำการ' },
    '12-5': { name: 'วันพ่อแห่งชาติ', desc: 'วันเฉลิมพระชนมพรรษา ร.9 หน่วยงานรัฐปิดทำการ' },
    '12-10': { name: 'วันรัฐธรรมนูญ', desc: 'วันระลึกพระราชทานรัฐธรรมนูญฉบับแรก' },
    '12-31': { name: 'วันสิ้นปี', desc: 'วันส่งท้ายปีเก่า' },
  };

  const now = new Date();
  const monthDay = `${now.getMonth() + 1}-${now.getDate()}`;
  const specialDay = SPECIAL_DAYS[monthDay];

  // ─── วันพระ detection ───────────────────────────────────────────────
  const WAN_PHRA_2026 = new Set([
    '1-3', '1-10', '1-18', '1-25',
    '2-2', '2-9', '2-17', '2-24',
    '3-3', '3-11', '3-19', '3-25',
    '4-2', '4-9', '4-17', '4-24',
    '5-1', '5-9', '5-17', '5-24', '5-31',
    '6-4', '6-11', '6-19', '6-26',
    '7-3', '7-11', '7-18', '7-25',
    '8-2', '8-9', '8-17', '8-24', '8-31',
    '9-7', '9-15', '9-22', '9-30',
    '10-7', '10-14', '10-22', '10-29',
    '11-5', '11-12', '11-20', '11-27',
    '12-5', '12-12', '12-20', '12-27',
  ]);

  // ─── Birthday detection ─────────────────────────────────────────────
  const USER_BIRTH_MONTH = 6;
  const USER_BIRTH_DAY = 4;
  const autoBirthday = (now.getMonth() + 1 === USER_BIRTH_MONTH && now.getDate() === USER_BIRTH_DAY);
  const autoWanPhra = WAN_PHRA_2026.has(monthDay);
  const autoRain = true; // default mock: rain expected

  // Stamp auto values on card element so renderContextBars() can read them
  const cardEl = document.getElementById('today-context-card');
  if (cardEl) {
    cardEl.dataset.birthday = autoBirthday;
    cardEl.dataset.wanphra = autoWanPhra;
    cardEl.dataset.rain = autoRain;
  }

  // Pre-fill bar text content (bars stay hidden until toggled ON)
  const bdTextEl = document.getElementById('birthday-text');
  if (bdTextEl) {
    const AGE = now.getFullYear() - 1990; // mock birth year 1990
    const wishes = [
      `สุขสันต์วันเกิด คุณสมชาย! ครบ ${AGE} ปีแล้ว ขอให้มีสุขภาพแข็งแรง มีความสุข และโชคดีตลอดปีนี้ 🎉`,
      `วันนี้วันเกิดของคุณ อายุครบ ${AGE} ปีแล้ว ขอให้ทุกความปรารถนาเป็นจริง มีสุขภาพดี และประสบความสำเร็จ 🎊`,
      `Happy Birthday! ขอให้ปีที่ ${AGE} นี้เต็มไปด้วยความสุขและสิ่งดีๆ รออยู่ข้างหน้า ✨`,
    ];
    bdTextEl.textContent = wishes[Math.floor(Math.random() * wishes.length)];
  }

  const wanPhraMsgEl = document.getElementById('wan-phra-text');
  if (wanPhraMsgEl) {
    wanPhraMsgEl.textContent = specialDay
      ? `วันนี้วันพระ และเป็น${specialDay.name} — ${specialDay.desc}`
      : 'วันนี้วันพระ อย่าลืมทำบุญหรือรักษาศีลตามโอกาส';
  }

  const wanPhra = autoWanPhra; // keep for specialDay notice logic below

  var specialDayNoticeEl = document.getElementById('notice-special-day-title') &&
    document.getElementById('notice-special-day-title').closest('.notice-special-wrapper');
  var noticeCount = 2; // passport + motorcycle always shown

  if (specialDay) {
    // Show special-day bar only if it's NOT already merged into วันพระ bar
    if (!wanPhra) {
      var sdBar = document.getElementById('special-day-bar');
      var sdText = document.getElementById('special-day-text');
      if (sdBar && sdText) {
        sdText.textContent = `วันนี้${specialDay.name} — ${specialDay.desc}`;
        sdBar.style.display = 'flex';
      }
    }
    const noticeTitle = document.getElementById('notice-special-day-title');
    const noticeSub = document.getElementById('notice-special-day-sub');
    if (noticeTitle) noticeTitle.textContent = specialDay.name + ' — วันนี้';
    if (noticeSub) noticeSub.textContent = specialDay.desc;
    noticeCount++;
  } else {
    // hide special-day notice card
    var sdNotice = document.getElementById('notice-special-day-title');
    if (sdNotice) {
      var card = sdNotice.closest('div[style*="border-left: 4px solid #3b82f6"]');
      if (card) card.style.display = 'none';
    }
  }

  // Update badge
  var badge = document.querySelector('#important-notices-section span[style*="background: #e53935"]');
  if (badge) badge.textContent = noticeCount;

  // ─── Mock weather data (replace with real API call if key available) ───
  // Simulates Bangkok afternoon conditions
  const MOCK = { location: 'กรุงเทพมหานคร' };

  // Only the location comes from here — the weather chip's own icon, colour
  // and text are owned by renderContextBars(), which reads the
  // demo-configurable WEATHER_TYPES variant.
  function applyWeather(d) {
    document.getElementById('weather-location').textContent = d.location;
  }

  // Geolocation disabled — use mock data directly
  function loadWithMock() {
    applyWeather(MOCK);
    renderContextBars();
  }

  {
    loadWithMock();
  }
})();
