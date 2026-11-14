import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getAuthConfig } from "../api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingFilter, setBookingFilter] = useState("ALL");
  const [cancellingBookingId, setCancellingBookingId] = useState(null);

  async function fetchBookings() {
    setLoading(true);
    setError("");

    try {
      const [bookingResponse, roomResponse] = await Promise.all([
        axios.get("http://localhost:8080/bookings", getAuthConfig()),
        axios.get("http://localhost:8080/rooms", getAuthConfig()),
      ]);
      setBookings(bookingResponse.data);
      setRooms(roomResponse.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setError("You are not authorized to view these bookings.");
      } else if (!err.response) {
        setError("Unable to connect to the server. Please try again.");
      } else {
        setError("Unable to load bookings. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  async function handleCancelBooking(bookingId) {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setCancellingBookingId(bookingId);

    try {
     await axios.delete(
       `http://localhost:8080/bookings/${bookingId}`,
       getAuthConfig(),
     );

      await fetchBookings();
    } catch (err) {
       console.error("Cancellation failed:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setError("You are not authorized to cancel this booking.");
      } else if (!err.response) {
        setError("Unable to connect to the server. Please try again.");
      } else {
        setError("Unable to cancel booking. Please try again.");
      }
    } finally {
      setCancellingBookingId(null);
    }
  }

  const filteredBookings =
    bookingFilter === "ALL"
      ? bookings
      : bookings.filter((booking) => booking.status === bookingFilter);
  const getRoomDetails = (roomId) => {
    return rooms.find((room) => room.id === roomId);
  };
  return (
    <div className="app">
      <nav className="navbar">
        <h2>StayEasy</h2>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/my-bookings">My Bookings</Link>
        </div>
      </nav>

      <section className="bookings-section">
        <h2>My Bookings</h2>

        <div className="booking-controls">
          <select
            value={bookingFilter}
            onChange={(event) => setBookingFilter(event.target.value)}
          >
            <option value="ALL">All Bookings</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button type="button" onClick={fetchBookings} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loading && <p>Loading bookings...</p>}
        {error && <p role="alert">{error}</p>}

        {!loading && !error && filteredBookings.length === 0 && (
          <p>No bookings found.</p>
        )}

        <div className="booking-list">
          {filteredBookings.map((booking) => {
            const room = getRoomDetails(booking.roomId);

            const roomImage = room?.roomType?.toLowerCase().includes("suite")
              ? "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800"
              : room?.roomType?.toLowerCase().includes("deluxe")
                ? "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"
                : "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800";

            return (
              <div className="my-booking-card" key={booking.id}>
                <img
                  src={roomImage}
                  alt={room ? `${room.roomType} room` : "Hotel room"}
                  className="my-booking-image"
                />

                <div className="my-booking-content">
                  <div className="my-booking-header">
                    <div>
                      <span className="booking-id-label">
                        BOOKING #{booking.id}
                      </span>
                      <h3>{room?.roomType || "Hotel"} Room</h3>
                      <p>Room Number: {room?.roomNumber ?? booking.roomId}</p>
                    </div>

                    <span
                      className={`my-booking-status ${
                        booking.status === "CONFIRMED"
                          ? "confirmed"
                          : "cancelled"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="my-booking-dates">
                    <div>
                      <span>CHECK-IN</span>
                      <strong>{booking.checkInDate}</strong>
                    </div>

                    <div>
                      <span>CHECK-OUT</span>
                      <strong>{booking.checkOutDate}</strong>
                    </div>
                  </div>

                  <div className="my-booking-footer">
                    <div>
                      <span>Total Amount</span>
                      <strong>
                        ₹{Number(booking.totalPrice).toLocaleString("en-IN")}
                      </strong>
                    </div>

                    {booking.status === "CONFIRMED" && (
                      <button
                        type="button"
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingBookingId === booking.id}
                      >
                        {cancellingBookingId === booking.id
                          ? "Cancelling..."
                          : "Cancel Booking"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default MyBookings;
