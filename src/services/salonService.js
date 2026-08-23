import api from "./api";

export const getMySalon = async () => {
  const response = await api.get("/salons/my");

  return response.data;
};

export const createSalon = async (salonData) => {
  const response = await api.post("/salons", salonData);

  return response.data;
};

export const updateSalon = async (salonData) => {
  const response = await api.put("/salons/my", salonData);

  return response.data;
};

export const toggleSalonVisibility = async () => {
  const response = await api.patch("/salons/my/visibility");

  return response.data;
};

export const toggleSalonStatus = async () => {
  const response = await api.patch("/salons/my/status");

  return response.data;
};

export const uploadSalonProfileImage = async (imageFile) => {
  const formData = new FormData();

  formData.append("profileImage", imageFile);

  const response = await api.post("/salons/my/profile-image", formData);

  return response.data;
};
