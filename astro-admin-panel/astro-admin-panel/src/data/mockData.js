// This mock data stands in for your live API responses.
// Swap each block for a real fetch/axios call to the matching endpoint
// (see the comment above each block) once your backend is wired up.

export const CURRENT_ASTROLOGER_NAME = "Acharya Devansh Sharma";

export const SPECIALIZATIONS = [
  "Vedic Astrology",
  "Tarot Reading",
  "Numerology",
  "Vastu Shastra",
  "Palmistry",
  "Face Reading",
];

// GET /api/admin/astrologers/pending
export const PENDING_ASTROLOGERS = [
  { id: "a101", name: "Acharya Devansh Sharma", email: "devansh.sharma@example.com", specialization: "Vedic Astrology", experience: 12, submitted: "2 days ago" },
  { id: "a102", name: "Pandit Ritu Malhotra", email: "ritu.malhotra@example.com", specialization: "Tarot Reading", experience: 6, submitted: "5 hours ago" },
  { id: "a103", name: "Guruji Om Prakash", email: "om.prakash@example.com", specialization: "Numerology", experience: 20, submitted: "1 day ago" },
  { id: "a104", name: "Dr. Kavita Iyer", email: "kavita.iyer@example.com", specialization: "Vastu Shastra", experience: 9, submitted: "3 days ago" },
];

// GET /api/admin/astrologers
export const ALL_ASTROLOGERS = [
  { id: "a001", name: "Acharya Devansh Sharma", email: "devansh.sharma@example.com", specialization: "Vedic Astrology", experience: 12, rating: 4.8, sessions: 1240, status: "active" },
  { id: "a002", name: "Nakshatra Verma", email: "nakshatra.verma@example.com", specialization: "Palmistry", experience: 8, rating: 4.6, sessions: 860, status: "active" },
  { id: "a003", name: "Pandit Suresh Joshi", email: "suresh.joshi@example.com", specialization: "Vedic Astrology", experience: 25, rating: 4.9, sessions: 2310, status: "active" },
  { id: "a004", name: "Meera Kulkarni", email: "meera.kulkarni@example.com", specialization: "Tarot Reading", experience: 4, rating: 4.3, sessions: 310, status: "inactive" },
  { id: "a005", name: "Rajeshwar Tripathi", email: "rajeshwar.t@example.com", specialization: "Face Reading", experience: 15, rating: 4.5, sessions: 970, status: "active" },
  { id: "a006", name: "Anjali Deshpande", email: "anjali.d@example.com", specialization: "Numerology", experience: 7, rating: 4.1, sessions: 420, status: "rejected" },
];

// GET /api/appointments  (super admin)
// GET /api/appointments/astrologer/:astrologerId  (astrologer, filtered client-side here)
export const APPOINTMENTS = [
  { id: "bk501", user: "Rohit Sinha", astrologer: "Acharya Devansh Sharma", date: "12 Sep", time: "10:30 AM", mode: "call", amount: 799, status: "confirmed" },
  { id: "bk502", user: "Priya Nair", astrologer: "Acharya Devansh Sharma", date: "12 Sep", time: "2:00 PM", mode: "video", amount: 1299, status: "pending" },
  { id: "bk503", user: "Karan Mehta", astrologer: "Pandit Suresh Joshi", date: "11 Sep", time: "6:15 PM", mode: "chat", amount: 499, status: "completed" },
  { id: "bk504", user: "Simran Kaur", astrologer: "Nakshatra Verma", date: "13 Sep", time: "11:00 AM", mode: "call", amount: 699, status: "confirmed" },
  { id: "bk505", user: "Aditya Rao", astrologer: "Acharya Devansh Sharma", date: "10 Sep", time: "4:45 PM", mode: "video", amount: 1299, status: "cancelled" },
  { id: "bk506", user: "Neha Gupta", astrologer: "Rajeshwar Tripathi", date: "14 Sep", time: "9:00 AM", mode: "chat", amount: 399, status: "pending" },
];

// GET /api/products
export const PRODUCTS = [
  { id: "p201", name: "5 Mukhi Rudraksha Mala", astrologer: "Acharya Devansh Sharma", category: "Mala & Beads", price: 1450, stock: 34, status: "active" },
  { id: "p202", name: "Personalised Janam Kundli Report", astrologer: "Acharya Devansh Sharma", category: "Reports", price: 999, stock: 999, status: "active" },
  { id: "p203", name: "Panchdhatu Navgraha Ring", astrologer: "Pandit Suresh Joshi", category: "Rings", price: 2100, stock: 12, status: "active" },
  { id: "p204", name: "Sphatik Crystal Mala", astrologer: "Nakshatra Verma", category: "Mala & Beads", price: 890, stock: 0, status: "draft" },
  { id: "p205", name: "Vastu Home Correction E-book", astrologer: "Dr. Kavita Iyer", category: "Reports", price: 249, stock: 999, status: "active" },
];
