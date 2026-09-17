const express = require("express");

const router = express.Router();

const {
  adminLogin,
  adminForgotPassword,
  adminVerifyOtp,
  adminResetPassword,
} = require("../controllers/adminAuthController");

router.post("/login", adminLogin);
router.post("/forgot-password", adminForgotPassword);
router.post("/verify-otp", adminVerifyOtp);
router.post("/reset-password", adminResetPassword);

module.exports = router;
