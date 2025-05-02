import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/api";
import "./Login.css";
import BookCoverImage from "../../assets/HeaderBooks/headerBook1.png";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationLink, setShowVerificationLink] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowVerificationLink(false);

    try {
      const response = await apiRequest("auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      // Store the token in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirect to home page
      navigate("/");
      setShowVerificationLink(true);
    } catch (err) {
      console.error("Login error:", err);

      // Check if the error is about verification
      if (err.message && err.message.toLowerCase().includes("not verified")) {
        setError(
          "Your account needs verification. Please check your email or verify now."
        );
        setShowVerificationLink(true);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  // Add this state

  // Then in your JSX after the auth-error div
  {
    showVerificationLink && (
      <div className="auth-info">
        <Link to={`/verify?email=${encodeURIComponent(formData.email)}`}>
          Click here to verify your account
        </Link>
      </div>
    );
  }
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-image">
          <img src={BookCoverImage} alt="Book cover" />
        </div>
        <div className="auth-form-container">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue to Open Library</p>

          {error && <div className="auth-error">{error}</div>}
          {showVerificationLink && (
            <div className="auth-info">
              <Link to={`/verify?email=${encodeURIComponent(formData.email)}`}>
                Click here to verify your account
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="auth-redirect">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
