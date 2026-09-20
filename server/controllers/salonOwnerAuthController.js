const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const PasswordReset = require("../models/PasswordReset");
const cloudinary = require("../config/cloudinary");

// ==================== SALON OWNER REGISTER ====================

const salonOwnerRegister = async (req, res) => {
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

    // Create Salon Owner
    const user = await User.create({
      fullName,
      phone,
      email,
      password: hashedPassword,
      role: "salon",
    });

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: "salon",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(201).json({
      success: true,
      message: "Salon Owner Registration Successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
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

// ==================== SALON OWNER LOGIN ====================

const salonOwnerLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Validation
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and Password are required.",
      });
    }

    // Find Salon Owner only
    const user = await User.findOne({
      phone: phone.trim(),
      role: "salon",
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Salon Owner phone number or password.",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Salon Owner phone number or password.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: "salon",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      success: true,
      message: "Salon Owner Login Successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
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

const salonOwnerForgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;

    // Validation
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    // Find Salon Owner only
    const salonOwner = await User.findOne({
      phone: phone.trim(),
      role: "salon",
    });

    if (!salonOwner) {
      return res.status(404).json({
        success: false,
        message: "Salon Owner account not found.",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP
    const otpHash = await bcrypt.hash(otp, 10);

    // Remove previous reset request
    await PasswordReset.deleteMany({
      userId: salonOwner._id,
    });

    // OTP expires in 5 minutes
    await PasswordReset.create({
      userId: salonOwner._id,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
      resetTokenHash: "",
    });

    // Development OTP
    console.log(
      `🔐 Salon Owner Development OTP for ${salonOwner.phone}: ${otp}`,
    );

    res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const salonOwnerVerifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Validation
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required.",
      });
    }

    // Find Salon Owner only
    const salonOwner = await User.findOne({
      phone: phone.trim(),
      role: "salon",
    });

    if (!salonOwner) {
      return res.status(404).json({
        success: false,
        message: "Salon Owner account not found.",
      });
    }

    // Find password reset request
    const resetRequest = await PasswordReset.findOne({
      userId: salonOwner._id,
    });

    if (!resetRequest) {
      return res.status(400).json({
        success: false,
        message: "OTP request not found. Please request a new OTP.",
      });
    }

    // Check expiry
    if (resetRequest.expiresAt < new Date()) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Maximum attempts
    if (resetRequest.attempts >= 5) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return res.status(400).json({
        success: false,
        message: "Too many invalid attempts. Please request a new OTP.",
      });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(otp.trim(), resetRequest.otpHash);

    if (!isMatch) {
      resetRequest.attempts += 1;
      await resetRequest.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // Generate password reset token
    const resetToken = jwt.sign(
      {
        userId: salonOwner._id,
        role: "salon",
        purpose: "salon-owner-password-reset",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      },
    );

    // Store hashed reset token
    const resetTokenHash = await bcrypt.hash(resetToken, 10);

    resetRequest.resetTokenHash = resetTokenHash;
    await resetRequest.save();

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

const salonOwnerResetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    // Validation
    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // Verify reset token
    let decoded;

    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
    }

    // Make sure token belongs to Salon Owner password reset
    if (
      decoded.role !== "salon" ||
      decoded.purpose !== "salon-owner-password-reset"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token.",
      });
    }

    // Find reset request
    const resetRequest = await PasswordReset.findOne({
      userId: decoded.userId,
    });

    if (!resetRequest) {
      return res.status(400).json({
        success: false,
        message: "Password reset request not found.",
      });
    }

    // Check reset token expiry
    if (resetRequest.expiresAt < new Date()) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      });

      return res.status(400).json({
        success: false,
        message: "Password reset request has expired.",
      });
    }

    // Verify stored reset token
    const isTokenMatch = await bcrypt.compare(
      resetToken,
      resetRequest.resetTokenHash,
    );

    if (!isTokenMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token.",
      });
    }

    // Find Salon Owner only
    const salonOwner = await User.findOne({
      _id: decoded.userId,
      role: "salon",
    });

    if (!salonOwner) {
      return res.status(404).json({
        success: false,
        message: "Salon Owner account not found.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    salonOwner.password = hashedPassword;
    await salonOwner.save();

    // Remove password reset request
    await PasswordReset.deleteOne({
      _id: resetRequest._id,
    });

    res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==================== SALON OWNER PROFILE ====================

const salonOwnerGetProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user || user.role !== "salon") {
      return res.status(404).json({
        success: false,
        message: "Salon Owner not found.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Salon Owner profile fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const salonOwnerUpdateProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full Name is required.",
      });
    }

    const user = await User.findOne({
      _id: req.user.id,
      role: "salon",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Salon Owner not found.",
      });
    }

    user.fullName = fullName.trim();

    if (email !== undefined) {
      user.email = email.trim().toLowerCase();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Salon Owner profile update error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const salonOwnerUploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required.",
      });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "salonhub/profile-images",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      stream.end(req.file.buffer);
    });

    const user = await User.findOne({
      _id: req.user.id,
      role: "salon",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Salon Owner not found.",
      });
    }

    user.profileImage = uploadResult.secure_url;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully.",
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Salon Owner profile image upload error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload profile image.",
    });
  }
};

module.exports = {
  salonOwnerRegister,
  salonOwnerLogin,
  salonOwnerForgotPassword,
  salonOwnerVerifyOtp,
  salonOwnerResetPassword,
  salonOwnerGetProfile,
  salonOwnerUpdateProfile,
  salonOwnerUploadProfileImage,
};
