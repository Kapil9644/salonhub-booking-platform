const express = require("express");

const router = express.Router();

const {
  createBooking,
  getMyBookings,
  updateBooking,
  cancelBooking,
  getBookedSlots,
} = require("../controllers/bookingController");

const protect = require("../middleware/authMiddleware");

// Create booking
router.post("/", protect, createBooking);

// Get logged-in user's bookings
router.get("/my", protect, getMyBookings);

// Get booked time slots for a salon and date
router.get("/booked-slots", protect, getBookedSlots);

// Edit booking
router.put("/:id", protect, updateBooking);

// Cancel booking
router.patch("/:id/cancel", protect, cancelBooking);

module.exports = router;
