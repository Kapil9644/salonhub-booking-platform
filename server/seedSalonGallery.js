require("dotenv").config();

const fs = require("fs");
const path = require("path");

const connectDB = require("./config/db");
const cloudinary = require("./config/cloudinary");
const Salon = require("./models/Salon");

const MAX_GALLERY_IMAGES = 10;

const IMAGE_DIRECTORY =
  process.env.SALON_GALLERY_IMAGES_DIR ||
  path.join(__dirname, "Salon Gallery Images");

const CLOUDINARY_FOLDER = "salonhub/salon-gallery-seed";

function makeSlug(filename) {
  return path
    .parse(filename)
    .name.normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function getOrUploadImage(filePath, filename, index) {
  const slug = makeSlug(filename) || `salon-image-${index + 1}`;

  const publicId = `${String(index + 1).padStart(2, "0")}-${slug}`;

  const fullPublicId = `salonhub/salon-gallery-seed/${publicId}`;

  try {
    const existing = await cloudinary.api.resource(fullPublicId, {
      resource_type: "image",
    });

    console.log(`Reusing existing Cloudinary image: ${fullPublicId}`);

    return {
      url: existing.secure_url,
      publicId: existing.public_id,
    };
  } catch (error) {
    const statusCode = error.http_code || error.error?.http_code;

    if (statusCode !== 404) {
      throw error;
    }

    console.log(`Image not found; uploading: ${filename}`);
  }

  const uploaded = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    folder: "salonhub/salon-gallery-seed",
    resource_type: "image",
    overwrite: false,
  });

  console.log(`Uploaded successfully: ${uploaded.public_id}`);

  return {
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
  };
}

async function seedSalonGallery() {
  let updatedSalons = 0;
  let skippedFullSalons = 0;
  let unchangedSalons = 0;
  let totalImagesAdded = 0;

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from the server .env file.");
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error(
        "Cloudinary credentials are missing from the server .env file.",
      );
    }

    if (!fs.existsSync(IMAGE_DIRECTORY)) {
      throw new Error(
        `Image folder not found: ${IMAGE_DIRECTORY}\n` +
          "Place the 'Salon Gallery Images' folder beside server.js.",
      );
    }

    const files = fs
      .readdirSync(IMAGE_DIRECTORY)
      .filter((filename) => /\.(jpe?g|png|webp)$/i.test(filename))
      .sort((a, b) => a.localeCompare(b));

    if (files.length !== MAX_GALLERY_IMAGES) {
      throw new Error(
        `Expected exactly ${MAX_GALLERY_IMAGES} images, but found ${files.length} in ${IMAGE_DIRECTORY}`,
      );
    }

    console.log(`Found ${files.length} gallery images.`);

    await connectDB();

    // Upload/reuse the 10 shared images once, not once per salon.
    const seedImages = [];

    for (let index = 0; index < files.length; index++) {
      const filename = files[index];
      const filePath = path.join(IMAGE_DIRECTORY, filename);

      console.log(`Preparing image ${index + 1}/${files.length}: ${filename}`);

      const image = await getOrUploadImage(filePath, filename, index);
      seedImages.push(image);
    }

    const salons = await Salon.find({});
    console.log(`Found ${salons.length} salons in the database.`);

    for (const salon of salons) {
      const currentImages = salon.galleryImages || [];

      if (currentImages.length >= MAX_GALLERY_IMAGES) {
        skippedFullSalons++;
        console.log(`SKIPPED (gallery full): ${salon.name || salon._id}`);
        continue;
      }

      const existingPublicIds = new Set(
        currentImages.map((image) => image.publicId).filter(Boolean),
      );

      const existingUrls = new Set(
        currentImages.map((image) => image.url).filter(Boolean),
      );

      const missingImages = seedImages.filter(
        (image) =>
          !existingPublicIds.has(image.publicId) &&
          !existingUrls.has(image.url),
      );

      const availableSlots = MAX_GALLERY_IMAGES - currentImages.length;
      const imagesToAdd = missingImages.slice(0, availableSlots);

      if (imagesToAdd.length === 0) {
        unchangedSalons++;
        console.log(`UNCHANGED: ${salon.name || salon._id}`);
        continue;
      }

      salon.galleryImages.push(...imagesToAdd);
      await salon.save();

      updatedSalons++;
      totalImagesAdded += imagesToAdd.length;

      console.log(
        `UPDATED: ${salon.name || salon._id} — added ${imagesToAdd.length} image(s)`,
      );
    }

    console.log("\n========== GALLERY SEED SUMMARY ==========");
    console.log(`Total salons found: ${salons.length}`);
    console.log(`Salons updated: ${updatedSalons}`);
    console.log(`Images added: ${totalImagesAdded}`);
    console.log(`Salons already full: ${skippedFullSalons}`);
    console.log(`Salons unchanged: ${unchangedSalons}`);
    console.log("==========================================");
  } catch (error) {
    console.error("\n❌ Salon gallery seeding failed:");
    console.error(error.message || error);
    process.exitCode = 1;
  } finally {
    const mongoose = require("mongoose");

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
}

seedSalonGallery();
