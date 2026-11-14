
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Booking({
  selectedRoom,
  checkIn,
  checkOut,
  customerName,
  setCustomerName,
  onConfirmBooking,
  loading,
  message,
}) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  if (!selectedRoom) {
    return (
      <div className="booking-page">
        <h2>No room selected</h2>
        <p>Please select a room before booking.</p>
        <Link to="/">Explore Rooms</Link>
      </div>
    );
  }

  const nights =
    checkIn && checkOut
      ? Math.round(
          (new Date(checkOut + "T00:00:00") -
            new Date(checkIn + "T00:00:00")) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const pricePerNight = Number(selectedRoom.pricePerNight);
  const totalPrice = nights > 0 ? nights * pricePerNight : 0;

  const roomImage = selectedRoom.roomType.toLowerCase().includes("suite")
    ? "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1000"
    : selectedRoom.roomType.toLowerCase().includes("deluxe")
      ? "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1000"
      : "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1000";

  function handleSubmit(event) {
    event.preventDefault();

    if (!customerName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (customerName.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (!checkIn || !checkOut || nights <= 0) {
      setError("Please select valid check-in and check-out dates.");
      return;
    }

    setError("");
    onConfirmBooking();
  }

  return (
    <div className="booking-page">
      <nav className="navbar">
        <h2>StayEasy</h2>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/my-bookings">My Bookings</Link>
        </div>
      </nav>

      <main className="booking-container">
        <div className="booking-heading">
          <span>YOUR STAY, YOUR WAY</span>
          <h1>Complete Your Booking</h1>
          <p>Review your stay details and confirm your reservation.</p>
        </div>

        <div className="booking-layout">
          <section className="booking-room-card">
            <img
              className="booking-room-image"
              src={roomImage}
              alt={`${selectedRoom.roomType} hotel room`}
            />

            <div className="booking-room-info">
              <span className="booking-tag">SELECTED ROOM</span>
              <h2>{selectedRoom.roomType} Room</h2>
              <p>Room Number: {selectedRoom.roomNumber}</p>

              <div className="booking-nightly-price">
                <strong>
                  ₹{pricePerNight.toLocaleString("en-IN")}
                </strong>
                <span> / night</span>
              </div>
            </div>
          </section>

          <section className="booking-details-card">
            <h2>Your Stay Details</h2>

            <div className="stay-dates">
              <div>
                <span>CHECK-IN</span>
                <strong>{checkIn || "Not selected"}</strong>
              </div>

              <div>
                <span>CHECK-OUT</span>
                <strong>{checkOut || "Not selected"}</strong>
              </div>
            </div>

            <p className="night-count">
              <span>{nights} {nights === 1 ? "night" : "nights"}</span>
            </p>

            <div className="price-breakdown">
              <h3>Price Summary</h3>

              <div className="price-row">
                <span>Room price</span>
                <span>₹{pricePerNight.toLocaleString("en-IN")}</span>
              </div>

              <div className="price-row">
                <span>Number of nights</span>
                <span>{nights}</span>
              </div>

              <div className="price-row total-row">
                <strong>Total Amount</strong>
                <strong>₹{totalPrice.toLocaleString("en-IN")}</strong>
              </div>
            </div>

            <form className="booking-customer-form" onSubmit={handleSubmit}>
              <h3>Guest Information</h3>

              <label htmlFor="customerName">Full Name</label>
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(event) => {
                  setCustomerName(event.target.value);
                  setError("");
                }}
                placeholder="Enter your full name"
                maxLength={50}
                autoComplete="name"
              />

              <p className="input-hint">
                Enter the name of the person staying in the room.
              </p>

              {error && <p className="booking-error" role="alert">{error}</p>}
              {message && (
                <p className="booking-feedback" role="status">{message}</p>
              )}

              <button
                className="confirm-booking-button"
                type="submit"
                disabled={loading || nights <= 0}
              >
                {loading ? "Confirming Booking..." : "Confirm Booking"}
              </button>

              <button
                className="back-rooms-button"
                type="button"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                ← Back to Rooms
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Booking;
