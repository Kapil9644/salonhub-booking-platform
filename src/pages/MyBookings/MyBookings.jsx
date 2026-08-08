import { useEffect, useState } from "react";
import Container from "../../layouts/Container/Container";
import { useAuth } from "../../context/AuthContext";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) return;

    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];

    const userBookings = storedBookings.filter(
      (booking) => booking.userId === user.id,
    );

    setBookings(userBookings);
  }, [user]);

  return (
    <Container>
      <div className="py-16">
        <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-gray-300 py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              No bookings yet
            </h2>

            <p className="mt-2 text-gray-500">
              Your upcoming appointments will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-3xl border border-gray-200 p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold text-slate-900">
                  {booking.salon.name}
                </h2>

                <p className="mt-2 text-gray-600">{booking.service.name}</p>

                <p className="mt-2 text-gray-600">
                  {booking.date
                    ? new Date(booking.date).toLocaleDateString("en-IN")
                    : "--"}{" "}
                  • {booking.time}
                </p>

                <p className="mt-3 font-semibold text-purple-600">
                  ₹{booking.service.price}
                </p>

                <span className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
