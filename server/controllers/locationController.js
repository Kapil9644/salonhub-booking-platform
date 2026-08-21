exports.reverseGeocode = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude are required.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Location received successfully.",
      coordinates: {
        latitude,
        longitude,
      },
    });
  } catch (error) {
    console.error("Reverse geocoding error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process location.",
    });
  }
};
