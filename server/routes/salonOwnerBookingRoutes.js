const express = require("express");

const router = express.Router();

const {
  getSalonOwnerAppointments,
  updateAppointmentStatus,
  markBookingPaymentReceived,
} = require("../controllers/salonOwnerBookingController");

const protect = require("../middleware/salonOwnerAuthMiddleware");

// Get appointments for logged-in salon owner
router.get("/", protect, getSalonOwnerAppointments);

// Update appointment status
router.patch("/:id/status", protect, updateAppointmentStatus);

// Record payment received for a completed Pay After Service booking
router.patch("/:id/payment-received", protect, markBookingPaymentReceived);

module.exports = router;
