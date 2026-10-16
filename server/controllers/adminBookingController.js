const Booking = require("../models/Booking");
const { processCancellationRefund } = require("./bookingController");

// ========================================
// GET ALL BOOKINGS FOR ADMIN
// ========================================
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user", "fullName email phone profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get all bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// UPDATE BOOKING STATUS FOR ADMIN
// ========================================

const updateAdminBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Completed", "Cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status.",
      });
    }

    const booking = await Booking.findById(req.params.id).populate(
      "user",
      "fullName email phone profileImage",
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    if (booking.status === "Completed" || booking.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "This appointment can no longer be modified.",
      });
    }

    let refundResult = null;

    if (status === "Cancelled") {
      booking.status = "Cancelled";
      booking.cancelledAt = new Date();

      // Initiate refund for an eligible prepaid booking
      refundResult = await processCancellationRefund(booking);
    } else {
      booking.status = "Completed";
    }

    await booking.save();

    return res.status(200).json({
      success: true,
      message:
        status === "Cancelled"
          ? "Appointment cancelled successfully."
          : "Appointment marked as Completed.",
      booking,
      ...(refundResult ? { refund: refundResult } : {}),
    });
  } catch (error) {
    console.error("Admin update booking status error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// MARK PAYMENT RECEIVED FOR ADMIN
// ========================================
const markAdminBookingPaymentReceived = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

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
    console.error("Admin record payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to record payment.",
    });
  }
};

module.exports = {
  getAllBookings,
  updateAdminBookingStatus,
  markAdminBookingPaymentReceived,
};
