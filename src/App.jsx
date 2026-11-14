import { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import { getAuthConfig } from "./api";

import "./App.css";
import "./index.css";

function ProtectedRoute({ children }) {
  const isLoggedIn = Boolean(localStorage.getItem("auth"));

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  const navigate = useNavigate();

 function handleLogout() {
   localStorage.removeItem("username");
   localStorage.removeItem("auth");

   setSelectedRoom(null);
   setCustomerName("");
   setCheckIn("");
   setCheckOut("");
   setMessage("");

   navigate("/login", { replace: true });
 }
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  function handleSelectRoom(room) {
    setSelectedRoom(room);
    setMessage("");
  }

  async function handleConfirmBooking() {
    if (!selectedRoom) {
      setMessage("Please select a room first.");
      return;
    }

    if (!checkIn || !checkOut) {
      setMessage(
        "Please select check-in and check-out dates on the Home page.",
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axios.post(
        "http://localhost:8080/bookings",
        {
          customerName: customerName.trim(),
          roomId: selectedRoom.id,
          checkInDate: checkIn,
          checkOutDate: checkOut,
        },
        getAuthConfig(),
      );

      setMessage("Booking confirmed successfully!");
      setSelectedRoom(null);
      setCustomerName("");
      setCheckIn("");
      setCheckOut("");

      navigate("/my-bookings");
    } catch (err) {
      console.error("Booking failed:", err);

      if (err.response?.status === 409) {
        setMessage("This room is already booked for the selected dates.");
      } else if (err.response?.status === 400) {
        setMessage(
          err.response.data?.detail ||
            err.response.data?.message ||
            "Please check your booking details.",
        );
      } else if (err.response?.status === 401) {
        setMessage("Your session has expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setMessage("You are not authorized to perform this action.");
      } else if (!err.response) {
        setMessage("Unable to connect to the server. Please try again.");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            checkIn={checkIn}
            setCheckIn={setCheckIn}
            checkOut={checkOut}
            setCheckOut={setCheckOut}
            onSelectRoom={handleSelectRoom}
            onLogout={handleLogout}
          />
        }
      />

      <Route
        path="/booking"
        element={
          <ProtectedRoute>
            <Booking
              selectedRoom={selectedRoom}
              checkIn={checkIn}
              checkOut={checkOut}
              customerName={customerName}
              setCustomerName={setCustomerName}
              onConfirmBooking={handleConfirmBooking}
              loading={loading}
              message={message}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
