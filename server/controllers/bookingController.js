const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Salon = require("../models/Salon");
const WorkingHours = require("../models/WorkingHours");
// ========================================

// ========================================
// BOOKING DATE/TIME HELPERS
// ========================================

// Convert frontend time like "10:00 AM" or "09:00 PM"
// into 24-hour format like "10:00" or "21:00"
const convertTimeTo24Hour = (time) => {
  if (!time || typeof time !== "string") {
    return null;
  }

  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    return null;
  }

  let hours = Number(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();

  if (hours < 1 || hours > 12) {
    return null;
  }

  if (period === "AM") {
    if (hours === 12) {
      hours = 0;
    }
  } else {
    if (hours !== 12) {
      hours += 12;
    }
  }

  return `${String(hours).padStart(2, "0")}:${minutes}`;
};

// Get weekday name for a booking date using India timezone
const getBookingDayName = (date) => {
  const bookingDate = new Date(`${date}T12:00:00+05:30`);

  if (Number.isNaN(bookingDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
  })
    .format(bookingDate)
    .toLowerCase();
};

const timeToMinutes = (time) => {
  if (!time || typeof time !== "string") {
    return null;
  }

  const [hours, minutes] = time.split(":").map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
};

// Validate booking time against salon working hours
const validateBookingTime = async (salonId, date, time, totalDuration = 0) => {
  const dayName = getBookingDayName(date);
  const bookingTime = convertTimeTo24Hour(time);

  if (!dayName || !bookingTime) {
    return {
      valid: false,
      message: "Invalid booking date or time.",
    };
  }

  const workingHours = await WorkingHours.findOne({
    salon: salonId,
  });

  if (!workingHours) {
    return {
      valid: false,
      message: "Salon working hours are not configured.",
    };
  }

  const dayHours = workingHours[dayName];

  if (!dayHours || !dayHours.isOpen) {
    return {
      valid: false,
      message: "The salon is closed on the selected date.",
    };
  }

  if (!dayHours.openTime || !dayHours.closeTime) {
    return {
      valid: false,
      message: "Salon working hours are not properly configured.",
    };
  }

  const bookingStartMinutes = timeToMinutes(bookingTime);
  const closingMinutes = timeToMinutes(dayHours.closeTime);

  if (bookingStartMinutes === null || closingMinutes === null) {
    return {
      valid: false,
      message: "Salon working hours are not properly configured.",
    };
  }

  // Booking must start within salon working hours.
  if (
    bookingStartMinutes < timeToMinutes(dayHours.openTime) ||
    bookingStartMinutes >= closingMinutes
  ) {
    return {
      valid: false,
      message: `This time slot is outside the salon's working hours (${dayHours.openTime} - ${dayHours.closeTime}).`,
    };
  }

  // The complete service duration must finish before or exactly at closing time.
  const bookingEndMinutes = bookingStartMinutes + Number(totalDuration || 0);

  if (bookingEndMinutes > closingMinutes) {
    return {
      valid: false,
      message: `This booking cannot be completed within the salon's working hours. The salon closes at ${dayHours.closeTime}.`,
    };
  }

  return {
    valid: true,
  };
};

const hasBookingTimeOverlap = async (
  salonId,
  date,
  bookingTime,
  bookingDuration,
  excludeBookingId = null,
) => {
  const requestedStartMinutes = timeToMinutes(convertTimeTo24Hour(bookingTime));

  if (requestedStartMinutes === null) {
    return false;
  }

  const requestedEndMinutes =
    requestedStartMinutes + Number(bookingDuration || 0);

  const existingBookingsQuery = {
    "salon.id": salonId,
    date: new Date(date),
    status: "Upcoming",
  };

  if (excludeBookingId) {
    existingBookingsQuery._id = {
      $ne: excludeBookingId,
    };
  }

  const existingBookings = await Booking.find(existingBookingsQuery).select(
    "time totalDuration",
  );

  return existingBookings.some((booking) => {
    const existingStartMinutes = timeToMinutes(
      convertTimeTo24Hour(booking.time),
    );

    if (existingStartMinutes === null) {
      return false;
    }

    const existingEndMinutes =
      existingStartMinutes + Number(booking.totalDuration || 0);

    return (
      requestedStartMinutes < existingEndMinutes &&
      requestedEndMinutes > existingStartMinutes
    );
  });
};

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

    // Check whether the requested time overlaps with an existing booking
    const hasOverlap = await hasBookingTimeOverlap(
      salonData._id,
      date,
      time,
      totalDuration,
    );

    if (hasOverlap) {
      return res.status(400).json({
        success: false,
        message:
          "This time slot overlaps with an existing booking. Please select another time.",
      });
    }

    // Validate booking time including total service duration
    const workingHoursValidation = await validateBookingTime(
      salonData._id,
      date,
      time,
      totalDuration,
    );

    if (!workingHoursValidation.valid) {
      return res.status(400).json({
        success: false,
        message: workingHoursValidation.message,
      });
    }

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

    // Salon must be approved and listed
    if (salonData.approvalStatus !== "Approved" || !salonData.isListed) {
      return res.status(400).json({
        success: false,
        message: "This salon is currently unavailable for booking.",
      });
    }

    // Validate selected date and time against salon working hours

    // Check whether the new salon/date/time slot is already booked
    // Exclude the current booking itself.

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

    // Check whether the new time overlaps with another existing booking
    // Exclude the current booking itself.
    const hasOverlap = await hasBookingTimeOverlap(
      salonData._id,
      date,
      time,
      totalDuration,
      booking._id,
    );

    if (hasOverlap) {
      return res.status(400).json({
        success: false,
        message:
          "This time slot overlaps with an existing booking. Please select another time.",
      });
    }

    // Validate booking time including total service duration
    const workingHoursValidation = await validateBookingTime(
      salonData._id,
      date,
      time,
      totalDuration,
    );

    if (!workingHoursValidation.valid) {
      return res.status(400).json({
        success: false,
        message: workingHoursValidation.message,
      });
    }

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

// ========================================
// GET BOOKED TIME SLOTS FOR A SALON + DATE
// ========================================
const getBookedSlots = async (req, res) => {
  try {
    const { salonId, date } = req.query;

    if (!salonId || !date) {
      return res.status(400).json({
        success: false,
        message: "Salon ID and date are required.",
      });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format.",
      });
    }

    // Booking dates are currently stored from YYYY-MM-DD,
    // so query the complete UTC day.
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    const bookings = await Booking.find({
      "salon.id": salonId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
      status: "Upcoming",
    }).select("time totalDuration");

    const bookedSlots = bookings.map((booking) => ({
      time: booking.time,
      duration: booking.totalDuration,
    }));

    res.status(200).json({
      success: true,
      bookedSlots,
    });
  } catch (error) {
    console.error("Get booked slots error:", error);

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
  getBookedSlots,
};
