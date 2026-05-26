const DEFAULT_TICKETS = [
  {
    id: "ticket-1",
    ticketNumber: "0265125960711",
    fine: 500,
    dueDate: "31 มกราคม 2569",
    status: "unpaid", // unpaid, paid, warning
    issueDate: "10 มกราคม 2569 09:31 น.",
    ownerName: "นายขับขี่ดี เดินทางปลอดภัย",
    licensePlate: "9 ฮฮ 1234 กรุงเทพมหานคร",
    offenseDate: "10 มกราคม 2569 09:31 น.",
    offenseLocation: "ถนนมอเตอร์เวย์ M7 กิโลเมตรที่ 135+400 ห้วยใหญ่ บางละมุง ชลบุรี",
    issuedBy: "ส.ทล.1 กก.8 บก.ทล.",
    offenses: [
      { name: "1. ขับรถใช้ความเร็วเกินกว่าอัตราที่กฎหมายกำหนด (พ.ร.บ.ทางหลวง ม.5 (1), ม.69)", price: 500 }
    ]
  },
  {
    id: "ticket-2",
    ticketNumber: "0265125960711",
    fine: 1000,
    dueDate: "31 มกราคม 2569",
    status: "paid",
    paymentDetails: "ชำระผ่าน KTB Netbank วันที่ 10 เมษายน 2569",
    issueDate: "10 มกราคม 2569 09:31 น.",
    ownerName: "นายขับขี่ดี เดินทางปลอดภัย",
    licensePlate: "9 ฮฮ 1234 กรุงเทพมหานคร",
    offenseDate: "10 มกราคม 2569 09:31 น.",
    offenseLocation: "ถนนมอเตอร์เวย์ M7 กิโลเมตรที่ 135+400 ห้วยใหญ่ บางละมุง ชลบุรี",
    issuedBy: "ส.ทล.1 กก.8 บก.ทล.",
    offenses: [
      { name: "1. ขับรถใช้ความเร็วเกินกว่าอัตราที่กฎหมายกำหนด (พ.ร.บ.ทางหลวง ม.5 (1), ม.69)", price: 500 },
      { name: "2. ขับรถใช้ความเร็วเกินกว่าอัตราที่กฎหมายกำหนด (พ.ร.บ.ทางหลวง ม.5 (1), ม.69)", price: 500 }
    ]
  },
  {
    id: "ticket-3",
    ticketNumber: "0265125960711",
    fine: 1000,
    dueDate: "31 มกราคม 2569",
    status: "warning", // unpaid with warning letter issued
    issueDate: "10 มกราคม 2569 09:31 น.",
    ownerName: "นายขับขี่ดี เดินทางปลอดภัย",
    licensePlate: "9 ฮฮ 1234 กรุงเทพมหานคร",
    offenseDate: "10 มกราคม 2569 09:31 น.",
    offenseLocation: "ถนนมอเตอร์เวย์ M7 กิโลเมตรที่ 135+400 ห้วยใหญ่ บางละมุง ชลบุรี",
    issuedBy: "ส.ทล.1 กก.8 บก.ทล.",
    offenses: [
      { name: "1. ขับรถใช้ความเร็วเกินกว่าอัตราที่กฎหมายกำหนด (พ.ร.บ.ทางหลวง ม.5 (1), ม.69)", price: 500 },
      { name: "2. ขับรถใช้ความเร็วเกินกว่าอัตราที่กฎหมายกำหนด (พ.ร.บ.ทางหลวง ม.5 (1), ม.69)", price: 500 }
    ]
  }
];

const DEFAULT_POINTS = {
  remainingPoints: 7,
  maxPoints: 12,
  logs: [
    {
      id: "log-1",
      title: "คืนคะแนนครบกำหนด 1 ปี (+1 คะแนน)",
      remaining: 7,
      date: "02 ม.ค. 2569 10:15 น.",
      refTicket: "0265125960812",
      type: "restoration"
    },
    {
      id: "log-2",
      title: "ถูกตัดคะแนน (-2 คะแนน) — ฝ่าสัญญาณไฟจราจร",
      remaining: 6,
      date: "10 ธ.ค. 2568 15:30 น.",
      refTicket: "0265125960811",
      type: "deduction"
    },
    {
      id: "log-3",
      title: "คืนคะแนนครบกำหนด 1 ปี (+1 คะแนน)",
      remaining: 8,
      date: "28 พ.ย. 2568 09:00 น.",
      refTicket: "0265125960710",
      type: "restoration"
    },
    {
      id: "log-4",
      title: "ถูกตัดคะแนน (-1 คะแนน) — ขับรถไม่คาดเข็มขัดนิรภัย",
      remaining: 7,
      date: "15 พ.ย. 2568 08:45 น.",
      refTicket: "0265125960709",
      type: "deduction"
    },
    {
      id: "log-5",
      title: "คืนคะแนนผ่านการอบรม (+2 คะแนน)",
      remaining: 8,
      date: "05 ต.ค. 2568 14:00 น.",
      refTicket: "อบรมครั้งที่ 1/2568",
      type: "restoration"
    },
    {
      id: "log-6",
      title: "ถูกตัดคะแนน (-2 คะแนน) — ขับรถเร็วเกินกว่าอัตราที่กฎหมายกำหนด",
      remaining: 6,
      date: "22 ก.ย. 2568 22:15 น.",
      refTicket: "0265125960707",
      type: "deduction"
    },
    {
      id: "log-7",
      title: "ถูกตัดคะแนน (-1 คะแนน) — ใช้โทรศัพท์มือถือขณะขับรถ",
      remaining: 8,
      date: "10 ส.ค. 2568 11:30 น.",
      refTicket: "0265125960706",
      type: "deduction"
    },
    {
      id: "log-8",
      title: "คืนคะแนนครบกำหนด 1 ปี (+2 คะแนน)",
      remaining: 9,
      date: "25 ก.ค. 2568 10:00 น.",
      refTicket: "0265125960605",
      type: "restoration"
    },
    {
      id: "log-9",
      title: "ถูกตัดคะแนน (-3 คะแนน) — ขับรถโดยประมาทหรือน่าหวาดเสียว",
      remaining: 7,
      date: "18 พ.ค. 2568 17:20 น.",
      refTicket: "0265125960604",
      type: "deduction"
    },
    {
      id: "log-10",
      title: "คืนคะแนนครบกำหนด 1 ปี (+1 คะแนน)",
      remaining: 10,
      date: "12 เม.ย. 2568 09:00 น.",
      refTicket: "0265125960402",
      type: "restoration"
    },
    {
      id: "log-11",
      title: "ถูกตัดคะแนน (-2 คะแนน) — ขับรถย้อนศร",
      remaining: 9,
      date: "20 ก.พ. 2568 08:30 น.",
      refTicket: "0265125960503",
      type: "deduction"
    },
    {
      id: "log-12",
      title: "ถูกตัดคะแนน (-1 คะแนน) — ขับขี่รถจักรยานยนต์ไม่สวมหมวกนิรภัย",
      remaining: 11,
      date: "15 ม.ค. 2568 09:00 น.",
      refTicket: "0265125960101",
      type: "deduction"
    }
  ]
};

// Database Initializer
const DB = {
  init() {
    if (!localStorage.getItem("czp_tickets")) {
      localStorage.setItem("czp_tickets", JSON.stringify(DEFAULT_TICKETS));
    }
    if (!localStorage.getItem("czp_points") || JSON.parse(localStorage.getItem("czp_points")).logs.length !== 12) {
      localStorage.setItem("czp_points", JSON.stringify(DEFAULT_POINTS));
    }

  },

  getTickets() {
    this.init();
    return JSON.parse(localStorage.getItem("czp_tickets"));
  },

  getTicketById(id) {
    const tickets = this.getTickets();
    return tickets.find(t => t.id === id);
  },

  updateTicketStatus(id, status, paymentDetails = "") {
    this.init();
    const tickets = JSON.parse(localStorage.getItem("czp_tickets"));
    const index = tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      tickets[index].status = status;
      if (paymentDetails) {
        tickets[index].paymentDetails = paymentDetails;
      }
      localStorage.setItem("czp_tickets", JSON.stringify(tickets));
      return true;
    }
    return false;
  },

  getPoints() {
    this.init();
    return JSON.parse(localStorage.getItem("czp_points"));
  },



  reset() {
    localStorage.setItem("czp_tickets", JSON.stringify(DEFAULT_TICKETS));
    localStorage.setItem("czp_points", JSON.stringify(DEFAULT_POINTS));
  }
};

// Auto-run init when imported/loaded
DB.init();
