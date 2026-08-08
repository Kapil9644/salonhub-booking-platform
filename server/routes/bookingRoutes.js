const express = require("express");

const router = express.Router();

const {
  createBooking,
  getMyBookings,
} = require("../controllers/bookingController");

const protect = require("../middleware/authMiddleware");

// Create booking
router.post("/", protect, createBooking);

// Get logged-in user's bookings
router.get("/my", protect, getMyBookings);

module.exports = router;
