const express = require("express");

const router = express.Router();

const salonOwnerProtect = require("../middleware/salonOwnerAuthMiddleware");

const {
  getMyServices,
  getPublicSalonServices,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

// Get logged-in salon owner's services
router.get("/my", salonOwnerProtect, getMyServices);

// Get active services of a public salon
router.get("/salon/:salonId", getPublicSalonServices);

// Create service
router.post("/", salonOwnerProtect, createService);

// Update service
router.put("/:id", salonOwnerProtect, updateService);

// Delete service
router.delete("/:id", salonOwnerProtect, deleteService);

module.exports = router;
