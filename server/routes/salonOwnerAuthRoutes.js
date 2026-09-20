const multer = require("multer");
const salonOwnerProtect = require("../middleware/salonOwnerAuthMiddleware");

const upload = multer({
  storage: multer.memoryStorage(),
});

const express = require("express");

const {
  salonOwnerRegister,
  salonOwnerLogin,
  salonOwnerForgotPassword,
  salonOwnerVerifyOtp,
  salonOwnerResetPassword,
  salonOwnerGetProfile,
  salonOwnerUpdateProfile,
  salonOwnerUploadProfileImage,
} = require("../controllers/salonOwnerAuthController");

const router = express.Router();

// Salon Owner Registration
router.post("/register", salonOwnerRegister);

// Salon Owner Login
router.post("/login", salonOwnerLogin);

// Salon Owner Forgot Password
router.post("/forgot-password", salonOwnerForgotPassword);

// Salon Owner Verify OTP
router.post("/verify-otp", salonOwnerVerifyOtp);

// Salon Owner Reset Password
router.post("/reset-password", salonOwnerResetPassword);

// Salon Owner Profile
router.get("/me", salonOwnerProtect, salonOwnerGetProfile);

router.put("/profile", salonOwnerProtect, salonOwnerUpdateProfile);

router.post(
  "/profile-image",
  salonOwnerProtect,
  upload.single("profileImage"),
  salonOwnerUploadProfileImage,
);

module.exports = router;
