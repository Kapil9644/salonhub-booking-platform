const Booking = require("../models/Booking");
const Salon = require("../models/Salon");

// ========================================
// GET APPOINTMENTS FOR LOGGED-IN SALON OWNER
// ========================================
const getSalonOwnerAppointments = async (req, res) => {
  try {
    const salon = await Salon.findOne({
      owner: req.user.id,
    });

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: "Salon not found.",
      });
    }

    const bookings = await Booking.find({
      "salon.id": salon._id,
    })
      .populate("user", "fullName email phone profileImage")
      .sort({
        date: 1,
        time: 1,
      });

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get salon owner appointments error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// UPDATE APPOINTMENT STATUS
// ========================================
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Upcoming", "Completed", "Cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status.",
      });
    }

    // Find salon belonging to logged-in owner
    const salon = await Salon.findOne({
      owner: req.user.id,
    });

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: "Salon not found.",
      });
    }

    // Find booking belonging to this salon
    const booking = await Booking.findOne({
      _id: req.params.id,
      "salon.id": salon._id,
    }).populate("user", "fullname email phone profileImage");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    // Prevent changing completed/cancelled appointments back accidentally
    if (booking.status === "Completed" || booking.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "This appointment can no longer be modified.",
      });
    }

    booking.status = status;

    await booking.save();

    return res.status(200).json({
      success: true,
      message: `Appointment marked as ${status}.`,
      booking,
    });
  } catch (error) {
    console.error("Update appointment status error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const markBookingPaymentReceived = async (req, res) => {
  try {
    const salon = await Salon.findOne({
      owner: req.user.id,
    });

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: "Salon not found.",
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      "salon.id": salon._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (booking.paymentMethod !== "PAY_AFTER_SERVICE") {
      return res.status(400).json({
        success: false,
        message: "This booking does not use Pay After Service.",
      });
    }

    if (booking.paymentStatus === "PAID") {
      return res.status(409).json({
        success: false,
        message: "Payment has already been recorded.",
      });
    }

    if (booking.paymentStatus !== "UNPAID") {
      return res.status(400).json({
        success: false,
        message: "This booking is not eligible for payment confirmation.",
      });
    }

    if (booking.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Complete the appointment before recording payment.",
      });
    }

    booking.paymentStatus = "PAID";
    booking.settlementStatus = "PENDING";

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Payment recorded successfully.",
      booking,
    });
  } catch (error) {
    console.error("Record booking payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to record booking payment.",
    });
  }
};

module.exports = {
  getSalonOwnerAppointments,
  updateAppointmentStatus,
  markBookingPaymentReceived,
};
