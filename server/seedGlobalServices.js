const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");
const GlobalService = require("./models/GlobalService");

const globalServices = [
  {
    name: "Haircut",
    category: "Hair",
    description: "Professional haircut and grooming",
    detailedDescription:
      "Get a clean, stylish haircut tailored to your face shape, hair type and preferred look.",
    highlights: ["Hair consultation", "Professional haircut", "Neat finishing"],
    defaultDuration: 30,
    icon: "Scissors",
  },

  {
    name: "Beard Trim",
    category: "Grooming",
    description: "Sharp beard styling and shaping",
    detailedDescription:
      "Keep your beard clean and well-shaped with professional trimming, detailing and finishing.",
    highlights: ["Beard shaping", "Length trimming", "Edge detailing"],
    defaultDuration: 20,
    icon: "UserRound",
  },

  {
    name: "Hair Color",
    category: "Hair",
    description: "Professional hair coloring",
    detailedDescription:
      "Refresh your look with professional hair coloring options designed for your preferred shade and style.",
    highlights: [
      "Color consultation",
      "Professional application",
      "Finishing & styling",
    ],
    defaultDuration: 90,
    icon: "Paintbrush",
  },

  {
    name: "Facial",
    category: "Skin Care",
    description: "Refreshing skincare and facial care",
    detailedDescription:
      "Enjoy a relaxing facial treatment designed to cleanse, refresh and leave your skin looking healthy and glowing.",
    highlights: ["Deep cleansing", "Facial treatment", "Relaxing finish"],
    defaultDuration: 60,
    icon: "Sparkles",
  },

  {
    name: "Manicure",
    category: "Nails",
    description: "Complete hand and nail care",
    detailedDescription:
      "Give your hands and nails a clean, polished look with professional manicure and nail-care treatment.",
    highlights: ["Nail shaping", "Cuticle care", "Hand care"],
    defaultDuration: 45,
    icon: "Hand",
  },

  {
    name: "Styling",
    category: "Hair",
    description: "Party, event and wedding styling",
    detailedDescription:
      "Create a polished look for parties, weddings and special occasions with professional styling tailored to your outfit and event.",
    highlights: [
      "Style consultation",
      "Professional styling",
      "Event-ready finishing",
    ],
    defaultDuration: 60,
    icon: "Brush",
  },

  {
    name: "Massage",
    category: "Spa",
    description: "Relaxing massage and wellness care",
    detailedDescription:
      "Take time to relax with a professional massage experience focused on comfort, relaxation and overall wellness.",
    highlights: [
      "Relaxing massage",
      "Comfort-focused session",
      "Wellness experience",
    ],
    defaultDuration: 45,
    icon: "Hand",
  },

  {
    name: "Eyelash Extensions",
    category: "Beauty",
    description: "Beautiful and defined eyelash styling",
    detailedDescription:
      "Enhance your eye look with professionally applied eyelash extensions for a fuller and more defined appearance.",
    highlights: [
      "Lash consultation",
      "Professional application",
      "Detailed finishing",
    ],
    defaultDuration: 90,
    icon: "Sparkles",
  },

  {
    name: "Lip & Eyebrow Tinting",
    category: "Beauty",
    description: "Natural-looking lip and brow enhancement",
    detailedDescription:
      "Enhance the appearance of your lips and eyebrows with a subtle tint designed to complement your natural features.",
    highlights: [
      "Shade selection",
      "Precise application",
      "Natural-looking finish",
    ],
    defaultDuration: 40,
    icon: "LiaPenSolid",
  },

  {
    name: "Nail Art",
    category: "Nails",
    description: "Creative nail art and designs",
    detailedDescription:
      "Add personality to your nails with creative designs, patterns and decorative finishes for everyday or special occasions.",
    highlights: [
      "Design selection",
      "Creative nail detailing",
      "Finishing & styling",
    ],
    defaultDuration: 60,
    icon: "Paintbrush",
  },
];

const seedGlobalServices = async () => {
  try {
    await connectDB();

    console.log("Seeding global services...");

    for (const service of globalServices) {
      await GlobalService.findOneAndUpdate({ name: service.name }, service, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
    }

    console.log(
      `✅ ${globalServices.length} global services seeded successfully.`,
    );

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Global service seed error:", error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedGlobalServices();
