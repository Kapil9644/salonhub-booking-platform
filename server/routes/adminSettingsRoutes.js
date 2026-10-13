const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  getAdminSettings,
  updateAdminSettings,
} = require("../controllers/adminSettingsController");

// Authenticate and authorize admin access.
router.use(protect, adminOnly);

// Read settings.
router.get("/", getAdminSettings);

// Save settings.
router.put("/", updateAdminSettings);

module.exports = router;
