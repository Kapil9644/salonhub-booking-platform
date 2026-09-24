const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createPaymentOrder,
  verifyPaymentOrder,
} = require("../controllers/paymentController");

const router = express.Router();

// Create Cashfree payment order
router.post("/create-order", protect, createPaymentOrder);

// Verify Cashfree payment order
router.post("/verify-order", protect, verifyPaymentOrder);

module.exports = router;
