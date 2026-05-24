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
      title: "ถูกตัดคะแนน (-2 คะแนน)",
      remaining: 7,
      date: "10 ม.ค. 2569 09:31 น.",
      refTicket: "0265125960711",
      type: "deduction"
    },
    {
      id: "log-2",
      title: "ถูกตัดคะแนน (-2 คะแนน)",
      remaining: 9,
      date: "10 ม.ค. 2569 09:31 น.",
      refTicket: "0265125960711",
      type: "deduction"
    },
    {
      id: "log-3",
      title: "คืนคะแนนครบกำหนด 1 ปี (+1 คะแนน)",
      remaining: 9,
      date: "10 ม.ค. 2569 09:31 น.",
      refTicket: "0265125960711",
      type: "restoration"
    }
  ]
};

// Database Initializer
const DB = {
  init() {
    if (!localStorage.getItem("czp_tickets")) {
      localStorage.setItem("czp_tickets", JSON.stringify(DEFAULT_TICKETS));
    }
    if (!localStorage.getItem("czp_points")) {
      localStorage.setItem("czp_points", JSON.stringify(DEFAULT_POINTS));
    }
    if (localStorage.getItem("czp_empty_state") === null) {
      localStorage.setItem("czp_empty_state", "false");
    }
  },

  getTickets() {
    this.init();
    if (localStorage.getItem("czp_empty_state") === "true") {
      return [];
    }
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

  getEmptyState() {
    this.init();
    return localStorage.getItem("czp_empty_state") === "true";
  },

  setEmptyState(isEmpty) {
    localStorage.setItem("czp_empty_state", isEmpty.toString());
  },

  reset() {
    localStorage.setItem("czp_tickets", JSON.stringify(DEFAULT_TICKETS));
    localStorage.setItem("czp_points", JSON.stringify(DEFAULT_POINTS));
    localStorage.setItem("czp_empty_state", "false");
  }
};

// Auto-run init when imported/loaded
DB.init();
