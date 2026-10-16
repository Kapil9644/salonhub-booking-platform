const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getSalonOwnerPayments,
  exportSalonOwnerPayments,
} = require("../controllers/salonOwnerPaymentController");

const router = express.Router();

router.use(protect);

// Keep export before the general GET route.
router.get("/export", exportSalonOwnerPayments);
router.get("/", getSalonOwnerPayments);

module.exports = router;
