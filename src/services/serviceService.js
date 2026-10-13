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
// Get all active global services
export const getGlobalServices = async () => {
  const response = await api.get("/global-services");

  return response.data;
};

// Get one active global service
export const getGlobalServiceById = async (serviceId) => {
  const response = await api.get(`/global-services/${serviceId}`);

  return response.data;
};

export const getPublicServiceCatalog = async () => {
  const response = await api.get("/services/catalog");
  return response.data;
};
