const express = require("express");

const router = express.Router();

const {
  getGlobalServices,
  getGlobalServiceById,
} = require("../controllers/globalServiceController");

// Get all active global services
router.get("/", getGlobalServices);

// Get one active global service
router.get("/:id", getGlobalServiceById);

module.exports = router;
