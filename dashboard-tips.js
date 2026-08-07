/*
 * dashboard-tips.js
 * รู้หรือไม่ — the rotating tip card. Picks TIPS_SHOWN tips at random from the
 * Figma "tips" pool per page load, auto-advances every 15s, and exposes
 * window.dykNext() (tap to advance) and window.dykReshuffle() (demo config).
 *
 * Runs at parse time and reads #dyk-* elements, so load it at the end of <body>.
 */

(function () {
  // All 15 tip variants from the Figma "tips" component set. Only
  // TIPS_SHOWN of them are surfaced per page load, picked at random.
  var TIP_POOL = [
    { text: 'รู้หรือไม่? คุณสามารถต่ออายุใบอนุญาตขับรถล่วงหน้าได้ 90 วันก่อนหมดอายุ ', miniapp: 'e82f601e-ce10-4d45-a297-51d59722d86a' },
    { text: 'ไม่ต้องรอให้อายุครบ 60 ปี คุณสามารถลงทะเบียนรับเบี้ยผู้สูงอายุได้ ตั้งแต่เดือน ต.ค. - ก.ย. ของปีก่อน เพื่อให้รับเงิน 600 - 1,000 บาท (ตามช่วงอายุ) ทันที ' },
    { text: 'บัตรทองไม่ได้มีแค่ถอนหรืออุดฟัน แต่ยังครอบคลุมการขูดหินปูน ผ่าฟันคุด และทำฟันเทียมถอดได้ ช่วยประหยัดค่าใช้จ่ายหลักหมื่นได้มาก ', miniapp: '3332774b-8a0f-4907-b3aa-29dbc8779d12' },
    { text: 'ตรวจสอบเครดิตบูโรผ่านทางรัฐ นอกจากดูฟรี ได้ทุกที่ทุกเวลาแล้ว ยังสามารถใช้ประกอบการขอสินเชื่อกับ กยศ ได้ด้วย ', miniapp: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
    { text: 'ค่าน้ำ ค่าไฟ สามารถนำไปขอเอกสาร ประกอบการขอสินเชื่อ เพื่อยื่นกู้สินเชื่อต่างๆ กับธนาคารได้ด้วย ', miniapp: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' },
    { text: 'ฟรีแลนซ์ ค้าขาย หรือยังเรียนอยู่ มาเริ่มต้นสร้างบำนาญง่ายๆ เพียงแค่สมัคร กองทุนการออมแห่งชาติ ' },
    { text: 'ใบขับขี่ และบัตรคนพิการในทางรัฐ สามารถใช้แสดงตนได้ตามกฎหมายเช่น แสดงให้เจ้าหน้าที่ตำรวจ, ขอรับสิทธิ, เลือกตั้ง เป็นต้น ' },
    { text: 'สงสัยว่าจะเจอหมอปลอม ลองตรวจสอบใบอนุญาตคุณหมอ และบุคลากรทางการแพทย์ก่อนเข้ารับการรักษาหน่อยไหม ' },
    { text: 'ช่วงเทศกาลต้องเดินทางไกล ลองเช็คสภาพการจราจรก่อนออกรถ ช่วยให้คุณวางแผนการเดินทางได้ดีขึ้น ' },
    { text: 'เกิดเหตุ ไม่รู้จะติดต่อใคร ลองเข้าบริการสายด่วนฉุกเฉิน รวมเบอร์ที่คุณต้องรู้ ครบจบในที่เดียว ' },
    { text: 'จำไม่ได้มีประกันของที่ไหนบ้าง ตรวจสอบกรมธรรม์ของคุณได้ง่ายๆ ครบทุกฉบับผ่าน OIC Connect ' },
    { text: 'เพราะห่วงใย เลยอยากให้ใส่ถุงยาง ชาย หญิงอายุเกิน 15 ปี ขอรับถุงยางได้ปีละ 520 ชิ้น ผ่านจุดบริการ สปสช. ', miniapp: '3332774b-8a0f-4907-b3aa-29dbc8779d12' },
    { text: 'เจ็บป่วยเล็กน้อย คุณสามารถเดินเข้าร้านยา และแจ้งอาการเบื้องต้นกับเภสัชกร เพื่อขอรับยาฟรีได้ ' },
    { text: 'ลูกจ้างลาไปทำหมัน หรือพักฟื้นจากการทำหมัน นายจ้างต้องจ่ายค่าจ้างให้ตามปกติในวันที่ลา โดยไม่นับรวมกับวันลาป่วยหรือลากิจ ' },
    { text: 'ใบขับขี่ ในทางรัฐ สามารถใช้แสดงตนได้ตามกฎหมายเช่น แสดงให้เจ้าหน้าที่ตำรวจ, ขอรับสิทธิ, เลือกตั้ง เป็นต้น ' },
  ];

  var TIPS_SHOWN = 5;
  var TIP_LINK_LABEL = 'ดูรายละเอียด';

  var TIPS = [];
  var current = 0;
  var textEl = document.getElementById('dyk-text');
  var linkEl = document.getElementById('dyk-link');
  var dotsEl = document.getElementById('dyk-dots');
  var timer;

  function pickTips() {
    var pool = TIP_POOL.slice();
    // Fisher-Yates, then take the first TIPS_SHOWN
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
    }
    return pool.slice(0, Math.min(TIPS_SHOWN, pool.length));
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    TIPS.forEach(function (_, i) {
      var d = document.createElement('div');
      d.id = 'dyk-dot-' + i;
      d.className = 'dyk-card__dot';
      dotsEl.appendChild(d);
    });
  }

  function show(idx, userTriggered) {
    var tip = TIPS[idx];
    var card = document.getElementById('did-you-know');

    // fade (the transition itself lives on .dyk-card in dashboard-components.css)
    card.classList.add('dyk-card--fading');
    setTimeout(function () {
      // set text node before the link
      textEl.childNodes[0] && textEl.childNodes[0].nodeType === 3
        ? textEl.childNodes[0].textContent = tip.text
        : textEl.insertBefore(document.createTextNode(tip.text), linkEl);
      linkEl.textContent = TIP_LINK_LABEL;
      linkEl.onclick = function () {
        if (tip.miniapp && window.czpSdk) window.czpSdk.openMiniApp(tip.miniapp);
      };
      card.classList.remove('dyk-card--fading');
    }, 180);

    // dots
    TIPS.forEach(function (_, i) {
      var d = document.getElementById('dyk-dot-' + i);
      if (!d) return;
      d.classList.toggle('dyk-card__dot--active', i === idx);
    });

    current = idx;

    // reset auto-timer on manual tap
    if (userTriggered) {
      clearInterval(timer);
      timer = setInterval(advance, 15000);
    }
  }

  function advance() { show((current + 1) % TIPS.length, false); }

  window.dykNext = function () { show((current + 1) % TIPS.length, true); };

  // Re-rolls which 5 tips are on show — wired to the demo config modal.
  window.dykReshuffle = function () {
    TIPS = pickTips();
    buildDots();
    clearInterval(timer);
    show(0, false);
    timer = setInterval(advance, 15000);
  };

  TIPS = pickTips();
  buildDots();
  show(0, false);
  timer = setInterval(advance, 15000);
})();
