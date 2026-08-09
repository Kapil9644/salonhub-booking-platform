const express = require("express");

const router = express.Router();

const {
  createBooking,
  getMyBookings,
  updateBooking,
  cancelBooking,
} = require("../controllers/bookingController");

const protect = require("../middleware/authMiddleware");

// Create booking
router.post("/", protect, createBooking);

// Get logged-in user's bookings
router.get("/my", protect, getMyBookings);

// Edit booking
router.put("/:id", protect, updateBooking);

// Cancel booking
router.patch("/:id/cancel", protect, cancelBooking);

module.exports = router;
