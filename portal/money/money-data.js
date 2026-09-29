/* ============================================================
   Money Portal — mock data (ข้อมูลตัวอย่างเพื่อการสาธิตเท่านั้น)
   ทุกหน้าใน portal/money อ่านข้อมูลจาก window.MONEY
   ใบสั่งจราจรอ่านจาก window.CRIME (../crime/crime-data.js) เพื่อให้ยอดตรงกับ Crime Portal
   วันที่ทั้งหมดเก็บเป็น ISO (ค.ศ.) แล้วแปลงเป็น พ.ศ. ตอนแสดงผล
   ============================================================ */
window.MONEY = {

  /* ─── ผู้ใช้งาน ─── */
  user: {
    fullName: 'นายสมชาย ใจดี',
    pidMasked: '1-1002-XXXXX-XX-8'
  },

  /* ─── ที่อยู่ / ทรัพย์สินที่มีชื่อเป็นเจ้าของ (ใช้ร่วมกันระหว่างค่าน้ำไฟและภาษีที่ดิน) ─── */
  properties: [
    {
      key: 'home', name: 'บ้านพักอาศัย จตุจักร', icon: 'home',
      address: '88/12 ซอยพหลโยธิน 24 แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร 10900',
      type: 'บ้านเดี่ยวพร้อมที่ดิน', deed: 'โฉนดเลขที่ 41235', area: '0-0-52 ไร่ (52 ตร.ว.)',
      appraised: 6850000, use: 'residential-main'
    },
    {
      key: 'condo', name: 'ห้องชุด ปากเกร็ด', icon: 'apartment',
      address: 'อาคาร B ชั้น 15 ห้อง 1507 ถนนแจ้งวัฒนะ ตำบลบางตลาด อำเภอปากเกร็ด นนทบุรี 11120',
      type: 'ห้องชุด', deed: 'หนังสือกรรมสิทธิ์ห้องชุด เลขที่ 1507/88', area: '34.5 ตร.ม.',
      appraised: 3200000, use: 'residential-other'
    },
    {
      key: 'land', name: 'ที่ดินว่างเปล่า สันทราย', icon: 'landscape',
      address: 'ตำบลหนองหาร อำเภอสันทราย เชียงใหม่ 50290',
      type: 'ที่ดินเปล่า', deed: 'โฉนดเลขที่ 88214', area: '1-2-00 ไร่',
      appraised: 1800000, use: 'vacant'
    }
  ],

  /* ─── 1. ค่าน้ำ ค่าไฟ ───
     แต่ละมิเตอร์มีบิลย้อนหลัง (เก่า → ใหม่) — บิลล่าสุดคือบิลของเดือนนี้
     status: unpaid | paid | overdue */
  meters: [
    {
      key: 'mea-home', kind: 'electric', property: 'home',
      provider: 'การไฟฟ้านครหลวง (กฟน.)', providerShort: 'กฟน.', ext: 'mea',
      account: 'CA 0001 2345 6789', meterNo: 'M-10458823', unit: 'หน่วย (kWh)', autoPay: false,
      bills: [
        { period: '2026-03', read: '2026-03-20', prev: 18240, curr: 18652, amount: 1843.25, due: '2026-04-04', paidAt: '2026-04-01', paidVia: 'ทางรัฐ (พร้อมเพย์)' },
        { period: '2026-04', read: '2026-04-20', prev: 18652, curr: 19188, amount: 2462.80, due: '2026-05-05', paidAt: '2026-05-02', paidVia: 'ทางรัฐ (พร้อมเพย์)' },
        { period: '2026-05', read: '2026-05-20', prev: 19188, curr: 19749, amount: 2591.40, due: '2026-06-04', paidAt: '2026-06-03', paidVia: 'MEA Smart Life' },
        { period: '2026-06', read: '2026-06-20', prev: 19749, curr: 20231, amount: 2187.55, due: '2026-07-05', paidAt: '2026-07-04', paidVia: 'ทางรัฐ (พร้อมเพย์)' },
        { period: '2026-07', read: '2026-07-20', prev: 20231, curr: 20668, amount: 1962.10, due: '2026-08-04', paidAt: '2026-08-01', paidVia: 'ทางรัฐ (พร้อมเพย์)' },
        { period: '2026-08', read: '2026-08-20', prev: 20668, curr: 21087, amount: 1874.35, due: '2026-09-04', paidAt: '2026-09-03', paidVia: 'ทางรัฐ (พร้อมเพย์)' },
        { period: '2026-09', read: '2026-09-20', prev: 21087, curr: 21493, amount: 1812.60, due: '2026-10-05' }
      ]
    },
    {
      key: 'mwa-home', kind: 'water', property: 'home',
      provider: 'การประปานครหลวง (กปน.)', providerShort: 'กปน.', ext: 'mwa',
      account: 'เลขที่ผู้ใช้น้ำ 1203 4567 8', meterNo: 'W-2207719', unit: 'ลบ.ม.', autoPay: false,
      bills: [
        { period: '2026-03', read: '2026-03-14', prev: 3412, curr: 3438, amount: 312.70, due: '2026-03-28', paidAt: '2026-03-25', paidVia: 'ทางรัฐ (พร้อมเพย์)' },
        { period: '2026-04', read: '2026-04-14', prev: 3438, curr: 3467, amount: 352.10, due: '2026-04-28', paidAt: '2026-04-24', paidVia: 'ทางรัฐ (พร้อมเพย์)' },
        { period: '2026-05', read: '2026-05-14', prev: 3467, curr: 3497, amount: 365.25, due: '2026-05-28', paidAt: '2026-05-27', paidVia: 'MWA onMobile' },
        { period: '2026-06', read: '2026-06-14', prev: 3497, curr: 3524, amount: 325.85, due: '2026-06-28', paidAt: '2026-06-26', paidVia: 'ทางรัฐ (พร้อมเพย์)' },
        { period: '2026-07', read: '2026-07-14', prev: 3524, curr: 3549, amount: 299.55, due: '2026-07-28', paidAt: '2026-07-20', paidVia: 'ทางรัฐ (พร้อมเพย์)' },
        { period: '2026-08', read: '2026-08-14', prev: 3549, curr: 3574, amount: 299.55, due: '2026-08-28', paidAt: '2026-08-27', paidVia: 'ทางรัฐ (พร้อมเพย์)' },
        { period: '2026-09', read: '2026-09-14', prev: 3574, curr: 3600, amount: 312.70, due: '2026-09-28' }
      ]
    },
    {
      key: 'mea-condo', kind: 'electric', property: 'condo',
      provider: 'การไฟฟ้านครหลวง (กฟน.)', providerShort: 'กฟน.', ext: 'mea',
      account: 'CA 0001 9876 5432', meterNo: 'M-20931157', unit: 'หน่วย (kWh)', autoPay: true,
      bills: [
        { period: '2026-03', read: '2026-03-22', prev: 7120, curr: 7248, amount: 548.90, due: '2026-04-06', paidAt: '2026-04-06', paidVia: 'หักบัญชีอัตโนมัติ' },
        { period: '2026-04', read: '2026-04-22', prev: 7248, curr: 7401, amount: 668.30, due: '2026-05-07', paidAt: '2026-05-07', paidVia: 'หักบัญชีอัตโนมัติ' },
        { period: '2026-05', read: '2026-05-22', prev: 7401, curr: 7560, amount: 697.45, due: '2026-06-06', paidAt: '2026-06-06', paidVia: 'หักบัญชีอัตโนมัติ' },
        { period: '2026-06', read: '2026-06-22', prev: 7560, curr: 7698, amount: 593.20, due: '2026-07-07', paidAt: '2026-07-07', paidVia: 'หักบัญชีอัตโนมัติ' },
        { period: '2026-07', read: '2026-07-22', prev: 7698, curr: 7829, amount: 562.15, due: '2026-08-06', paidAt: '2026-08-06', paidVia: 'หักบัญชีอัตโนมัติ' },
        { period: '2026-08', read: '2026-08-22', prev: 7829, curr: 7955, amount: 540.70, due: '2026-09-06', paidAt: '2026-09-06', paidVia: 'หักบัญชีอัตโนมัติ' },
        { period: '2026-09', read: '2026-09-22', prev: 7955, curr: 8077, amount: 523.40, due: '2026-10-07' }
      ]
    },
    {
      key: 'mwa-condo', kind: 'water', property: 'condo',
      provider: 'การประปานครหลวง (กปน.)', providerShort: 'กปน.', ext: 'mwa',
      account: 'เลขที่ผู้ใช้น้ำ 4410 2231 6', meterNo: 'W-5580342', unit: 'ลบ.ม.', autoPay: false,
      bills: [
        { period: '2026-03', read: '2026-03-16', prev: 902, curr: 911, amount: 107.00, due: '2026-03-30', paidAt: '2026-03-29', paidVia: 'ทางรัฐ (พร้อมเพย์)' },
        { period: '2026-04', read: '2026-04-16', prev: 911, curr: 921, amount: 117.70, due: '2026-04-30', paidAt: '2026-04-28', paidVia: 'ทางรัฐ (พร้อมเพย์)' },
        { period: '2026-05', read: '2026-05-16', prev: 921, curr: 932, amount: 128.40, due: '2026-05-30', paidAt: '2026-05-30', paidVia: 'ทางรัฐ (พร้อมเพย์)' },
        { period: '2026-06', read: '2026-06-16', prev: 932, curr: 941, amount: 107.00, due: '2026-06-30', paidAt: '2026-07-03', paidVia: 'เคาน์เตอร์เซอร์วิส' },
        { period: '2026-07', read: '2026-07-16', prev: 941, curr: 950, amount: 107.00, due: '2026-07-30', paidAt: '2026-07-29', paidVia: 'ทางรัฐ (พร้อมเพย์)' },
        { period: '2026-08', read: '2026-08-16', prev: 950, curr: 958, amount: 96.30, due: '2026-08-30', paidAt: '2026-08-22', paidVia: 'ทางรัฐ (พร้อมเพย์)' },
        { period: '2026-09', read: '2026-09-16', prev: 958, curr: 967, amount: 107.00, due: '2026-09-30' }
      ]
    }
  ],

  /* ─── 3. การบริจาค (ระบบ e-Donation กรมสรรพากร) ───
     deduct: 1 = หักลดหย่อนได้ตามจริง, 2 = หักได้ 2 เท่า, 'party' = บริจาคพรรคการเมือง (แยกวงเงิน 10,000 บาท) */
  donationTypes: [
    { key: 'temple',    label: 'วัด / ศาสนสถาน',      icon: 'temple_buddhist', tone: 'warning',   deduct: 1 },
    { key: 'charity',   label: 'องค์กรการกุศล',        icon: 'volunteer_activism', tone: 'positive', deduct: 1 },
    { key: 'hospital',  label: 'โรงพยาบาลรัฐ',         icon: 'local_hospital',  tone: 'danger',    deduct: 2 },
    { key: 'education', label: 'สถานศึกษา',            icon: 'school',          tone: 'info',      deduct: 2 },
    { key: 'party',     label: 'พรรคการเมือง',         icon: 'how_to_vote',     tone: 'secondary', deduct: 'party' }
  ],
  donations: [
    { id: 'D69-0412', date: '2026-09-12', type: 'hospital',  to: 'มูลนิธิโรงพยาบาลรามาธิบดี', amount: 3000, ref: 'ED2569091200381' },
    { id: 'D69-0388', date: '2026-08-12', type: 'temple',    to: 'วัดพระศรีมหาธาตุวรมหาวิหาร', amount: 1000, ref: 'ED2569081200129' },
    { id: 'D69-0301', date: '2026-07-20', type: 'education', to: 'มหาวิทยาลัยเกษตรศาสตร์ (ทุนการศึกษา)', amount: 5000, ref: 'ED2569072000874' },
    { id: 'D69-0214', date: '2026-05-01', type: 'charity',   to: 'มูลนิธิกระจกเงา', amount: 1500, ref: 'ED2569050100417' },
    { id: 'D69-0102', date: '2026-02-26', type: 'temple',    to: 'วัดบวรนิเวศวิหาร', amount: 999, ref: 'ED2569022600063' },
    { id: 'D69-0033', date: '2026-01-15', type: 'hospital',  to: 'โรงพยาบาลศิริราช (มูลนิธิ)', amount: 2000, ref: 'ED2569011500255' },

    { id: 'D68-0921', date: '2025-12-28', type: 'charity',   to: 'สภากาชาดไทย', amount: 2000, ref: 'ED2568122800590' },
    { id: 'D68-0877', date: '2025-11-05', type: 'temple',    to: 'วัดพระศรีมหาธาตุวรมหาวิหาร (กฐิน)', amount: 2500, ref: 'ED2568110500174' },
    { id: 'D68-0640', date: '2025-08-18', type: 'education', to: 'โรงเรียนบ้านหนองหาร (สันทราย)', amount: 3000, ref: 'ED2568081800902' },
    { id: 'D68-0512', date: '2025-07-02', type: 'party',     to: 'พรรคการเมือง (บริจาคผ่านแบบ ภ.ง.ด.90/91)', amount: 500, ref: 'PP2568070200011' },
    { id: 'D68-0203', date: '2025-04-13', type: 'temple',    to: 'วัดบวรนิเวศวิหาร', amount: 1000, ref: 'ED2568041300088' },
    { id: 'D68-0019', date: '2025-01-09', type: 'hospital',  to: 'มูลนิธิโรงพยาบาลรามาธิบดี', amount: 3000, ref: 'ED2568010900377' },

    { id: 'D67-0804', date: '2024-12-02', type: 'charity',   to: 'มูลนิธิร่วมกตัญญู', amount: 1000, ref: 'ED2567120200731' },
    { id: 'D67-0550', date: '2024-09-15', type: 'charity',   to: 'สภากาชาดไทย (ช่วยเหลือผู้ประสบอุทกภัยภาคเหนือ)', amount: 3000, ref: 'ED2567091500112' },
    { id: 'D67-0318', date: '2024-06-10', type: 'education', to: 'จุฬาลงกรณ์มหาวิทยาลัย (กองทุนการศึกษา)', amount: 2000, ref: 'ED2567061000246' },
    { id: 'D67-0071', date: '2024-02-24', type: 'temple',    to: 'วัดพระศรีมหาธาตุวรมหาวิหาร', amount: 1000, ref: 'ED2567022400035' }
  ],

  /* ─── 4. ภาษีที่ดินและสิ่งปลูกสร้าง (ชำระกับ อปท. ที่ทรัพย์สินตั้งอยู่) ───
     status: paid | overdue | unpaid | exempt */
  landTax: [
    /* ปีภาษี 2569 */
    {
      id: 'LT69-home', year: 2026, property: 'home', office: 'สำนักงานเขตจตุจักร',
      category: 'ที่อยู่อาศัยหลัก (บ้านหลังหลัก)', status: 'exempt',
      base: 6850000, exemption: 50000000, rateText: 'ยกเว้น (มูลค่าไม่เกิน 50 ล้านบาท)', tax: 0
    },
    {
      id: 'LT69-condo', year: 2026, property: 'condo', office: 'เทศบาลนครปากเกร็ด',
      category: 'ที่อยู่อาศัยอื่น', status: 'paid',
      base: 3200000, rateText: '0.02%', tax: 640, due: '2026-04-30', paidAt: '2026-04-18', paidVia: 'ทางรัฐ (พร้อมเพย์)', receipt: 'ภ.ด.ส.9-6904-00218'
    },
    {
      id: 'LT69-land', year: 2026, property: 'land', office: 'องค์การบริหารส่วนตำบลหนองหาร',
      category: 'ที่ดินรกร้างว่างเปล่า', status: 'overdue',
      base: 1800000, rateText: '0.3%', tax: 5400, due: '2026-04-30', noticeDue: '2026-10-15',
      penalty: 1080, penaltyText: 'เบี้ยปรับ 20% (ชำระภายในกำหนดของหนังสือแจ้งเตือน)',
      surcharge: 270, surchargeText: 'เงินเพิ่ม 1% ต่อเดือน × 5 เดือน',
      notice: 'หนังสือแจ้งเตือน ภ.ด.ส.10 เลขที่ 0112/2569'
    },
    /* ปีภาษี 2568 */
    { id: 'LT68-home', year: 2025, property: 'home', office: 'สำนักงานเขตจตุจักร', category: 'ที่อยู่อาศัยหลัก (บ้านหลังหลัก)', status: 'exempt', base: 6850000, rateText: 'ยกเว้น', tax: 0 },
    { id: 'LT68-condo', year: 2025, property: 'condo', office: 'เทศบาลนครปากเกร็ด', category: 'ที่อยู่อาศัยอื่น', status: 'paid', base: 3200000, rateText: '0.02%', tax: 640, due: '2025-04-30', paidAt: '2025-04-22', paidVia: 'ทางรัฐ (พร้อมเพย์)', receipt: 'ภ.ด.ส.9-6804-00731' },
    { id: 'LT68-land', year: 2025, property: 'land', office: 'องค์การบริหารส่วนตำบลหนองหาร', category: 'ที่ดินรกร้างว่างเปล่า', status: 'paid', base: 1800000, rateText: '0.3%', tax: 5400, due: '2025-04-30', paidAt: '2025-04-28', paidVia: 'ชำระ ณ ที่ทำการ อบต.', receipt: 'ภ.ด.ส.9-6804-00095' },
    /* ปีภาษี 2567 */
    { id: 'LT67-home', year: 2024, property: 'home', office: 'สำนักงานเขตจตุจักร', category: 'ที่อยู่อาศัยหลัก (บ้านหลังหลัก)', status: 'exempt', base: 6850000, rateText: 'ยกเว้น', tax: 0 },
    { id: 'LT67-condo', year: 2024, property: 'condo', office: 'เทศบาลนครปากเกร็ด', category: 'ที่อยู่อาศัยอื่น', status: 'paid', base: 3200000, rateText: '0.02%', tax: 640, due: '2024-04-30', paidAt: '2024-04-10', paidVia: 'Krungthai NEXT', receipt: 'ภ.ด.ส.9-6704-00512' },
    { id: 'LT67-land', year: 2024, property: 'land', office: 'องค์การบริหารส่วนตำบลหนองหาร', category: 'ที่ดินรกร้างว่างเปล่า', status: 'paid', base: 1800000, rateText: '0.3%', tax: 5400, due: '2024-04-30', paidAt: '2024-06-14', paidVia: 'ชำระ ณ ที่ทำการ อบต.', receipt: 'ภ.ด.ส.9-6706-00044', late: 'ชำระล่าช้า รวมเบี้ยปรับและเงินเพิ่ม 594 บาท' }
  ],

  /* ─── 5. เครดิตบูโร (สรุปแบบย่อ — ข้อมูลจริงต้องขอผ่าน NCB) ─── */
  credit: {
    updated: '2026-09-25',
    accounts: [
      { type: 'สินเชื่อที่อยู่อาศัย', lender: 'ธนาคารออมสิน', icon: 'home', limit: 2800000, balance: 1942500, status: 'normal' },
      { type: 'สินเชื่อเช่าซื้อรถยนต์', lender: 'ธนาคารกรุงไทย', icon: 'directions_car', limit: 650000, balance: 212300, status: 'normal' },
      { type: 'บัตรเครดิต', lender: 'ธนาคารกรุงเทพ', icon: 'credit_card', limit: 80000, balance: 12450, status: 'normal' },
      { type: 'บัตรเครดิต', lender: 'ธนาคารกสิกรไทย', icon: 'credit_card', limit: 60000, balance: 3890, status: 'late30' }
    ],
    inquiries6m: 1
  },

  /* ─── บริการภายนอก (ยืนยันก่อนออกจากทางรัฐ) ─── */
  services: [
    { key: 'mea',  name: 'MEA Smart Life', agency: 'การไฟฟ้านครหลวง', url: 'https://www.mea.or.th/' },
    { key: 'mwa',  name: 'MWA onMobile', agency: 'การประปานครหลวง', url: 'https://www.mwa.co.th/' },
    { key: 'edonation', name: 'ระบบ e-Donation', agency: 'กรมสรรพากร', url: 'https://epit.rd.go.th/' },
    { key: 'landtax', name: 'ระบบภาษีที่ดินและสิ่งปลูกสร้าง', agency: 'กรมส่งเสริมการปกครองท้องถิ่น', url: 'https://www.dla.go.th/' },
    { key: 'ncb',  name: 'ตรวจเครดิตบูโร', agency: 'บริษัท ข้อมูลเครดิตแห่งชาติ จำกัด (NCB)', url: 'https://www.ncb.co.th/' }
  ],

  /* ─── บริการด้านการเงินที่จะเปิดในอนาคต ─── */
  upcoming: [
    { title: 'สถานะคืนภาษีเงินได้', agency: 'กรมสรรพากร', icon: 'currency_exchange', tone: 'positive',
      desc: 'ติดตามการยื่น ภ.ง.ด.90/91 และสถานะเงินคืนภาษีที่โอนเข้าพร้อมเพย์ผูกเลขบัตรประชาชน' },
    { title: 'ค่าลดหย่อนภาษีของฉัน', agency: 'กรมสรรพากร', icon: 'receipt', tone: 'primary',
      desc: 'รวมเบี้ยประกันชีวิต/สุขภาพ ดอกเบี้ยบ้าน กองทุน SSF/RMF และเงินบริจาค เพื่อวางแผนก่อนสิ้นปีภาษี' },
    { title: 'เงินออมเพื่อเกษียณ', agency: 'สำนักงานประกันสังคม · กอช. · กบข.', icon: 'savings', tone: 'info',
      desc: 'ยอดเงินชราภาพประกันสังคม เงินสะสม กอช./กบข. และกองทุนสำรองเลี้ยงชีพ ในที่เดียว' },
    { title: 'ตรวจสอบเงินฝากไม่มีการเคลื่อนไหว', agency: 'กรมบัญชีกลาง', icon: 'account_balance', tone: 'warning',
      desc: 'ค้นหาเงินฝากที่ไม่ได้เคลื่อนไหวเกิน 10 ปี ซึ่งธนาคารนำส่งกรมบัญชีกลาง และยื่นขอรับคืนได้' },
    { title: 'กรมธรรม์ประกันภัยของฉัน', agency: 'สำนักงาน คปภ.', icon: 'shield', tone: 'secondary',
      desc: 'ดูกรมธรรม์ประกันชีวิต สุขภาพ และรถยนต์ทั้งหมดที่มีชื่อคุณเป็นผู้เอาประกันหรือผู้รับประโยชน์' },
    { title: 'หนี้ กยศ.', agency: 'กองทุนเงินให้กู้ยืมเพื่อการศึกษา', icon: 'school', tone: 'info',
      desc: 'ยอดหนี้คงเหลือ งวดที่ต้องชำระ และประวัติการหักเงินเดือน' },
    { title: 'ภาษีรถประจำปี', agency: 'กรมการขนส่งทางบก', icon: 'directions_car', tone: 'warning',
      desc: 'วันครบกำหนดต่อภาษีรถทุกคันในชื่อคุณ พร้อมแจ้งเตือนและชำระออนไลน์' },
    { title: 'พันธบัตรออมทรัพย์ / สลากออมสิน', agency: 'สบน. · ธนาคารออมสิน · ธ.ก.ส.', icon: 'confirmation_number', tone: 'positive',
      desc: 'รวมพันธบัตรรัฐบาลและสลากออมทรัพย์ที่ถือครอง พร้อมวันครบกำหนดไถ่ถอน' },
    { title: 'สวัสดิการและเงินช่วยเหลือจากรัฐ', agency: 'กระทรวงการคลัง · อปท.', icon: 'redeem', tone: 'danger',
      desc: 'เบี้ยยังชีพ บัตรสวัสดิการแห่งรัฐ และเงินอุดหนุนต่างๆ ที่มีสิทธิ์และที่โอนเข้าแล้ว' }
  ]
};
