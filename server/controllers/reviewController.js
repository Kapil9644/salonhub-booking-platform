const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Salon = require("../models/Salon");
const { createNotification } = require("../utils/notificationService");

// ========================================
// CREATE REVIEW
// ========================================
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || rating === undefined || !comment?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Booking, rating and comment are required.",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a whole number between 1 and 5.",
      });
    }

    const trimmedComment = comment.trim();

    if (trimmedComment.length < 3 || trimmedComment.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Review must be between 3 and 1000 characters.",
      });
    }

    // Find the customer's booking
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Only completed bookings can be reviewed
    if (booking.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Only completed bookings can be reviewed.",
      });
    }

    // Check whether this booking has already been reviewed
    const existingReview = await Review.findOne({
      booking: booking._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this booking.",
      });
    }

    const review = await Review.create({
      customer: req.user.id,
      salon: booking.salon.id,
      booking: booking._id,
      rating: numericRating,
      comment: trimmedComment,
    });

    const salon = await Salon.findById(booking.salon.id);

    if (salon?.owner) {
      await createNotification({
        recipient: salon.owner,
        type: "NEW_REVIEW",
        title: "New Review",
        message: `A new ${numericRating}-star review has been submitted for ${salon.name}.`,
        relatedBooking: booking._id,
      });
    }

    const populatedReview = await Review.findById(review._id)
      .populate("customer", "fullName profileImage")
      .lean();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review: populatedReview,
    });
  } catch (error) {
    console.error("Create review error:", error);

    // Handles the unique booking index safely
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this booking.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// UPDATE REVIEW
// ========================================
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (rating === undefined || !comment?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rating and comment are required.",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a whole number between 1 and 5.",
      });
    }

    const trimmedComment = comment.trim();

    if (trimmedComment.length < 3 || trimmedComment.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Review must be between 3 and 1000 characters.",
      });
    }

    const review = await Review.findOne({
      _id: reviewId,
      customer: req.user.id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    review.rating = numericRating;
    review.comment = trimmedComment;

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate("customer", "fullName profileImage")
      .lean();

    res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Update review error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// GET REVIEW FOR A BOOKING
// ========================================
const getBookingReview = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const review = await Review.findOne({
      booking: booking._id,
      customer: req.user.id,
    })
      .populate("customer", "fullName profileImage")
      .lean();

    res.status(200).json({
      success: true,
      review: review || null,
    });
  } catch (error) {
    console.error("Get booking review error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// GET REVIEWS FOR A SALON
// ========================================
const getSalonReviews = async (req, res) => {
  try {
    const { salonId } = req.params;

    const reviews = await Review.find({
      salon: salonId,
    })
      .populate("customer", "fullName profileImage")
      .sort({ createdAt: -1 })
      .lean();

    const totalReviews = reviews.length;

    const totalRating = reviews.reduce(
      (total, review) => total + review.rating,
      0,
    );

    const averageRating =
      totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(1)) : null;

    res.status(200).json({
      success: true,
      reviews,
      totalReviews,
      averageRating,
    });
  } catch (error) {
    console.error("Get salon reviews error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getSalonOwnerReviews = async (req, res) => {
  try {
    // Find the salon belonging to the logged-in owner.
    // Confirm that "owner" matches the field in your Salon schema.
    const salon = await Salon.findOne({ owner: req.user.id }).select(
      "_id name",
    );

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: "Salon not found for this owner.",
      });
    }

    const reviews = await Review.find({ salon: salon._id })
      .populate("customer", "fullName profileImage")
      .populate("booking", "date time services status")
      .sort({ createdAt: -1 })
      .lean();

    const totalReviews = reviews.length;

    const totalRating = reviews.reduce(
      (total, review) => total + review.rating,
      0,
    );

    const averageRating =
      totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(1)) : 0;

    const ratingBreakdown = {
      5: reviews.filter((review) => review.rating === 5).length,
      4: reviews.filter((review) => review.rating === 4).length,
      3: reviews.filter((review) => review.rating === 3).length,
      2: reviews.filter((review) => review.rating === 2).length,
      1: reviews.filter((review) => review.rating === 1).length,
    };

    return res.status(200).json({
      success: true,
      salon: {
        id: salon._id,
        name: salon.name,
      },
      reviews,
      totalReviews,
      averageRating,
      ratingBreakdown,
    });
  } catch (error) {
    console.error("Get salon owner reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createReview,
  updateReview,
  getBookingReview,
  getSalonReviews,
  getSalonOwnerReviews,
};
