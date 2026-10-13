const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const { getAllCustomers } = require("../controllers/adminUserController");

// Get all customers
router.get("/all", protect, adminOnly, getAllCustomers);

module.exports = router;
