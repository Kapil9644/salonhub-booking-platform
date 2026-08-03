import { useLocation } from "react-router-dom";
import Container from "../../layouts/Container/Container";
import BookingHeader from "../../components/Booking/BookingHeader";
import { useState } from "react";
import DateSelector from "../../components/Booking/DateSelector";
import TimeSlotSelector from "../../components/Booking/TimeSlotSelector";
import BookingSummary from "../../components/Booking/BookingSummary";

export default function Booking() {
  const { state } = useLocation();

  if (!state) {
    return (
      <Container>
        <div className="py-16 text-center">
          <h1 className="text-3xl font-bold">No booking data found</h1>

          <p className="mt-3 text-gray-500">
            Please select a salon and service first.
          </p>
        </div>
      </Container>
    );
  }

  const { salon, selectedService } = state;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  return (
    <Container>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BookingHeader salon={salon} selectedService={selectedService} />

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
            selectedService={selectedService}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
        </div>
      </div>
    </Container>
  );
}
