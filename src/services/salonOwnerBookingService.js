import salonOwnerApi from "./salonOwnerApi";

// Get appointments
export const getSalonOwnerAppointments = async () => {
  const response = await salonOwnerApi.get("/salon-owner/appointments");

  return response.data;
};

// Update appointment status
export const updateAppointmentStatus = async (bookingId, status) => {
  const response = await salonOwnerApi.patch(
    `/salon-owner/appointments/${bookingId}/status`,
    {
      status,
    },
  );

  return response.data;
};
