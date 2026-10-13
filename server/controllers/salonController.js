const cloudinary = require("../config/cloudinary");
const Salon = require("../models/Salon");
const Service = require("../models/Service");
const WorkingHours = require("../models/WorkingHours");
const Review = require("../models/Review");

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

const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Get salons visible to customers

const getPublicSalons = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 20),
    );

    const searchText = String(req.query.search || "").trim();
    const selectedLocation = String(req.query.location || "").trim();
    const selectedPincode = String(req.query.pincode || "").trim();
    const serviceCategory = String(req.query.serviceCategory || "").trim();
    const minimumRating = Math.min(
      5,
      Math.max(0, Number(req.query.rating) || 0),
    );
    const openNow = req.query.openNow === "true";
    const sortBy = String(req.query.sort || "Nearest");

    const customerLat = Number(req.query.latitude);
    const customerLon = Number(req.query.longitude);

    const hasCustomerCoordinates =
      req.query.latitude !== undefined &&
      req.query.longitude !== undefined &&
      Number.isFinite(customerLat) &&
      Number.isFinite(customerLon) &&
      customerLat >= -90 &&
      customerLat <= 90 &&
      customerLon >= -180 &&
      customerLon <= 180;

    const escapeRegex = (value = "") =>
      value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const baseFilter = {
      approvalStatus: "Approved",
      isListed: true,
    };

    const andFilters = [];

    // Search salon name, address, area, city, state and pincode.
    if (searchText) {
      const regex = new RegExp(escapeRegex(searchText), "i");

      const matchingServices = await Service.distinct("salon", {
        isActive: true,
        name: regex,
      });

      andFilters.push({
        $or: [
          { name: regex },
          { "location.address": regex },
          { "location.area": regex },
          { "location.city": regex },
          { "location.state": regex },
          { "location.pincode": regex },
          { _id: { $in: matchingServices } },
        ],
      });
    }

    // Explicit location filter.
    if (selectedLocation) {
      const locationRegex = new RegExp(escapeRegex(selectedLocation), "i");

      andFilters.push({
        $or: [
          { "location.area": locationRegex },
          { "location.city": locationRegex },
          { "location.state": locationRegex },
        ],
      });
    }

    // Exact pincode filter.
    if (selectedPincode) {
      baseFilter["location.pincode"] = selectedPincode;
    }

    // Service category filter.
    if (serviceCategory) {
      const matchingServices = await Service.distinct("salon", {
        isActive: true,
        category: new RegExp(`^${escapeRegex(serviceCategory)}$`, "i"),
      });

      andFilters.push({
        _id: { $in: matchingServices },
      });
    }

    if (andFilters.length) {
      baseFilter.$and = andFilters;
    }

    // Fetch candidate salons and related data in batches of queries.
    const candidates = await Salon.find(baseFilter)
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    if (!candidates.length) {
      return res.status(200).json({
        success: true,
        salons: [],
        pagination: {
          totalSalons: 0,
          currentPage: page,
          limit,
          totalPages: 0,
          hasMore: false,
        },
      });
    }

    const salonIds = candidates.map((salon) => salon._id);

    const [services, workingHoursList, reviewStats] = await Promise.all([
      Service.find({
        salon: { $in: salonIds },
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .lean(),

      WorkingHours.find({
        salon: { $in: salonIds },
      }).lean(),

      Review.aggregate([
        { $match: { salon: { $in: salonIds } } },
        {
          $group: {
            _id: "$salon",
            totalReviews: { $sum: 1 },
            averageRating: { $avg: "$rating" },
          },
        },
      ]),
    ]);

    const servicesBySalon = new Map();
    for (const service of services) {
      const key = String(service.salon);

      if (!servicesBySalon.has(key)) {
        servicesBySalon.set(key, []);
      }

      servicesBySalon.get(key).push(service);
    }

    const hoursBySalon = new Map(
      workingHoursList.map((hours) => [String(hours.salon), hours]),
    );

    const reviewsBySalon = new Map(
      reviewStats.map((stats) => [String(stats._id), stats]),
    );

    // Build public response objects before filtering and pagination.
    let results = candidates.map((salon) => {
      const key = String(salon._id);
      const salonServices = servicesBySalon.get(key) || [];
      const stats = reviewsBySalon.get(key);

      const totalReviews = stats?.totalReviews || 0;
      const averageRating =
        totalReviews > 0 ? Number(stats.averageRating.toFixed(1)) : null;

      const lowestPrice =
        salonServices.length > 0
          ? Math.min(...salonServices.map((service) => service.price))
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
        isOpen: calculateSalonOpenStatus(salon, hoursBySalon.get(key)),
        rating: averageRating,
        reviews: totalReviews,
        approvalStatus: salon.approvalStatus,
        services: salonServices,
        price: lowestPrice,
        priceLabel:
          lowestPrice !== null
            ? `₹${lowestPrice} Onwards`
            : "Price unavailable",
        _createdAt: salon.createdAt,

        distance:
          hasCustomerCoordinates &&
          Number.isFinite(salon.location?.latitude) &&
          Number.isFinite(salon.location?.longitude)
            ? Number(
                calculateDistanceKm(
                  customerLat,
                  customerLon,
                  salon.location.latitude,
                  salon.location.longitude,
                ).toFixed(2),
              )
            : null,
      };
    });

    // Minimum rating filter.
    if (minimumRating > 0) {
      results = results.filter(
        (salon) => salon.rating !== null && salon.rating >= minimumRating,
      );
    }

    // Price filter uses the lowest active service price.
    const priceRange = String(req.query.price || "Any Price");

    if (priceRange === "₹0 - ₹500") {
      results = results.filter(
        (salon) =>
          salon.price !== null && salon.price >= 0 && salon.price <= 500,
      );
    } else if (priceRange === "₹500 - ₹1000") {
      results = results.filter(
        (salon) =>
          salon.price !== null && salon.price > 500 && salon.price <= 1000,
      );
    } else if (priceRange === "₹1000+") {
      results = results.filter(
        (salon) => salon.price !== null && salon.price > 1000,
      );
    }

    // Currently open salons only.
    if (openNow) {
      results = results.filter((salon) => salon.isOpen);
    }

    // Sorting.
    if (sortBy === "Highest Rated") {
      results.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
    } else if (sortBy === "Lowest Price") {
      results.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    } else if (sortBy === "Highest Price") {
      results.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    } else if (sortBy === "Most Popular") {
      results.sort((a, b) => b.reviews - a.reviews);
    } else {
      if (sortBy === "Nearest" && hasCustomerCoordinates) {
        results.sort((a, b) => {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });
      } else {
        results.sort(
          (a, b) => new Date(b._createdAt || 0) - new Date(a._createdAt || 0),
        );
      }
    }

    const totalSalons = results.length;
    const totalPages = Math.ceil(totalSalons / limit);
    const startIndex = (page - 1) * limit;

    const paginatedSalons = results
      .slice(startIndex, startIndex + limit)
      .map(({ _createdAt, ...salon }) => salon);

    return res.status(200).json({
      success: true,
      salons: paginatedSalons,
      pagination: {
        totalSalons,
        currentPage: page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Get public salons error:", error);

    return res.status(500).json({
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

    const reviews = await Review.find({
      salon: salon._id,
    }).select("rating");

    const totalReviews = reviews.length;

    const totalRating = reviews.reduce(
      (total, review) => total + review.rating,
      0,
    );

    const averageRating =
      totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(1)) : null;

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
        rating: averageRating,
        reviews: totalReviews,

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
