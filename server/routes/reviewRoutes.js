const express = require("express");

const router = express.Router();

const {
  createReview,
  getSalonReviews,
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");

// Get reviews for a salon
router.get("/salon/:salonId", getSalonReviews);

// Create a review
router.post("/", protect, createReview);

module.exports = router;
