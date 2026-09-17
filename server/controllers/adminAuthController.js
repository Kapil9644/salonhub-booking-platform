const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const PasswordReset = require("../models/PasswordReset");

const adminLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone number and password are required.",
      });
    }

    const admin = await User.findOne({
      phone: phone.trim(),
      role: "admin",
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        phone: admin.phone,
        email: admin.email,
        role: admin.role,
        profileImage: admin.profileImage,
        isVerified: admin.isVerified,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const adminForgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    const admin = await User.findOne({
      phone: phone.trim(),
      role: "admin",
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "No admin account found with this phone number.",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP
    const otpHash = await bcrypt.hash(otp, 10);

    // Remove previous reset requests for this admin
    await PasswordReset.deleteMany({
      userId: admin._id,
    });

    // Create new reset request
    await PasswordReset.create({
      userId: admin._id,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // Development only
    console.log(`🔐 Admin Development OTP for ${phone}: ${otp}`);

    return res.status(200).json({
      success: true,
      message: "OTP generated successfully.",
    });
  } catch (error) {
    console.error("Admin forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const adminVerifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required.",
      });
    }

    // Find admin
    const admin = await User.findOne({
      phone: phone.trim(),
      role: "admin",
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    // Find reset record
    const resetRecord = await PasswordReset.findOne({
      userId: admin._id,
    });

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message: "No active password reset request found.",
      });
    }

    // Check OTP expiration
    if (resetRecord.expiresAt < new Date()) {
      await PasswordReset.deleteOne({
        _id: resetRecord._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Check maximum attempts
    if (resetRecord.attempts >= 5) {
      await PasswordReset.deleteOne({
        _id: resetRecord._id,
      });

      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    // Compare OTP
    const isOtpValid = await bcrypt.compare(otp.trim(), resetRecord.otpHash);

    if (!isOtpValid) {
      resetRecord.attempts += 1;
      await resetRecord.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // Generate temporary reset token
    const resetToken = jwt.sign(
      {
        userId: admin._id,
        role: "admin",
        purpose: "admin-password-reset",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      },
    );

    // Store hashed reset token
    resetRecord.resetTokenHash = await bcrypt.hash(resetToken, 10);

    await resetRecord.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      resetToken,
    });
  } catch (error) {
    console.error("Admin verify OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const adminResetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required.",
      });
    }

    // Verify reset token
    let decoded;

    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    // Make sure this token is specifically for admin password reset
    if (
      decoded.role !== "admin" ||
      decoded.purpose !== "admin-password-reset"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin reset token.",
      });
    }

    // Find reset record
    const resetRecord = await PasswordReset.findOne({
      userId: decoded.userId,
    });

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message: "Password reset request not found or already used.",
      });
    }

    // Check expiration
    if (resetRecord.expiresAt < new Date()) {
      await PasswordReset.deleteOne({
        _id: resetRecord._id,
      });

      return res.status(400).json({
        success: false,
        message: "Password reset request has expired.",
      });
    }

    // Verify reset token against stored hash
    const isTokenValid = await bcrypt.compare(
      resetToken,
      resetRecord.resetTokenHash,
    );

    if (!isTokenValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid reset token.",
      });
    }

    // Find admin
    const admin = await User.findOne({
      _id: decoded.userId,
      role: "admin",
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update admin password
    admin.password = hashedPassword;
    await admin.save();

    // Delete reset record so token cannot be reused
    await PasswordReset.deleteOne({
      _id: resetRecord._id,
    });

    return res.status(200).json({
      success: true,
      message: "Admin password reset successful. Please login again.",
    });
  } catch (error) {
    console.error("Admin reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  adminLogin,
  adminForgotPassword,
  adminVerifyOtp,
  adminResetPassword,
};
