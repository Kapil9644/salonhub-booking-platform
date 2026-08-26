import salonOwnerApi from "./salonOwnerApi";

// Get logged-in salon owner's personal profile
export const getSalonOwnerProfile = async () => {
  const response = await salonOwnerApi.get("/auth/me");

  return response.data;
};

// Update logged-in salon owner's personal profile
export const updateSalonOwnerProfile = async (profileData) => {
  const response = await salonOwnerApi.put("/auth/profile", profileData);

  return response.data;
};

// Upload salon owner's personal profile image
export const uploadSalonOwnerProfileImage = async (imageFile) => {
  const formData = new FormData();

  formData.append("profileImage", imageFile);

  const response = await salonOwnerApi.post("/auth/profile-image", formData);

  return response.data;
};
