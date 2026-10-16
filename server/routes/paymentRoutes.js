const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createPaymentOrder,
  verifyPaymentOrder,
  processCashfreeWebhook,
} = require("../controllers/paymentController");

const router = express.Router();

const { getMyPaymentHistory } = require("../controllers/paymentController");

router.get("/history", protect, getMyPaymentHistory);

router.get("/my", protect, getMyPaymentHistory);

router.post("/create-order", protect, createPaymentOrder);
router.post("/verify-order", protect, verifyPaymentOrder);

// Cashfree calls this endpoint directly.
// Signature verification happens inside the controller.
router.post("/webhook", processCashfreeWebhook);

module.exports = router;
