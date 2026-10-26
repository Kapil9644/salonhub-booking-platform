const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const salonOwnerProtect = require("../middleware/salonOwnerAuthMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  createComplaint,
  getMyComplaints,
  trackComplaint,
  getAllComplaints,
  updateComplaint,
  createSalonOwnerComplaint,
  getMySalonOwnerComplaints,
} = require("../controllers/complaintController");

// Salon Owner routes
router.post("/salon-owner", salonOwnerProtect, createSalonOwnerComplaint);

router.get("/salon-owner/my", salonOwnerProtect, getMySalonOwnerComplaints);

// Customer routes
router.post("/", protect, createComplaint);
router.get("/my", protect, getMyComplaints);
router.get("/track/:complaintId", protect, trackComplaint);

// Admin routes
router.get("/admin", protect, adminOnly, getAllComplaints);
router.patch("/admin/:id", protect, adminOnly, updateComplaint);

module.exports = router;
