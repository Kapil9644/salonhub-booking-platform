const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(
      "Connecting to:",
      process.env.MONGO_URI.replace(/\/\/.*:.*@/, "//****:****@"),
    );

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error("Error Name:", error.name);
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.message);
    console.error(error);

    process.exit(1);
  }
};

module.exports = connectDB;
