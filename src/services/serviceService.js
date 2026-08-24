import api from "./api";

export const getMyServices = async () => {
  const response = await api.get("/services/my");

  return response.data;
};

export const createService = async (serviceData) => {
  const response = await api.post("/services", serviceData);

  return response.data;
};

export const updateService = async (serviceId, serviceData) => {
  const response = await api.put(`/services/${serviceId}`, serviceData);

  return response.data;
};

export const deleteService = async (serviceId) => {
  const response = await api.delete(`/services/${serviceId}`);

  return response.data;
};

// Get active services of a public salon
export const getPublicSalonServices = async (salonId) => {
  const response = await api.get(`/services/salon/${salonId}`);

  return response.data;
};
