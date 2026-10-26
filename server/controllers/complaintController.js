const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");
const Salon = require("../models/Salon");
const getUserId = (req) => req.user?._id || req.user?.id;

const createComplaint = async (req, res) => {
  try {
    const { category, subject, description, bookingId } = req.body;

    if (
      typeof category !== "string" ||
      typeof subject !== "string" ||
      typeof description !== "string" ||
      !category.trim() ||
      !subject.trim() ||
      !description.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Category, subject and description are required.",
      });
    }

    const complaintData = {
      customer: getUserId(req),
      category: category.trim(),
      subject: subject.trim(),
      description: description.trim(),
      bookingId: typeof bookingId === "string" ? bookingId.trim() : "",
    };

    const complaint = await Complaint.create(complaintData);

    return res.status(201).json({
      success: true,
      message: "Complaint registered successfully.",
      complaint: {
        complaintId: complaint.complaintId,
        category: complaint.category,
        subject: complaint.subject,
        description: complaint.description,
        bookingId: complaint.bookingId,
        status: complaint.status,
        adminResponse: complaint.adminResponse,
        createdAt: complaint.createdAt,
      },
    });
  } catch (error) {
    console.error("Create complaint error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to register complaint.",
    });
  }
};

const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      customer: getUserId(req),
    })
      .select("-customer -__v")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, complaints });
  } catch (error) {
    console.error("Get customer complaints error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load your complaints.",
    });
  }
};

const trackComplaint = async (req, res) => {
  try {
    const complaintId = req.params.complaintId.trim().toUpperCase();

    const complaint = await Complaint.findOne({
      complaintId,
      customer: getUserId(req),
    }).select("-customer -__v");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found in your account.",
      });
    }

    return res.status(200).json({ success: true, complaint });
  } catch (error) {
    console.error("Track complaint error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to track complaint.",
    });
  }
};

// ADMIN: Get all complaints with customer details

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("customer", "name fullName username email")
      .populate("salonOwner", "name fullName username email")
      .sort({ createdAt: -1 })
      .lean();

    const salonOwnerIds = [
      ...new Set(
        complaints
          .filter((complaint) => complaint.submitterType === "salon")
          .map((complaint) => complaint.salonOwner?._id?.toString())
          .filter(Boolean),
      ),
    ];

    const salons = await Salon.find({
      owner: { $in: salonOwnerIds },
    })
      .select("name owner")
      .lean();

    const salonNameByOwnerId = new Map(
      salons.map((salon) => [salon.owner.toString(), salon.name]),
    );

    const formattedComplaints = complaints.map((complaint) => {
      if (complaint.submitterType !== "salon") {
        return complaint;
      }

      const ownerId = complaint.salonOwner?._id?.toString();

      return {
        ...complaint,
        salonName: ownerId
          ? salonNameByOwnerId.get(ownerId) || "Salon name unavailable"
          : "Salon name unavailable",
      };
    });

    return res.status(200).json({
      success: true,
      complaints: formattedComplaints,
    });
  } catch (error) {
    console.error("Admin get complaints error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load complaints.",
    });
  }
};

// ADMIN: Update complaint status and response
const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint ID.",
      });
    }

    const allowedStatuses = ["Open", "In Progress", "Resolved", "Closed"];

    if (status !== undefined && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status.",
      });
    }

    if (
      adminResponse !== undefined &&
      (typeof adminResponse !== "string" || adminResponse.length > 2000)
    ) {
      return res.status(400).json({
        success: false,
        message: "Admin response must be text of at most 2000 characters.",
      });
    }

    const updates = {};

    if (status !== undefined) updates.status = status;
    if (adminResponse !== undefined) {
      updates.adminResponse = adminResponse.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide a status or admin response to update.",
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("customer", "name fullName username email")
      .populate("salonOwner", "name fullName username email");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Admin update complaint error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update complaint.",
    });
  }
};

const createSalonOwnerComplaint = async (req, res) => {
  try {
    const { category, subject, description, bookingId } = req.body;
    const ownerId = req.user?.id || req.user?._id;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Salon owner authentication required.",
      });
    }

    if (
      typeof category !== "string" ||
      typeof subject !== "string" ||
      typeof description !== "string" ||
      !category.trim() ||
      !subject.trim() ||
      !description.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Category, subject and description are required.",
      });
    }

    const complaint = await Complaint.create({
      submitterType: "salon",
      salonOwner: ownerId,
      category: category.trim(),
      subject: subject.trim(),
      description: description.trim(),
      bookingId: typeof bookingId === "string" ? bookingId.trim() : "",
    });

    return res.status(201).json({
      success: true,
      message: "Support request submitted successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Create salon owner complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit support request.",
    });
  }
};

const getMySalonOwnerComplaints = async (req, res) => {
  try {
    const ownerId = req.user?.id || req.user?._id;

    const complaints = await Complaint.find({
      salonOwner: ownerId,
      submitterType: "salon",
    })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      complaints,
    });
  } catch (error) {
    console.error("Get salon owner complaints error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load your support requests.",
    });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  trackComplaint,
  getAllComplaints,
  updateComplaint,
  createSalonOwnerComplaint,
  getMySalonOwnerComplaints,
};
