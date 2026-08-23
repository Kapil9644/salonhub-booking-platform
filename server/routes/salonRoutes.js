const multer = require("multer");
const express = require("express");
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

const {
  getMySalon,
  createSalon,
  updateSalon,
  uploadSalonProfileImage,
  toggleSalonVisibility,
  toggleSalonStatus,
  getPublicSalons,
} = require("../controllers/salonController");

const protect = require("../middleware/authMiddleware");

// Get salons visible to customers
router.get("/", getPublicSalons);

// Get logged-in owner's salon
router.get("/my", protect, getMySalon);

// Create salon profile
router.post("/", protect, createSalon);

// Update salon profile
router.put("/my", protect, updateSalon);

// Toggle salon visibility
router.patch("/my/visibility", protect, toggleSalonVisibility);

// Toggle open/closed status
router.patch("/my/status", protect, toggleSalonStatus);

router.post(
  "/my/profile-image",
  protect,
  upload.single("profileImage"),
  uploadSalonProfileImage,
);

module.exports = router;
