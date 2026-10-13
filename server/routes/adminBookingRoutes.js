const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  getAllBookings,
  updateAdminBookingStatus,
  markAdminBookingPaymentReceived,
} = require("../controllers/adminBookingController");

router.get("/all", protect, adminOnly, getAllBookings);

router.patch("/:id/status", protect, adminOnly, updateAdminBookingStatus);

router.patch(
  "/:id/payment-received",
  protect,
  adminOnly,
  markAdminBookingPaymentReceived,
);

module.exports = router;
