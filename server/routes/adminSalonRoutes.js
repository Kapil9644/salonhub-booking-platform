const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const { getPendingSalons } = require("../controllers/adminSalonController");

// Get pending salon applications

router.get("/pending", protect, adminOnly, getPendingSalons);

module.exports = router;
