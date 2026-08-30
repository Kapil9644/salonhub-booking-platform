const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Salon = require("../models/Salon");

// ========================================
// CREATE A NEW BOOKING
// ========================================
const createBooking = async (req, res) => {
  try {
    const { salon, services, date, time } = req.body;

    if (!salon?.id || !services?.length || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Salon, services, date and time are required.",
      });
    }

    // Find salon from database
    const salonData = await Salon.findById(salon.id);

    if (!salonData) {
      return res.status(404).json({
        success: false,
        message: "Salon not found.",
      });
    }

    // Salon must be approved and listed
    if (salonData.approvalStatus !== "Approved" || !salonData.isListed) {
      return res.status(400).json({
        success: false,
        message: "This salon is currently unavailable for booking.",
      });
    }

    // Get service IDs
    const serviceIds = services.map((service) => service.id);

    // Fetch actual active services from database
    const serviceData = await Service.find({
      _id: { $in: serviceIds },
      salon: salonData._id,
      isActive: true,
    });

    // Make sure every selected service exists
    if (serviceData.length !== serviceIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more selected services are invalid.",
      });
    }

    // Prepare booking services using database values
    const bookingServices = serviceData.map((service) => ({
      id: service._id,
      name: service.name,
      price: service.price,
      duration: service.duration,
    }));

    // Calculate totals on server
    const totalPrice = bookingServices.reduce(
      (total, service) => total + service.price,
      0,
    );

    const totalDuration = bookingServices.reduce(
      (total, service) => total + service.duration,
      0,
    );

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,

      salon: {
        id: salonData._id,
        name: salonData.name,

        location: {
          address: salonData.location?.address || "",
          area: salonData.location?.area || "",
          city: salonData.location?.city || "",
          state: salonData.location?.state || "",
          pincode: salonData.location?.pincode || "",
        },
      },

      services: bookingServices,

      totalPrice,
      totalDuration,

      date,
      time,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// GET BOOKINGS OF LOGGED-IN USER
// ========================================
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// EDIT AN EXISTING BOOKING
// ========================================
const updateBooking = async (req, res) => {
  try {
    const { salon, services, date, time } = req.body;

    if (!salon?.id || !services?.length || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Salon, services, date and time are required.",
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.status !== "Upcoming") {
      return res.status(400).json({
        success: false,
        message: "Only upcoming bookings can be edited.",
      });
    }

    const salonData = await Salon.findById(salon.id);

    if (!salonData) {
      return res.status(404).json({
        success: false,
        message: "Salon not found.",
      });
    }

    const serviceIds = services.map((service) => service.id);

    const serviceData = await Service.find({
      _id: { $in: serviceIds },
      salon: salonData._id,
      isActive: true,
    });

    if (serviceData.length !== serviceIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more selected services are invalid.",
      });
    }

    const bookingServices = serviceData.map((service) => ({
      id: service._id,
      name: service.name,
      price: service.price,
      duration: service.duration,
    }));

    const totalPrice = bookingServices.reduce(
      (total, service) => total + service.price,
      0,
    );

    const totalDuration = bookingServices.reduce(
      (total, service) => total + service.duration,
      0,
    );

    booking.salon = {
      id: salonData._id,
      name: salonData.name,

      location: {
        address: salonData.location?.address || "",
        area: salonData.location?.area || "",
        city: salonData.location?.city || "",
        state: salonData.location?.state || "",
        pincode: salonData.location?.pincode || "",
      },
    };

    booking.services = bookingServices;
    booking.totalPrice = totalPrice;
    booking.totalDuration = totalDuration;
    booking.date = date;
    booking.time = time;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking updated successfully.",
      booking,
    });
  } catch (error) {
    console.error("Update booking error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// CANCEL AN EXISTING BOOKING
// ========================================
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.status !== "Upcoming") {
      return res.status(400).json({
        success: false,
        message: "Only upcoming bookings can be cancelled.",
      });
    }

    booking.status = "Cancelled";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  updateBooking,
  cancelBooking,
};
