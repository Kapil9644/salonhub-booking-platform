const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  getPaymentSummary,
  getAdminPayments,
  getAdminPaymentDetails,
  exportAdminPayments,
} = require("../controllers/adminPaymentController");

router.use(protect, adminOnly);

router.get("/summary", getPaymentSummary);
router.get("/export", exportAdminPayments);
router.get("/", getAdminPayments);
router.get("/:id", getAdminPaymentDetails);

module.exports = router;
