require("dotenv").config();

const mongoose = require("mongoose");
const Salon = require("./models/Salon");
const Service = require("./models/Service");

const START_PHONE = 6232963000;
const END_PHONE = 6232963059;

// Category-wise relevant images
const IMAGES = {
  Salon: [
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=80",
  ],

  "Beauty Parlour": [
    "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1200&q=80",
  ],

  Spa: [
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=1200&q=80",
  ],
};

// 8 services per category
const SERVICES = {
  Salon: [
    ["Haircut", "Professional haircut tailored to your style.", 150, 30],
    ["Beard Trim", "Neat and professional beard trimming.", 100, 20],
    ["Haircut + Beard", "Complete haircut and beard grooming.", 250, 45],
    ["Hair Styling", "Professional styling for a fresh look.", 200, 30],
    ["Hair Spa", "Deep conditioning and rejuvenating hair spa.", 600, 60],
    ["Hair Coloring", "Professional hair coloring service.", 800, 90],
    ["Head Massage", "Relaxing head massage for stress relief.", 300, 30],
    ["Shaving", "Clean and comfortable professional shave.", 100, 20],
  ],

  "Beauty Parlour": [
    ["Threading", "Professional eyebrow and facial threading.", 80, 15],
    ["Cleanup", "Refreshing skin cleanup.", 250, 30],
    ["Facial", "Rejuvenating facial treatment.", 500, 45],
    ["Waxing", "Professional waxing service.", 400, 45],
    ["Manicure", "Nail shaping, cleaning and hand care.", 350, 45],
    ["Pedicure", "Foot cleaning, nail care and relaxation.", 450, 60],
    ["Party Makeup", "Professional makeup for special occasions.", 1500, 90],
    ["Bridal Makeup", "Complete bridal makeup service.", 5000, 180],
  ],

  Spa: [
    ["Head Massage", "Relaxing head massage.", 400, 30],
    ["Foot Massage", "Soothing foot massage.", 500, 30],
    ["Swedish Massage", "Relaxing full-body Swedish massage.", 1000, 60],
    ["Deep Tissue Massage", "Deep massage for muscle tension.", 1400, 60],
    ["Aromatherapy", "Relaxing massage with aromatic oils.", 1500, 75],
    ["Body Massage", "Rejuvenating full-body massage.", 1200, 60],
    ["Back Massage", "Focused back and shoulder massage.", 700, 45],
    ["Relaxation Therapy", "Gentle wellness relaxation therapy.", 900, 60],
  ],
};

function getBusinessType(salon, index) {
  // If businessType exists in your Salon model, use it.
  if (salon.businessType && SERVICES[salon.businessType]) {
    return salon.businessType;
  }

  // Fallback: matches our original 20/20/20 dummy-data order.
  if (index < 20) return "Salon";
  if (index < 40) return "Beauty Parlour";
  return "Spa";
}

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in server/.env");
  }

  await mongoose.connect(process.env.MONGO_URI);

  console.log("✅ MongoDB connected");

  // IMPORTANT:
  // Only touch the 60 dummy businesses.
  const salons = await Salon.find({
    phone: {
      $gte: String(START_PHONE),
      $lte: String(END_PHONE),
    },
  }).sort({ phone: 1 });

  if (!salons.length) {
    console.log("❌ No dummy businesses found.");
    return;
  }

  console.log(`🔎 Found ${salons.length} dummy businesses`);

  let imagesUpdated = 0;
  let servicesCreated = 0;
  let servicesSkipped = 0;

  for (let i = 0; i < salons.length; i++) {
    const salon = salons[i];

    const type = getBusinessType(salon, i);

    // ---------------- IMAGE ----------------

    const imagePool = IMAGES[type];

    salon.profileImage = imagePool[i % imagePool.length];

    // If businessType field exists, make sure it is populated.
    if (salon.schema.path("businessType")) {
      salon.businessType = type;
    }

    await salon.save();

    imagesUpdated++;

    // ---------------- SERVICES ----------------

    const serviceList = SERVICES[type];

    for (const [name, description, price, duration] of serviceList) {
      // Prevent duplicate services when script is run again.
      const existingService = await Service.findOne({
        salon: salon._id,
        name: name,
      });

      if (existingService) {
        servicesSkipped++;
        continue;
      }

      await Service.create({
        salon: salon._id,
        name,
        description,
        price,
        duration,
        isActive: true,
      });

      servicesCreated++;
    }

    console.log(`✅ ${salon.name} | ${type} | 8 services checked`);
  }

  console.log("\n======================================");
  console.log("   RUPIVA DUMMY DATA UPDATE COMPLETE");
  console.log("======================================");
  console.log(`Businesses found  : ${salons.length}`);
  console.log(`Images updated    : ${imagesUpdated}`);
  console.log(`Services created  : ${servicesCreated}`);
  console.log(`Services skipped  : ${servicesSkipped}`);
  console.log("======================================");
}

main()
  .catch((error) => {
    console.error("\n❌ Update failed:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  });
