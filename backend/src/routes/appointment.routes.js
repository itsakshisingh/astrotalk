const express = require("express");
const router = express.Router();

const {
  bookAppointment,
  getAllAppointments,
  getAppointmentsByAstrologer,
  getAppointmentsByUser,
  updateAppointmentStatus,
} = require("../controllers/appointment.controller");

// Book Appointment API
router.post("/book", bookAppointment);

// Get All Appointments (Super Admin)
router.get("/", getAllAppointments);

// Get Appointments by User ID (for user profile page)
router.get("/user/:userId", getAppointmentsByUser);

// Get Appointments by Astrologer ID
router.get("/astrologer/:astrologerId", getAppointmentsByAstrologer);

// Update Appointment Status
router.patch("/:id/status", updateAppointmentStatus);
router.put("/:id/status", updateAppointmentStatus);

module.exports = router;

