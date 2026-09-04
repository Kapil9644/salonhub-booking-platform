import { useEffect, useState } from "react";
import { getBookingDateLimits } from "../../utils/dateUtils";
import {
  getPublicSalonDetails,
  getPublicSalons,
} from "../../services/salonService";
import { updateBooking, getBookedSlots } from "../../services/bookingService";

export default function EditBookingModal({ booking, onClose, onUpdated }) {
  const { minDate, maxDate } = getBookingDateLimits();
  const [salons, setSalons] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ========================================
  // FORMAT DATE FOR INPUT
  // ========================================

  const formatDateForInput = (date) => {
    if (!date) return "";

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return "";
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ========================================
  // LOAD REAL SALON + BOOKING DATA
  // ========================================

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setLoading(true);

        // Get real salons from backend
        const salonResponse = await getPublicSalons();

        const salonList = salonResponse.salons || [];

        setSalons(salonList);

        // Find actual booked salon
        const bookedSalonId = booking?.salon?.id;

        const salonFromList = salonList.find(
          (salon) => String(salon._id || salon.id) === String(bookedSalonId),
        );

        if (!salonFromList) {
          throw new Error("Booked salon not found.");
        }

        // Get complete salon details
        const salonId = salonFromList._id || salonFromList.id;

        const detailsResponse = await getPublicSalonDetails(salonId);

        if (!detailsResponse.success || !detailsResponse.salon) {
          throw new Error("Unable to load salon details.");
        }

        const realSalon = detailsResponse.salon;

        setSelectedSalon(realSalon);

        // Match booking services with real salon services
        const bookingServices = booking?.services || [];

        const matchedServices = bookingServices
          .map((bookingService) =>
            (realSalon.services || []).find(
              (service) =>
                String(service._id || service.id) === String(bookingService.id),
            ),
          )
          .filter(Boolean);

        setSelectedServices(matchedServices);

        // Actual booking date
        setSelectedDate(formatDateForInput(booking?.date));

        // Actual booking time
        setSelectedTime(booking?.time || "");
      } catch (error) {
        console.error("Failed to load edit booking data:", error);

        alert(
          error.response?.data?.message ||
            error.message ||
            "Failed to load booking details.",
        );

        onClose();
      } finally {
        setLoading(false);
      }
    };

    if (booking) {
      loadBookingData();
    }
  }, [booking, onClose]);

  useEffect(() => {
    const loadBookedSlots = async () => {
      if (!selectedDate || !selectedSalon?._id) {
        setBookedSlots([]);
        return;
      }

      try {
        setLoadingSlots(true);

        const response = await getBookedSlots(selectedSalon._id, selectedDate);

        setBookedSlots(response.bookedSlots || []);
      } catch (error) {
        console.error("Failed to load booked slots:", error);
        setBookedSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    loadBookedSlots();
  }, [selectedDate, selectedSalon?._id]);

  // ========================================
  // TOTALS
  // ========================================

  const totalPrice = selectedServices.reduce(
    (total, service) => total + Number(service.price || 0),
    0,
  );

  const totalDuration = selectedServices.reduce(
    (total, service) => total + Number(service.duration || 0),
    0,
  );
  const isTimeSlotOverlappingBooking = (time) => {
    const slotStartMinutes = timeToMinutes(convertTimeTo24Hour(time));

    if (slotStartMinutes === null) {
      return false;
    }

    const slotEndMinutes = slotStartMinutes + totalDuration;

    return bookedSlots.some((booking) => {
      const bookingTime = typeof booking === "string" ? booking : booking.time;

      const bookingDuration =
        typeof booking === "string" ? 0 : Number(booking.duration || 0);

      // Allow the booking currently being edited to keep its own slot.
      const isCurrentBookingSlot =
        selectedDate === originalBookingDate &&
        bookingTime === originalBookingTime;

      if (isCurrentBookingSlot) {
        return false;
      }

      const bookingStartMinutes = timeToMinutes(
        convertTimeTo24Hour(bookingTime),
      );

      if (bookingStartMinutes === null) {
        return false;
      }

      const bookingEndMinutes = bookingStartMinutes + bookingDuration;

      return (
        slotStartMinutes < bookingEndMinutes &&
        slotEndMinutes > bookingStartMinutes
      );
    });
  };
  // ========================================
  // CHANGE SALON
  // ========================================

  const handleSalonChange = async (e) => {
    const salonId = e.target.value;

    try {
      setLoading(true);

      const response = await getPublicSalonDetails(salonId);

      if (!response.success || !response.salon) {
        throw new Error("Unable to load selected salon.");
      }

      const newSalon = response.salon;

      setSelectedSalon(newSalon);

      // When salon changes, reset services
      setSelectedServices(
        newSalon.services?.length ? [newSalon.services[0]] : [],
      );
    } catch (error) {
      console.error("Salon change error:", error);

      alert(error.response?.data?.message || "Failed to load salon services.");
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // SERVICE SELECT / UNSELECT
  // ========================================

  const handleServiceToggle = (service) => {
    setSelectedServices((currentServices) => {
      const alreadySelected = currentServices.some(
        (item) =>
          String(item._id || item.id) === String(service._id || service.id),
      );

      if (alreadySelected) {
        // Don't allow zero services
        if (currentServices.length === 1) {
          return currentServices;
        }

        return currentServices.filter(
          (item) =>
            String(item._id || item.id) !== String(service._id || service.id),
        );
      }

      return [...currentServices, service];
    });
  };

  const timeToMinutes = (time) => {
    if (!time) return null;

    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
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

    const bookingDate = new Date(`${date}T12:00:00`);

    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
    })
      .format(bookingDate)
      .toLowerCase();
  };

  const getCurrentIndiaDateTime = () => {
    const now = new Date();

    const indiaDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
    }).format(now);

    const indiaTime = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);

    return {
      date: indiaDate,
      time: indiaTime,
    };
  };

  const convertTimeTo24Hour = (time) => {
    if (!time) return null;

    const [timePart, period] = time.split(" ");

    let [hours, minutes] = timePart.split(":").map(Number);

    if (period === "AM" && hours === 12) {
      hours = 0;
    }

    if (period === "PM" && hours !== 12) {
      hours += 12;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const isPastTimeSlot = (time) => {
    if (!selectedDate) return false;

    const { date: currentIndiaDate, time: currentIndiaTime } =
      getCurrentIndiaDateTime();

    if (selectedDate !== currentIndiaDate) {
      return false;
    }

    const slotTime = convertTimeTo24Hour(time);

    return slotTime <= currentIndiaTime;
  };

  const dayName = getDayName(selectedDate);
  const dayHours = selectedSalon?.workingHours?.[dayName];

  const generateTimeSlots = () => {
    if (!selectedDate || !dayHours?.isOpen) {
      return [];
    }

    if (!dayHours.openTime || !dayHours.closeTime) {
      return [];
    }

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

  const availableTimeSlots = generateTimeSlots().filter(
    (time) => !isPastTimeSlot(time),
  );

  const originalBookingDate = formatDateForInput(booking.date);
  const originalBookingTime = booking.time;
  // ========================================
  // SAVE
  // ========================================

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

    try {
      setSaving(true);

      const bookingData = {
        salon: {
          id: selectedSalon._id,
          name: selectedSalon.name,

          location: selectedSalon.location || {},
        },

        services: selectedServices.map((service) => ({
          id: service._id || service.id,
          name: service.name,
          price: Number(service.price),
          duration: Number(service.duration),
        })),

        totalPrice,

        totalDuration,

        date: selectedDate,

        time: selectedTime,
      };

      console.log("Updating booking with:", bookingData);

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

  // ========================================
  // LOADING
  // ========================================

  if (loading || !selectedSalon) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="rounded-3xl bg-white px-8 py-10 text-center shadow-2xl">
          <p className="font-semibold text-gray-700">
            Loading booking details...
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-[calc(100%-1rem)] max-w-2xl overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl sm:w-[calc(100%-2rem)] sm:p-6 lg:p-8">
        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Edit Booking</h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your appointment details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full px-3 py-2 text-xl text-gray-500 hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <div className="mt-7 space-y-6">
          {/* ========================================
              SALON
          ======================================== */}

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Salon
            </label>

            <select
              value={selectedSalon._id}
              onChange={handleSalonChange}
              disabled={saving}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
            >
              {salons.map((salon) => (
                <option key={salon._id} value={salon._id}>
                  {salon.name}
                </option>
              ))}
            </select>
          </div>

          {/* ========================================
              SERVICES
          ======================================== */}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="font-medium text-gray-700">Services</label>

              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                {selectedServices.length} Selected
              </span>
            </div>

            <div className="space-y-3">
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
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-purple-400"
                    }`}
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {service.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {service.duration} min
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-purple-600">
                        ₹{service.price}
                      </p>

                      <span
                        className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          isSelected
                            ? "bg-purple-600 text-white"
                            : "border border-purple-600 text-purple-600"
                        }`}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================
              DATE
          ======================================== */}

          <div>
            <label className="mb-2 block font-medium text-gray-700">Date</label>

            <input
              type="date"
              value={selectedDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              disabled={saving}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600"
            />
          </div>

          {/* ========================================
              TIME
          ======================================== */}

          <div>
            <label className="mb-3 block font-medium text-gray-700">Time</label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {!selectedDate && (
                <p className="mt-3 text-gray-500">
                  Please select a date first.
                </p>
              )}

              {selectedDate && !dayHours?.isOpen && (
                <p className="mt-3 font-medium text-red-500">
                  The salon is closed on the selected date.
                </p>
              )}

              {selectedDate &&
                dayHours?.isOpen &&
                availableTimeSlots.length === 0 && (
                  <p className="mt-3 font-medium text-gray-500">
                    No time slots are available for this date.
                  </p>
                )}

              {selectedDate &&
                dayHours?.isOpen &&
                availableTimeSlots.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                    {" "}
                    {availableTimeSlots.map((time) => {
                      const isCurrentBookingSlot =
                        selectedDate === originalBookingDate &&
                        time === originalBookingTime;

                      const isBooked = isTimeSlotOverlappingBooking(time);

                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={isBooked || loadingSlots}
                          onClick={() => setSelectedTime(time)}
                          className={`flex min-h-[52px] items-center justify-center rounded-xl border px-3 py-3 text-sm font-semibold whitespace-nowrap transition ${
                            isBooked
                              ? "cursor-not-allowed border-red-200 bg-red-50 text-red-400"
                              : selectedTime === time
                                ? "border-purple-600 bg-purple-600 text-white shadow-sm"
                                : "border-gray-200 bg-white text-slate-700 hover:border-purple-500 hover:bg-purple-50"
                          }`}
                        >
                          {isBooked ? (
                            <span className="flex flex-col items-center leading-tight">
                              <span>{time}</span>
                              <span className="mt-0.5 text-[11px] font-medium">
                                Booked
                              </span>
                            </span>
                          ) : (
                            time
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
            </div>
          </div>

          {/* ========================================
              TOTAL
          ======================================== */}

          <div className="rounded-2xl bg-purple-50 p-5">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Services</span>

              <span className="font-semibold">{selectedServices.length}</span>
            </div>

            <div className="mt-3 flex justify-between">
              <span className="text-gray-600">Total Duration</span>

              <span className="font-semibold">{totalDuration} min</span>
            </div>

            <div className="mt-3 flex justify-between border-t border-purple-200 pt-3">
              <span className="font-medium">Updated Total</span>

              <span className="text-2xl font-bold text-purple-600">
                ₹{totalPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving ||
              !selectedServices.length ||
              !selectedDate ||
              !selectedTime
            }
            className="rounded-full bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
