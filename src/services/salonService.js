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

// ================================
// PUBLIC / CUSTOMER APIs
// ================================

export const getPublicSalons = async () => {
  const response = await api.get("/salons");

  return response.data;
};

export const getPublicSalonDetails = async (salonId) => {
  const response = await api.get(`/salons/${salonId}`);

  return response.data;
};
