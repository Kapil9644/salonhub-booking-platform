const express = require("express");
const multer = require("multer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

const {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getProfile,
  updateProfile,
  uploadProfileImage,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post(
  "/profile-image",
  protect,
  upload.single("profileImage"),
  uploadProfileImage,
);

module.exports = router;
