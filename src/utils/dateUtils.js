// Get today's date in local timezone
export const getTodayDateInput = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Get date after N days
export const getDateAfterDays = (days) => {
  const date = new Date();

  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Booking date range
export const getBookingDateLimits = () => {
  return {
    minDate: getTodayDateInput(),
    maxDate: getDateAfterDays(6),
  };
};
