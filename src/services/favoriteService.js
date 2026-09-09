import api from "./api";

export const getFavoriteSalons = async () => {
  const response = await api.get("/favorites");
  return response.data;
};

export const toggleFavoriteSalon = async (salonId) => {
  const response = await api.post(`/favorites/${salonId}/toggle`);
  return response.data;
};
