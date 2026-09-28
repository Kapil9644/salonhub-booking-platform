const express = require("express");

const router = express.Router();

const {
  createReview,
  updateReview,
  getBookingReview,
  getSalonReviews,
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");

// Get review for a booking
router.get("/booking/:bookingId", protect, getBookingReview);

// Get reviews for a salon
router.get("/salon/:salonId", getSalonReviews);

// Create a review
router.post("/", protect, createReview);

// Update a review
router.patch("/:reviewId", protect, updateReview);

module.exports = router;
