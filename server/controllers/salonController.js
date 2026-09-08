const cloudinary = require("../config/cloudinary");
const Salon = require("../models/Salon");
const Service = require("../models/Service");
const WorkingHours = require("../models/WorkingHours");

// ========================================
// CALCULATE CURRENT SALON OPEN/CLOSED STATUS
// ========================================
const calculateSalonOpenStatus = (salon, workingHours) => {
  const today = new Date();

  // Use India Standard Time
  const indiaDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(today);

  const indiaTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(today);

  const dayName = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
  })
    .format(today)
    .toLowerCase();

  const todayHours = workingHours?.[dayName];

  // No working hours found for today
  if (!todayHours) {
    return false;
  }

  // ========================================
  // MANUAL OVERRIDE
  // ========================================
  if (salon.statusOverrideDate === indiaDate) {
    if (salon.statusOverride === "open") {
      return true;
    }

    if (salon.statusOverride === "closed") {
      return false;
    }
  }

  // ========================================
  // AUTOMATIC WORKING HOURS
  // ========================================
  if (!todayHours.isOpen) {
    return false;
  }

  if (!todayHours.openTime || !todayHours.closeTime) {
    return false;
  }

  return indiaTime >= todayHours.openTime && indiaTime < todayHours.closeTime;
};

// Get salon owned by logged-in salon owner
const getMySalon = async (req, res) => {
  try {
    const salon = await Salon.findOne({
      owner: req.user.id,
    });

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: "Salon profile not found.",
      });
    }

    // Get active services count
    const servicesCount = await Service.countDocuments({
      salon: salon._id,
      isActive: true,
    });

    // Get working hours
    let workingHours = await WorkingHours.findOne({
      salon: salon._id,
    });

    // Create default working hours if they don't exist
    if (!workingHours) {
      workingHours = await WorkingHours.create({
        salon: salon._id,
      });
    }

    const currentIsOpen = calculateSalonOpenStatus(salon, workingHours);

    res.status(200).json({
      success: true,
      salon: {
        ...salon.toObject(),
        isOpen: currentIsOpen,
      },
      servicesCount,
      workingHours,
    });
  } catch (error) {
    console.error("Get my salon error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// Create salon profile
const createSalon = async (req, res) => {
  try {
    // Only salon owners can create a salon
    if (req.user.role !== "salon") {
      return res.status(403).json({
        success: false,
        message: "Only salon owners can create a salon.",
      });
    }

    // Check whether owner already has a salon
    const existingSalon = await Salon.findOne({
      owner: req.user.id,
    });

    if (existingSalon) {
      return res.status(400).json({
        success: false,
        message: "You already have a salon profile.",
      });
    }

    const { name, about, location, phone, email } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Salon name is required.",
      });
    }

    const salon = await Salon.create({
      owner: req.user.id,
      name,
      about,
      location,
      phone,
      email,
      approvalStatus: "Pending",
      isListed: false,
      isOpen: false,
    });

    res.status(201).json({
      success: true,
      message: "Salon profile created successfully.",
      salon,
    });
  } catch (error) {
    console.error("Create salon error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update salon profile
const updateSalon = async (req, res) => {
  try {
    const salon = await Salon.findOne({
      owner: req.user.id,
    });

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: "Salon profile not found.",
      });
    }

    const { name, about, location, phone, email } = req.body;

    if (name !== undefined) {
      salon.name = name;
    }

    if (about !== undefined) {
      salon.about = about;
    }

    if (location !== undefined) {
      salon.location = location;
    }

    if (phone !== undefined) {
      salon.phone = phone;
    }

    if (email !== undefined) {
      salon.email = email;
    }

    await salon.save();

    res.status(200).json({
      success: true,
      message: "Salon profile updated successfully.",
      salon,
    });
  } catch (error) {
    console.error("Update salon error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Upload salon profile image
const uploadSalonProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Salon image is required.",
      });
    }

    const salon = await Salon.findOne({
      owner: req.user.id,
    });

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: "Salon profile not found.",
      });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "salonhub/salon-images",
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

    salon.profileImage = uploadResult.secure_url;

    await salon.save();

    res.status(200).json({
      success: true,
      message: "Salon image uploaded successfully.",
      salon,
    });
  } catch (error) {
    console.error("Salon image upload error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload salon image.",
    });
  }
};

// Toggle salon visibility
const toggleSalonVisibility = async (req, res) => {
  try {
    const salon = await Salon.findOne({
      owner: req.user.id,
    });

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: "Salon profile not found.",
      });
    }

    salon.isListed = !salon.isListed;

    await salon.save();

    res.status(200).json({
      success: true,
      message: salon.isListed
        ? "Salon is now visible on Rupiva."
        : "Salon is now hidden from Rupiva.",
      isListed: salon.isListed,
    });
  } catch (error) {
    console.error("Toggle salon visibility error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Toggle salon open/closed status
const toggleSalonStatus = async (req, res) => {
  try {
    const salon = await Salon.findOne({
      owner: req.user.id,
    });

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: "Salon profile not found.",
      });
    }

    salon.isOpen = !salon.isOpen;

    await salon.save();

    res.status(200).json({
      success: true,
      message: salon.isOpen ? "Salon is now open." : "Salon is now closed.",
      isOpen: salon.isOpen,
    });
  } catch (error) {
    console.error("Toggle salon status error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get salons visible to customers
// Get salons visible to customers
const getPublicSalons = async (req, res) => {
  try {
    const salons = await Salon.find({
      approvalStatus: "Approved",
      isListed: true,
    }).sort({ createdAt: -1 });

    const salonsWithServices = await Promise.all(
      salons.map(async (salon) => {
        const services = await Service.find({
          salon: salon._id,
          isActive: true,
        }).sort({ createdAt: -1 });

        const workingHours = await WorkingHours.findOne({
          salon: salon._id,
        });

        const currentIsOpen = calculateSalonOpenStatus(salon, workingHours);

        const lowestPrice =
          services.length > 0
            ? Math.min(...services.map((service) => service.price))
            : null;

        return {
          _id: salon._id,
          name: salon.name,
          profileImage: salon.profileImage,
          about: salon.about,
          location: salon.location,
          phone: salon.phone,
          email: salon.email,
          isListed: salon.isListed,
          isOpen: currentIsOpen,
          approvalStatus: salon.approvalStatus,
          services,
          price: lowestPrice,
          priceLabel:
            lowestPrice !== null
              ? `₹${lowestPrice} Onwards`
              : "Price unavailable",
        };
      }),
    );

    res.status(200).json({
      success: true,
      salons: salonsWithServices,
    });
  } catch (error) {
    console.error("Get public salons error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get complete details of a public salon
const getPublicSalonDetails = async (req, res) => {
  try {
    const salon = await Salon.findOne({
      _id: req.params.salonId,
      approvalStatus: "Approved",
      isListed: true,
    });

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: "Salon not found.",
      });
    }

    const services = await Service.find({
      salon: salon._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    let workingHours = await WorkingHours.findOne({
      salon: salon._id,
    });

    if (!workingHours) {
      workingHours = await WorkingHours.create({
        salon: salon._id,
      });
    }

    const currentIsOpen = calculateSalonOpenStatus(salon, workingHours);

    const startingPrice =
      services.length > 0
        ? Math.min(...services.map((service) => service.price))
        : null;

    res.status(200).json({
      success: true,
      salon: {
        _id: salon._id,
        name: salon.name,
        profileImage: salon.profileImage,
        about: salon.about,
        location: salon.location,
        phone: salon.phone,
        email: salon.email,
        isListed: salon.isListed,
        isOpen: currentIsOpen,
        approvalStatus: salon.approvalStatus,

        services,

        workingHours,

        startingPrice,
        priceLabel:
          startingPrice !== null
            ? `₹${startingPrice} Onwards`
            : "Price unavailable",
      },
    });
  } catch (error) {
    console.error("Get public salon details error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getMySalon,
  createSalon,
  updateSalon,
  toggleSalonVisibility,
  toggleSalonStatus,
  uploadSalonProfileImage,
  getPublicSalons,
  getPublicSalonDetails,
};
