import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { apiRequest } from "../../utils/api";
import "../Login/Login.css";
import BookCoverImage from "../../assets/HeaderBooks/headerBook3.png";

export default function Verification() {
  const [formData, setFormData] = useState({
    email: "",
    token: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email from URL if present
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const email = query.get("email");
    if (email) {
      setFormData((prev) => ({ ...prev, email }));
    }
  }, [location]);

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
    setSuccess("");

    try {
      await apiRequest("auth/verify", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      setSuccess(
        "Email verified successfully! You can now login to your account."
      );

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.message ||
          "Verification failed. Please check the code and try again."
      );
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await apiRequest("auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email: formData.email }),
      });
      setSuccess(
        "Verification email sent successfully. Please check your inbox."
      );
    } catch (err) {
      setError(err.message || "Failed to resend verification email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-image">
          <img src={BookCoverImage} alt="Book cover" />
        </div>
        <div className="auth-form-container">
          <h2>Verify Your Email</h2>
          <p className="auth-subtitle">
            Enter the verification code sent to your email
          </p>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

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
              <label htmlFor="token">Verification Code</label>
              <input
                type="text"
                id="token"
                name="token"
                value={formData.token}
                onChange={handleChange}
                required
                placeholder="Enter the 6-digit code"
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="auth-redirect">
            <button
              type="button"
              onClick={handleResendVerification}
              className="text-button"
              disabled={loading}
            >
              Didn't receive code? Resend verification email
            </button>
          </div>

          <div className="auth-redirect">
            Already verified? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
