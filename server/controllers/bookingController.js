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

module.exports = {
  createBooking,
  getMyBookings,
};
