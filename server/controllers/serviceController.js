const Service = require("../models/Service");
const Salon = require("../models/Salon");

// Get services of the logged-in salon owner
const getMyServices = async (req, res) => {
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

    const services = await Service.find({
      salon: salon._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    console.error("Get my services error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get active services of a public salon
const getPublicSalonServices = async (req, res) => {
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

    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    console.error("Get public salon services error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get all public salon services for customer service discovery
const getPublicServiceCatalog = async (req, res) => {
  try {
    const services = await Service.aggregate([
      {
        $match: {
          isActive: true,
        },
      },

      {
        $lookup: {
          from: "salons",
          localField: "salon",
          foreignField: "_id",
          as: "salonData",
        },
      },

      {
        $unwind: "$salonData",
      },

      {
        $match: {
          "salonData.approvalStatus": "Approved",
          "salonData.isListed": true,
        },
      },

      {
        $project: {
          _id: 1,

          name: 1,
          category: 1,
          description: 1,
          price: 1,
          duration: 1,
          isActive: 1,

          salonId: "$salonData._id",
          salonName: "$salonData.name",
        },
      },

      {
        $sort: {
          category: 1,
          name: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    console.error("Get public service catalog error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Create a service
const createService = async (req, res) => {
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

    const { category, name, description, price, duration, globalService } =
      req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Service category is required.",
      });
    }

    if (!name || price === undefined || duration === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, price and duration are required.",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative.",
      });
    }

    if (Number(duration) < 1) {
      return res.status(400).json({
        success: false,
        message: "Duration must be at least 1 minute.",
      });
    }

    const service = await Service.create({
      salon: salon._id,
      category,
      name,
      description,
      price: Number(price),
      duration: Number(duration),
      globalService: globalService || null,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully.",
      service,
    });
  } catch (error) {
    console.error("Create service error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update a service
const updateService = async (req, res) => {
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

    const service = await Service.findOne({
      _id: req.params.id,
      salon: salon._id,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    const {
      category,
      name,
      description,
      price,
      duration,
      isActive,
      globalService,
    } = req.body;

    if (category !== undefined) {
      service.category = category || "Other";
    }

    if (name !== undefined) {
      service.name = name;
    }

    if (description !== undefined) {
      service.description = description;
    }

    if (price !== undefined) {
      if (Number(price) < 0) {
        return res.status(400).json({
          success: false,
          message: "Price cannot be negative.",
        });
      }

      service.price = Number(price);
    }

    if (duration !== undefined) {
      if (Number(duration) < 1) {
        return res.status(400).json({
          success: false,
          message: "Duration must be at least 1 minute.",
        });
      }

      service.duration = Number(duration);
    }

    if (isActive !== undefined) {
      service.isActive = Boolean(isActive);
    }

    if (globalService !== undefined) {
      service.globalService = globalService || null;
    }

    await service.save();

    res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      service,
    });
  } catch (error) {
    console.error("Update service error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete a service
const deleteService = async (req, res) => {
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

    const service = await Service.findOne({
      _id: req.params.id,
      salon: salon._id,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: "Service deleted successfully.",
    });
  } catch (error) {
    console.error("Delete service error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getMyServices,
  getPublicSalonServices,
  getPublicServiceCatalog,
  createService,
  updateService,
  deleteService,
};
