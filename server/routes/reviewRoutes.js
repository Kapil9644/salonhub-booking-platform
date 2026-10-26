const express = require("express");

const router = express.Router();

const {
  createReview,
  updateReview,
  getBookingReview,
  getSalonReviews,
  getSalonOwnerReviews,
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");
const salonOwnerProtect = require("../middleware/salonOwnerAuthMiddleware");

// Customer: Get review for a booking
router.get("/booking/:bookingId", protect, getBookingReview);

// Public: Get reviews for a salon
router.get("/salon/:salonId", getSalonReviews);

// Customer: Create a review
router.post("/", protect, createReview);

// Customer: Update a review
router.patch("/:reviewId", protect, updateReview);

// Salon Owner: Get reviews for their own salon
router.get("/owner", salonOwnerProtect, getSalonOwnerReviews);

module.exports = router;
