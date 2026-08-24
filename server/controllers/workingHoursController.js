const WorkingHours = require("../models/WorkingHours");
const Salon = require("../models/Salon");

// Get working hours of the logged-in salon owner
const getMyWorkingHours = async (req, res) => {
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

    let workingHours = await WorkingHours.findOne({
      salon: salon._id,
    });

    // Create default working hours if they don't exist yet
    if (!workingHours) {
      workingHours = await WorkingHours.create({
        salon: salon._id,
      });
    }

    res.status(200).json({
      success: true,
      workingHours,
    });
  } catch (error) {
    console.error("Get working hours error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update working hours
const updateMyWorkingHours = async (req, res) => {
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

    let workingHours = await WorkingHours.findOne({
      salon: salon._id,
    });

    if (!workingHours) {
      workingHours = await WorkingHours.create({
        salon: salon._id,
      });
    }

    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    days.forEach((day) => {
      if (req.body[day] !== undefined) {
        const { isOpen, openTime, closeTime } = req.body[day];

        if (isOpen !== undefined) {
          workingHours[day].isOpen = Boolean(isOpen);
        }

        if (openTime !== undefined) {
          workingHours[day].openTime = openTime;
        }

        if (closeTime !== undefined) {
          workingHours[day].closeTime = closeTime;
        }
      }
    });

    await workingHours.save();

    res.status(200).json({
      success: true,
      message: "Working hours updated successfully.",
      workingHours,
    });
  } catch (error) {
    console.error("Update working hours error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getMyWorkingHours,
  updateMyWorkingHours,
};
