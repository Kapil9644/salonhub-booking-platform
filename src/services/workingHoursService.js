import api from "./api";

// Get logged-in salon owner's working hours
export const getMyWorkingHours = async () => {
  const response = await api.get("/working-hours/my");

  return response.data;
};

// Update logged-in salon owner's working hours
export const updateMyWorkingHours = async (workingHours) => {
  const response = await api.put("/working-hours/my", workingHours);

  return response.data;
};
