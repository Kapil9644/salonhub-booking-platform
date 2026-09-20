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
  getPublicSalonDetails,
} = require("../controllers/salonController");

const salonOwnerProtect = require("../middleware/salonOwnerAuthMiddleware");

// Get salons visible to customers
router.get("/", getPublicSalons);

// Get logged-in owner's salon
router.get("/my", salonOwnerProtect, getMySalon);

// Create salon profile
router.post("/", salonOwnerProtect, createSalon);

// Update salon profile
router.put("/my", salonOwnerProtect, updateSalon);

// Toggle salon visibility
router.patch("/my/visibility", salonOwnerProtect, toggleSalonVisibility);

// Toggle open/closed status
router.patch("/my/status", salonOwnerProtect, toggleSalonStatus);

// Upload salon profile image
router.post(
  "/my/profile-image",
  salonOwnerProtect,
  upload.single("profileImage"),
  uploadSalonProfileImage,
);

// Get complete details of one public salon
// Keep this LAST because :salonId is a dynamic route
router.get("/:salonId", getPublicSalonDetails);

module.exports = router;
