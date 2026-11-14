
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { getAuthConfig } from "../api";

function Home({
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  onSelectRoom,
  onLogout,
}) {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/rooms", getAuthConfig())
      .then((response) => {
        setRooms(response.data);
        setError("");
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
        setError(
          err.response?.status === 401
            ? "Please log in to continue."
            : "Unable to load rooms. Please check that Spring Boot is running.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSearch() {
    if (!checkIn || !checkOut) {
      setMessage("Please select both check-in and check-out dates.");
      return;
    }

    if (checkOut <= checkIn) {
      setMessage("Check-out must be after check-in.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.get(
        "http://localhost:8080/rooms/available-by-date",
        {
          params: {
            checkInDate: checkIn,
            checkOutDate: checkOut,
          },
          ...getAuthConfig(),
        }
      );

      setRooms(response.data);
      setMessage(`Available rooms from ${checkIn} to ${checkOut}`);
    } catch (err) {
      console.error("Room search failed:", err);
      setError("Unable to search rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleClearDates() {
    setCheckIn("");
    setCheckOut("");
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.get(
        "http://localhost:8080/rooms",
        getAuthConfig()
      );

      setRooms(response.data);
    } catch (err) {
      console.error("Error reloading rooms:", err);
      setError("Failed to reload rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleBookNow(room) {
    if (!checkIn || !checkOut) {
      setMessage("Please select check-in and check-out dates before booking.");
      document.querySelector(".hero")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    if (checkOut <= checkIn) {
      setMessage("Check-out date must be after check-in date.");
      return;
    }

    onSelectRoom(room);
    navigate("/booking");
  }

  return (
    <div className="app">
      <nav className="navbar">
  <h2>StayEasy</h2>

  <div className="nav-links">
    <Link to="/">Home</Link>
    <a href="#rooms">Rooms</a>
    <Link to="/my-bookings">My Bookings</Link>
    <a href="#about">About</a>

    {localStorage.getItem("auth") ? (
      <button type="button" onClick={onLogout}>
        Logout
      </button>
    ) : (
      <>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </>
    )}
  </div>
</nav>

      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">WELCOME TO STAYEASY</span>
          <h1>Find Your Perfect Stay</h1>
          <p>
            Discover comfortable rooms and make your next stay simple, relaxing,
            and memorable.
          </p>
        </div>

        <div className="search-box">
          <input
            type="date"
            aria-label="Check-in date"
            min={new Date().toLocaleDateString("en-CA")}
            value={checkIn}
            onChange={(event) => {
              setCheckIn(event.target.value);
              if (checkOut && event.target.value >= checkOut) {
                setCheckOut("");
              }
            }}
          />

          <input
            type="date"
            aria-label="Check-out date"
            value={checkOut}
            min={checkIn || undefined}
            onChange={(event) => setCheckOut(event.target.value)}
          />

          <button type="button" onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search Rooms"}
          </button>

          <button type="button" onClick={handleClearDates} disabled={loading}>
            Clear Dates
          </button>
        </div>

        {message && <p className="feedback-message">{message}</p>}
      </section>

      <section id="rooms" className="rooms-section">
        <h2>Explore Our Rooms</h2>
        <p>Discover a comfortable room for your next stay.</p>

        {loading && <p>Loading rooms...</p>}
        {error && <p role="alert">{error}</p>}

        {!loading && !error && rooms.length === 0 && (
          <p className="empty-state">
            No rooms are available for your selected dates. Please try different
            dates.
          </p>
        )}

        <div className="room-list">
          {rooms.map((room) => (
            <div className="room-card" key={room.id}>
              <div className="room-image">
                <img
                  src={
                    room.roomType.toLowerCase().includes("suite")
                      ? "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800"
                      : room.roomType.toLowerCase().includes("deluxe")
                      ? "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"
                      : "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800"
                  }
                  alt={`${room.roomType} room`}
                />
              </div>

              <div className="room-card-content">
                <h3>{room.roomType} Room</h3>
                <p className="room-number">
                  Room Number: {room.roomNumber}
                </p>

                <div className="room-price">
                  <span>
                    ₹{Number(room.pricePerNight).toLocaleString("en-IN")}
                  </span>
                  <small> / night</small>
                </div>

                <span
                  className={
                    room.available ? "status available" : "status unavailable"
                  }
                >
                  {room.available
                    ? "Available to book"
                    : "Currently unavailable"}
                </span>

                {room.available && (
                  <button
                    type="button"
                    className="book-button"
                    onClick={() => handleBookNow(room)}
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="about-content">
          <span className="about-label">ABOUT US</span>
          <h2>Welcome to StayEasy</h2>
          <p>
            StayEasy makes finding and booking comfortable rooms simple. Explore
            available rooms, check prices, and manage your reservations easily
            in one place.
          </p>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>StayEasy</h2>
            <p>Making your stay simple and comfortable.</p>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <a href="#rooms">Rooms</a>
            <Link to="/my-bookings">My Bookings</Link>
            <a href="#about">About Us</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 StayEasy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
