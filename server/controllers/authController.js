const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const PasswordReset = require("../models/PasswordReset");

// Register User
const register = async (req, res) => {
  try {
    const { fullName, phone, email, password } = req.body;

    // Validation
    if (!fullName || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Full Name, Phone and Password are required.",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered.",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      fullName,
      phone,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Validation
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and Password are required.",
      });
    }

    // Find User
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone number or password.",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone number or password.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;

    // Validation
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    // Find User
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this phone number.",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP
    const otpHash = await bcrypt.hash(otp, 10);

    // Remove previous reset records
    await PasswordReset.deleteMany({ userId: user._id });

    // Create reset record
    await PasswordReset.create({
      userId: user._id,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log(`🔐 Development OTP for ${phone}: ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP generated successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Validation
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required.",
      });
    }

    // Find User
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Find Reset Record
    const resetRecord = await PasswordReset.findOne({
      userId: user._id,
    });

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message: "No active password reset request found.",
      });
    }

    // Check OTP expiration
    if (resetRecord.expiresAt < new Date()) {
      await PasswordReset.deleteOne({ _id: resetRecord._id });

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Check attempts
    if (resetRecord.attempts >= 5) {
      await PasswordReset.deleteOne({ _id: resetRecord._id });

      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    // Compare OTP
    const isOtpValid = await bcrypt.compare(otp, resetRecord.otpHash);

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
        userId: user._id,
        purpose: "password-reset",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      },
    );

    // Store hashed reset token
    resetRecord.resetTokenHash = await bcrypt.hash(resetToken, 10);

    await resetRecord.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      resetToken,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    // Validation
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

    // Make sure this JWT is specifically for password reset
    if (decoded.purpose !== "password-reset") {
      return res.status(401).json({
        success: false,
        message: "Invalid reset token.",
      });
    }

    // Find password reset record
    const resetRecord = await PasswordReset.findOne({
      userId: decoded.userId,
    });

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message: "Password reset request not found or already used.",
      });
    }

    // Check reset record expiration
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

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Delete reset record so token cannot be reused
    await PasswordReset.deleteOne({
      _id: resetRecord._id,
    });

    res.status(200).json({
      success: true,
      message: "Password reset successful. Please login again.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getProfile,
};
