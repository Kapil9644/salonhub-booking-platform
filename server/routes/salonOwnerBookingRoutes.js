const express = require("express");

const router = express.Router();

const {
  getSalonOwnerAppointments,
  updateAppointmentStatus,
} = require("../controllers/salonOwnerBookingController");

const protect = require("../middleware/authMiddleware");

// Get appointments for logged-in salon owner
router.get("/", protect, getSalonOwnerAppointments);

// Update appointment status
router.patch("/:id/status", protect, updateAppointmentStatus);

module.exports = router;
