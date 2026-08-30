import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";

import Container from "../../layouts/Container/Container";
import BookingHeader from "../../components/Booking/BookingHeader";
import DateSelector from "../../components/Booking/DateSelector";
import TimeSlotSelector from "../../components/Booking/TimeSlotSelector";
import BookingSummary from "../../components/Booking/BookingSummary";

import { salons } from "../../data/salons";

export default function Booking() {
  const { state } = useLocation();
  const { id } = useParams();

  const salon = state?.salon || salons.find((salon) => salon.id === Number(id));

  // Selected multiple services
  const selectedServices =
    state?.selectedServices ||
    (state?.selectedService ? [state.selectedService] : []);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  if (!salon) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-700">Salon not found</h1>

          <p className="mt-3 text-gray-500">
            The salon you're trying to book doesn't exist.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BookingHeader salon={salon} selectedServices={selectedServices} />

          <DateSelector
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          <TimeSlotSelector
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
        </div>

        <div>
          <BookingSummary
            salon={salon}
            selectedServices={selectedServices}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
        </div>
      </div>
    </Container>
  );
}
