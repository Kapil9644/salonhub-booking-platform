import adminApi from "./adminApi";

export const getPendingSalons = async () => {
  const response = await adminApi.get("/admin/salons/pending");

  return response.data;
};

export const approveSalon = async (salonId) => {
  const response = await adminApi.patch(`/admin/salons/${salonId}/approve`);

  return response.data;
};
