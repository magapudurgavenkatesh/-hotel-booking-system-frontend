
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();
    setMessage("");

    if (!username.trim() || !password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:8080/auth/register", {
        username: username.trim(),
        password: password,
      });

      setMessage("Registration successful!");

      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      if (!error.response) {
        setMessage("Unable to connect to the server. Please try again.");
      } else if (error.response.status === 409) {
        setMessage("Username already exists. Please choose another.");
      } else {
        setMessage(
          error.response.data?.message ||
            "Registration failed. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-image">
          <div className="auth-image-overlay">
            <Link to="/" className="auth-brand">
              StayEasy.
            </Link>

            <div className="auth-image-text">
              <h1>Begin your next adventure.</h1>
              <p>
                Create your account and discover comfortable
                stays for every journey.
              </p>
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-form-content">

            <Link to="/" className="auth-mobile-brand">
              StayEasy.
            </Link>

            <h2>Create Account</h2>
            <p className="auth-subtitle">
              Join StayEasy and book your perfect stay.
            </p>

            <form onSubmit={handleRegister}>
              <div className="auth-input-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  autoComplete="username"
                />
              </div>

              <div className="auth-input-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
              </div>

              <div className="auth-input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                />
              </div>

              {message && (
                <p className="auth-message">{message}</p>
              )}

              <button type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="auth-link">
              Already have an account?{" "}
              <Link to="/login">Login</Link>
            </p>

            <Link to="/" className="auth-back-link">
              ← Back to Home
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
