const express = require("express");
const router = express.Router();

const {
  toggleFavoriteSalon,
  getFavoriteSalons,
} = require("../controllers/favoriteController");

const protect = require("../middleware/authMiddleware");

router.get("/", protect, getFavoriteSalons);
router.post("/:salonId/toggle", protect, toggleFavoriteSalon);

module.exports = router;
