
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setMessage("");

    if (!username.trim() || !password) {
      setMessage("Please enter username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/me", {
        method: "GET",
        headers: {
          Authorization:
            "Basic " + btoa(username.trim() + ":" + password),
        },
      });

      if (!response.ok) {
        throw new Error("Invalid username or password.");
      }

      const loggedInUsername = await response.text();

      localStorage.setItem("username", loggedInUsername);
      localStorage.setItem(
        "auth",
        btoa(username.trim() + ":" + password)
      );

      navigate("/");
    } catch (error) {
       if (error instanceof TypeError) {
         setMessage("Unable to connect to the server. Please try again.");
       } else {
         setMessage(error.message);
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
              <h1>Your comfort, our priority.</h1>
              <p>
                Discover beautiful stays and make every journey
                memorable with StayEasy.
              </p>
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-form-content">

            <Link to="/" className="auth-mobile-brand">
              StayEasy.
            </Link>

            <h2>Welcome Back!</h2>
            <p className="auth-subtitle">
              Login to continue your journey with us.
            </p>

            <form onSubmit={handleLogin}>
              <div className="auth-input-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>

              <div className="auth-input-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>

              {message && (
                <p className="auth-message">{message}</p>
              )}

              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="auth-link">
              Don't have an account?{" "}
              <Link to="/register">Create an account</Link>
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

export default Login;
