const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getMyWorkingHours,
  updateMyWorkingHours,
} = require("../controllers/workingHoursController");

// Get logged-in salon owner's working hours
router.get("/my", protect, getMyWorkingHours);

// Update logged-in salon owner's working hours
router.put("/my", protect, updateMyWorkingHours);

module.exports = router;
