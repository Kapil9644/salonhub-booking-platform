const Booking = require("../models/Booking");

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { salon, service, date, time } = req.body;

    if (!salon || !service || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Salon, service, date and time are required.",
      });
    }

    const booking = await Booking.create({
      user: req.user.id,
      salon,
      service,
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

// Get bookings of logged-in user
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

// Edit an existing booking
const updateBooking = async (req, res) => {
  try {
    const { salon, service, date, time } = req.body;

    if (!salon || !service || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Salon, service, date and time are required.",
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

    booking.salon = salon;
    booking.service = service;
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

// Cancel an existing booking
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
