import { useEffect, useState } from "react";
import { X, CalendarDays, Clock3, Scissors, MapPin } from "lucide-react";

import { getBookingDateLimits } from "../../utils/dateUtils";
import {
  getPublicSalonDetails,
  getPublicSalons,
} from "../../services/salonService";
import { updateBooking, getBookedSlots } from "../../services/bookingService";

const formatDateForInput = (date) => {
  if (!date) return "";

  // Handle YYYY-MM-DD without timezone shifting.
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}/.test(date)) {
    return date.slice(0, 10);
  }

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "";

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getAvailableDates = () => {
  const { minDate, maxDate } = getBookingDateLimits();
  const dates = [];

  const start = new Date(`${minDate}T12:00:00`);
  const end = new Date(`${maxDate}T12:00:00`);

  for (
    const date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    dates.push(`${year}-${month}-${day}`);
  }

  return dates;
};

const timeToMinutes = (time) => {
  if (!time) return null;

  const [hours, minutes] = time.split(":").map(Number);

  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
};

const convertTimeTo24Hour = (time) => {
  if (!time) return null;

  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    // Already in 24-hour HH:mm format.
    return /^\d{2}:\d{2}$/.test(time) ? time : null;
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (hours < 1 || hours > 12 || minutes > 59) return null;

  if (period === "AM" && hours === 12) hours = 0;
  if (period === "PM" && hours !== 12) hours += 12;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const formatTime = (totalMinutes) => {
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";

  let hours12 = hours24 % 12;
  if (hours12 === 0) hours12 = 12;

  return `${String(hours12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
};

const getDayName = (date) => {
  if (!date) return null;

  // Use local calendar date to avoid UTC day shifts.
  const bookingDate = new Date(`${date}T12:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  })
    .format(bookingDate)
    .toLowerCase();
};

const getCurrentIndiaDateTime = () => {
  const now = new Date();

  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  return { date, time };
};

export default function EditBookingModal({ booking, onClose, onUpdated }) {
  const { minDate, maxDate } = getBookingDateLimits();
  const availableDates = getAvailableDates();

  const [salons, setSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const originalBookingDate = formatDateForInput(booking?.date);
  const originalBookingTime = booking?.time || "";

  useEffect(() => {
    let cancelled = false;

    const loadBookingData = async () => {
      try {
        setLoading(true);

        const salonResponse = await getPublicSalons();
        const salonList = salonResponse.salons || [];

        const bookedSalonId =
          booking?.salon?.id ||
          booking?.salon?._id ||
          (typeof booking?.salon === "string" ? booking.salon : null);

        if (!bookedSalonId) {
          throw new Error("Salon ID is missing from this booking.");
        }

        const detailsResponse = await getPublicSalonDetails(bookedSalonId);

        if (!detailsResponse.success || !detailsResponse.salon) {
          throw new Error("Unable to load the booked salon details.");
        }

        const realSalon = detailsResponse.salon;

        const salonExists = salonList.some(
          (salon) =>
            String(salon._id || salon.id) ===
            String(realSalon._id || realSalon.id),
        );

        const updatedSalonList = salonExists
          ? salonList
          : [realSalon, ...salonList];

        const bookingServices = booking?.services || [];

        const matchedServices = bookingServices
          .map((bookingService) =>
            (realSalon.services || []).find(
              (service) =>
                String(service._id || service.id) ===
                String(bookingService.id || bookingService._id),
            ),
          )
          .filter(Boolean);

        if (cancelled) return;

        setSalons(updatedSalonList);
        setSelectedSalon(realSalon);
        setSelectedServices(matchedServices);
        setSelectedDate(originalBookingDate);
        setSelectedTime(originalBookingTime);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load edit booking data:", error);

        alert(
          error.response?.data?.message ||
            error.message ||
            "Failed to load booking details.",
        );

        onClose();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (booking) loadBookingData();

    return () => {
      cancelled = true;
    };
  }, [booking, originalBookingDate, originalBookingTime, onClose]);

  useEffect(() => {
    let cancelled = false;

    const loadBookedSlots = async () => {
      const salonId = selectedSalon?._id || selectedSalon?.id;

      if (!selectedDate || !salonId) {
        setBookedSlots([]);
        return;
      }

      try {
        setLoadingSlots(true);

        const response = await getBookedSlots(salonId, selectedDate);

        if (!cancelled) {
          setBookedSlots(response.bookedSlots || []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load booked slots:", error);
          setBookedSlots([]);
        }
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    };

    loadBookedSlots();

    return () => {
      cancelled = true;
    };
  }, [selectedDate, selectedSalon?._id, selectedSalon?.id]);

  const totalPrice = selectedServices.reduce(
    (total, service) => total + Number(service.price || 0),
    0,
  );

  const totalDuration = selectedServices.reduce(
    (total, service) => total + Number(service.duration || 0),
    0,
  );

  const handleSalonChange = async (event) => {
    const salonId = event.target.value;

    try {
      setLoading(true);

      const response = await getPublicSalonDetails(salonId);

      if (!response.success || !response.salon) {
        throw new Error("Unable to load selected salon.");
      }

      const newSalon = response.salon;

      setSelectedSalon(newSalon);
      setSelectedServices(
        newSalon.services?.length ? [newSalon.services[0]] : [],
      );
      setSelectedDate("");
      setSelectedTime("");
      setBookedSlots([]);
    } catch (error) {
      console.error("Salon change error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to load salon services.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (service) => {
    setSelectedServices((currentServices) => {
      const serviceId = String(service._id || service.id);

      const alreadySelected = currentServices.some(
        (item) => String(item._id || item.id) === serviceId,
      );

      if (alreadySelected) {
        if (currentServices.length === 1) return currentServices;

        return currentServices.filter(
          (item) => String(item._id || item.id) !== serviceId,
        );
      }

      return [...currentServices, service];
    });

    setSelectedTime("");
  };

  const isTimeSlotOverlappingBooking = (time) => {
    const slotStartMinutes = timeToMinutes(convertTimeTo24Hour(time));

    if (slotStartMinutes === null) return false;

    const slotEndMinutes = slotStartMinutes + totalDuration;

    return bookedSlots.some((item) => {
      const bookingTime = typeof item === "string" ? item : item.time;
      const bookingDuration =
        typeof item === "string" ? 0 : Number(item.duration || 0);

      const isCurrentBookingSlot =
        selectedDate === originalBookingDate &&
        bookingTime === originalBookingTime;

      if (isCurrentBookingSlot) return false;

      const bookingStartMinutes = timeToMinutes(
        convertTimeTo24Hour(bookingTime),
      );

      if (bookingStartMinutes === null) return false;

      const bookingEndMinutes = bookingStartMinutes + bookingDuration;

      return (
        slotStartMinutes < bookingEndMinutes &&
        slotEndMinutes > bookingStartMinutes
      );
    });
  };

  const dayName = getDayName(selectedDate);
  const dayHours = selectedSalon?.workingHours?.[dayName];

  const generateTimeSlots = () => {
    if (!selectedDate || !dayHours?.isOpen) return [];

    if (!dayHours.openTime || !dayHours.closeTime) return [];

    const openingMinutes = timeToMinutes(dayHours.openTime);
    const closingMinutes = timeToMinutes(dayHours.closeTime);

    if (
      openingMinutes === null ||
      closingMinutes === null ||
      openingMinutes >= closingMinutes
    ) {
      return [];
    }

    const slots = [];

    for (
      let currentTime = openingMinutes;
      currentTime < closingMinutes;
      currentTime += 30
    ) {
      slots.push(formatTime(currentTime));
    }

    return slots;
  };

  const { date: currentIndiaDate, time: currentIndiaTime } =
    getCurrentIndiaDateTime();

  const availableTimeSlots = generateTimeSlots().filter((time) => {
    const slot24 = convertTimeTo24Hour(time);

    if (selectedDate === currentIndiaDate && slot24 <= currentIndiaTime) {
      return false;
    }

    return !isTimeSlotOverlappingBooking(time);
  });

  const handleSave = async () => {
    if (!selectedSalon) {
      alert("Please select a salon.");
      return;
    }

    if (!selectedServices.length) {
      alert("Please select at least one service.");
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert("Please select date and time.");
      return;
    }

    // Compare ISO date strings to enforce the same date range on all devices.
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(selectedDate) ||
      selectedDate < minDate ||
      selectedDate > maxDate
    ) {
      alert("Bookings are available only for the next 7 days.");
      return;
    }

    if (!availableDates.includes(selectedDate)) {
      alert("Please select one of the available dates.");
      return;
    }

    if (!availableTimeSlots.includes(selectedTime)) {
      alert("This time slot is no longer available. Please choose another.");
      return;
    }

    try {
      setSaving(true);

      const bookingData = {
        salon: {
          id: selectedSalon._id || selectedSalon.id,
          name: selectedSalon.name,
          location: selectedSalon.location || {},
        },
        services: selectedServices.map((service) => ({
          id: service._id || service.id,
          name: service.name,
          price: Number(service.price || 0),
          duration: Number(service.duration || 0),
        })),
        totalPrice,
        totalDuration,
        date: selectedDate,
        time: selectedTime,
      };

      const data = await updateBooking(booking._id, bookingData);

      if (!data.success) {
        throw new Error(data.message || "Failed to update booking.");
      }

      alert("Booking updated successfully.");
      onUpdated(data.booking);
      onClose();
    } catch (error) {
      console.error("Update booking error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to update booking. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading || !selectedSalon) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div className="rounded-3xl bg-white px-8 py-10 text-center shadow-2xl">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600" />
          <p className="mt-4 font-semibold text-gray-700">
            Loading booking details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-4">
      <div className="flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Fixed header */}
        <header className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
              <CalendarDays size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Edit Booking
              </h2>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Update your appointment details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close edit booking"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={21} />
          </button>
        </header>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Salon */}
            <section>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <MapPin size={16} className="text-purple-600" />
                Salon
              </label>

              <select
                value={selectedSalon._id || selectedSalon.id}
                onChange={handleSalonChange}
                disabled={saving}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
              >
                {salons.map((salon) => (
                  <option
                    key={salon._id || salon.id}
                    value={salon._id || salon.id}
                  >
                    {salon.name}
                  </option>
                ))}
              </select>
            </section>

            {/* Services */}
            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Scissors size={16} className="text-purple-600" />
                  Services
                </label>

                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                  {selectedServices.length} selected
                </span>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {(selectedSalon.services || []).map((service) => {
                  const serviceId = service._id || service.id;

                  const isSelected = selectedServices.some(
                    (item) => String(item._id || item.id) === String(serviceId),
                  );

                  return (
                    <button
                      key={serviceId}
                      type="button"
                      onClick={() => handleServiceToggle(service)}
                      disabled={saving}
                      className={`flex min-w-0 items-center justify-between gap-3 rounded-xl border p-3 text-left transition ${
                        isSelected
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {service.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {service.duration} min
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-purple-700">
                          ₹{service.price}
                        </p>
                        <span
                          className={`mt-1 inline-block text-[11px] font-semibold ${
                            isSelected ? "text-purple-700" : "text-gray-500"
                          }`}
                        >
                          {isSelected ? "✓ Selected" : "Select"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Date */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <CalendarDays size={18} className="text-purple-600" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Select Date
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Choose from the next 7 calendar days.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {availableDates.map((date) => {
                  const parsedDate = new Date(`${date}T12:00:00`);
                  const isSelected = selectedDate === date;

                  return (
                    <button
                      key={date}
                      type="button"
                      disabled={saving}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTime("");
                      }}
                      aria-pressed={isSelected}
                      className={`min-h-[68px] rounded-xl border p-3 text-left transition ${
                        isSelected
                          ? "border-purple-600 bg-purple-50 ring-2 ring-purple-100"
                          : "border-gray-200 bg-white hover:border-purple-400"
                      }`}
                    >
                      <span className="block text-xs text-gray-500">
                        {parsedDate.toLocaleDateString("en-IN", {
                          weekday: "short",
                        })}
                      </span>
                      <span
                        className={`mt-1 block text-sm font-bold ${
                          isSelected ? "text-purple-700" : "text-slate-900"
                        }`}
                      >
                        {parsedDate.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Time slots */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <Clock3 size={18} className="text-purple-600" />
                <h3 className="text-sm font-semibold text-gray-800">
                  Select Time
                </h3>
              </div>

              {!selectedDate && (
                <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                  Please select a date first.
                </p>
              )}

              {selectedDate && !dayHours?.isOpen && (
                <p className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
                  The salon is closed on the selected date.
                </p>
              )}

              {selectedDate &&
                dayHours?.isOpen &&
                availableTimeSlots.length === 0 && (
                  <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                    {loadingSlots
                      ? "Checking available slots..."
                      : "No time slots are available for this date."}
                  </p>
                )}

              {selectedDate &&
                dayHours?.isOpen &&
                availableTimeSlots.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-3">
                    {availableTimeSlots.map((time) => {
                      const isSelected = selectedTime === time;

                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={saving || loadingSlots}
                          onClick={() => setSelectedTime(time)}
                          className={`flex min-h-10 items-center justify-center rounded-lg border px-1.5 py-2 text-xs font-semibold whitespace-nowrap transition sm:px-2 ${
                            isSelected
                              ? "border-purple-600 bg-purple-600 text-white shadow-sm"
                              : "border-gray-200 bg-white text-slate-700 hover:border-purple-500 hover:bg-purple-50"
                          } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )}

              {loadingSlots && selectedDate && (
                <p className="mt-2 text-xs text-gray-500">
                  Refreshing booked slots...
                </p>
              )}
            </section>

            {/* Total */}
            <section className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total services</span>
                <span className="font-semibold text-slate-900">
                  {selectedServices.length}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">Total duration</span>
                <span className="font-semibold text-slate-900">
                  {totalDuration} min
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 border-t border-purple-200 pt-3">
                <span className="text-sm font-semibold text-slate-800">
                  Updated Total
                </span>
                <span className="text-2xl font-bold text-purple-700">
                  ₹{totalPrice}
                </span>
              </div>
            </section>
          </div>
        </div>

        {/* Fixed footer */}
        <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-100 bg-white px-4 py-4 sm:flex-row sm:justify-end sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="w-full rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving ||
              loadingSlots ||
              !selectedServices.length ||
              !selectedDate ||
              !selectedTime
            }
            className="w-full rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto"
          >
            {saving ? "Saving changes..." : "Save Changes"}
          </button>
        </footer>
      </div>
    </div>
  );
}
