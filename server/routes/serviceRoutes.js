const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getMyServices,
  getPublicSalonServices,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

// Get logged-in salon owner's services
router.get("/my", protect, getMyServices);

// Get active services of a public salon
router.get("/salon/:salonId", getPublicSalonServices);

// Create service
router.post("/", protect, createService);

// Update service
router.put("/:id", protect, updateService);

// Delete service
router.delete("/:id", protect, deleteService);

module.exports = router;
