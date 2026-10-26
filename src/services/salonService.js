import api from "./api";
import salonOwnerApi from "./salonOwnerApi";

// ================================
// SALON OWNER APIs
// ================================

export const getMySalon = async () => {
  const response = await salonOwnerApi.get("/salons/my");

  return response.data;
};

export const createSalon = async (salonData) => {
  const response = await salonOwnerApi.post("/salons", salonData);

  return response.data;
};

export const updateSalon = async (salonData) => {
  const response = await salonOwnerApi.put("/salons/my", salonData);

  return response.data;
};

export const toggleSalonVisibility = async () => {
  const response = await salonOwnerApi.patch("/salons/my/visibility");

  return response.data;
};

export const toggleSalonStatus = async () => {
  const response = await salonOwnerApi.patch("/salons/my/status");

  return response.data;
};

export const uploadSalonProfileImage = async (imageFile) => {
  const formData = new FormData();

  formData.append("profileImage", imageFile);

  const response = await salonOwnerApi.post(
    "/salons/my/profile-image",
    formData,
  );

  return response.data;
};

export const uploadSalonGalleryImages = async (files) => {
  const formData = new FormData();

  Array.from(files).forEach((file) => {
    formData.append("galleryImages", file);
  });

  const response = await salonOwnerApi.post("/salons/my/gallery", formData);

  return response.data;
};

export const deleteSalonGalleryImage = async (imageId) => {
  const response = await salonOwnerApi.delete(`/salons/my/gallery/${imageId}`);

  return response.data;
};

// ================================
// PUBLIC / CUSTOMER APIs
// ================================

export const getPublicSalons = async (options = {}) => {
  const params = {};

  for (const key of [
    "page",
    "limit",
    "search",
    "location",
    "pincode",
    "serviceCategory",
    "rating",
    "price",
    "openNow",
    "sort",
    "latitude",
    "longitude",
  ]) {
    if (options[key] !== undefined && options[key] !== "") {
      params[key] = options[key];
    }
  }

  const response = await api.get("/salons", { params });
  return response.data;
};

export const getPublicSalonDetails = async (salonId) => {
  const response = await api.get(`/salons/${salonId}`);

  return response.data;
};

export const getSalonOwnerNotificationPreferences = async () => {
  const response = await salonOwnerApi.get(
    "/salon-owner-auth/notification-preferences",
  );
  return response.data;
};

export const updateSalonOwnerNotificationPreferences = async (preferences) => {
  const response = await salonOwnerApi.put(
    "/salon-owner-auth/notification-preferences",
    preferences,
  );
  return response.data;
};

export const changeSalonOwnerPassword = async (passwordData) => {
  const response = await salonOwnerApi.put(
    "/salon-owner-auth/change-password",
    passwordData,
  );
  return response.data;
};
