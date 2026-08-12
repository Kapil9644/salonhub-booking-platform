import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);

  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);

  return response.data;
};

export const forgotPassword = async (phone) => {
  const response = await api.post("/auth/forgot-password", {
    phone,
  });

  return response.data;
};

export const verifyOtp = async (phone, otp) => {
  const response = await api.post("/auth/verify-otp", {
    phone,
    otp,
  });

  return response.data;
};

export const resetPassword = async (resetToken, newPassword) => {
  const response = await api.post("/auth/reset-password", {
    resetToken,
    newPassword,
  });

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/auth/profile", profileData);

  return response.data;
};

export const uploadProfileImage = async (imageFile) => {
  const formData = new FormData();

  formData.append("profileImage", imageFile);

  const response = await api.post("/auth/profile-image", formData);

  return response.data;
};
