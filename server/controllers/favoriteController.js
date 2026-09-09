const User = require("../models/User");
const Salon = require("../models/Salon");

// TOGGLE FAVORITE SALON
const toggleFavoriteSalon = async (req, res) => {
  try {
    const { salonId } = req.params;

    if (!salonId) {
      return res.status(400).json({
        success: false,
        message: "Salon ID is required.",
      });
    }

    const salon = await Salon.findOne({
      _id: salonId,
      approvalStatus: "Approved",
      isListed: true,
    });

    if (!salon) {
      return res.status(404).json({
        success: false,
        message: "Salon not found.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const alreadyFavorite = user.favoriteSalons.some(
      (id) => id.toString() === salonId,
    );

    if (alreadyFavorite) {
      user.favoriteSalons = user.favoriteSalons.filter(
        (id) => id.toString() !== salonId,
      );

      await user.save();

      return res.status(200).json({
        success: true,
        isFavorite: false,
        message: "Salon removed from favorites.",
      });
    }

    user.favoriteSalons.push(salon._id);

    await user.save();

    return res.status(200).json({
      success: true,
      isFavorite: true,
      message: "Salon added to favorites.",
    });
  } catch (error) {
    console.error("Toggle favorite salon error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET CUSTOMER FAVORITES
const getFavoriteSalons = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "favoriteSalons",
      match: {
        approvalStatus: "Approved",
        isListed: true,
      },
      select:
        "name profileImage about location phone email isListed approvalStatus",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      salons: user.favoriteSalons || [],
    });
  } catch (error) {
    console.error("Get favorite salons error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  toggleFavoriteSalon,
  getFavoriteSalons,
};
