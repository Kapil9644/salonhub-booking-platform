const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const adminOnly = require("../middleware/adminMiddleware");

const {
  getPendingSalons,
  approveSalon,
  rejectSalon,
  getAllSalons,
} = require("../controllers/adminSalonController");

// Get pending salon applications
router.get("/pending", protect, adminOnly, getPendingSalons);

// Approve salon application
router.patch("/:id/approve", protect, adminOnly, approveSalon);

// Reject salon application
router.patch("/:id/reject", protect, adminOnly, rejectSalon);

// Get all salons
router.get("/all", protect, adminOnly, getAllSalons);

module.exports = router;
