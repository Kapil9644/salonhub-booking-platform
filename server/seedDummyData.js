require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Salon = require("./models/Salon");

// 60 dummy businesses:
// 20 Salon + 20 Beauty Parlour + 20 Spa
// Existing records are NOT deleted or modified.
// The seed is safe to run again: existing dummy phone/email/business records are skipped.

const PASSWORD = "Rupiva@123";
const START_PHONE = 6232963000;

const businesses = [
  // -------------------- 20 SALONS --------------------
  ["Royal Cuts Studio", "Aarav Sharma", "Salon"],
  ["Urban Style Salon", "Rohan Verma", "Salon"],
  ["Classic Gents & Family Salon", "Mohit Patel", "Salon"],
  ["The Hair Lounge", "Aditya Jain", "Salon"],
  ["Style Street Salon", "Karan Mehta", "Salon"],
  ["Elite Hair Studio", "Rahul Soni", "Salon"],
  ["Gentlemen's Hub", "Deepak Yadav", "Salon"],
  ["New Look Salon", "Ankit Tiwari", "Salon"],
  ["Trendz Family Salon", "Manish Gupta", "Salon"],
  ["Looks & Locks", "Saurabh Mishra", "Salon"],
  ["Urban Grooming Point", "Vivek Sharma", "Salon"],
  ["The Style Room", "Akash Singh", "Salon"],
  ["Classic Look Studio", "Naveen Chouhan", "Salon"],
  ["Sharp Edge Salon", "Pankaj Rathore", "Salon"],
  ["Fresh Cut Family Salon", "Ravi Malviya", "Salon"],
  ["Mirror Magic Salon", "Yash Dubey", "Salon"],
  ["The Grooming House", "Abhishek Joshi", "Salon"],
  ["Perfect Style Salon", "Sumit Saxena", "Salon"],
  ["Signature Hair Studio", "Harsh Vyas", "Salon"],
  ["Royal Family Salon", "Gaurav Thakur", "Salon"],

  // ---------------- 20 BEAUTY PARLOURS ----------------
  ["Blossom Beauty Parlour", "Neha Sharma", "Beauty Parlour"],
  ["Glamour Touch Parlour", "Priya Verma", "Beauty Parlour"],
  ["Pink Petals Beauty Studio", "Anjali Patel", "Beauty Parlour"],
  ["Divine Beauty Parlour", "Kavya Jain", "Beauty Parlour"],
  ["Beauty Bloom Studio", "Ritika Mehta", "Beauty Parlour"],
  ["Queen's Beauty Lounge", "Simran Soni", "Beauty Parlour"],
  ["Grace Beauty Point", "Pallavi Yadav", "Beauty Parlour"],
  ["Pretty You Parlour", "Shweta Tiwari", "Beauty Parlour"],
  ["Glow & Grace Beauty", "Muskan Gupta", "Beauty Parlour"],
  ["Blush Beauty Studio", "Nisha Mishra", "Beauty Parlour"],
  ["Rose Petal Parlour", "Komal Sharma", "Beauty Parlour"],
  ["Glam Diva Beauty", "Sakshi Singh", "Beauty Parlour"],
  ["Elegant Beauty House", "Poonam Chouhan", "Beauty Parlour"],
  ["Beauty Nest Parlour", "Jyoti Rathore", "Beauty Parlour"],
  ["Dream Look Beauty Studio", "Renu Malviya", "Beauty Parlour"],
  ["Makeover Magic", "Isha Dubey", "Beauty Parlour"],
  ["Radiant Beauty Parlour", "Megha Joshi", "Beauty Parlour"],
  ["The Beauty Room", "Aarti Saxena", "Beauty Parlour"],
  ["Bloom & Blush", "Tanvi Vyas", "Beauty Parlour"],
  ["Forever Beautiful", "Preeti Thakur", "Beauty Parlour"],

  // ------------------------ 20 SPAS ------------------------
  ["Serenity Spa", "Arjun Sharma", "Spa"],
  ["Tranquil Wellness Spa", "Nikhil Verma", "Spa"],
  ["Relax Retreat Spa", "Sameer Patel", "Spa"],
  ["Lotus Wellness Spa", "Varun Jain", "Spa"],
  ["Healing Touch Spa", "Ritesh Mehta", "Spa"],
  ["Calm Aura Spa", "Amit Soni", "Spa"],
  ["Nature Bliss Spa", "Rakesh Yadav", "Spa"],
  ["Royal Wellness Spa", "Vikas Tiwari", "Spa"],
  ["Pure Relaxation Spa", "Sandeep Gupta", "Spa"],
  ["Zen Zone Spa", "Tarun Mishra", "Spa"],
  ["Serene Life Spa", "Rajesh Sharma", "Spa"],
  ["Wellness Wave Spa", "Prakash Singh", "Spa"],
  ["Ayur Glow Spa", "Dinesh Chouhan", "Spa"],
  ["Peaceful Touch Spa", "Lokesh Rathore", "Spa"],
  ["Aura Wellness Centre", "Mukul Malviya", "Spa"],
  ["Blissful Moments Spa", "Rajat Dubey", "Spa"],
  ["Heavenly Hands Spa", "Kunal Joshi", "Spa"],
  ["The Relax House", "Nitin Saxena", "Spa"],
  ["Oasis Wellness Spa", "Chirag Vyas", "Spa"],
  ["Vitality Spa & Wellness", "Siddharth Thakur", "Spa"],
];

const locations = [
  {
    address: "Near MP Nagar Square",
    area: "MP Nagar Zone II",
    city: "Bhopal",
    state: "Madhya Pradesh",
    pincode: "462011",
    latitude: 23.2331,
    longitude: 77.4340,
  },
  {
    address: "Near 10 No. Market",
    area: "Arera Colony",
    city: "Bhopal",
    state: "Madhya Pradesh",
    pincode: "462016",
    latitude: 23.2084,
    longitude: 77.4358,
  },
  {
    address: "Near Mata Mandir Square",
    area: "TT Nagar",
    city: "Bhopal",
    state: "Madhya Pradesh",
    pincode: "462003",
    latitude: 23.2355,
    longitude: 77.4010,
  },
  {
    address: "Near Vijay Nagar Square",
    area: "Vijay Nagar",
    city: "Indore",
    state: "Madhya Pradesh",
    pincode: "452010",
    latitude: 22.7533,
    longitude: 75.8937,
  },
  {
    address: "Near Wright Town",
    area: "Wright Town",
    city: "Jabalpur",
    state: "Madhya Pradesh",
    pincode: "482002",
    latitude: 23.1665,
    longitude: 79.9333,
  },
  {
    address: "Near Freeganj Market",
    area: "Freeganj",
    city: "Ujjain",
    state: "Madhya Pradesh",
    pincode: "456010",
    latitude: 23.1828,
    longitude: 75.7682,
  },
  {
    address: "Near City Centre",
    area: "City Centre",
    city: "Gwalior",
    state: "Madhya Pradesh",
    pincode: "474011",
    latitude: 26.2183,
    longitude: 78.1828,
  },
  {
    address: "Near Palasia Square",
    area: "Palasia",
    city: "Indore",
    state: "Madhya Pradesh",
    pincode: "452001",
    latitude: 22.7196,
    longitude: 75.8577,
  },
];

const aboutByType = {
  Salon:
    "A modern family salon offering professional haircuts, styling, grooming, hair care and personalized beauty services in a clean and comfortable environment.",
  "Beauty Parlour":
    "A welcoming beauty parlour offering makeup, facial care, skincare, hair care and personalized beauty services for everyday looks and special occasions.",
  Spa:
    "A relaxing wellness destination offering rejuvenating spa therapies, massage services and self-care experiences designed to help guests relax and refresh.",
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function ownerImageUrl(fullName, index) {
  const genderedIndex = (index % 50) + 1;
  const isFemale = /Neha|Priya|Anjali|Kavya|Ritika|Simran|Pallavi|Shweta|Muskan|Nisha|Komal|Sakshi|Poonam|Jyoti|Renu|Isha|Megha|Aarti|Tanvi|Preeti/.test(fullName);
  const gender = isFemale ? "women" : "men";
  return `https://randomuser.me/api/portraits/${gender}/${genderedIndex}.jpg`;
}

function businessImageUrl(type, index) {
  // Deterministic placeholder photos. These are external URLs, so they require internet access.
  const seed = `rupiva-${slugify(type)}-${index + 1}`;
  return `https://picsum.photos/seed/${seed}/1000/700`;
}

function createEmail(fullName, phone) {
  const parts = fullName
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .split(/\s+/);

  return `${parts.join("")}${phone.slice(-4)}@gmail.com`;
}

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in server/.env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

  let ownersCreated = 0;
  let salonsCreated = 0;
  let ownersSkipped = 0;
  let salonsSkipped = 0;

  for (let i = 0; i < businesses.length; i++) {
    const [name, fullName, businessType] = businesses[i];
    const phone = String(START_PHONE + i);
    const email = createEmail(fullName, phone);
    const location = locations[i % locations.length];

    let owner = await User.findOne({
      $or: [{ phone }, { email }],
    });

    if (!owner) {
      owner = await User.create({
        fullName,
        phone,
        email,
        password: hashedPassword,
        role: "salon",
        isVerified: false,
        profileImage: ownerImageUrl(fullName, i),
      });

      ownersCreated++;
      console.log(`👤 Owner created: ${fullName} (${phone})`);
    } else {
      ownersSkipped++;
      console.log(`↩️ Owner exists: ${fullName} (${phone})`);
    }

    let salon = await Salon.findOne({ owner: owner._id });

    if (!salon) {
      salon = await Salon.create({
        owner: owner._id,
        name,
        businessType,
        profileImage: businessImageUrl(businessType, i),
        about: aboutByType[businessType],
        location,
        phone,
        email,
        isListed: true,
        isOpen: false,
        statusOverride: "auto",
        statusOverrideDate: "",
        approvalStatus: "Approved",
      });

      salonsCreated++;
      console.log(`🏪 Business created: ${name} [${businessType}]`);
    } else {
      salonsSkipped++;
      console.log(`↩️ Business exists for owner: ${fullName}`);
    }
  }

  console.log("\n======================================");
  console.log("       RUPIVA DUMMY DATA SEED");
  console.log("======================================");
  console.log(`Total dummy businesses : ${businesses.length}`);
  console.log(`Salon                  : 20`);
  console.log(`Beauty Parlour         : 20`);
  console.log(`Spa                    : 20`);
  console.log(`Owners created         : ${ownersCreated}`);
  console.log(`Businesses created     : ${salonsCreated}`);
  console.log(`Owners skipped         : ${ownersSkipped}`);
  console.log(`Businesses skipped     : ${salonsSkipped}`);
  console.log("Password for all new owners:", PASSWORD);
  console.log("Phone range:", START_PHONE, "-", START_PHONE + businesses.length - 1);
  console.log("======================================\n");
}

main()
  .catch((error) => {
    console.error("\n❌ Dummy data seed failed");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  });
