import api from "./api";

export const getPendingSalons = async () => {
  const response = await api.get("/admin/salons/pending");

  return response.data;
};

export const approveSalon = async (salonId) => {
  const response = await api.patch(`/admin/salons/${salonId}/approve`);

  return response.data;
};
